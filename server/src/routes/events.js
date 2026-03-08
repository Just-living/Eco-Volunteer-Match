const express = require("express");
const Event = require("../models/Event");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/events?q=search&category=cleanup
 * List all events with optional search and category filter
 */
router.get("/", async (req, res, next) => {
  try {
    const category = (req.query.category || "all").toLowerCase();
    const q = (req.query.q || "").trim().toLowerCase();

    const match = {};
    if (category !== "all") match.category = category;
    if (q) {
      match.$or = [
        { title: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ];
    }

    const events = await Event.find(match)
      .sort({ dateISO: 1 })
      .lean()
      .limit(100);

    res.json(events);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/events/near?lat=..&lng=..&radiusKm=5&category=cleanup&q=park
 * Uses $geoNear to return distance
 */
router.get("/near", async (req, res, next) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const radiusKm = Number(req.query.radiusKm || 10);
    const category = (req.query.category || "all").toLowerCase();
    const q = (req.query.q || "").trim().toLowerCase();

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ message: "lat/lng required" });
    }

    const maxDistanceMeters = radiusKm * 1000;

    const match = {};
    if (category !== "all") match.category = category;
    if (q) {
      match.$or = [
        { title: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ];
    }

    const results = await Event.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          maxDistance: maxDistanceMeters,
          spherical: true
        }
      },
      { $match: match },
      { $sort: { distanceMeters: 1 } },
      { $limit: 50 }
    ]);

    const withKm = results.map((e) => ({
      ...e,
      distanceKm: Math.round((e.distanceMeters / 1000) * 10) / 10
    }));

    res.json(withKm);
  } catch (error) {
    next(error);
  }
});

/** Join event: adds points + eventId to user */
router.post("/:eventId/join", auth, async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const ev = await Event.findById(eventId).lean();
    if (!ev) return res.status(404).json({ message: "Event not found" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const already = user.joinedEventIds.some((id) => String(id) === String(eventId));
    if (!already) {
      user.joinedEventIds.push(eventId);
      user.points += ev.points;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
