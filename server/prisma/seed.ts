import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AI Growth & Agentic Commerce Database...');

  // Clean existing tables in order
  await prisma.agentLog.deleteMany({});
  await prisma.marketingCampaign.deleteMany({});
  await prisma.growthInsight.deleteMany({});
  await prisma.customerSegment.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users (1 Admin, 10 Customers)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@nexagentic.ai',
      name: 'Aditi Sen',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98765 43210',
    }
  });

  const customerData = [
    {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98111 22334',
      budgetMax: 80000,
      categories: ['Laptops & Computing', 'Audio & Headphones'],
      proficiency: 'Advanced',
      brands: ['Apple', 'Dell', 'Sony'],
      location: 'Bengaluru, Karnataka',
      persona: 'Senior Fullstack Developer'
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98222 33445',
      budgetMax: 50000,
      categories: ['Smartphones & Tablets', 'Smart Wearables'],
      proficiency: 'Intermediate',
      brands: ['Samsung', 'OnePlus'],
      location: 'Mumbai, Maharashtra',
      persona: 'Marketing Strategist & Content Creator'
    },
    {
      name: 'Aman Verma',
      email: 'aman.verma@example.com',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98333 44556',
      budgetMax: 65000,
      categories: ['Laptops & Computing', 'Smart Home & Productivity'],
      proficiency: 'Intermediate',
      brands: ['Lenovo', 'HP', 'Logitech'],
      location: 'Pune, Maharashtra',
      persona: 'Computer Science Student'
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98444 55667',
      budgetMax: 120000,
      categories: ['Audio & Headphones', 'Smart Wearables', 'Laptops & Computing'],
      proficiency: 'Advanced',
      brands: ['Apple', 'Bose', 'Sennheiser'],
      location: 'Chennai, Tamil Nadu',
      persona: 'Music Producer & Sound Designer'
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98555 66778',
      budgetMax: 90000,
      categories: ['Smartphones & Tablets', 'Smart Home & Productivity'],
      proficiency: 'Intermediate',
      brands: ['Google', 'Asus'],
      location: 'Delhi NCR',
      persona: 'Product Manager'
    },
    {
      name: 'Sneha Rao',
      email: 'sneha.rao@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98666 77889',
      budgetMax: 40000,
      categories: ['Audio & Headphones', 'Smart Wearables'],
      proficiency: 'Beginner',
      brands: ['Boat', 'Noise', 'Realme'],
      location: 'Hyderabad, Telangana',
      persona: 'Fitness Enthusiast'
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan.mehta@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98777 88990',
      budgetMax: 150000,
      categories: ['Laptops & Computing', 'Audio & Headphones'],
      proficiency: 'Advanced',
      brands: ['Apple', 'Sony', 'Asus'],
      location: 'Gurugram, Haryana',
      persona: 'Fintech Founder'
    },
    {
      name: 'Kavita Joshi',
      email: 'kavita.joshi@example.com',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98888 99001',
      budgetMax: 35000,
      categories: ['Smart Home & Productivity', 'Smartphones & Tablets'],
      proficiency: 'Beginner',
      brands: ['Xiaomi', 'Amazon', 'TP-Link'],
      location: 'Ahmedabad, Gujarat',
      persona: 'Remote Consultant'
    },
    {
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98999 00112',
      budgetMax: 75000,
      categories: ['Smartphones & Tablets', 'Audio & Headphones'],
      proficiency: 'Intermediate',
      brands: ['OnePlus', 'Sony'],
      location: 'Kolkata, West Bengal',
      persona: 'Architect & 3D Artist'
    },
    {
      name: 'Devendra Nair',
      email: 'devendra.nair@example.com',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
      phone: '+91 98000 11223',
      budgetMax: 55000,
      categories: ['Laptops & Computing', 'Smart Wearables'],
      proficiency: 'Intermediate',
      brands: ['Acer', 'Samsung'],
      location: 'Kochi, Kerala',
      persona: 'Data Analyst'
    }
  ];

  const createdCustomers = [];
  for (const c of customerData) {
    const user = await prisma.user.create({
      data: {
        email: c.email,
        name: c.name,
        role: 'CUSTOMER',
        avatar: c.avatar,
        phone: c.phone,
        profile: {
          create: {
            budgetMax: c.budgetMax,
            preferredCategories: JSON.stringify(c.categories),
            techProficiency: c.proficiency,
            preferredBrands: JSON.stringify(c.brands),
            location: c.location,
            personaTag: c.persona,
          }
        },
        carts: {
          create: {}
        }
      },
      include: {
        carts: true,
        profile: true
      }
    });
    createdCustomers.push(user);
  }

  console.log(`Created ${createdCustomers.length} customers and 1 admin.`);

  // 2. Create 32 Realistic Products
  const products = [
    // Laptops & Computing
    {
      title: 'ASUS Vivobook Pro 15 OLED Creator',
      slug: 'asus-vivobook-pro-15-oled',
      category: 'Laptops & Computing',
      brand: 'ASUS',
      price: 68990,
      originalPrice: 79990,
      rating: 4.7,
      reviewCount: 142,
      inStock: true,
      stockCount: 18,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      description: 'Engineered for developers and creators featuring AMD Ryzen 7 5800H, 16GB RAM, 512GB NVMe SSD, and vivid 15.6-inch FHD OLED display with 100% DCI-P3 color gamut.',
      specs: JSON.stringify({
        'Processor': 'AMD Ryzen 7 5800H (8 Cores, 16 Threads)',
        'RAM': '16GB DDR4 3200MHz',
        'Storage': '512GB M.2 NVMe PCIe SSD',
        'Display': '15.6-inch FHD OLED 600 nits Peak Brightness',
        'Graphics': 'NVIDIA GeForce RTX 3050 4GB GDDR6',
        'Battery Life': 'Up to 9 hours (63Whr)',
        'Weight': '1.65 kg',
        'OS': 'Windows 11 Home'
      }),
      features: JSON.stringify([
        'Ideal for programming, containerization, and light ML tasks',
        '100% DCI-P3 Pantone Validated color-accurate OLED display',
        'Dual-fan cooling system for sustained high-intensity compilation',
        'Fast charging to 60% in 49 minutes'
      ]),
      tags: JSON.stringify(['programming', 'coding', 'oled', 'battery', 'rtx3050', 'under70k', 'laptop']),
      isFeatured: true
    },
    {
      title: 'Lenovo IdeaPad Slim 5 AMD Ryzen 7',
      slug: 'lenovo-ideapad-slim-5-ryzen-7',
      category: 'Laptops & Computing',
      brand: 'Lenovo',
      price: 64990,
      originalPrice: 74990,
      rating: 4.6,
      reviewCount: 98,
      inStock: true,
      stockCount: 22,
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      description: 'Ultra-durable, sleek aluminum unibody productivity laptop with AMD Ryzen 7 7730U, 16GB LPDDR4X RAM, 512GB SSD, and phenomenal 11-hour battery life.',
      specs: JSON.stringify({
        'Processor': 'AMD Ryzen 7 7730U (8 Cores, 16 Threads)',
        'RAM': '16GB soldered LPDDR4X',
        'Storage': '512GB PCIe Gen4 NVMe SSD',
        'Display': '14-inch WUXGA IPS Antiglare (1920x1200, 16:10)',
        'Battery Life': '11.5 hours endurance (56.6Whr)',
        'Weight': '1.46 kg',
        'Keyboard': 'Backlit Ergonomic Keyboard with Fingerprint Reader'
      }),
      features: JSON.stringify([
        'Superb typing experience for long coding sessions',
        '16:10 aspect ratio gives extra vertical space for code',
        'Military-grade MIL-STD-810H rugged testing',
        'Rapid Charge Boost: 2 hours of use in 15 mins'
      ]),
      tags: JSON.stringify(['programming', 'student', 'battery', 'lightweight', 'under70k', 'lenovo']),
      isFeatured: true
    },
    {
      title: 'Apple MacBook Air 13-inch (M2 Chip)',
      slug: 'apple-macbook-air-m2',
      category: 'Laptops & Computing',
      brand: 'Apple',
      price: 94990,
      originalPrice: 114900,
      rating: 4.9,
      reviewCount: 310,
      inStock: true,
      stockCount: 14,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      description: 'The pinnacle of silent efficiency. Apple M2 silicon with 8-core CPU and 8-core GPU, 8GB Unified Memory, Liquid Retina display, and 18-hour battery longevity.',
      specs: JSON.stringify({
        'Chip': 'Apple M2 (8-core CPU, 8-core GPU, 16-core Neural Engine)',
        'Unified Memory': '8GB Unified Memory',
        'Storage': '256GB High-speed SSD',
        'Display': '13.6-inch Liquid Retina with True Tone (500 nits)',
        'Battery': 'Up to 18 hours wireless web',
        'Weight': '1.24 kg',
        'Port': 'MagSafe 3, 2x Thunderbolt / USB 4'
      }),
      features: JSON.stringify([
        'Fanless silent operation under heavy workload',
        'Unmatched battery life that lasts all day without charging',
        'Razor-thin 11.3mm durable aluminum enclosure',
        '1080p FaceTime HD camera with studio mics'
      ]),
      tags: JSON.stringify(['macbook', 'apple', 'developer', 'premium', 'm2', 'battery', 'portable']),
      isFeatured: true
    },
    {
      title: 'Dell Inspiron 15 3520 Intel Core i5',
      slug: 'dell-inspiron-15-3520-i5',
      category: 'Laptops & Computing',
      brand: 'Dell',
      price: 48990,
      originalPrice: 56990,
      rating: 4.3,
      reviewCount: 76,
      inStock: true,
      stockCount: 30,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
      description: 'Reliable everyday computing powered by 12th Gen Intel Core i5-1235U, 16GB RAM, 512GB SSD, and a fluid 120Hz Full HD narrow border display.',
      specs: JSON.stringify({
        'Processor': 'Intel Core i5-1235U (10 Cores, up to 4.40 GHz)',
        'RAM': '16GB DDR4 (Expandable to 32GB)',
        'Storage': '512GB PCIe NVMe SSD',
        'Display': '15.6-inch FHD (1920 x 1080) 120Hz Anti-glare',
        'Battery Life': 'Up to 7 hours',
        'Weight': '1.68 kg'
      }),
      features: JSON.stringify([
        'Expandable dual-channel memory for multitasking',
        '120Hz smooth refresh rate reduces eye strain',
        'Lift-hinge design for comfortable wrist typing angle'
      ]),
      tags: JSON.stringify(['budget', 'student', 'programming', 'dell', 'office']),
      isFeatured: false
    },
    {
      title: 'HP Pavilion 14 Aero Ultra-Light Ryzen 5',
      slug: 'hp-pavilion-14-aero-ryzen-5',
      category: 'Laptops & Computing',
      brand: 'HP',
      price: 58990,
      originalPrice: 67990,
      rating: 4.5,
      reviewCount: 88,
      inStock: true,
      stockCount: 15,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      description: 'Weighing under 1kg, the Pavilion Aero is powered by AMD Ryzen 5 7535U, 16GB LPDDR5, 512GB SSD, and a brilliant 16:10 400-nit IPS screen.',
      specs: JSON.stringify({
        'Processor': 'AMD Ryzen 5 7535U (6 Cores, 12 Threads)',
        'RAM': '16GB LPDDR5 6400MHz',
        'Storage': '512GB PCIe NVMe M.2 SSD',
        'Display': '13.3-inch WUXGA (1920 x 1200) IPS, 400 nits, 100% sRGB',
        'Battery Life': 'Up to 10.5 hours',
        'Weight': '0.97 kg'
      }),
      features: JSON.stringify([
        'Sub-1kg magnesium-aluminum chassis',
        'Fast Wi-Fi 6E connectivity for cloud development',
        'Audio by B&O dual speakers'
      ]),
      tags: JSON.stringify(['lightweight', 'portable', 'college', 'programming', 'hp', 'under70k']),
      isFeatured: false
    },
    {
      title: 'ASUS ROG Zephyrus G14 Gaming & AI Beast',
      slug: 'asus-rog-zephyrus-g14',
      category: 'Laptops & Computing',
      brand: 'ASUS',
      price: 139990,
      originalPrice: 159990,
      rating: 4.8,
      reviewCount: 64,
      inStock: true,
      stockCount: 8,
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
      description: 'Top-tier powerhouse for AI engineering, local LLM inferencing, and AAA gaming. AMD Ryzen 9 8945HS with dedicated Ryzen AI NPU and NVIDIA RTX 4060.',
      specs: JSON.stringify({
        'Processor': 'AMD Ryzen 9 8945HS with 16 TOPS AI NPU',
        'Graphics': 'NVIDIA GeForce RTX 4060 8GB GDDR6 (90W)',
        'RAM': '32GB LPDDR5X 6400MHz',
        'Storage': '1TB PCIe 4.0 NVMe M.2 SSD',
        'Display': '14-inch 3K OLED 120Hz 0.2ms Rog Nebula',
        'Weight': '1.50 kg'
      }),
      features: JSON.stringify([
        'Dedicated AI neural accelerator for on-device PyTorch & Ollama',
        'CNC-milled unibody aluminum with customizable slash lighting',
        'Vapor chamber cooling and liquid metal thermal compound'
      ]),
      tags: JSON.stringify(['ai', 'machine-learning', 'gaming', 'high-end', 'developer', 'rtx4060']),
      isFeatured: true
    },

    // Audio & Headphones
    {
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling',
      slug: 'sony-wh-1000xm5-anc',
      category: 'Audio & Headphones',
      brand: 'Sony',
      price: 26990,
      originalPrice: 34990,
      rating: 4.8,
      reviewCount: 420,
      inStock: true,
      stockCount: 25,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      description: 'Industry-leading Active Noise Cancellation with two processors and eight microphones. LDAC high-res audio codec, crystal clear hands-free calls, and 30h battery.',
      specs: JSON.stringify({
        'Driver Unit': '30mm Carbon Fiber Composite',
        'ANC': 'Auto NC Optimizer with V1 + QN1 Processors',
        'Battery Life': '30 hours (ANC On), 40 hours (ANC Off)',
        'Fast Charge': '3 mins gives 3 hours playback',
        'Microphones': '8 beamforming mics with AI noise reduction',
        'Weight': '250 grams',
        'Bluetooth': '5.2 with Multipoint connection'
      }),
      features: JSON.stringify([
        'Market-leading noise cancellation blocks subway, flight, and coffee shop hum',
        'Multipoint connection pairs phone and laptop seamlessly',
        'Speak-to-Chat pauses music automatically when you talk'
      ]),
      tags: JSON.stringify(['anc', 'headphones', 'sony', 'wireless', 'audiophile', 'travel', 'calls']),
      isFeatured: true
    },
    {
      title: 'Apple AirPods Pro (2nd Gen, USB-C)',
      slug: 'apple-airpods-pro-2nd-gen',
      category: 'Audio & Headphones',
      brand: 'Apple',
      price: 21990,
      originalPrice: 24900,
      rating: 4.9,
      reviewCount: 512,
      inStock: true,
      stockCount: 40,
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      description: 'Re-engineered with the Apple H2 chip for up to 2x more Active Noise Cancellation, Adaptive Audio, Conversation Awareness, and USB-C MagSafe charging case.',
      specs: JSON.stringify({
        'Chip': 'Apple H2 Headphone Chip, Apple U1 in case',
        'Battery': '6 hours listening (up to 30h with case)',
        'Resistance': 'IP54 dust, sweat, and water resistant',
        'Charging': 'USB-C, MagSafe, Qi Wireless, Apple Watch charger',
        'Audio Modes': 'Active Noise Cancellation, Transparency, Adaptive'
      }),
      features: JSON.stringify([
        'Adaptive Audio blends ANC and transparency in dynamic environments',
        'Personalized Spatial Audio with dynamic head tracking',
        'Precision Finding for lost case via Find My app'
      ]),
      tags: JSON.stringify(['apple', 'earbuds', 'anc', 'airpods', 'tws', 'spatial-audio']),
      isFeatured: true
    },
    {
      title: 'Bose QuietComfort 45 Over-Ear Headphones',
      slug: 'bose-quietcomfort-45-anc',
      category: 'Audio & Headphones',
      brand: 'Bose',
      price: 22990,
      originalPrice: 29900,
      rating: 4.7,
      reviewCount: 230,
      inStock: true,
      stockCount: 16,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      description: 'Iconic plush comfort paired with deep, clear audio. TriPort acoustic architecture, Quiet and Aware modes, adjustable EQ, and 24 hours of playback on a single charge.',
      specs: JSON.stringify({
        'Design': 'Over-ear with synthetic leather plush cushions',
        'Battery': '24 hours on single charge',
        'Charge Time': '2.5 hours via USB-C (15 mins = 3 hrs)',
        'Microphone': 'Quad-microphone array with noise rejecting algorithms',
        'Weight': '240 grams'
      }),
      features: JSON.stringify([
        'Supreme ergonomic comfort during 8+ hour coding marathons',
        'Proprietary acoustic TriPort architecture for deep bass',
        'Customizable EQ in Bose Music companion app'
      ]),
      tags: JSON.stringify(['bose', 'comfortable', 'anc', 'travel', 'audiophile', 'office']),
      isFeatured: false
    },
    {
      title: 'Sennheiser Momentum 4 Wireless Audiophile',
      slug: 'sennheiser-momentum-4',
      category: 'Audio & Headphones',
      brand: 'Sennheiser',
      price: 24990,
      originalPrice: 34990,
      rating: 4.6,
      reviewCount: 115,
      inStock: true,
      stockCount: 12,
      imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      description: 'Unmatched 60-hour battery life with Sennheiser signature sound. 42mm transducer system delivering brilliant dynamics, clarity, and adaptive hybrid ANC.',
      specs: JSON.stringify({
        'Driver': '42mm audiophile-grade transducer',
        'Battery Life': 'Astounding 60 hours playback',
        'Codecs': 'aptX, aptX adaptive, AAC, SBC',
        'Connectivity': 'Bluetooth 5.2, 3.5mm analog, USB digital audio',
        'Weight': '293 grams'
      }),
      features: JSON.stringify([
        'Class-leading 60-hour endurance — charge once every 2 weeks',
        'Audiophile sound tuning with customizable Sound Personalization',
        'USB-C digital audio input allows lossless 24-bit DAC playback'
      ]),
      tags: JSON.stringify(['audiophile', 'sennheiser', 'battery-king', 'anc', 'studio']),
      isFeatured: false
    },
    {
      title: 'OnePlus Buds Pro 2 with Spatial Audio',
      slug: 'oneplus-buds-pro-2',
      category: 'Audio & Headphones',
      brand: 'OnePlus',
      price: 9999,
      originalPrice: 11999,
      rating: 4.5,
      reviewCount: 180,
      inStock: true,
      stockCount: 35,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      description: 'Co-created with Dynaudio. MelodyBoost dual drivers (11mm woofer + 6mm tweeter), up to 48dB Smart Adaptive Noise Cancellation, and LHDC 4.0 Hi-Res audio.',
      specs: JSON.stringify({
        'Driver': 'Dual Drivers (11mm + 6mm co-created with Dynaudio)',
        'ANC Depth': 'Up to 48dB Smart Adaptive ANC',
        'Battery': '39 hours total with case (ANC off)',
        'Latency': '54ms ultra-low latency mode for gaming',
        'Water Resistance': 'IP55 buds / IPX4 case'
      }),
      features: JSON.stringify([
        'Flagship ANC acoustic depth at sub-₹10,000 pricing',
        'Dual connection with fast Google Fast Pair support',
        'Wireless Qi charging case'
      ]),
      tags: JSON.stringify(['budget-flagship', 'oneplus', 'tws', 'spatial-audio', 'under10k']),
      isFeatured: false
    },

    // Smartphones & Tablets
    {
      title: 'Samsung Galaxy S24 Ultra AI Edition',
      slug: 'samsung-galaxy-s24-ultra',
      category: 'Smartphones & Tablets',
      brand: 'Samsung',
      price: 129999,
      originalPrice: 134999,
      rating: 4.8,
      reviewCount: 340,
      inStock: true,
      stockCount: 15,
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      description: 'The definitive AI-first flagship phone. Titanium frame, built-in S-Pen, 200MP Quad Telephoto camera with 100x zoom, Snapdragon 8 Gen 3, and Galaxy AI suite.',
      specs: JSON.stringify({
        'Processor': 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
        'Display': '6.8-inch Dynamic AMOLED 2X 120Hz (2600 nits, Gorilla Armor)',
        'Camera': '200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP Ultra-wide',
        'Battery': '5000mAh with 45W Fast Charging',
        'RAM/Storage': '12GB LPDDR5X, 256GB UFS 4.0',
        'AI Suite': 'Circle to Search, Live Call Translate, Generative Edit'
      }),
      features: JSON.stringify([
        'Anti-reflective Corning Gorilla Armor display cuts 75% reflections',
        'Built-in Galaxy AI agent features for instant text rewriting and search',
        '7 years of guaranteed Android OS & security upgrades'
      ]),
      tags: JSON.stringify(['flagship', 'samsung', 'camera', 'galaxy-ai', 'spen', '5g']),
      isFeatured: true
    },
    {
      title: 'Apple iPhone 15 Pro (128GB, Natural Titanium)',
      slug: 'apple-iphone-15-pro',
      category: 'Smartphones & Tablets',
      brand: 'Apple',
      price: 119900,
      originalPrice: 134900,
      rating: 4.8,
      reviewCount: 290,
      inStock: true,
      stockCount: 20,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
      description: 'Forged in aerospace-grade titanium with the groundbreaking A17 Pro chip, customizable Action button, 48MP Pro camera system, and USB-C with 10Gbps transfer speeds.',
      specs: JSON.stringify({
        'Chip': 'Apple A17 Pro (3nm, 6-core GPU with hardware ray tracing)',
        'Display': '6.1-inch Super Retina XDR with ProMotion 120Hz & Always-On',
        'Camera': '48MP Main with 24MP super-high-res default, 3x Telephoto',
        'Port': 'USB-C supporting USB 3 transfer speeds up to 10Gb/s',
        'Weight': '187 grams'
      }),
      features: JSON.stringify([
        'Aerospace titanium enclosure makes it exceptionally light and strong',
        'Action button provides 1-click access to voice memos, focus, or shortcuts',
        'Console-quality gaming with hardware-accelerated ray tracing'
      ]),
      tags: JSON.stringify(['apple', 'iphone', 'titanium', 'a17pro', 'camera', 'premium']),
      isFeatured: true
    },
    {
      title: 'OnePlus 12 (16GB RAM + 512GB Storage)',
      slug: 'oneplus-12-flagship',
      category: 'Smartphones & Tablets',
      brand: 'OnePlus',
      price: 64999,
      originalPrice: 69999,
      rating: 4.7,
      reviewCount: 210,
      inStock: true,
      stockCount: 28,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      description: 'Flagship killer benchmark. Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera system, 5400mAh dual-cell battery, 100W SuperVOOC wired and 50W wireless charging.',
      specs: JSON.stringify({
        'Processor': 'Qualcomm Snapdragon 8 Gen 3',
        'Display': '6.82-inch 2K 120Hz ProXDR with 4500 nits Peak Brightness',
        'Cameras': '50MP Sony LYT-808 + 64MP 3x Periscope + 48MP Ultrawide',
        'Battery': '5400mAh with 100W Fast Charging (0 to 100% in 26 mins)',
        'RAM/ROM': '16GB LPDDR5X + 512GB UFS 4.0'
      }),
      features: JSON.stringify([
        'Industry-leading 4500 nits display brightness for direct sunlight',
        'Aqua Touch technology works flawlessly with wet fingers or in rain',
        'Massive 9140mm² dual cryo-velocity VC cooling'
      ]),
      tags: JSON.stringify(['oneplus', 'flagship', 'hasselblad', 'fast-charging', 'value-flagship']),
      isFeatured: false
    },
    {
      title: 'Google Pixel 8 (128GB, Hazel)',
      slug: 'google-pixel-8',
      category: 'Smartphones & Tablets',
      brand: 'Google',
      price: 59999,
      originalPrice: 75999,
      rating: 4.6,
      reviewCount: 165,
      inStock: true,
      stockCount: 14,
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      description: 'The pure Google Android experience engineered with Google Tensor G3. Best Take, Magic Editor, Audio Magic Eraser, and unmatched computational photography.',
      specs: JSON.stringify({
        'Processor': 'Google Tensor G3 with Titan M2 security coprocessor',
        'Display': '6.2-inch Actua display 120Hz OLED (2000 nits)',
        'Camera': '50MP Octa PD main sensor + 12MP ultrawide with Macro Focus',
        'Updates': '7 years of OS, security, and Feature Drops'
      }),
      features: JSON.stringify([
        'Google computational AI photo editing: Magic Editor & Best Take',
        'Ultra-pocketable form factor with rounded contours',
        'On-device AI voice transcription and real-time live translation'
      ]),
      tags: JSON.stringify(['google', 'pixel', 'camera', 'ai', 'clean-android', 'photography']),
      isFeatured: false
    },
    {
      title: 'Apple iPad Air 11-inch (M2 Chip, Wi-Fi 128GB)',
      slug: 'apple-ipad-air-m2',
      category: 'Smartphones & Tablets',
      brand: 'Apple',
      price: 57900,
      originalPrice: 59900,
      rating: 4.8,
      reviewCount: 130,
      inStock: true,
      stockCount: 20,
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      description: 'Supercharged by the M2 chip with phenomenal performance. Liquid Retina display, landscape 12MP front camera with Center Stage, and Apple Pencil Pro support.',
      specs: JSON.stringify({
        'Chip': 'Apple M2 (8-core CPU, 9-core GPU, 16-core Neural Engine)',
        'Display': '11-inch Liquid Retina with P3 wide color and True Tone',
        'Camera': 'Landscape 12MP Ultra Wide with Center Stage',
        'Pencil Support': 'Apple Pencil Pro and Apple Pencil (USB-C)',
        'Weight': '462 grams'
      }),
      features: JSON.stringify([
        'Desktop-class performance in a half-kilo slate',
        'Perfect for digital notes, UI design, sketching, and remote meetings',
        'Stage Manager for multi-window desktop multitasking'
      ]),
      tags: JSON.stringify(['tablet', 'apple', 'ipad', 'm2', 'designer', 'student']),
      isFeatured: false
    },

    // Smart Wearables
    {
      title: 'Apple Watch Series 9 GPS 45mm',
      slug: 'apple-watch-series-9-45mm',
      category: 'Smart Wearables',
      brand: 'Apple',
      price: 41990,
      originalPrice: 44900,
      rating: 4.8,
      reviewCount: 220,
      inStock: true,
      stockCount: 18,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      description: 'Powered by the S9 SiP enabling a magical new way to use your watch without touching the screen using Double Tap gesture. 2000-nit Always-On display and ECG monitor.',
      specs: JSON.stringify({
        'Processor': 'Apple S9 SiP with 4-core Neural Engine',
        'Display': 'Always-On Retina display up to 2000 nits (down to 1 nit)',
        'Sensors': 'Blood Oxygen, ECG, Temperature sensor, Fall/Crash Detection',
        'Battery': '18 hours (up to 36 hours in Low Power Mode)',
        'Water Resistance': 'WR50 (50 meters water resistant)'
      }),
      features: JSON.stringify([
        'Double Tap gesture controls timer, plays music, or answers calls with one hand',
        'On-device Siri processes requests faster and without Wi-Fi',
        'Comprehensive health metrics tracking sleep stages, cycle, and cardio fitness'
      ]),
      tags: JSON.stringify(['smartwatch', 'apple', 'fitness', 'health', 'ecg', 'premium']),
      isFeatured: true
    },
    {
      title: 'Samsung Galaxy Watch 6 Classic (43mm Bluetooth)',
      slug: 'samsung-galaxy-watch-6-classic',
      category: 'Smart Wearables',
      brand: 'Samsung',
      price: 29999,
      originalPrice: 36999,
      rating: 4.6,
      reviewCount: 145,
      inStock: true,
      stockCount: 20,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: 'The return of the iconic rotating bezel. Sapphire crystal glass, BioActive Sensor for body composition (BIA) analysis, personalized sleep coaching, and Wear OS.',
      specs: JSON.stringify({
        'Display': '1.3-inch Super AMOLED Sapphire Crystal (2000 nits)',
        'Bezel': 'Physical Rotating Stainless Steel Bezel',
        'Sensors': 'Samsung BioActive (Optical Heart, Electrical Heart, BIA)',
        'OS': 'Wear OS Powered by Samsung (One UI 5 Watch)',
        'Durability': '5ATM + IP68 / MIL-STD-810H'
      }),
      features: JSON.stringify([
        'Tactile mechanical rotating bezel makes navigation effortless',
        'BIA body composition scans skeletal muscle and body fat percentage in 15 seconds',
        'Extensive third-party apps via Google Play Store'
      ]),
      tags: JSON.stringify(['smartwatch', 'samsung', 'wearos', 'fitness', 'classic', 'rotating-bezel']),
      isFeatured: false
    },
    {
      title: 'Garmin Forerunner 265 Running GPS Watch',
      slug: 'garmin-forerunner-265',
      category: 'Smart Wearables',
      brand: 'Garmin',
      price: 49990,
      originalPrice: 53990,
      rating: 4.9,
      reviewCount: 85,
      inStock: true,
      stockCount: 10,
      imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      description: 'Dedicated GPS running smartwatch with colorful AMOLED touchscreen. Morning Report, Training Readiness score, HRV status, and up to 13 days of battery life in smartwatch mode.',
      specs: JSON.stringify({
        'Display': '1.3-inch colorful AMOLED display with Corning Gorilla Glass 4',
        'Battery Life': 'Up to 13 days in smartwatch mode, 20 hrs GPS',
        'GPS': 'Multi-band GNSS with SatIQ technology for pinpoint tracking',
        'Weight': '47 grams lightweight design'
      }),
      features: JSON.stringify([
        'Training readiness score tells you if you are primed for a hard workout',
        'Multi-band GPS accurately tracks runs through dense urban high-rises',
        'Onboard music storage for offline Spotify phone-free runs'
      ]),
      tags: JSON.stringify(['garmin', 'running', 'marathon', 'fitness', 'amoled', 'gps']),
      isFeatured: false
    },
    {
      title: 'OnePlus Watch 2 with Dual-Engine Architecture',
      slug: 'oneplus-watch-2',
      category: 'Smart Wearables',
      brand: 'OnePlus',
      price: 21999,
      originalPrice: 24999,
      rating: 4.5,
      reviewCount: 92,
      inStock: true,
      stockCount: 15,
      imageUrl: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
      description: 'Game-changing battery architecture. Snapdragon W5 paired with BES2700 efficiency chipset delivering a full 100 hours of regular smart mode battery life on Wear OS 4.',
      specs: JSON.stringify({
        'Chipsets': 'Snapdragon W5 Gen 1 + BES2700 efficiency co-processor',
        'Battery': '500mAh (Up to 100 hours smart mode, 12 days power saver)',
        'Display': '1.43-inch AMOLED 2.5D Sapphire Crystal (1000 nits)',
        'Storage': '32GB storage + 2GB RAM',
        'OS': 'Wear OS 4 by Google'
      }),
      features: JSON.stringify([
        'Runs full Google Wear OS with 4 days between charges',
        '7.5W VOOC Fast Charging gives a full day battery in 10 mins',
        'Military-grade stainless steel casing and sapphire crystal'
      ]),
      tags: JSON.stringify(['oneplus', 'wearos', 'battery-king', 'smartwatch', 'under25k']),
      isFeatured: false
    },
    {
      title: 'Noise ColorFit Pro 5 Max Calling Smartwatch',
      slug: 'noise-colorfit-pro-5-max',
      category: 'Smart Wearables',
      brand: 'Noise',
      price: 3999,
      originalPrice: 7999,
      rating: 4.3,
      reviewCount: 380,
      inStock: true,
      stockCount: 50,
      imageUrl: 'https://images.unsplash.com/photo-1509741102003-ca64bfe5f069?auto=format&fit=crop&w=800&q=80',
      description: 'Feature-loaded budget smartwatch with 1.96-inch AMOLED display, TruSync Bluetooth calling with functional crown, Post-training analysis, and Rapid Health tracker.',
      specs: JSON.stringify({
        'Display': '1.96-inch AMOLED (410x502 resolution, 600 nits)',
        'Calling': 'Bluetooth v5.3 with built-in microphone & speaker',
        'Battery': 'Up to 7 days standby (2 days with heavy calling)',
        'Water Resistance': 'IP68 water and dust resistant'
      }),
      features: JSON.stringify([
        'Massive borderless AMOLED screen with crisp clarity',
        'Single-tap SOS dialling and instant contact sync',
        '100+ sports modes with auto workout detection'
      ]),
      tags: JSON.stringify(['budget', 'calling', 'amoled', 'noise', 'under5k', 'fitness']),
      isFeatured: false
    },

    // Smart Home & Productivity
    {
      title: 'Logitech MX Master 3S Wireless Performance Mouse',
      slug: 'logitech-mx-master-3s',
      category: 'Smart Home & Productivity',
      brand: 'Logitech',
      price: 8995,
      originalPrice: 10995,
      rating: 4.9,
      reviewCount: 390,
      inStock: true,
      stockCount: 35,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      description: 'The definitive tool for coders and creators. Quiet Clicks with 90% less noise, 8000 DPI track-on-glass optical sensor, and MagSpeed electromagnetic scroll wheel.',
      specs: JSON.stringify({
        'Sensor': 'Darkfield high precision (200 - 8000 DPI)',
        'Scroll Wheel': 'MagSpeed electromagnetic scrolling (1000 lines/sec)',
        'Clicks': 'Quiet Click acoustic dampening technology',
        'Battery': 'Up to 70 days on full charge (3 hours from 1 min charge)',
        'Connectivity': 'Bluetooth Low Energy & Logi Bolt USB Receiver'
      }),
      features: JSON.stringify([
        'Scroll 1,000 lines of code in 1 second with precision pixel stopping',
        'Logi Options+ app enables app-specific shortcut gestures for VS Code / Chrome',
        'Seamlessly copy-paste text and files across 3 Macs and PCs with Logitech Flow'
      ]),
      tags: JSON.stringify(['productivity', 'mouse', 'developer', 'ergonomic', 'logitech', 'mxmaster']),
      isFeatured: true
    },
    {
      title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
      slug: 'keychron-q1-pro-wireless',
      category: 'Smart Home & Productivity',
      brand: 'Keychron',
      price: 18499,
      originalPrice: 21999,
      rating: 4.8,
      reviewCount: 110,
      inStock: true,
      stockCount: 12,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      description: 'Full aluminum 75% layout QMK/VIA wireless mechanical keyboard. Double-gasket design, pre-lubed Keychron K Pro Banana switches, South-facing RGB, and Mac/Win hot-swap.',
      specs: JSON.stringify({
        'Layout': '75% compact exploded layout with programmable rotary knob',
        'Body': 'CNC machined 6063 aluminum body',
        'Switches': 'Hot-swappable Keychron K Pro Mechanical (Tactile Banana)',
        'Keycaps': 'KSA double-shot non-shine PBT keycaps',
        'Weight': '1.82 kg heavy desk anchor'
      }),
      features: JSON.stringify([
        'Double-gasket acoustic mounting produces a deeply satisfying marbly thock',
        'Fully reprogrammable keys and macro layers using open-source QMK/VIA web',
        'Tri-mode connectivity: Bluetooth 5.1 with 3 devices or Type-C wired'
      ]),
      tags: JSON.stringify(['keyboard', 'mechanical', 'custom', 'developer', 'typing', 'ergonomic']),
      isFeatured: true
    },
    {
      title: 'BenQ ScreenBar Pro LED Monitor Light Bar',
      slug: 'benq-screenbar-pro',
      category: 'Smart Home & Productivity',
      brand: 'BenQ',
      price: 13990,
      originalPrice: 15990,
      rating: 4.7,
      reviewCount: 95,
      inStock: true,
      stockCount: 20,
      imageUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
      description: 'Asymmetric optical design that illuminates your desk workspace with zero screen glare. Auto-dimming sensor, ultrasonic presence detection, and wide 85x50cm illumination.',
      specs: JSON.stringify({
        'Illuminance': 'Center illuminance 1000 lux at 45cm',
        'Color Temp': 'Adjustable 2700K (Warm) to 6500K (Cool White)',
        'Motion Sensor': 'Ultrasonic presence detection auto turns on/off',
        'CRI': 'Ra>95 high color rendering index',
        'Power': 'USB-C powered'
      }),
      features: JSON.stringify([
        'Asymmetric optical light eliminates eye fatigue during late-night coding',
        'Ultrasonic motion sensor detects your presence to power on automatically',
        'Zero clamp counterweight fits any flat or curved monitor without tools'
      ]),
      tags: JSON.stringify(['lighting', 'desk-setup', 'developer', 'benq', 'eye-care', 'productivity']),
      isFeatured: false
    },
    {
      title: 'Amazon Echo Dot (5th Gen) Smart Speaker with Alexa',
      slug: 'amazon-echo-dot-5th-gen',
      category: 'Smart Home & Productivity',
      brand: 'Amazon',
      price: 4499,
      originalPrice: 5499,
      rating: 4.5,
      reviewCount: 650,
      inStock: true,
      stockCount: 45,
      imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80',
      description: 'Best-sounding Echo Dot yet. Deeper bass, clearer vocals, built-in indoor temperature sensor, motion detection, and seamless smart home voice control with Alexa.',
      specs: JSON.stringify({
        'Speaker': '1.73-inch front-firing speaker',
        'Voice Assistant': 'Amazon Alexa with Hindi and English bilingual support',
        'Sensors': 'Indoor temperature sensor, ultrasound motion sensor',
        'Connectivity': 'Dual-band Wi-Fi 802.11a/b/g/n/ac & Bluetooth'
      }),
      features: JSON.stringify([
        'Voice control appliances, lights, AC, and home automation routines',
        'Built-in motion sensor can automatically turn on lights when you enter the room',
        'Stream music from Spotify, Apple Music, and Amazon Music HD'
      ]),
      tags: JSON.stringify(['smarthome', 'alexa', 'speaker', 'iot', 'amazon', 'budget']),
      isFeatured: false
    },
    {
      title: 'Philips Hue Smart 9W LED Starter Ambient Bulb',
      slug: 'philips-hue-smart-bulb-9w',
      category: 'Smart Home & Productivity',
      brand: 'Philips',
      price: 2899,
      originalPrice: 3499,
      rating: 4.6,
      reviewCount: 175,
      inStock: true,
      stockCount: 30,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      description: 'Transform your room atmosphere with 16 million colors and warm-to-cool white light. Bluetooth and Zigbee enabled, syncs with music, games, and code editor themes.',
      specs: JSON.stringify({
        'Brightness': '800 lumens at 4000K',
        'Color Range': '16 million colors + 2000K to 6500K whites',
        'Fitting': 'B22 / E27 Indian Standard Socket',
        'Protocol': 'Bluetooth and Zigbee 3.0'
      }),
      features: JSON.stringify([
        'Sync room lighting with monitor screen content or Spotify rhythm',
        'Preset focus and relax modes optimized for peak working concentration',
        'Schedule gentle sunrise wake-up lighting'
      ]),
      tags: JSON.stringify(['smarthome', 'lighting', 'philips', 'rgb', 'ambiance', 'developer']),
      isFeatured: false
    },
    {
      title: 'Anker 737 Power Bank (PowerCore 24K 140W)',
      slug: 'anker-737-powerbank-140w',
      category: 'Smart Home & Productivity',
      brand: 'Anker',
      price: 11999,
      originalPrice: 14999,
      rating: 4.8,
      reviewCount: 160,
      inStock: true,
      stockCount: 16,
      imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
      description: 'Ultra-powerful two-way charging power bank equipped with Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or get a 140W ultra-powerful charge for laptops.',
      specs: JSON.stringify({
        'Capacity': '24,000mAh (Can charge MacBook Air 1.3 times)',
        'Output': 'Up to 140W single-port USB-C fast charging',
        'Display': 'Smart digital color display showing watts, time to full, and battery health',
        'Ports': '2x USB-C (140W max each) + 1x USB-A (18W)'
      }),
      features: JSON.stringify([
        'Charges high-performance laptops, iPads, and phones at full speed simultaneously',
        'Color smart display indicates real-time input/output wattage and battery temperature',
        'Approved for airline carry-on luggage (86.4Wh)'
      ]),
      tags: JSON.stringify(['powerbank', 'travel', 'fast-charging', 'anker', 'laptop-charger', 'wfh']),
      isFeatured: true
    },
    {
      title: 'Elgato Stream Deck MK.2 Studio Controller',
      slug: 'elgato-stream-deck-mk2',
      category: 'Smart Home & Productivity',
      brand: 'Elgato',
      price: 14490,
      originalPrice: 16990,
      rating: 4.8,
      reviewCount: 130,
      inStock: true,
      stockCount: 10,
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      description: '15 customizable LCD keys to control apps, tools, and platforms. Trigger single or multi actions, launch GitHub scripts, mute mic on Zoom, and toggle smart lights with one tap.',
      specs: JSON.stringify({
        'Keys': '15 customizable tactile LCD keys with animated GIF support',
        'Interface': 'USB 2.0 (Detachable Type-C cable)',
        'Stand': 'Fixed 45-degree ergonomic angle desktop cradle'
      }),
      features: JSON.stringify([
        'Map complex developer terminal commands, Docker scripts, and git workflows to 1 key',
        'Live system resource monitor (CPU, RAM, network stats) directly on LCD keys',
        'Deep integration with VS Code, Discord, OBS, Spotify, and Philips Hue'
      ]),
      tags: JSON.stringify(['developer', 'productivity', 'macro', 'elgato', 'desk-setup', 'creator']),
      isFeatured: false
    }
  ];

  const createdProducts = [];
  for (const p of products) {
    const prod = await prisma.product.create({
      data: p
    });
    createdProducts.push(prod);
  }
  console.log(`Created ${createdProducts.length} products.`);

  // 3. Create 5 Customer Segments
  const segments = [
    {
      name: 'Tech Enthusiasts & High CLV',
      key: 'tech_enthusiasts_high_clv',
      description: 'Developers, tech founders, and power users with high average order value and strong affinity for premium laptops, noise cancelling audio, and mechanical keyboards.',
      customerCount: 3,
      avgAOV: 78500,
      avgCLV: 185000,
      churnRisk: 'LOW',
      characteristics: JSON.stringify([
        'Average budget ₹80,000 - ₹1,50,000',
        'High repeat purchase rate on developer tools and audio gear',
        'Responds well to technical spec comparisons and early product releases'
      ]),
      recommendedActions: JSON.stringify([
        'Promote developer productivity bundles (Laptop + MX Master 3S)',
        'Exclusive early access to flagship tech releases',
        'High-tier loyalty rewards and complimentary priority shipping'
      ])
    },
    {
      name: 'Value-Conscious Students',
      key: 'value_conscious_students',
      description: 'College students and early career coders looking for highest spec-to-price ratio in laptops under ₹70,000 and budget audio.',
      customerCount: 2,
      avgAOV: 42000,
      avgCLV: 68000,
      churnRisk: 'MEDIUM',
      characteristics: JSON.stringify([
        'Primary search queries involve "under ₹70,000", "battery life", and "coding"',
        'High page view rate per session, price sensitive',
        'High cart drop-off when delivery fees or no-cost EMI are absent'
      ]),
      recommendedActions: JSON.stringify([
        'Surface 0% No-Cost EMI and student verification discounts',
        'Highlight battery life and portable weight specs',
        'AI Assistant shopping plan tailored to educational use cases'
      ])
    },
    {
      name: 'Creative Professionals & Creators',
      key: 'creatives_audiophiles',
      description: 'Designers, sound engineers, and content creators demanding color-accurate OLED displays, spatial audio, and tablet styluses.',
      customerCount: 2,
      avgAOV: 64000,
      avgCLV: 142000,
      churnRisk: 'LOW',
      characteristics: JSON.stringify([
        'Prioritizes DCI-P3 color gamuts, LDAC codecs, and low latency input',
        'Engages deeply with product review sentiment analysis',
        'Regularly adds items to wishlist before purchasing'
      ]),
      recommendedActions: JSON.stringify([
        'Showcase side-by-side display and audio codec comparisons',
        'Personalized email drip when wishlisted creative accessories drop in price',
        'Cross-sell BenQ screenbars and Keychron tactile accessories'
      ])
    },
    {
      name: 'Dormant Cart Abandoners',
      key: 'cart_abandoners',
      description: 'Users who added products to their cart in the last 14 days without completing checkout.',
      customerCount: 2,
      avgAOV: 32000,
      avgCLV: 35000,
      churnRisk: 'HIGH',
      characteristics: JSON.stringify([
        'Average cart dormancy: 4.8 days',
        'Last exit occurred at checkout confirmation step',
        'Sensitive to unexpected shipping or payment doubts'
      ]),
      recommendedActions: JSON.stringify([
        'Trigger WhatsApp AI assistant with personalized 5% limited-time incentive',
        'Offer 1-click agentic checkout confirmation directly in chat',
        'Highlight 7-day hassle-free return and replacement policy'
      ])
    },
    {
      name: 'WFH & Remote Productivity Seekers',
      key: 'wfh_productivity',
      description: 'Remote consultants and managers investing in desk ergonomics, smart lighting, and active noise cancelling for conference calls.',
      customerCount: 1,
      avgAOV: 28500,
      avgCLV: 59000,
      churnRisk: 'MEDIUM',
      characteristics: JSON.stringify([
        'Focuses on microphone background noise isolation and posture health',
        'Purchases smart lighting, ergonomic mice, and power accessories',
        'Peak browsing between 7 PM - 10 PM on weekdays'
      ]),
      recommendedActions: JSON.stringify([
        'Recommend ergonomic home office bundle upgrades',
        'Targeted evening push notifications highlighting focus lighting'
      ])
    }
  ];

  const createdSegments = [];
  for (const s of segments) {
    const seg = await prisma.customerSegment.create({
      data: s
    });
    createdSegments.push(seg);
  }
  console.log(`Created ${createdSegments.length} customer segments.`);

  // 4. Create 24 Realistic Orders across past 60 days
  const now = new Date();
  const orderDataSeeds = [
    {
      customerIndex: 0, // Rahul
      productIndices: [0, 20], // ASUS Vivobook Pro + MX Master 3S
      daysAgo: 48,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Customer requested a laptop for programming under ₹70,000 with long battery. Agent recommended Asus Vivobook Pro 15 OLED with MX Master 3S mouse.',
    },
    {
      customerIndex: 0, // Rahul
      productIndices: [6], // Sony WH-1000XM5
      daysAgo: 22,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Agent suggested high-tier ANC headphones to pair with development laptop during open office deep work.',
    },
    {
      customerIndex: 1, // Priya
      productIndices: [11], // Galaxy S24 Ultra
      daysAgo: 35,
      status: 'DELIVERED',
      isAiAssisted: false,
      agentSummary: null,
    },
    {
      customerIndex: 1, // Priya
      productIndices: [16], // Apple Watch S9
      daysAgo: 12,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Agent personalized offer for wearable ecosystem based on lifestyle profile.',
    },
    {
      customerIndex: 2, // Aman
      productIndices: [1], // Lenovo IdeaPad Slim 5
      daysAgo: 40,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'CS student asked for long battery life and lightweight coding machine under ₹65,000. IdeaPad Slim 5 chosen.',
    },
    {
      customerIndex: 2, // Aman
      productIndices: [20], // MX Master 3S
      daysAgo: 10,
      status: 'SHIPPED',
      isAiAssisted: false,
      agentSummary: null,
    },
    {
      customerIndex: 3, // Ananya
      productIndices: [9, 21], // Sennheiser Momentum 4 + Keychron Q1 Pro
      daysAgo: 55,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Audio producer seeking 60hr battery audiophile wireless headphones and custom tactile keyboard.',
    },
    {
      customerIndex: 3, // Ananya
      productIndices: [7], // AirPods Pro 2
      daysAgo: 19,
      status: 'DELIVERED',
      isAiAssisted: false,
      agentSummary: null,
    },
    {
      customerIndex: 4, // Vikram
      productIndices: [13, 22], // OnePlus 12 + BenQ ScreenBar Pro
      daysAgo: 42,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Product manager sought eye-care monitor light and high-speed fast-charging phone.',
    },
    {
      customerIndex: 4, // Vikram
      productIndices: [17], // Galaxy Watch 6 Classic
      daysAgo: 6,
      status: 'PROCESSING',
      isAiAssisted: true,
      agentSummary: 'Agent recommended rotating-bezel smart watch to monitor health during high-intensity sprint cycles.',
    },
    {
      customerIndex: 5, // Sneha
      productIndices: [10, 19], // OnePlus Buds Pro 2 + Noise ColorFit
      daysAgo: 31,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Fitness enthusiast sought sports tracking watch and ANC earbuds under ₹15,000 total budget.',
    },
    {
      customerIndex: 6, // Rohan
      productIndices: [5], // ROG Zephyrus G14
      daysAgo: 28,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Fintech founder required local AI LLM execution power and portable chassis. Agent recommended ROG Zephyrus G14 with RTX 4060.',
    },
    {
      customerIndex: 6, // Rohan
      productIndices: [6, 25], // Sony XM5 + Anker 737 140W
      daysAgo: 8,
      status: 'SHIPPED',
      isAiAssisted: true,
      agentSummary: 'Agent suggested 140W power delivery bank and Sony ANC headphones for international executive travel.',
    },
    {
      customerIndex: 7, // Kavita
      productIndices: [23, 24], // Echo Dot 5th Gen + Hue Bulb
      daysAgo: 45,
      status: 'DELIVERED',
      isAiAssisted: false,
      agentSummary: null,
    },
    {
      customerIndex: 7, // Kavita
      productIndices: [3], // Dell Inspiron 15
      daysAgo: 15,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Remote consultant requested budget laptop for spreadsheet modeling and video meetings.',
    },
    {
      customerIndex: 8, // Neha
      productIndices: [14, 15], // Pixel 8 + iPad Air M2
      daysAgo: 33,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Architect seeking stylus-enabled tablet for floor plans and AI photo phone.',
    },
    {
      customerIndex: 8, // Neha
      productIndices: [8], // Bose QC45
      daysAgo: 14,
      status: 'DELIVERED',
      isAiAssisted: false,
      agentSummary: null,
    },
    {
      customerIndex: 9, // Devendra
      productIndices: [4], // HP Pavilion Aero
      daysAgo: 25,
      status: 'DELIVERED',
      isAiAssisted: true,
      agentSummary: 'Data analyst asked for ultra-lightweight laptop under 1kg for commute. Agent recommended HP Pavilion 14 Aero.',
    },
    {
      customerIndex: 9, // Devendra
      productIndices: [18], // OnePlus Watch 2
      daysAgo: 5,
      status: 'PROCESSING',
      isAiAssisted: true,
      agentSummary: 'Agent recommended 100-hour WearOS watch based on user preference for high battery endurance.',
    },
    {
      customerIndex: 0, // Rahul
      productIndices: [21], // Keychron Q1 Pro
      daysAgo: 4,
      status: 'PROCESSING',
      isAiAssisted: true,
      agentSummary: 'Agent notified Rahul of restocked Keychron Q1 Pro mechanical keyboard matching his saved wishlist.',
    },
    {
      customerIndex: 2, // Aman
      productIndices: [10], // OnePlus Buds Pro 2
      daysAgo: 3,
      status: 'CONFIRMED',
      isAiAssisted: true,
      agentSummary: 'Shopping agent compared 3 earbuds under ₹10k and prepared instant cart checkout.',
    },
    {
      customerIndex: 5, // Sneha
      productIndices: [23], // Echo Dot 5th Gen
      daysAgo: 2,
      status: 'CONFIRMED',
      isAiAssisted: false,
      agentSummary: null,
    },
    {
      customerIndex: 1, // Priya
      productIndices: [7], // AirPods Pro 2
      daysAgo: 1,
      status: 'CONFIRMED',
      isAiAssisted: true,
      agentSummary: 'Shopping assistant answered comparison questions regarding ANC vs Bose QC and executed checkout confirmation.',
    },
    {
      customerIndex: 6, // Rohan
      productIndices: [26], // Elgato Stream Deck MK2
      daysAgo: 0,
      status: 'CONFIRMED',
      isAiAssisted: true,
      agentSummary: 'Executive desk macro controller recommended by agent based on multi-tasking profile.',
    }
  ];

  for (let i = 0; i < orderDataSeeds.length; i++) {
    const seed = orderDataSeeds[i];
    const customer = createdCustomers[seed.customerIndex];
    const selectedProds = seed.productIndices.map(idx => createdProducts[idx]);
    const total = selectedProds.reduce((sum, p) => sum + p.price, 0);
    const orderDate = new Date(now.getTime() - seed.daysAgo * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${2024000 + i + 1}`,
        userId: customer.id,
        totalAmount: total,
        discountAmount: seed.isAiAssisted ? Math.round(total * 0.05) : 0,
        taxAmount: Math.round(total * 0.18),
        finalAmount: Math.round(total * (seed.isAiAssisted ? 0.95 : 1.0) + (total * 0.18)),
        status: seed.status,
        shippingAddress: `${customer.profile?.location || 'Bengaluru, India'}`,
        isAiAssisted: seed.isAiAssisted,
        agentSummary: seed.agentSummary,
        createdAt: orderDate,
        updatedAt: orderDate,
        items: {
          create: selectedProds.map(p => ({
            productId: p.id,
            quantity: 1,
            price: p.price,
            title: p.title,
            imageUrl: p.imageUrl
          }))
        }
      }
    });
  }
  console.log(`Created ${orderDataSeeds.length} orders across the past 60 days.`);

  // 5. Seed Initial Active Cart & Wishlist for Demo User Rahul Sharma
  const demoCustomer = createdCustomers[0]; // Rahul Sharma
  const demoCart = await prisma.cart.findUnique({
    where: { userId: demoCustomer.id }
  });

  if (demoCart) {
    await prisma.cartItem.create({
      data: {
        cartId: demoCart.id,
        productId: createdProducts[20].id, // Logitech MX Master 3S
        quantity: 1,
        addedByAgent: true,
        agentRecommendationReason: 'Added by Shopping Agent to pair with your laptop for enhanced ergonomic workflow.'
      }
    });
  }

  // Add Wishlist items for Rahul
  await prisma.wishlist.create({
    data: {
      userId: demoCustomer.id,
      productId: createdProducts[2].id, // MacBook Air M2
    }
  });
  await prisma.wishlist.create({
    data: {
      userId: demoCustomer.id,
      productId: createdProducts[6].id, // Sony XM5
    }
  });

  // 6. Seed AI Growth Insights
  const growthInsights = [
    {
      type: 'OPPORTUNITY',
      title: 'High-Demand Developer Bundle Cross-Sell',
      explanation: 'Customers purchasing laptops in the ₹60,000–₹75,000 bracket show a 68% purchase propensity for ergonomic mice and keyboards within 14 days. Introducing an automated agent bundle prompt can boost Average Order Value by 18.4%.',
      impactLevel: 'HIGH',
      recommendedAction: 'Deploy autonomous agent bundle recommendation rule: offer 8% bundle discount when MX Master 3S or Keychron is added alongside a programming laptop.',
      estimatedImpactValue: '+₹3,40,000 Monthly Revenue',
      metricHighlight: '+18.4% AOV Lift',
      status: 'ACTIVE'
    },
    {
      type: 'RISK',
      title: 'Student Segment Cart Abandonment Surge',
      explanation: 'Customers aged 18–25 browsing coding laptops have an 84% view rate but exit at the final shipping step due to absence of instant No-Cost EMI options.',
      impactLevel: 'CRITICAL',
      recommendedAction: 'Automate WhatsApp / Email agent outreach offering instant 3-month No-Cost EMI and student verification discount within 2 hours of cart drop-off.',
      estimatedImpactValue: 'Save ~₹2,10,000 In At-Risk Carts',
      metricHighlight: '26% Drop-off Rate',
      status: 'ACTIVE'
    },
    {
      type: 'CONVERSION',
      title: 'AI Shopping Assistant Conversion Advantage',
      explanation: 'Sessions where customers interacted with the AI Shopping Assistant converted at 7.2%, compared to 2.1% for traditional catalog browsing (a 3.4x conversion multiplier).',
      impactLevel: 'HIGH',
      recommendedAction: 'Make the AI Shopping Assistant floating launcher prominent on mobile viewports and product detail pages to increase agent adoption from 28% to 50%.',
      estimatedImpactValue: '+3.4x Conversion Multiplier',
      metricHighlight: '7.2% vs 2.1% CR',
      status: 'ACTIVE'
    },
    {
      type: 'MARKETING',
      title: 'Audiophile Noise-Cancelling Campaign Timing',
      explanation: 'Search traffic for premium ANC headphones spikes on Thursday and Friday evenings from metropolitan tech corridors (Bengaluru, Pune, Hyderabad, Gurgaon).',
      impactLevel: 'MEDIUM',
      recommendedAction: 'Schedule weekly automated multi-channel campaign highlighting Sony XM5 and Bose QC45 commute noise-cancellation with targeted social ads.',
      estimatedImpactValue: '+₹1,80,000 Incremental GMV',
      metricHighlight: '+32% Weekend Engagement',
      status: 'ACTIVE'
    },
    {
      type: 'RETENTION',
      title: '30-Day Re-engagement for Flagship Smartphone Buyers',
      explanation: 'Buyers of premium smartphones (S24 Ultra, iPhone 15 Pro) have zero accessory purchases after 30 days despite strong compatibility with smartwatches and fast wireless chargers.',
      impactLevel: 'MEDIUM',
      recommendedAction: 'Trigger autonomous personalization email from the Recommendation Agent highlighting paired wearables and 140W Anker travel chargers with tailored compatibility badges.',
      estimatedImpactValue: '+14% Repeat Purchase Rate',
      metricHighlight: '14% Repurchase Lift',
      status: 'ACTIVE'
    }
  ];

  for (const gi of growthInsights) {
    await prisma.growthInsight.create({
      data: gi
    });
  }
  console.log(`Created ${growthInsights.length} AI Growth Insights.`);

  // 7. Seed Marketing Campaigns
  const campaigns = [
    {
      name: 'Q3 Developer Productivity Sprint',
      targetSegmentId: createdSegments[0].id,
      status: 'ACTIVE',
      channel: 'EMAIL',
      generatedHeadline: 'Elevate Your Dev Workflow: OLED Clarity Meets Precision Ergonomics',
      generatedCopy: 'Hi {{name}}, compile code without eye strain. Pair the ASUS Vivobook Pro OLED with the Logitech MX Master 3S for effortless 1000-line navigation. Enjoy an exclusive 8% dev bundle privilege this week.',
      cta: 'Explore Dev Bundles',
      predictedConversion: 6.8,
      budget: 25000,
      revenueGenerated: 184500
    },
    {
      name: 'Back to College: Code & Conquer',
      targetSegmentId: createdSegments[1].id,
      status: 'ACTIVE',
      channel: 'WHATSAPP',
      generatedHeadline: 'The Ultimate Coding Laptop Under ₹70,000 + 0% EMI',
      generatedCopy: 'Hey {{name}}! Need a laptop that powers through Docker, Python, and 11-hour college days? Meet the Lenovo IdeaPad Slim 5 Ryzen 7. Get student verified pricing + 6 months No-Cost EMI now.',
      cta: 'Claim Student Offer',
      predictedConversion: 8.2,
      budget: 15000,
      revenueGenerated: 122000
    },
    {
      name: 'Noise-Free Commute & Deep Work Flash Drop',
      targetSegmentId: createdSegments[2].id,
      status: 'COMPLETED',
      channel: 'PUSH',
      generatedHeadline: 'Tune Out The Noise. Tune In To Focus.',
      generatedCopy: 'Industry-leading Sony WH-1000XM5 and Bose QuietComfort with dual processors. Limited quantity express delivery.',
      cta: 'Upgrade Your Audio',
      predictedConversion: 4.9,
      budget: 12000,
      revenueGenerated: 98000
    }
  ];

  for (const c of campaigns) {
    await prisma.marketingCampaign.create({
      data: c
    });
  }
  console.log(`Created ${campaigns.length} Marketing Campaigns.`);

  // 8. Seed Sample Agent Execution Logs
  const sampleLogs = [
    {
      agentName: 'ShoppingAgent',
      userId: demoCustomer.id,
      userQuery: 'I need a laptop for programming under ₹70,000 with good battery life.',
      toolInvoked: 'searchProducts',
      inputParams: JSON.stringify({
        category: 'Laptops & Computing',
        maxPrice: 70000,
        keywords: ['programming', 'battery']
      }),
      outputSummary: 'Extracted budget = ₹70,000, useCase = programming, batteryPriority = true. Ranked ASUS Vivobook Pro 15 OLED (#1) and Lenovo IdeaPad Slim 5 (#2) with detailed rationale.',
      reasoningChain: JSON.stringify([
        '1. Intent Analysis: Detected shopping request for laptops with explicit constraints (budget ≤ ₹70,000, primary use: software programming).',
        '2. Parameter Extraction: maxPrice = 70000, category = "Laptops & Computing", requiredAttributes = ["good battery", "multitasking RAM >= 16GB"].',
        '3. Tool Invocation: Executed searchProducts with filtered criteria.',
        '4. Recommendation Ranking: Scored candidates on battery capacity (Whr), CPU multi-threaded benchmark, and RAM suitability.',
        '5. Rationale Formulation: Formulated structured explanation comparing OLED display and battery longevity.'
      ]),
      executionTimeMs: 142,
      success: true
    },
    {
      agentName: 'RecommendationAgent',
      userId: demoCustomer.id,
      userQuery: 'Suggest accessories for my new laptop',
      toolInvoked: 'compareProducts',
      inputParams: JSON.stringify({
        productIds: [createdProducts[20].id, createdProducts[21].id]
      }),
      outputSummary: 'Recommended Logitech MX Master 3S and Keychron Q1 Pro based on user persona Senior Fullstack Developer.',
      reasoningChain: JSON.stringify([
        '1. Profile Fetch: Customer persona is "Senior Fullstack Developer" with affinity for ergonomic peripherals.',
        '2. Collaborative Filtering: Cross-matched historical orders of similar developer profiles.',
        '3. Selected top 2 compatible accessories: MX Master 3S and Keychron Q1 Pro.'
      ]),
      executionTimeMs: 98,
      success: true
    },
    {
      agentName: 'GrowthAgent',
      userId: null,
      userQuery: 'Analyze store conversion funnel and segment dropout',
      toolInvoked: 'analyzeGrowth',
      inputParams: JSON.stringify({ timeWindowDays: 30 }),
      outputSummary: 'Diagnosed high student cart abandonment rate at final checkout step. Generated Risk Insight with recommended instant EMI action.',
      reasoningChain: JSON.stringify([
        '1. KPI Query: Loaded 60-day conversion telemetry by segment.',
        '2. Anomaly Detection: Value-Conscious Student segment shows 26% cart drop-off vs 8% store average.',
        '3. Root Cause Hypothesis: Lack of zero-interest financing at checkout step.',
        '4. Generated actionable insight for Admin Dashboard.'
      ]),
      executionTimeMs: 210,
      success: true
    }
  ];

  for (const log of sampleLogs) {
    await prisma.agentLog.create({
      data: log
    });
  }
  console.log(`Created ${sampleLogs.length} initial Agent execution logs.`);

  console.log('Database seeding completed successfully! All 32 products, 10 customers, 24 orders, insights, and logs are ready.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
