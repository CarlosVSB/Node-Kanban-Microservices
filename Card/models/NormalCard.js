const mongoose = require(`mongoose`);

const NormalCard = mongoose.model("NormalCard", {
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  other: String,
  status: {
    type: String,
    enum: ["WAITING", "IN_PROGRESS", "PENDING", "FINISHED", "OTHER"],
    default: "WAITING",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = NormalCard;
