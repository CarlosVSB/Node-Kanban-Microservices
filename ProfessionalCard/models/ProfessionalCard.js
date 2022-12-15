const mongoose = require(`mongoose`);

const ProfessionalCard = mongoose.model("ProfessionalCard", {
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
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

module.exports = ProfessionalCard;
