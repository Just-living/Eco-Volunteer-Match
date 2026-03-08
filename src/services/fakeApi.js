import { loadDB, saveDB, delay } from "./db";

function todayISO() {
  return new Date().toISOString();
}

// Helper to get current user ID from token
function getCurrentUserId() {
  // Try to get from localStorage first (stored during login)
  const storedUserId = localStorage.getItem("evm_userId");
  if (storedUserId) return storedUserId;
  
  // Fallback: get first user from DB
  const db = loadDB();
  return db?.users?.[0]?.id || null;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get approximate coordinates for a location name
function getLocationCoords(location) {
  // Simple mapping for demo locations
  const locationMap = {
    "Santa Monica Beach": { lat: 34.0089, lng: -118.4973 },
    "Central Park": { lat: 40.7829, lng: -73.9654 },
    "Community Hall": { lat: 17.3850, lng: 78.4867 },
    "Hussain Sagar Lake": { lat: 17.4239, lng: 78.4738 },
  };
  
  // Try to find exact match
  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.includes(key) || key.includes(location)) {
      return coords;
    }
  }
  
  // Default to Hyderabad center
  return { lat: 17.3850, lng: 78.4867 };
}

export function setToken(token) {
  // No-op for fakeApi, token is stored in localStorage by AuthContext
}

export async function login(email, password) {
  await delay();
  const db = loadDB();

  // demo login: accept any password
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // if new user, auto-create
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      city: "Your City",
      points: 0,
      badges: ["b1"],
      joinedEventIds: [],
      interests: [],
    };
    db.users.unshift(user);
    saveDB(db);
  }

  // Store user ID for later retrieval
  localStorage.setItem("evm_userId", user.id);
  
  // return "token" + user
  return { token: "demo-token", user };
}

export async function register(payload) {
  await delay();
  const db = loadDB();
  
  // Check if user exists
  const existing = db.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
  if (existing) {
    throw new Error("User already exists");
  }
  
  const user = {
    id: crypto.randomUUID(),
    name: payload.name || payload.email.split("@")[0],
    email: payload.email,
    city: payload.city || "Your City",
    points: 0,
    badges: ["b1"],
    joinedEventIds: [],
    interests: payload.interests || [],
  };
  
  db.users.unshift(user);
  saveDB(db);
  
  // Store user ID for later retrieval
  localStorage.setItem("evm_userId", user.id);
  
  return { token: "demo-token", user };
}

export async function getMe() {
  await delay();
  const db = loadDB();
  const userId = getCurrentUserId();
  if (!userId) {
    // Return first user as fallback
    return db.users[0] || null;
  }
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  return user;
}

export async function updateMe(patch) {
  await delay();
  const db = loadDB();
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("User not found");
  db.users[idx] = { ...db.users[idx], ...patch };
  saveDB(db);
  return db.users[idx];
}

export async function listEvents({ q = "", category = "all" } = {}) {
  await delay();
  const db = loadDB();
  const query = q.trim().toLowerCase();

  return db.events
    .filter((e) => (category === "all" ? true : e.category === category))
    .filter((e) => {
      if (!query) return true;
      return (
        e.title.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
}

export async function getEvent(eventId) {
  await delay();
  const db = loadDB();
  const ev = db.events.find((e) => e.id === eventId);
  if (!ev) throw new Error("Event not found");
  return ev;
}

export async function joinEvent(eventId) {
  await delay();
  const db = loadDB();
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  const user = db.users.find((u) => u.id === userId);
  const ev = db.events.find((e) => e.id === eventId);
  if (!user || !ev) throw new Error("Invalid user/event");

  if (!user.joinedEventIds.includes(eventId)) {
    user.joinedEventIds.push(eventId);
    user.points += ev.points;
    saveDB(db);
  }
  return user;
}

// Events nearby (for map)
export async function listEventsNear({ lat, lng, radiusKm = 10, category = "all", q = "" }) {
  await delay();
  const db = loadDB();
  const query = q.trim().toLowerCase();
  
  const events = db.events
    .filter((e) => (category === "all" ? true : e.category === category))
    .filter((e) => {
      if (!query) return true;
      return (
        e.title.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
      );
    })
    .map((e) => {
      const coords = getLocationCoords(e.location);
      const distanceKm = calculateDistance(lat, lng, coords.lat, coords.lng);
      return {
        ...e,
        _id: e.id,
        address: e.location,
        location: {
          type: "Point",
          coordinates: [coords.lng, coords.lat], // GeoJSON format: [lng, lat]
        },
        distanceKm: Math.round(distanceKm * 10) / 10, // Round to 1 decimal
      };
    })
    .filter((e) => e.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  
  return events;
}

export async function listPosts() {
  await delay();
  const db = loadDB();
  return db.communityPosts
    .slice()
    .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
}

export async function listCommunityPosts() {
  return listPosts();
}

export async function createPost(content) {
  await delay();
  const db = loadDB();
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  const post = {
    id: crypto.randomUUID(),
    userId,
    content,
    createdAtISO: todayISO(),
    likes: 0,
  };
  db.communityPosts.unshift(post);
  saveDB(db);
  return post;
}

export async function listRewards() {
  await delay();
  const db = loadDB();
  return db.rewards;
}

export async function redeemReward(rewardId) {
  await delay();
  const db = loadDB();
  const userId = getCurrentUserId();
  if (!userId) throw new Error("Not authenticated");
  const user = db.users.find((u) => u.id === userId);
  const reward = db.rewards.find((r) => r.id === rewardId);
  if (!user || !reward) throw new Error("Invalid user/reward");

  if (user.points < reward.cost) {
    throw new Error("Not enough points");
  }

  user.points -= reward.cost;
  saveDB(db);
  return user;
}

export async function listBadges() {
  await delay();
  const db = loadDB();
  return db.badges;
}
