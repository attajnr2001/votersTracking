import mongoose from "mongoose";

const constituencySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    psCode: {
      type: String,
      required: true,
    },
    coordinator: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    population: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Constituency = mongoose.model("Constituency", constituencySchema);

export default Constituency;
