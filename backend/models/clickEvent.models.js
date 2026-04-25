import mongoose from "mongoose";

const clickEventSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Url",
      required: true,
      index: true,
    },
    clickedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    }
  },
  
);

const ClickEvent = mongoose.model("ClickEvent", clickEventSchema);

export default ClickEvent;
