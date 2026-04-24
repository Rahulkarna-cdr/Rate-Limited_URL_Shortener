import mongoose from "mongoose";

const clickEventSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    clickedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    }
  },
  
);

const ClickEvent = mongoose.model("ClickEvent", clickEventSchema);

export default ClickEvent;
