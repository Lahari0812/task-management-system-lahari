const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    startDate: {
      type: Date
    },

    dueDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);