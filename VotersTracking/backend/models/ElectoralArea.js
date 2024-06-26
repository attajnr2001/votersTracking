import mongoose from "mongoose";

const electoralAreaSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    psCode: {
      type: String,
      required: true,
      unique: true,
    },
    coordinator: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    population:{
        type: Number,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const ElectoralArea = mongoose.model("ElectoralArea", electoralAreaSchema);

export default ElectoralArea;
