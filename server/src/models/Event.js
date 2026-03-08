const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ["cleanup", "planting", "recycling"], required: true },
    points: { type: Number, default: 25 },
    dateISO: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, default: "" },

    // GeoJSON Point: [lng, lat]
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: { type: [Number], required: true } // [lng, lat]
    }
  },
  { timestamps: true }
);

// Geo index for $geoNear / $near
EventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Event", EventSchema);
