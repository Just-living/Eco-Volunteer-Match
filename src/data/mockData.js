export const mockDB = {
    users: [
      {
        id: "u1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        city: "Hyderabad",
        points: 1520,
        badges: ["b1", "b2", "b3", "b4"],
        joinedEventIds: ["e1", "e3", "e6", "e8", "e10", "e12", "e2", "e4", "e5", "e7", "e9", "e11"],
        interests: ["cleanup", "planting", "recycling"],
      },
    ],
    events: [
      {
        id: "e1",
        title: "Beach Cleanup Drive",
        category: "cleanup",
        points: 50,
        dateISO: "2026-02-15",
        location: "Santa Monica Beach",
        distanceKm: 2.3,
        description:
          "Join a community cleanup to remove plastic and waste from the shoreline. Gloves and bags provided.",
      },
      {
        id: "e2",
        title: "Tree Planting Initiative",
        category: "planting",
        points: 75,
        dateISO: "2026-02-18",
        location: "Central Park",
        distanceKm: 4.1,
        description:
          "Help plant native trees with local NGOs. Tools provided. Please wear comfortable footwear.",
      },
      {
        id: "e3",
        title: "Neighborhood Recycling Workshop",
        category: "recycling",
        points: 35,
        dateISO: "2026-02-20",
        location: "Community Hall",
        distanceKm: 1.1,
        description:
          "Learn practical recycling tips and help neighbors set up a waste segregation plan.",
      },
      {
        id: "e4",
        title: "Lake Cleanup + Awareness",
        category: "cleanup",
        points: 60,
        dateISO: "2026-02-22",
        location: "Hussain Sagar Lake",
        distanceKm: 3.8,
        description:
          "Cleanup drive around the lake and a short awareness walk with posters.",
      },
    ],
    communityPosts: [
      {
        id: "p1",
        userId: "u1",
        content:
          "Just finished a cleanup drive today — amazing energy from everyone! 🌱",
        createdAtISO: "2026-02-10T10:30:00Z",
        likes: 12,
      },
      {
        id: "p2",
        userId: "u1",
        content:
          "Planting trees is so satisfying. We planted 20 saplings! 🏆",
        createdAtISO: "2026-02-11T08:15:00Z",
        likes: 7,
      },
    ],
    rewards: [
      { id: "r1", title: "Eco Bottle", cost: 300, description: "Reusable insulated bottle." },
      { id: "r2", title: "Plant a Tree (Donation)", cost: 500, description: "We sponsor a tree plantation." },
      { id: "r3", title: "Volunteer Hoodie", cost: 900, description: "Eco-Volunteer Match hoodie." },
    ],
    badges: [
      { id: "b1", title: "First Event", icon: "🏁" },
      { id: "b2", title: "Cleanup Hero", icon: "🧹" },
      { id: "b3", title: "Tree Planter", icon: "🌳" },
      { id: "b4", title: "Community Star", icon: "⭐" },
    ],
  };
  