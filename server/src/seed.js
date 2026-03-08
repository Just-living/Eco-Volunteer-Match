require("dotenv").config();
const bcrypt = require("bcrypt");
const { connectDB } = require("./db");
const Event = require("./models/Event");
const Reward = require("./models/Reward");
const User = require("./models/User");

async function run() {
  await connectDB(process.env.MONGODB_URI);

  // Reset only fake data (keep real users safe)
  await Event.deleteMany({});
  await Reward.deleteMany({});

  // Demo user (create or update)
  const demoEmail = "sarah@example.com";
  const demoPassword = "demo";
  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await User.findOneAndUpdate(
    { email: demoEmail },
    {
      name: "Sarah Johnson",
      email: demoEmail,
      passwordHash,
      city: "Hyderabad",
      points: 1520,
      badges: ["b1", "b2", "b3", "b4"],
      interests: ["cleanup", "planting", "recycling"]
    },
    { upsert: true, new: true }
  );

  console.log("[SEED] Demo user ready:", demoEmail, "password:", demoPassword);

  // Create additional demo users
  const additionalUsers = [
    {
      email: "raj@example.com",
      name: "Raj Kumar",
      password: "demo123",
      city: "Hyderabad",
      points: 850,
      badges: ["b1", "b2"],
      interests: ["cleanup", "recycling"]
    },
    {
      email: "priya@example.com",
      name: "Priya Sharma",
      password: "demo123",
      city: "Hyderabad",
      points: 1200,
      badges: ["b1", "b2", "b3"],
      interests: ["planting", "cleanup"]
    },
    {
      email: "amit@example.com",
      name: "Amit Patel",
      password: "demo123",
      city: "Hyderabad",
      points: 650,
      badges: ["b1"],
      interests: ["recycling"]
    }
  ];

  for (const userData of additionalUsers) {
    const userPasswordHash = await bcrypt.hash(userData.password, 10);
    await User.findOneAndUpdate(
      { email: userData.email },
      {
        name: userData.name,
        email: userData.email,
        passwordHash: userPasswordHash,
        city: userData.city,
        points: userData.points,
        badges: userData.badges,
        interests: userData.interests
      },
      { upsert: true, new: true }
    );
    console.log("[SEED] Created/updated user:", userData.email);
  }

  // Events (GeoJSON [lng, lat])
  const events = [
    {
      title: "Hussain Sagar Lake Cleanup",
      category: "cleanup",
      points: 60,
      dateISO: "2026-02-22",
      address: "Hussain Sagar, Tank Bund Road, Hyderabad",
      description: "Cleanup drive around the lake + awareness walk.",
      location: { type: "Point", coordinates: [78.4738, 17.4239] }
    },
    {
      title: "Necklace Road Plastic Pickup",
      category: "cleanup",
      points: 50,
      dateISO: "2026-02-15",
      address: "Necklace Road, Hyderabad",
      description: "Quick plastic pickup walk along Necklace Road stretch.",
      location: { type: "Point", coordinates: [78.4694, 17.4127] }
    },
    {
      title: "KBR Park Tree Planting",
      category: "planting",
      points: 75,
      dateISO: "2026-02-18",
      address: "KBR National Park, Jubilee Hills, Hyderabad",
      description: "Plant native saplings near the park boundary with NGO.",
      location: { type: "Point", coordinates: [78.4260, 17.4156] }
    },
    {
      title: "Durgam Cheruvu Clean & Restore",
      category: "cleanup",
      points: 65,
      dateISO: "2026-02-20",
      address: "Durgam Cheruvu, Hitech City, Hyderabad",
      description: "Cleanup & segregation awareness around the lake walkway.",
      location: { type: "Point", coordinates: [78.3927, 17.4324] }
    },
    {
      title: "Shilparamam Recycling Workshop",
      category: "recycling",
      points: 35,
      dateISO: "2026-02-21",
      address: "Shilparamam, Madhapur, Hyderabad",
      description: "Learn waste segregation & build a recycling habit kit.",
      location: { type: "Point", coordinates: [78.3784, 17.4520] }
    },
    {
      title: "Botanical Garden Compost Session",
      category: "recycling",
      points: 40,
      dateISO: "2026-02-23",
      address: "Botanical Garden, Kondapur, Hyderabad",
      description: "Composting basics + demo setup for home kitchens.",
      location: { type: "Point", coordinates: [78.3613, 17.4662] }
    },
    {
      title: "Charminar Area Street Cleanup",
      category: "cleanup",
      points: 55,
      dateISO: "2026-02-25",
      address: "Charminar, Old City, Hyderabad",
      description: "Community-driven street cleanup & bin placement awareness.",
      location: { type: "Point", coordinates: [78.4747, 17.3616] }
    },
    {
      title: "Osman Sagar Tree Plantation Drive",
      category: "planting",
      points: 80,
      dateISO: "2026-02-27",
      address: "Osman Sagar (Gandipet), Hyderabad",
      description: "Tree plantation near lake outskirts; hydration provided.",
      location: { type: "Point", coordinates: [78.3115, 17.3715] }
    },
    {
      title: "Gachibowli Park Beach Cleanup",
      category: "cleanup",
      points: 45,
      dateISO: "2026-02-16",
      address: "Gachibowli Stadium Park, Hyderabad",
      description: "Morning cleanup session at the park with refreshments.",
      location: { type: "Point", coordinates: [78.3486, 17.4225] }
    },
    {
      title: "Hitech City E-Waste Collection Drive",
      category: "recycling",
      points: 50,
      dateISO: "2026-02-19",
      address: "Hitech City Main Road, Hyderabad",
      description: "Collect and properly dispose of electronic waste.",
      location: { type: "Point", coordinates: [78.3910, 17.4480] }
    },
    {
      title: "Lumbini Park Mangrove Planting",
      category: "planting",
      points: 70,
      dateISO: "2026-02-24",
      address: "Lumbini Park, Necklace Road, Hyderabad",
      description: "Plant mangrove saplings to support lake ecosystem.",
      location: { type: "Point", coordinates: [78.4710, 17.4100] }
    },
    {
      title: "Secunderabad Railway Station Cleanup",
      category: "cleanup",
      points: 55,
      dateISO: "2026-02-26",
      address: "Secunderabad Railway Station, Hyderabad",
      description: "Clean the station premises and promote cleanliness awareness.",
      location: { type: "Point", coordinates: [78.5000, 17.4500] }
    },
    {
      title: "Banjara Hills Paper Recycling Workshop",
      category: "recycling",
      points: 30,
      dateISO: "2026-02-28",
      address: "Banjara Hills, Road No. 12, Hyderabad",
      description: "Learn to make paper products from recycled materials.",
      location: { type: "Point", coordinates: [78.4400, 17.4200] }
    },
    {
      title: "Golconda Fort Area Tree Planting",
      category: "planting",
      points: 85,
      dateISO: "2026-03-01",
      address: "Golconda Fort, Hyderabad",
      description: "Plant heritage trees around the historic fort area.",
      location: { type: "Point", coordinates: [78.4014, 17.3833] }
    },
    {
      title: "Mehdipatnam Market Waste Segregation",
      category: "recycling",
      points: 40,
      dateISO: "2026-03-02",
      address: "Mehdipatnam Market, Hyderabad",
      description: "Help vendors set up proper waste segregation systems.",
      location: { type: "Point", coordinates: [78.4500, 17.3800] }
    },
    {
      title: "Indira Park Morning Cleanup",
      category: "cleanup",
      points: 50,
      dateISO: "2026-03-03",
      address: "Indira Park, Musheerabad, Hyderabad",
      description: "Early morning cleanup drive with yoga session after.",
      location: { type: "Point", coordinates: [78.4800, 17.4000] }
    },
    {
      title: "Sanjeevaiah Park Native Tree Planting",
      category: "planting",
      points: 75,
      dateISO: "2026-03-04",
      address: "Sanjeevaiah Park, Necklace Road, Hyderabad",
      description: "Plant native species to enhance park biodiversity.",
      location: { type: "Point", coordinates: [78.4700, 17.4150] }
    },
    {
      title: "Jubilee Hills Plastic-Free Zone Campaign",
      category: "cleanup",
      points: 60,
      dateISO: "2026-03-05",
      address: "Jubilee Hills Checkpost, Hyderabad",
      description: "Create awareness and clean up plastic waste in the area.",
      location: { type: "Point", coordinates: [78.4200, 17.4300] }
    },
    {
      title: "Miyapur Community Garden Setup",
      category: "planting",
      points: 65,
      dateISO: "2026-03-06",
      address: "Miyapur, Hyderabad",
      description: "Help set up a community vegetable garden.",
      location: { type: "Point", coordinates: [78.3400, 17.4900] }
    },
    {
      title: "Tank Bund Evening Cleanup",
      category: "cleanup",
      points: 55,
      dateISO: "2026-03-07",
      address: "Tank Bund, Hyderabad",
      description: "Evening cleanup walk along the beautiful Tank Bund.",
      location: { type: "Point", coordinates: [78.4750, 17.4250] }
    },
    {
      title: "Madhapur Upcycling Workshop",
      category: "recycling",
      points: 35,
      dateISO: "2026-03-08",
      address: "Madhapur, Hitech City, Hyderabad",
      description: "Transform old items into useful products through upcycling.",
      location: { type: "Point", coordinates: [78.3800, 17.4500] }
    },
    {
      title: "Qutub Shahi Tombs Heritage Tree Planting",
      category: "planting",
      points: 80,
      dateISO: "2026-03-09",
      address: "Qutub Shahi Tombs, Hyderabad",
      description: "Plant trees around the historic monument complex.",
      location: { type: "Point", coordinates: [78.4000, 17.3900] }
    },
    {
      title: "Ameerpet Metro Station Cleanup",
      category: "cleanup",
      points: 45,
      dateISO: "2026-03-10",
      address: "Ameerpet Metro Station, Hyderabad",
      description: "Keep the metro station clean and green.",
      location: { type: "Point", coordinates: [78.4400, 17.4400] }
    },
    {
      title: "Kondapur Organic Waste Composting",
      category: "recycling",
      points: 40,
      dateISO: "2026-03-11",
      address: "Kondapur, Hyderabad",
      description: "Learn and practice organic waste composting techniques.",
      location: { type: "Point", coordinates: [78.3600, 17.4700] }
    },
    {
      title: "Shamirpet Lake Restoration Project",
      category: "planting",
      points: 90,
      dateISO: "2026-03-12",
      address: "Shamirpet Lake, Hyderabad",
      description: "Major tree planting initiative for lake restoration.",
      location: { type: "Point", coordinates: [78.5500, 17.5500] }
    }
  ];

  const rewards = [
    { title: "Eco Bottle", cost: 300, description: "Reusable insulated bottle." },
    { title: "Plant a Tree (Donation)", cost: 500, description: "We sponsor a tree plantation." },
    { title: "Volunteer Hoodie", cost: 900, description: "Eco-Volunteer Match hoodie." },
    { title: "Bamboo Cutlery Set", cost: 250, description: "Sustainable bamboo cutlery for on-the-go meals." },
    { title: "Reusable Shopping Bag", cost: 150, description: "Durable canvas shopping bag with eco design." },
    { title: "Seed Starter Kit", cost: 200, description: "Complete kit to start your own garden at home." },
    { title: "Eco-Friendly Notebook", cost: 180, description: "Recycled paper notebook with eco tips." },
    { title: "Solar Power Bank", cost: 1200, description: "Portable solar charger for your devices." },
    { title: "Compost Bin", cost: 400, description: "Home composting bin with instructions." },
    { title: "Water Filter Bottle", cost: 350, description: "Portable water filter for clean drinking water." },
    { title: "Tree Adoption Certificate", cost: 600, description: "Adopt a tree and get a certificate." },
    { title: "Eco Tote Bag Set", cost: 220, description: "Set of 3 reusable tote bags." },
    { title: "Herb Garden Kit", cost: 280, description: "Everything you need to grow herbs at home." },
    { title: "LED Solar Light", cost: 450, description: "Solar-powered LED light for outdoor use." },
    { title: "Eco Volunteer Badge", cost: 100, description: "Special badge for active volunteers." }
  ];

  await Event.insertMany(events);
  await Reward.insertMany(rewards);

  // ✅ Ensure geospatial index exists for geoNear queries
  await Event.syncIndexes();

  console.log("[SEED] Inserted events:", events.length);
  console.log("[SEED] Inserted rewards:", rewards.length);

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

