const mongoose = require("mongoose");
const { empolyeeValidationSchema } = require("../Config/ValidatorConfig");

const employeeSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: [true, "Please provide your full name"],
      },
      email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: true,
      },
      phoneNumber: {
        type: Number,
        required: [true, "Please provide the Phone Number!"],
      },
      civilState: {
        type: String,
        required: [true, "Please provide the Civil State!"],
      },
      dependents: {
        type: Number,
        required: [true, "Please provide the Dependents!"],
      },
      contract: {
        type: String,
        required: [true, "Please provide the Contract Type!"],
      },
      position: {
        type: String,
        required: [true, "Please provide the position!"],
      },
      entryDate: {
        type: Date,
        required: [true, "Please provide the entry date!"],
      },
      salary: {
        type: Number,
        required: [true, "Please provide the Salary!"],
      },
      RIB: {
        type: Number,
        required: [true, "Please provide the RIB!"],
      },
      cnssNumber: {
        type: Number,
        required: [true, "Please provide the CNSS Number!"],
      },
      emergencyNumber: {
        type: Number,
        required: [true, "Please provide the Emergency Number!"],
      },
      hierarchicalSuperior: {
        type: String,
        required: [true, "Please provide the hierarchical Superior!"],
      },
      leaveBalance: {
        type: Number,
        required: [true, "Please provide the Leave Balance!"],
      },
      lastNegotiationDate: {
        type: Date,
        required: [true, "Please provide the last negotiation date!"],
      },
      rank: {
        type: Number,
        required: [true, "Please provide the rank!"],
      },
    },
    { timestamps: true } //createdAt & updatedAt are handled automatically.
  );

//À vérifier
// employeeSchema.pre('save', function(next){
//     const {error} = empolyeeValidationSchema.validate(this.toObject());
// if (error){
//     throw new Error(`validation error: ${error.message}`)
// }
// next();
// })

module.exports = mongoose.model("employee", employeeSchema);
