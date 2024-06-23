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
  },
  {
    timestamps: true,
  }
);

const Constituency = mongoose.model("Constituency", constituencySchema);

export default Constituency;
