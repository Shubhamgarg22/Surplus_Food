const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "donation_created",
      "donation_accepted",
      "pickup_confirmed",
      "delivery_completed",
      "donation_expired",
      "user_verified",
      "user_blocked",
      "system"
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  relatedDonationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
  },
  relatedRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  smsSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
