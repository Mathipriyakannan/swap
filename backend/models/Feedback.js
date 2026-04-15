const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    staffName: { type: String, required: true },
    department: { type: String, required: true },
    emoji: { type: String, required: true },
    emojiLabel: { type: String, required: true },
    extraRating: { type: Number, default: 0 },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);