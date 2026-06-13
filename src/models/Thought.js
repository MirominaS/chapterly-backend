import mongoose from "mongoose";

const thoughtSchema = new mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    type: {
      type: String,
      enum: ["Before", "During", "After"],
      required: true,
    },

    title: String,

    content: {
      type: String,
      required: true,
    },

    page_number: Number,

    mood: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Thought", thoughtSchema);