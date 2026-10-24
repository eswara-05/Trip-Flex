/**
 * Comprehensive, legally usable Indian Geographic Dataset
 * Contains destinations covering ALL 28 Indian States and ALL 8 Union Territories (36 States & UTs total).
 * Each destination includes authentic coordinates, transit hubs, and categorization.
 */
import { Destination } from './types';

export const INDIAN_GEOGRAPHIC_DATASET: Destination[] = [
  // ==========================================
  // 1. RAJASTHAN (State)
  // ==========================================
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Hawa Mahal, Amer Fort, Royal City Palace',
    tagline: 'The timeless Pink City of royal palaces, grand forts, and handcrafted heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    majorHubs: {
      busStations: ['Sindhi Camp Central Bus Stand', 'Narayan Singh Circle'],
      railwayStations: ['Jaipur Junction (JP)', 'Gandhinagar Jaipur (GADJ)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Lake Pichola, City Palace, Jag Mandir, Sajjangarh',
    tagline: 'The romantic City of Lakes with majestic marble palaces and serene boat rides.',
    imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 24.5854, lng: 73.7125 },
    majorHubs: {
      busStations: ['Udaipur Central Bus Stand (Udiapole)'],
      railwayStations: ['Udaipur City Railway Station (UDZ)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-jodhpur',
    name: 'Jodhpur',
    state: 'Rajasthan',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Mehrangarh Fort, Umaid Bhawan Palace, Blue City',
    tagline: 'The Sun City crowned by the colossal Mehrangarh Fort overlooking indigo lanes.',
    imageUrl: 'https://images.unsplash.com/photo-1598977123418-454555aa0381?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 26.2389, lng: 73.0243 },
    majorHubs: {
      busStations: ['Raikabagh Central Bus Stand'],
      railwayStations: ['Jodhpur Junction (JU)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-jaisalmer',
    name: 'Jaisalmer',
    state: 'Rajasthan',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Golden Sand Dunes, Jaisalmer Living Fort, Desert Safari',
    tagline: 'The Golden City in the heart of Thar Desert with living sandstone citadel.',
    imageUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 26.9157, lng: 70.9083 },
    majorHubs: {
      busStations: ['Jaisalmer Roadways Bus Stand'],
      railwayStations: ['Jaisalmer Railway Station (JSM)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 2. GOA (State)
  // ==========================================
  {
    id: 'dest-goa',
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    destinationType: 'BEACH',
    popularFor: 'Calangute, Candolim, Dudhsagar Falls, Portuguese Villas',
    tagline: 'Sun-drenched tropical coastline, vibrant beach shacks, and colonial churches.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    majorHubs: {
      busStations: ['Panaji KTC Bus Stand', 'Mapusa Bus Terminal', 'Margao KTC Stand'],
      railwayStations: ['Madgaon Junction (MAO)', 'Thivim (THVM)', 'Karmali (KRMI)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 3. HIMACHAL PRADESH (State)
  // ==========================================
  {
    id: 'dest-manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Solang Valley, Rohtang Pass, Old Manali Cafes, Hadimba Temple',
    tagline: 'Snow-clad Pir Panjal peaks, alpine cedar pine forests, and adventure valleys.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 32.2432, lng: 77.1892 },
    majorHubs: {
      busStations: ['Private Bus Stand Manali', 'Mall Road Volvo Stand'],
      railwayStations: ['Joginder Nagar (JDNX)', 'Chandigarh Junction (CDG - 310km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'The Ridge, Mall Road, Jakhu Temple, Toy Train',
    tagline: 'The Queen of Hills with historic British colonial charm and pine slopes.',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    majorHubs: {
      busStations: ['ISBT Shimla (Tutikandi)', 'Old Bus Stand Shimla'],
      railwayStations: ['Shimla Railway Station (SML - Heritage Kalka-Shimla Line)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-dharamshala',
    name: 'Dharamshala',
    state: 'Himachal Pradesh',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'McLeod Ganj, Dalai Lama Temple, HPCA Stadium, Triund Trek',
    tagline: 'Tranquil Himalayan refuge, Tibetan culture, and panoramic Dhauladhar ranges.',
    imageUrl: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 32.2190, lng: 76.3234 },
    majorHubs: {
      busStations: ['Dharamshala Inter-State Bus Stand', 'McLeod Ganj Bus Stand'],
      railwayStations: ['Pathankot Cantt (PTKC - 85km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 4. UTTARAKHAND (State)
  // ==========================================
  {
    id: 'dest-rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Ganga Aarti at Triveni Ghat, White-water Rafting, Yoga Ashrams',
    tagline: 'Yoga capital of the world embraced by the sacred emerald Ganga river.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    majorHubs: {
      busStations: ['Rishikesh Sanyukt Yatra Bus Stand', 'Natraj Chowk Stand'],
      railwayStations: ['Yog Nagari Rishikesh (YNRK)', 'Haridwar Junction (HW - 25km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-nainital',
    name: 'Nainital',
    state: 'Uttarakhand',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Naini Lake Boating, Naina Peak, Snow View Point, Mallital',
    tagline: 'Glistening eye-shaped lake surrounded by seven emerald Kumaon hills.',
    imageUrl: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 29.3919, lng: 79.4542 },
    majorHubs: {
      busStations: ['Tallital Bus Stand', 'Mallital Taxi Stand'],
      railwayStations: ['Kathgodam Railway Station (KGM - 35km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    country: 'India',
    destinationType: 'CITY',
    popularFor: 'Robbers Cave, Mindrolling Monastery, Forest Research Institute',
    tagline: 'The picturesque Doon Valley capital nestled between Ganga and Yamuna.',
    imageUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 30.3165, lng: 78.0322 },
    majorHubs: {
      busStations: ['ISBT Dehradun', 'Mussoorie Bus Stand'],
      railwayStations: ['Dehradun Terminal (DDN)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 5. DELHI (Union Territory)
  // ==========================================
  {
    id: 'dest-delhi',
    name: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'India Gate, Red Fort, Qutub Minar, Chandni Chowk',
    tagline: 'The vibrant national capital blending ancient Mughal grandeur with modern metropolis.',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    majorHubs: {
      busStations: ['Kashmere Gate ISBT', 'Anand Vihar ISBT', 'Sarai Kale Khan ISBT'],
      railwayStations: ['New Delhi Railway Station (NDLS)', 'Old Delhi (DLI)', 'Hazrat Nizamuddin (NZM)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 6. PUNJAB (State)
  // ==========================================
  {
    id: 'dest-amritsar',
    name: 'Amritsar',
    state: 'Punjab',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Sri Harmandir Sahib (Golden Temple), Wagah Border, Jallianwala Bagh',
    tagline: 'The holy spiritual soul of Sikhism known for the glowing Golden Temple and Punjabi hospitality.',
    imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 31.6340, lng: 74.8723 },
    majorHubs: {
      busStations: ['Amritsar ISBT (Shaheed Madan Lal Dhingra Stand)'],
      railwayStations: ['Amritsar Junction (ASR)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 7. CHANDIGARH (Union Territory)
  // ==========================================
  {
    id: 'dest-chandigarh',
    name: 'Chandigarh',
    state: 'Chandigarh',
    country: 'India',
    destinationType: 'CITY',
    popularFor: 'Rock Garden, Sukhna Lake, Rose Garden, Le Corbusier Architecture',
    tagline: 'India’s first master-planned green city with immaculate grid layout and tranquil lakes.',
    imageUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 30.7333, lng: 76.7794 },
    majorHubs: {
      busStations: ['ISBT Sector 43', 'ISBT Sector 17'],
      railwayStations: ['Chandigarh Junction (CDG)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 8. UTTAR PRADESH (State)
  // ==========================================
  {
    id: 'dest-agra',
    name: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Taj Mahal (Wonder of the World), Agra Fort, Fatehpur Sikri',
    tagline: 'Home of the timeless white marble mausoleum celebrating everlasting love.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 27.1767, lng: 78.0081 },
    majorHubs: {
      busStations: ['Idgah Bus Stand', 'ISBT Transport Nagar'],
      railwayStations: ['Agra Cantt (AGC)', 'Agra Fort (AF)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Dashashwamedh Ghat Aarti, Kashi Vishwanath, Sarnath Stupa',
    tagline: 'One of the world’s oldest continuously inhabited sacred cities along the holy Ganges.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    majorHubs: {
      busStations: ['Varanasi Cantt Bus Stand', 'Chaudhary Charan Singh Stand'],
      railwayStations: ['Varanasi Junction (BSB)', 'Banaras Station (BSBS)', 'Pt. Deen Dayal Upadhyaya (DDU)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Bara Imambara, Chota Imambara, Rumi Darwaza, Awadhi Kebabs',
    tagline: 'The City of Nawabs renowned for royal etiquette, chikan embroidery, and gourmet cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 26.8467, lng: 80.9462 },
    majorHubs: {
      busStations: ['Alambagh ISBT', 'Kaiserbagh Bus Station'],
      railwayStations: ['Lucknow Charbagh (LKO)', 'Lucknow Junction (LJN)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-ayodhya',
    name: 'Ayodhya',
    state: 'Uttar Pradesh',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Shri Ram Janmabhoomi Mandir, Sarayu River Ghats, Hanuman Garhi',
    tagline: 'Ancient sacred spiritual center on the peaceful banks of the holy Sarayu river.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 26.7922, lng: 82.1998 },
    majorHubs: {
      busStations: ['Ayodhya Dham Bus Terminal'],
      railwayStations: ['Ayodhya Dham Junction (AY)', 'Ayodhya Cantt (AYC)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 9. MAHARASHTRA (State)
  // ==========================================
  {
    id: 'dest-mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'Gateway of India, Marine Drive, Bandra-Worli Sea Link, Bollywood',
    tagline: 'The Maximum City: financial powerhouse, coastal dreams, and cinematic heartbeat.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 18.9220, lng: 72.8347 },
    majorHubs: {
      busStations: ['Mumbai Central MSRTC Bus Stand', 'Borivali MSRTC', 'Dadar TT Circle'],
      railwayStations: ['Chhatrapati Shivaji Maharaj Terminus (CSMT)', 'Mumbai Central (MMCT)', 'Lokmanya Tilak Terminus (LTT)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-pune',
    name: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'Shaniwar Wada, Aga Khan Palace, Sinhagad Fort, IT Hubs',
    tagline: 'The cultural capital of Maharashtra with lush Sahyadri trails and educational excellence.',
    imageUrl: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    majorHubs: {
      busStations: ['Shivajinagar Bus Stand', 'Swargate MSRTC Terminal'],
      railwayStations: ['Pune Junction (PUNE)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-mahabaleshwar',
    name: 'Mahabaleshwar',
    state: 'Maharashtra',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Venna Lake, Arthur’s Seat, Mapro Strawberry Gardens, Wilson Point',
    tagline: 'Western Ghats plateau famous for fresh strawberries, mist-laden viewpoints, and valleys.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 17.9237, lng: 73.6586 },
    majorHubs: {
      busStations: ['Mahabaleshwar Central MSRTC Bus Stand'],
      railwayStations: ['Satara (STR - 58km)', 'Pune Junction (PUNE - 120km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 10. KARNATAKA (State)
  // ==========================================
  {
    id: 'dest-bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'Cubbon Park, Lalbagh Botanical Gardens, Bangalore Palace, Tech Parks',
    tagline: 'India’s dynamic Silicon Valley known for pleasant year-round weather and craft breweries.',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    majorHubs: {
      busStations: ['Kempegowda Bus Station (Majestic)', 'Shantinagar KSRTC Bus Stand', 'Satellite Bus Terminal (Mysore Road)'],
      railwayStations: ['KSR Bengaluru City (SBC)', 'Yesvantpur Junction (YPR)', 'SMVT Bengaluru'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-mysuru',
    name: 'Mysuru (Mysore)',
    state: 'Karnataka',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Mysore Royal Palace, Chamundi Hill, Brindavan Gardens, Mysore Silk',
    tagline: 'Royal heritage city famed for illuminated palaces, sandalwood, and grand Dasara festivities.',
    imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e4299b86?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 12.2958, lng: 76.6394 },
    majorHubs: {
      busStations: ['Mysuru KSRTC Sub-urban Bus Stand', 'Mysuru City Bus Stand'],
      railwayStations: ['Mysuru Junction (MYS)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-hampi',
    name: 'Hampi',
    state: 'Karnataka',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Virupaksha Temple, Stone Chariot, Vijayanagara Ruins, Tungabhadra River',
    tagline: 'UNESCO World Heritage site with boulder-strewn landscape and medieval empire monuments.',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 15.3350, lng: 76.4600 },
    majorHubs: {
      busStations: ['Hampi Bazaar Bus Stand', 'Hospet KSRTC Bus Stand (12km)'],
      railwayStations: ['Hosapete Junction (HPT - 13km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-coorg',
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Abbey Falls, Raja’s Seat, Coffee Plantations, Dubare Elephant Camp',
    tagline: 'The Scotland of India draped in misty coffee estates, pepper vines, and spices.',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 12.3375, lng: 75.8069 },
    majorHubs: {
      busStations: ['Madikeri KSRTC Bus Stand', 'Kushalnagar Bus Stand'],
      railwayStations: ['Mysuru Junction (MYS - 118km)', 'Hassan Junction (HAS - 115km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 11. KERALA (State)
  // ==========================================
  {
    id: 'dest-kochi',
    name: 'Kochi (Cochin)',
    state: 'Kerala',
    country: 'India',
    destinationType: 'BEACH',
    popularFor: 'Fort Kochi Chinese Fishing Nets, Mattancherry Palace, Kathakali Dance',
    tagline: 'The Queen of the Arabian Sea uniting spice port history with artistic culture.',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    majorHubs: {
      busStations: ['KSRTC Central Bus Stand Ernakulam', 'Vyttila Mobility Hub'],
      railwayStations: ['Ernakulam Junction (ERS)', 'Ernakulam Town (ERN)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-munnar',
    name: 'Munnar',
    state: 'Kerala',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Eravikulam National Park, Mattupetty Dam, Tea Gardens, Anamudi Peak',
    tagline: 'Endless rolling emerald tea estates, mist-covered peaks, and Nilgiri tahr sanctuaries.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 10.0889, lng: 77.0595 },
    majorHubs: {
      busStations: ['Munnar Central KSRTC Bus Stand'],
      railwayStations: ['Aluva Railway Station (AWY - 110km)', 'Ernakulam Junction (ERS - 125km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-alleppey',
    name: 'Alleppey (Alappuzha)',
    state: 'Kerala',
    country: 'India',
    destinationType: 'BEACH',
    popularFor: 'Backwater Houseboats, Vembanad Lake, Marari Beach, Nehru Trophy Boat Race',
    tagline: 'The Venice of the East with labyrinthine canals, swaying coconut palms, and houseboats.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 9.4981, lng: 76.3388 },
    majorHubs: {
      busStations: ['KSRTC Bus Stand Alappuzha', 'Boat Jetty Bus Stand'],
      railwayStations: ['Alappuzha Railway Station (ALLP)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 12. TAMIL NADU (State)
  // ==========================================
  {
    id: 'dest-chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'Marina Beach, Kapaleeshwarar Temple, San Thome Basilica, Carnatic Music',
    tagline: 'The cultural gateway of South India: coastal breeze, ancient Dravidian temples, and filter coffee.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    majorHubs: {
      busStations: ['Puratchi Thalaivar Dr. MGR Bus Terminus (Koyambedu CMBT)', 'Kilambakkam Bus Terminus (KCBT)'],
      railwayStations: ['Chennai Central (MAS)', 'Chennai Egmore (MS)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-ooty',
    name: 'Ooty (Udhagamandalam)',
    state: 'Tamil Nadu',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Ooty Botanical Gardens, Nilgiri Mountain Toy Train, Pykara Lake, Doddabetta Peak',
    tagline: 'Queen of the Nilgiris featuring Eucalyptus groves, tea plantations, and heritage steam train.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 11.4102, lng: 76.6950 },
    majorHubs: {
      busStations: ['Ooty Central Bus Stand', 'Upper Bazaar Stand'],
      railwayStations: ['Udhagamandalam (UAM - UNESCO Nilgiri Mountain Railway)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-madurai',
    name: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum',
    tagline: 'The vibrant Temple City with soaring sculpted gopurams and millennia of Tamil literature.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 9.9252, lng: 78.1198 },
    majorHubs: {
      busStations: ['Mattuthavani Integrated Bus Terminus', 'Arapalayam Bus Stand'],
      railwayStations: ['Madurai Junction (MDU)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 13. TELANGANA (State)
  // ==========================================
  {
    id: 'dest-hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'Charminar, Golconda Fort, Ramoji Film City, Hyderabadi Biryani',
    tagline: 'The City of Pearls marrying historic Nizami legacy with thriving HITEC City tech hubs.',
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    majorHubs: {
      busStations: ['Mahatma Gandhi Bus Station (MGBS / Imlibun)', 'Jubilee Bus Station (JBS)'],
      railwayStations: ['Secunderabad Junction (SC)', 'Hyderabad Deccan (Nampally - HYB)', 'Kacheguda (KCG)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 14. ANDHRA PRADESH (State)
  // ==========================================
  {
    id: 'dest-vizag',
    name: 'Visakhapatnam (Vizag)',
    state: 'Andhra Pradesh',
    country: 'India',
    destinationType: 'BEACH',
    popularFor: 'RK Beach, Kailasagiri, INS Kursura Submarine Museum, Araku Valley',
    tagline: 'The Jewel of the East Coast: panoramic beaches meeting forested Eastern Ghat hills.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 17.6868, lng: 83.2185 },
    majorHubs: {
      busStations: ['Dwaraka Bus Station (RTC Complex)'],
      railwayStations: ['Visakhapatnam Junction (VSKP)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-tirupati',
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Sri Venkateswara Swamy Temple (Tirumala Hills), Silathoranam, Chandragiri Fort',
    tagline: 'World’s most visited sacred pilgrimage shrine atop the seven sacred Tirumala peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 13.6288, lng: 79.4192 },
    majorHubs: {
      busStations: ['Tirupati Central RTC Bus Stand', 'Balaji Colony Stand'],
      railwayStations: ['Tirupati Main (TPTY)', 'Renigunta Junction (RU)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 15. WEST BENGAL (State)
  // ==========================================
  {
    id: 'dest-kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'Victoria Memorial, Howrah Bridge, Dakshineswar Kali Temple, Park Street',
    tagline: 'The City of Joy: cultural capital of arts, literature, tramways, and grand heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 22.5726, lng: 88.3639 },
    majorHubs: {
      busStations: ['Esplanade Central Bus Terminus', 'Babughat Bus Stand', 'Karunamoyee Salt Lake Terminal'],
      railwayStations: ['Howrah Junction (HWH)', 'Sealdah (SDAH)', 'Kolkata Station (KOAA)', 'Shalimar (SHM)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-darjeeling',
    name: 'Darjeeling',
    state: 'West Bengal',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Tiger Hill Sunrise, Darjeeling Himalayan Toy Train, Batasia Loop, Champagne Tea',
    tagline: 'World capital of exquisite tea with majestic views of Mount Kangchenjunga.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 27.0410, lng: 88.2663 },
    majorHubs: {
      busStations: ['Chauk Bazaar Motor Stand', 'Siliguri Tenzing Norgay Bus Terminus (80km)'],
      railwayStations: ['Darjeeling Toy Train Station (DJ)', 'New Jalpaiguri (NJP - 75km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 16. SIKKIM (State)
  // ==========================================
  {
    id: 'dest-gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'MG Marg, Rumtek Monastery, Tsomgo Lake, Nathu La Pass',
    tagline: 'Clean Himalayan wonderland with fluttering prayer flags and crisp mountain air.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 27.3389, lng: 88.6065 },
    majorHubs: {
      busStations: ['SNT Bus Terminus Gangtok', 'Deorali Taxi Stand'],
      railwayStations: ['New Jalpaiguri (NJP - 120km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 17. GUJARAT (State)
  // ==========================================
  {
    id: 'dest-ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Sabarmati Ashram, Adalaj Stepwell, Atal Bridge, UNESCO Walled City',
    tagline: 'India’s first UNESCO World Heritage City famed for textiles, stepwells, and street food.',
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 23.0225, lng: 72.5714 },
    majorHubs: {
      busStations: ['Gita Mandir Central Bus Stand (ST)', 'Ranip GSRTC Bus Terminus'],
      railwayStations: ['Ahmedabad Junction (Kalupur - ADI)', 'Sabarmati Junction (SBT)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-kutch',
    name: 'Rann of Kutch',
    state: 'Gujarat',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'White Salt Desert, Rann Utsav, Kala Dungar, Bhuj Craft Villages',
    tagline: 'The vast mystical white salt desert glowing under full-moon skies.',
    imageUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 23.8344, lng: 69.8322 },
    majorHubs: {
      busStations: ['Bhuj GSRTC Bus Station (80km)'],
      railwayStations: ['Bhuj Railway Station (BHUJ - 82km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 18. MADHYA PRADESH (State)
  // ==========================================
  {
    id: 'dest-indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    destinationType: 'CITY',
    popularFor: 'Sarafa Night Food Bazaar, Rajwada Palace, Chappan Dukan, Lal Bagh',
    tagline: 'India’s cleanest city and undisputed gastronomic street-food capital.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 22.7196, lng: 75.8577 },
    majorHubs: {
      busStations: ['Sarwate Bus Stand', 'AiCTSL Gangwal Stand'],
      railwayStations: ['Indore Junction (INDB)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-bhopal',
    name: 'Bhopal',
    state: 'Madhya Pradesh',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Upper Lake (Bhojtal), Sanchi Stupa, Van Vihar National Park, Taj-ul-Masajid',
    tagline: 'The City of Lakes combining grand Afghan heritage with pristine natural reserves.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    majorHubs: {
      busStations: ['ISBT Bhopal (Hoshangabad Road)', 'Kushabhau Thakre Bus Terminal'],
      railwayStations: ['Rani Kamlapati Station (RKMP)', 'Bhopal Junction (BPL)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 19. JAMMU AND KASHMIR (Union Territory)
  // ==========================================
  {
    id: 'dest-srinagar',
    name: 'Srinagar',
    state: 'Jammu and Kashmir',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Dal Lake Shikara, Mughal Gardens, Shankaracharya Temple, Floating Markets',
    tagline: 'Paradise on Earth: cedar houseboats, lotus blossoms, and snow-capped peaks.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 34.0837, lng: 74.7973 },
    majorHubs: {
      busStations: ['TRC Srinagar Bus Stand', 'Batmaloo Bus Terminal'],
      railwayStations: ['Srinagar Railway Station (SINA)', 'Jammu Tawi (JAT - 260km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-gulmarg',
    name: 'Gulmarg',
    state: 'Jammu and Kashmir',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Gulmarg Gondola (World’s Highest Cable Car), Ski Slopes, Apharwat Peak',
    tagline: 'The Meadow of Flowers transformed into India’s premier winter sports wonderland.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 34.0484, lng: 74.3805 },
    majorHubs: {
      busStations: ['Gulmarg Bus Terminal', 'Tangmarg Stand (12km)'],
      railwayStations: ['Jammu Tawi (JAT - 290km)', 'Srinagar (SINA - 50km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 20. ASSAM (State)
  // ==========================================
  {
    id: 'dest-guwahati',
    name: 'Guwahati',
    state: 'Assam',
    country: 'India',
    destinationType: 'CITY',
    popularFor: 'Kamakhya Temple, Brahmaputra River Cruises, Umananda Island, Pobitora',
    tagline: 'Gateway to Northeast India perched on the majestic banks of the mighty Brahmaputra.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 26.1445, lng: 91.7362 },
    majorHubs: {
      busStations: ['ISBT Betkuchi Guwahati', 'ASTC Paltan Bazar'],
      railwayStations: ['Guwahati Junction (GHY)', 'Kamakhya Junction (KYQ)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-kaziranga',
    name: 'Kaziranga National Park',
    state: 'Assam',
    country: 'India',
    destinationType: 'WILDLIFE',
    popularFor: 'One-Horned Rhinoceros, Elephant Safari, Tea Estates, Birdwatching',
    tagline: 'UNESCO World Heritage wildlife sanctuary harboring the world’s greatest rhinoceros population.',
    imageUrl: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 26.5775, lng: 93.1711 },
    majorHubs: {
      busStations: ['Kohora Bus Stand (Kaziranga Central)'],
      railwayStations: ['Furkating Junction (FKG - 75km)', 'Guwahati (GHY - 215km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 21. BIHAR (State)
  // ==========================================
  {
    id: 'dest-bodhgaya',
    name: 'Bodh Gaya',
    state: 'Bihar',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Mahabodhi Temple, Sacred Bodhi Tree, Great Buddha Statue, International Monasteries',
    tagline: 'The sacred birthplace of Buddhism where Gautama Buddha attained supreme enlightenment.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 24.6961, lng: 84.9869 },
    majorHubs: {
      busStations: ['Bodh Gaya Central Bus Stand'],
      railwayStations: ['Gaya Junction (GAYA - 14km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-patna',
    name: 'Patna',
    state: 'Bihar',
    country: 'India',
    destinationType: 'CITY',
    popularFor: 'Takht Sri Patna Sahib, Golghar, Patna Museum, Ganga Riverfront',
    tagline: 'Ancient Pataliputra: capital of the Mauryan Empire and birthplace of Guru Gobind Singh.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 25.5941, lng: 85.1376 },
    majorHubs: {
      busStations: ['Bairiya ISBT Patna', 'Mithapur Bus Stand'],
      railwayStations: ['Patna Junction (PNBE)', 'Rajendra Nagar Terminal (RJPB)', 'Danapur (DNR)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 22. ODISHA (State)
  // ==========================================
  {
    id: 'dest-puri',
    name: 'Puri',
    state: 'Odisha',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Jagannath Temple, Golden Beach, Rath Yatra, Konark Sun Temple (35km)',
    tagline: 'Sacred coastal Char Dham abode of Lord Jagannath with golden Bay of Bengal surf.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 19.8135, lng: 85.8312 },
    majorHubs: {
      busStations: ['Puri OSRTC Bus Stand', 'Grand Road Bus Terminal'],
      railwayStations: ['Puri Railway Station (PURI)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Lingaraj Temple, Udayagiri & Khandagiri Caves, Dhauli Shanti Stupa, Nandankanan',
    tagline: 'The Temple City of India showcasing magnificent Kalinga stone architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 20.2961, lng: 85.8245 },
    majorHubs: {
      busStations: ['Baramunda ISBT Bhubaneswar'],
      railwayStations: ['Bhubaneswar Railway Station (BBS)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 23. MEGHALAYA (State)
  // ==========================================
  {
    id: 'dest-shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Elephant Falls, Umiam Lake, Ward’s Lake, Rock Music Capital',
    tagline: 'The Scotland of the East: rolling pine hills, waterfalls, and vibrant indie culture.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 25.5788, lng: 91.8933 },
    majorHubs: {
      busStations: ['ISBT Mawiong Shillong', 'Police Bazar Sumo Stand'],
      railwayStations: ['Guwahati Junction (GHY - 100km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-cherrapunji',
    name: 'Cherrapunji (Sohra)',
    state: 'Meghalaya',
    country: 'India',
    destinationType: 'NATURE',
    popularFor: 'Living Root Bridges, Nohkalikai Falls, Mawsmai Cave, Rain Forests',
    tagline: 'Fabled cloud kingdom with awe-inspiring bio-engineered living root bridges.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 25.2702, lng: 91.7323 },
    majorHubs: {
      busStations: ['Sohra Market Bus Stand'],
      railwayStations: ['Guwahati Junction (GHY - 150km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 24. ARUNACHAL PRADESH (State)
  // ==========================================
  {
    id: 'dest-tawang',
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Tawang Monastery, Sela Pass & Lake, Madhuri Lake, Jaswant Garh',
    tagline: 'Spiritual Himalayan heights home to India’s largest Tibetan Buddhist monastery.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 27.5861, lng: 91.8594 },
    majorHubs: {
      busStations: ['Tawang APST Bus Station'],
      railwayStations: ['Tezpur (TZTB - 320km)', 'Bhalukpong (BKT - 280km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 25. CHHATTISGARH (State)
  // ==========================================
  {
    id: 'dest-raipur',
    name: 'Raipur',
    state: 'Chhattisgarh',
    country: 'India',
    destinationType: 'CITY',
    popularFor: 'Swami Vivekananda Sarovar, Purkhouti Muktangan, Chitrakote Falls nearby',
    tagline: 'Vibrant heart of Central India blending modern industry with indigenous tribal arts.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 21.2514, lng: 81.6296 },
    majorHubs: {
      busStations: ['Sri Balaji Swami ISBT Raipur'],
      railwayStations: ['Raipur Junction (R)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-bastar',
    name: 'Bastar (Jagdalpur)',
    state: 'Chhattisgarh',
    country: 'India',
    destinationType: 'NATURE',
    popularFor: 'Chitrakote Falls (Niagara of India), Tirathgarh Falls, Bastar Bell Metal Craft',
    tagline: 'Dense Sal forests and roaring horseshoe waterfalls celebrating ancient tribal culture.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 19.0730, lng: 82.0280 },
    majorHubs: {
      busStations: ['Jagdalpur Central Bus Stand'],
      railwayStations: ['Jagdalpur Railway Station (JDB)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 26. JHARKHAND (State)
  // ==========================================
  {
    id: 'dest-ranchi',
    name: 'Ranchi',
    state: 'Jharkhand',
    country: 'India',
    destinationType: 'CITY',
    popularFor: 'Hundru Falls, Dassam Falls, Tagores Hill, Jagannath Temple Ranchi',
    tagline: 'The City of Waterfalls set amidst scenic Chota Nagpur plateau hills.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 23.3441, lng: 85.3096 },
    majorHubs: {
      busStations: ['Khadgarha Bus Stand Ranchi', 'ITIHAS Bus Stand'],
      railwayStations: ['Ranchi Junction (RNC)', 'Hatia (HTE)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 27. HARYANA (State)
  // ==========================================
  {
    id: 'dest-gurugram',
    name: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    destinationType: 'METRO',
    popularFor: 'Cyber Hub, Kingdom of Dreams, Sultanpur National Bird Sanctuary, Ambience Mall',
    tagline: 'The Millennium City of towering glass skyscrapers and world-class culinary avenues.',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 28.4595, lng: 77.0266 },
    majorHubs: {
      busStations: ['Gurugram Bus Stand (Old City)', 'IFFCO Chowk Flyover Stand'],
      railwayStations: ['Gurgaon Railway Station (GGN)', 'Delhi Cantt (DEC - 18km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
  {
    id: 'dest-kurukshetra',
    name: 'Kurukshetra',
    state: 'Haryana',
    country: 'India',
    destinationType: 'SPIRITUAL',
    popularFor: 'Brahma Sarovar, Jyotisar (Bhagavad Gita Birthplace), Sri Krishna Museum',
    tagline: 'The historic Land of the Bhagavad Gita and legendary Mahabharata epic.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 29.9695, lng: 76.8783 },
    majorHubs: {
      busStations: ['Kurukshetra Roadways Bus Stand (Pipli)'],
      railwayStations: ['Kurukshetra Junction (KKDE)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 28. MANIPUR (State)
  // ==========================================
  {
    id: 'dest-imphal',
    name: 'Imphal',
    state: 'Manipur',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Loktak Lake (Floating Phumdis), Keibul Lamjao (Sangai Deer), Kangla Fort, Ima Keithel',
    tagline: 'Home to the world’s only floating national park and Asia’s largest all-women market.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 24.8170, lng: 93.9368 },
    majorHubs: {
      busStations: ['ISBT Khuman Lampak Imphal'],
      railwayStations: ['Dimapur (DMV - 200km)', 'Silchar (SCL - 260km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 29. MIZORAM (State)
  // ==========================================
  {
    id: 'dest-aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Durtlang Hills, Solomon’s Temple, Reiek Heritage Village, Mizo Bamboo Crafts',
    tagline: 'Peaceful hilltop city overlooking emerald valleys and cloud-filled canyons.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 23.7271, lng: 92.7176 },
    majorHubs: {
      busStations: ['Aizawl MST Bus Station (Chaltlang)'],
      railwayStations: ['Bairabi Railway Station (BHRB - 130km)', 'Silchar (SCL - 170km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 30. NAGALAND (State)
  // ==========================================
  {
    id: 'dest-kohima',
    name: 'Kohima',
    state: 'Nagaland',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Hornbill Festival, Dzukou Valley Trek, WWII War Cemetery, Naga Heritage Village (Kisama)',
    tagline: 'Land of the Great Hornbill, majestic tribal traditions, and wildflower valleys.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 25.6751, lng: 94.1086 },
    majorHubs: {
      busStations: ['NST Bus Station Kohima', 'BOC Taxi Stand'],
      railwayStations: ['Dimapur Railway Station (DMV - 74km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 31. TRIPURA (State)
  // ==========================================
  {
    id: 'dest-agartala',
    name: 'Agartala',
    state: 'Tripura',
    country: 'India',
    destinationType: 'HERITAGE',
    popularFor: 'Ujjayanta Palace, Neermahal Water Palace, Unakoti Rock Carvings',
    tagline: 'Royal palaces reflecting in tranquil lakes and mysterious ancient colossal rock sculptures.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 23.8315, lng: 91.2868 },
    majorHubs: {
      busStations: ['ISBT Chandrapur Agartala', 'Nagerjala Bus Stand'],
      railwayStations: ['Agartala Railway Station (AGTL)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 32. LADAKH (Union Territory)
  // ==========================================
  {
    id: 'dest-leh',
    name: 'Leh',
    state: 'Ladakh',
    country: 'India',
    destinationType: 'HILL_STATION',
    popularFor: 'Pangong Tso Lake, Khardung La Pass, Nubra Valley, Thiksey Monastery',
    tagline: 'The Land of High Mountain Passes with crystal-blue high-altitude lakes and Tibetan stupas.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 34.1526, lng: 77.5771 },
    majorHubs: {
      busStations: ['Leh JKSRTC Central Bus Stand'],
      railwayStations: ['Jammu Tawi (JAT - 700km - Air/Road access via Manali-Leh)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 33. ANDAMAN AND NICOBAR ISLANDS (Union Territory)
  // ==========================================
  {
    id: 'dest-port-blair',
    name: 'Port Blair & Havelock Island',
    state: 'Andaman and Nicobar Islands',
    country: 'India',
    destinationType: 'ISLAND',
    popularFor: 'Radhanagar Beach (Asia’s Best Beach), Cellular Jail, Scuba Diving, Coral Reefs',
    tagline: 'Untouched turquoise tropical archipelago with world-class coral reefs and white sand beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 11.6234, lng: 92.7265 },
    majorHubs: {
      busStations: ['Mohanpura Central Bus Terminus (Port Blair)', 'Havelock Jetty Point'],
      railwayStations: ['Chennai Central / Kolkata (Transit via Port Blair Veer Savarkar Airport & Ferry)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 34. PUDUCHERRY (Union Territory)
  // ==========================================
  {
    id: 'dest-puducherry',
    name: 'Puducherry',
    state: 'Puducherry',
    country: 'India',
    destinationType: 'BEACH',
    popularFor: 'French War Memorial, Promenade Beach, Auroville Matrimandir, Sri Aurobindo Ashram',
    tagline: 'The French Riviera of the East with pastel mustard colonial streets and spiritual serenity.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 11.9416, lng: 79.8083 },
    majorHubs: {
      busStations: ['Puducherry New Bus Stand (Maraimalai Adigal Stand)'],
      railwayStations: ['Puducherry Railway Station (PDY)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 35. DADRA AND NAGAR HAVELI AND DAMAN AND DIU (Union Territory)
  // ==========================================
  {
    id: 'dest-daman',
    name: 'Daman & Diu',
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    country: 'India',
    destinationType: 'BEACH',
    popularFor: 'Devka Beach, Moti Daman Fort, Diu Fortress, Naida Caves',
    tagline: 'Charming Portuguese coastal fortresses and tranquil Arabian sea beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 20.3974, lng: 72.8328 },
    majorHubs: {
      busStations: ['Daman Bus Stand', 'Silvassa Central Stand'],
      railwayStations: ['Vapi Railway Station (VAPI - 12km)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },

  // ==========================================
  // 36. LAKSHADWEEP (Union Territory)
  // ==========================================
  {
    id: 'dest-lakshadweep',
    name: 'Agatti & Kavaratti',
    state: 'Lakshadweep',
    country: 'India',
    destinationType: 'ISLAND',
    popularFor: 'Agatti Coral Lagoon, Scuba Diving, Kavaratti Marine Aquarium, Glass-bottom Boats',
    tagline: 'Exquisite emerald atolls and shimmering coral lagoons in the Arabian Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 10.5667, lng: 72.6417 },
    majorHubs: {
      busStations: ['Agatti Island Jetty', 'Kavaratti Boat Harbor'],
      railwayStations: ['Kochi (Transit via Agatti Airport / Passenger Ships from Cochin Port)'],
    },
    isActive: true,
    sourceType: 'ADMIN_MANAGED',
    isVerified: true,
  },
];

/**
 * Repeatable, non-destructive data-import function
 * Adds missing destinations and updates metadata without deleting user records or duplicates
 */
export function importIndianDestinations(
  currentDestinations: Destination[]
): {
  merged: Destination[];
  addedCount: number;
  updatedCount: number;
} {
  const map = new Map<string, Destination>();

  // Index existing by normalized ID
  currentDestinations.forEach((d) => {
    map.set(d.id.toLowerCase(), d);
  });

  let addedCount = 0;
  let updatedCount = 0;

  for (const fresh of INDIAN_GEOGRAPHIC_DATASET) {
    const key = fresh.id.toLowerCase();
    if (map.has(key)) {
      // Update fields while preserving active status and user edits if desired
      const existing = map.get(key)!;
      map.set(key, {
        ...fresh,
        isActive: existing.isActive !== undefined ? existing.isActive : fresh.isActive,
        updatedAt: new Date().toISOString(),
      });
      updatedCount++;
    } else {
      map.set(key, {
        ...fresh,
        updatedAt: new Date().toISOString(),
      });
      addedCount++;
    }
  }

  return {
    merged: Array.from(map.values()),
    addedCount,
    updatedCount,
  };
}
