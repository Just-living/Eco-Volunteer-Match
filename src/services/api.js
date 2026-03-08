import axios from "axios";

const http = axios.create({
  baseURL: "/api"
});

// Add response interceptor for better error handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from response
    const message = error.response?.data?.message || error.message || "Request failed";
    const status = error.response?.status;
    
    // Create a more descriptive error
    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.response = error.response;
    
    return Promise.reject(enhancedError);
  }
);

export function setToken(token) {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
}

// Auth
export async function login(email, password) {
  const res = await http.post("/auth/login", { email, password });
  return res.data; // { token, user }
}

export async function register(payload) {
  const res = await http.post("/auth/register", payload);
  return res.data;
}

export async function getMe() {
  const res = await http.get("/users/me");
  return res.data;
}

export async function updateMe(patch) {
  const res = await http.put("/users/me", patch);
  return res.data;
}

// Events
export async function listEvents({ q = "", category = "all" } = {}) {
  const res = await http.get("/events", {
    params: { q, category }
  });
  return res.data;
}

// Events (nearby)
export async function listEventsNear({ lat, lng, radiusKm = 10, category = "all", q = "" }) {
  const res = await http.get("/events/near", {
    params: { lat, lng, radiusKm, category, q }
  });
  return res.data; // includes distanceKm
}

export async function joinEvent(eventId) {
  const res = await http.post(`/events/${eventId}/join`);
  return res.data;
}

// Community posts
export async function listPosts() {
  const res = await http.get("/posts");
  return res.data;
}

export async function createPost(content, imageFile = null) {
  const formData = new FormData();
  formData.append("content", content);
  if (imageFile) {
    formData.append("image", imageFile);
  }
  
  const res = await http.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}

export async function likePost(postId) {
  const res = await http.post(`/posts/${postId}/like`);
  return res.data;
}

export async function deletePost(postId) {
  const res = await http.delete(`/posts/${postId}`);
  return res.data;
}

// Rewards
export async function listRewards() {
  const res = await http.get("/rewards");
  return res.data;
}

export async function redeemReward(rewardId) {
  const res = await http.post(`/rewards/${rewardId}/redeem`);
  return res.data;
}

export default http;
