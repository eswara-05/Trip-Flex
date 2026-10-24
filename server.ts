/**
 * Trip Flex Full-Stack Express Server
 * Serves server-side endpoints for Destinations Query/Import and Razorpay Payment Lifecycle
 * Mounts Vite dev server middleware on port 3000
 */
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INDIAN_GEOGRAPHIC_DATASET, importIndianDestinations } from './src/lib/destinationsData.ts';
import { queryDestinations, getAutocompleteSuggestions } from './src/lib/destinationQuery.ts';
import {
  createPaymentOrder,
  verifyRazorpaySignature,
  generateTestSignature,
  processWebhookEvent,
  executeCompensationRefund,
  executePrototypePayment,
  PROTOTYPE_PAYMENT_CONFIG,
  getRazorpayConfig,
  validateAndCalculateServerPrice,
} from './src/lib/payments.ts';
import { Destination, PaymentAttempt, WebhookEvent } from './src/lib/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// In-memory server-side database store
let serverDestinations: Destination[] = [...INDIAN_GEOGRAPHIC_DATASET];
const serverPaymentAttempts: PaymentAttempt[] = [];
const serverWebhookEvents: WebhookEvent[] = [];

async function startServer() {
  const app = express();

  // JSON middleware with raw body capture for webhook signature verification
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );

  // --- DESTINATION API ENDPOINTS ---

  // 1. Paginated destination search with filters
  app.get('/api/destinations', (req, res) => {
    try {
      const {
        q = '',
        state = 'ALL',
        type = 'ALL',
        page = '1',
        pageSize = '9',
        sortBy = 'name',
      } = req.query;

      const result = queryDestinations(serverDestinations, {
        query: String(q),
        state: String(state),
        destinationType: type as any,
        page: parseInt(String(page), 10) || 1,
        pageSize: parseInt(String(pageSize), 10) || 9,
        sortBy: sortBy as any,
      });

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. Fast autocomplete suggestions
  app.get('/api/destinations/autocomplete', (req, res) => {
    try {
      const { q = '', limit = '8' } = req.query;
      const suggestions = getAutocompleteSuggestions(
        serverDestinations,
        String(q),
        parseInt(String(limit), 10) || 8
      );
      res.json({ success: true, suggestions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 3. Repeatable data import endpoint
  app.post('/api/destinations/import', (req, res) => {
    try {
      const { merged, addedCount, updatedCount } = importIndianDestinations(serverDestinations);
      serverDestinations = merged;
      res.json({
        success: true,
        message: `Import completed: ${addedCount} added, ${updatedCount} updated. Total: ${serverDestinations.length}`,
        addedCount,
        updatedCount,
        totalCount: serverDestinations.length,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- RAZORPAY PAYMENT GATEWAY ENDPOINTS ---

  // 4. Create Razorpay Payment Order (re-calculates price strictly on server)
  app.post('/api/payments/create-order', (req, res) => {
    try {
      const {
        bookingReference,
        serviceType,
        serviceId,
        serviceName,
        baseFareINR,
        quantity = 1,
        userEmail,
        userName,
        idempotencyKey,
      } = req.body;

      if (!bookingReference || !serviceType || !baseFareINR) {
        return res.status(400).json({ success: false, error: 'Missing required booking parameters.' });
      }

      const { order, priceBreakdown } = createPaymentOrder(
        {
          bookingReference,
          serviceType,
          serviceId: serviceId || 'srv-generic',
          serviceName: serviceName || 'Trip Flex Service',
          baseFareINR: Number(baseFareINR),
          quantity: Number(quantity),
          userEmail: userEmail || 'guest@tripflex.in',
          userName: userName || 'Guest Traveller',
          idempotencyKey,
        },
        serverPaymentAttempts
      );

      // Record attempt in database
      const existingIdx = serverPaymentAttempts.findIndex((a) => a.orderId === order.orderId);
      if (existingIdx >= 0) {
        serverPaymentAttempts[existingIdx] = order;
      } else {
        serverPaymentAttempts.unshift(order);
      }

      const config = getRazorpayConfig();

      res.json({
        success: true,
        orderId: order.orderId,
        amountINR: order.amountINR,
        currency: 'INR',
        keyId: config.keyId,
        isLiveConfigured: config.isLiveConfigured,
        priceBreakdown,
        status: order.status,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // Helper for test sandbox token & signature generation
  app.get('/api/payments/test-token', (req, res) => {
    try {
      const { orderId } = req.query;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'orderId is required' });
      }
      const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 12)}`;
      const signature = generateTestSignature(String(orderId), paymentId);
      res.json({ success: true, paymentId, signature });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. Verify Razorpay Payment Signature
  app.post('/api/payments/verify', (req, res) => {
    try {
      const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!orderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ success: false, error: 'Missing payment signature verification parameters.' });
      }

      const isValid = verifyRazorpaySignature(orderId, razorpayPaymentId, razorpaySignature);

      const attempt = serverPaymentAttempts.find((a) => a.orderId === orderId);

      if (!isValid) {
        if (attempt) {
          attempt.status = 'FAILED';
          attempt.failureReason = 'Invalid HMAC SHA-256 signature mismatch';
          attempt.updatedAt = new Date().toISOString();
        }
        return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
      }

      if (attempt) {
        attempt.status = 'CAPTURED';
        attempt.razorpayPaymentId = razorpayPaymentId;
        attempt.razorpaySignature = razorpaySignature;
        attempt.updatedAt = new Date().toISOString();
      }

      res.json({
        success: true,
        verified: true,
        orderId,
        paymentId: razorpayPaymentId,
        status: 'CAPTURED',
        message: 'Payment captured and verified on server. Provider fulfillment pending.',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5b. Prototype Payment Authorization Endpoint
  app.post('/api/payments/prototype-authorize', (req, res) => {
    try {
      const { orderId, paymentMethod = 'PROTOTYPE_1CLICK', details = {} } = req.body;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'orderId is required.' });
      }

      const attempt = serverPaymentAttempts.find((a) => a.orderId === orderId);
      if (!attempt) {
        return res.status(404).json({ success: false, error: 'Payment attempt not found.' });
      }

      const result = executePrototypePayment(attempt, paymentMethod, details);
      const idx = serverPaymentAttempts.findIndex((a) => a.orderId === orderId);
      if (idx >= 0) {
        serverPaymentAttempts[idx] = result.updatedOrder;
      }

      res.json({
        success: true,
        orderId,
        paymentId: result.paymentId,
        signature: result.signature,
        status: result.status,
        paymentMethod,
        isPrototype: true,
        message: 'Prototype payment authorized with valid server HMAC signature.',
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 6. Authenticated Webhook Notification (Idempotent)
  app.post('/api/payments/webhook', (req: any, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = req.rawBody || JSON.stringify(req.body);
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || getRazorpayConfig().keySecret;

      const result = processWebhookEvent(rawBody, signature, secret, serverWebhookEvents);

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      if (result.isDuplicate) {
        return res.json({ status: 'ok', message: 'Webhook already processed (Idempotent).' });
      }

      if (result.eventRecord) {
        serverWebhookEvents.unshift(result.eventRecord);

        // Update corresponding payment attempt if matching
        if (result.eventRecord.orderId) {
          const attempt = serverPaymentAttempts.find((a) => a.orderId === result.eventRecord?.orderId);
          if (attempt) {
            if (result.eventRecord.event === 'payment.captured') {
              attempt.status = 'CAPTURED';
              attempt.razorpayPaymentId = result.eventRecord.paymentId;
            } else if (result.eventRecord.event === 'payment.failed') {
              attempt.status = 'FAILED';
            }
            attempt.updatedAt = new Date().toISOString();
          }
        }
      }

      res.json({ status: 'ok', processed: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 7. Compensation & Refund Flow
  app.post('/api/payments/refund', (req, res) => {
    try {
      const { orderId, reason = 'Provider fulfillment failed' } = req.body;
      const attempt = serverPaymentAttempts.find((a) => a.orderId === orderId);

      if (!attempt) {
        return res.status(404).json({ success: false, error: 'Payment attempt not found.' });
      }

      const refundResult = executeCompensationRefund(attempt, reason);
      const idx = serverPaymentAttempts.findIndex((a) => a.orderId === orderId);
      serverPaymentAttempts[idx] = refundResult.updatedOrder;

      res.json({
        success: true,
        refundId: refundResult.refundId,
        refundAmountINR: refundResult.updatedOrder.refundAmountINR,
        status: 'REFUNDED',
        message: 'Compensation refund successfully initiated via payment gateway.',
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // 8. Payment Attempts Audit
  app.get('/api/payments/attempts', (_req, res) => {
    res.json({ success: true, attempts: serverPaymentAttempts, webhooks: serverWebhookEvents });
  });

  // --- VITE MIDDLEWARE / STATIC FILES ---
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Trip Flex] Full-Stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
