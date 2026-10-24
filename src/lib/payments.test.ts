import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  createPaymentOrder,
  verifyRazorpaySignature,
  generateTestSignature,
  processWebhookEvent,
  executeCompensationRefund,
  validateAndCalculateServerPrice,
  executePrototypePayment,
  PROTOTYPE_PAYMENT_CONFIG,
} from './payments';
import { PaymentAttempt } from './types';

test('validateAndCalculateServerPrice rejects negative or zero fares and calculates correct GST', () => {
  assert.throws(() => validateAndCalculateServerPrice('BUS', 0, 1));
  assert.throws(() => validateAndCalculateServerPrice('HOTEL', -500, 2));

  // Hotel 12% GST + ₹20 platform fee
  const price = validateAndCalculateServerPrice('HOTEL', 2000, 2);
  assert.equal(price.baseAmount, 4000);
  assert.equal(price.gstAmount, 480);
  assert.equal(price.platformFee, 20);
  assert.equal(price.totalAmount, 4500);
});

test('createPaymentOrder creates unique Razorpay order ID and respects idempotency', () => {
  const params = {
    bookingReference: 'TF-BUS-2026-99999',
    serviceType: 'BUS' as const,
    serviceId: 'bus-101',
    serviceName: 'Zingbus Express',
    baseFareINR: 800,
    quantity: 2,
    userEmail: 'user@test.com',
    userName: 'Tester',
    idempotencyKey: 'idem_key_12345',
  };

  const { order, priceBreakdown } = createPaymentOrder(params);
  assert.ok(order.orderId.startsWith('order_'));
  assert.equal(order.status, 'CREATED');
  assert.equal(order.amountINR, priceBreakdown.totalAmount);

  // Re-request with same idempotency key
  const existingAttempts: PaymentAttempt[] = [order];
  const repeat = createPaymentOrder(params, existingAttempts);
  assert.equal(repeat.order.orderId, order.orderId, 'Should return existing order on duplicate idempotency key');
});

test('verifyRazorpaySignature validates HMAC SHA-256 authentic signatures and rejects forged ones', () => {
  const secret = 'my_secret_key_123';
  const orderId = 'order_98765432101234';
  const paymentId = 'pay_11223344556677';

  const validSignature = generateTestSignature(orderId, paymentId, secret);

  // Valid signature check
  const isValid = verifyRazorpaySignature(orderId, paymentId, validSignature, secret);
  assert.equal(isValid, true);

  // Forged signature check
  const forgedSignature = validSignature.slice(0, -4) + 'abcd';
  const isForgedValid = verifyRazorpaySignature(orderId, paymentId, forgedSignature, secret);
  assert.equal(isForgedValid, false);

  // Mismatched payment ID check
  const isMismatched = verifyRazorpaySignature(orderId, 'pay_different', validSignature, secret);
  assert.equal(isMismatched, false);
});

test('processWebhookEvent handles signature verification and enforces idempotency', () => {
  const secret = 'whsec_test_secret';
  const payloadObj = {
    id: 'evt_1001',
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_capture_123',
          order_id: 'order_test_123',
          amount: 250000,
          status: 'captured',
        },
      },
    },
  };
  const rawBody = JSON.stringify(payloadObj);
  const validSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  // 1. First event processing
  const res1 = processWebhookEvent(rawBody, validSignature, secret, []);
  assert.equal(res1.success, true);
  assert.equal(res1.isDuplicate, false);
  assert.ok(res1.eventRecord);
  assert.equal(res1.eventRecord.eventId, 'evt_1001');

  // 2. Duplicate event processing (idempotency guard)
  const res2 = processWebhookEvent(rawBody, validSignature, secret, [res1.eventRecord]);
  assert.equal(res2.success, true);
  assert.equal(res2.isDuplicate, true, 'Duplicate webhook should be safely acknowledged without re-processing');

  // 3. Invalid signature
  const res3 = processWebhookEvent(rawBody, 'invalid_sig', secret, []);
  assert.equal(res3.success, false);
  assert.equal(res3.error, 'Invalid Webhook Signature');
});

test('executeCompensationRefund refunds captured payment when reservation fails', () => {
  const capturedOrder: PaymentAttempt = {
    id: 'pay_1',
    orderId: 'order_1',
    bookingReference: 'TF-HTL-2026-11111',
    serviceType: 'HOTEL',
    serviceId: 'hotel-1',
    serviceName: 'Grand Palace',
    userEmail: 'guest@test.com',
    userName: 'Guest',
    amountINR: 4500,
    currency: 'INR',
    status: 'CAPTURED',
    razorpayPaymentId: 'pay_rzp_999',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    idempotencyKey: 'key_1',
  };

  const refund = executeCompensationRefund(capturedOrder, 'Hotel room inventory was sold out by provider during checkout.');
  assert.equal(refund.success, true);
  assert.equal(refund.updatedOrder.status, 'REFUNDED');
  assert.equal(refund.updatedOrder.refundAmountINR, 4500);
  assert.ok(refund.refundId.startsWith('rfnd_'));
});

test('executePrototypePayment produces verified server signatures across all prototype methods', () => {
  const baseOrder: PaymentAttempt = {
    id: 'pay_test_order_1',
    orderId: 'order_test_proto_101',
    bookingReference: 'TF-BUS-2026-8888',
    serviceType: 'BUS',
    serviceId: 'bus-101',
    serviceName: 'Zingbus Plus',
    userEmail: 'arjun@tripflex.in',
    userName: 'Arjun Sharma',
    amountINR: 1365,
    currency: 'INR',
    status: 'CREATED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    idempotencyKey: 'idem_proto_1',
  };

  // 1. Test 1-Click Fast Prototype
  const res1Click = executePrototypePayment(baseOrder, 'PROTOTYPE_1CLICK');
  assert.ok(res1Click.paymentId.startsWith('pay_proto_prototype_1click_'));
  assert.equal(res1Click.status, 'CAPTURED');
  assert.equal(res1Click.updatedOrder.isPrototype, true);
  assert.equal(res1Click.updatedOrder.paymentMethod, 'PROTOTYPE_1CLICK');
  // Verify HMAC signature authenticity
  const is1ClickValid = verifyRazorpaySignature(baseOrder.orderId, res1Click.paymentId, res1Click.signature);
  assert.equal(is1ClickValid, true, '1-Click prototype signature must be cryptographically valid');

  // 2. Test UPI Simulation
  const resUpi = executePrototypePayment(baseOrder, 'PROTOTYPE_UPI', { vpa: 'arjun@oksbi' });
  assert.ok(resUpi.paymentId.startsWith('pay_proto_prototype_upi_'));
  assert.equal(resUpi.status, 'CAPTURED');
  const isUpiValid = verifyRazorpaySignature(baseOrder.orderId, resUpi.paymentId, resUpi.signature);
  assert.equal(isUpiValid, true, 'UPI prototype signature must be cryptographically valid');

  // 3. Test Card Simulation
  const resCard = executePrototypePayment(baseOrder, 'PROTOTYPE_CARD', { cardBrand: 'RUPAY' });
  assert.ok(resCard.paymentId.startsWith('pay_proto_prototype_card_'));
  assert.equal(resCard.status, 'CAPTURED');

  // 4. Test NetBanking Simulation
  const resNetBanking = executePrototypePayment(baseOrder, 'PROTOTYPE_NETBANKING', { bankName: 'SBI' });
  assert.ok(resNetBanking.paymentId.startsWith('pay_proto_prototype_netbanking_'));
  assert.equal(resNetBanking.status, 'CAPTURED');

  // 5. Test Pay on Boarding Prototype (Status should be AUTHORIZED, ₹0 upfront)
  const resPOB = executePrototypePayment(baseOrder, 'PROTOTYPE_PAY_ON_BOARDING');
  assert.ok(resPOB.paymentId.startsWith('pay_proto_prototype_pay_on_boarding_'));
  assert.equal(resPOB.status, 'AUTHORIZED');
  assert.equal(resPOB.updatedOrder.paymentMethod, 'PROTOTYPE_PAY_ON_BOARDING');

  // 6. Test PROTOTYPE_PAYMENT_CONFIG metadata coverage
  const expectedMethods = [
    'PROTOTYPE_1CLICK',
    'PROTOTYPE_UPI',
    'PROTOTYPE_CARD',
    'PROTOTYPE_NETBANKING',
    'PROTOTYPE_PAY_ON_BOARDING',
    'RAZORPAY_GATEWAY',
  ];
  for (const m of expectedMethods) {
    assert.ok(PROTOTYPE_PAYMENT_CONFIG[m], `Missing configuration for payment method: ${m}`);
    assert.ok(PROTOTYPE_PAYMENT_CONFIG[m].label.length > 0);
  }
});

