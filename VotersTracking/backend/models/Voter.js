import mongoose from "mongoose";

const voterSchema = mongoose.Schema(
  {
    surname: {
      type: String,
      required: true,
    },
    otherNames: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    psCode: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ["M", "F"],
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    dor: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;
