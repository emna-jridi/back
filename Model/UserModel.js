const mongoose = require("mongoose");
const roles = require("../Config/ConstConfig");
const { userValidationSchema } = require("../Config/ValidatorConfig");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
    },
    email: {
      type: String,
      // required: [true, "Please provide an email"],
      // unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    state: {
      type: Boolean,
    },

    role: {
      type: String,
      required: true,
      enum: {
        values: [roles.RA, roles.RPA, roles.RTA],
        message: `{value} does not have permission to connect`,
      },
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true } //createdAt & updatedAt are handled automatically.
);

// userSchema.pre('save', function (next) {
//   const { error } = userValidationSchema.validate(this.toObject());
//   if (error) {
//     throw new Error(`Validation error: ${error.message}`);
//   }

//   next();
// });

module.exports = mongoose.model("user", userSchema);
