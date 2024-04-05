const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Please provide a label "],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },

    assignedEmployee: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", 
      },
      email: {
        type: String,
        default: "non assigned",
      },

    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("project", projectSchema);
