import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    quote_text: {
      type: String,
      required: true,
      trim: true,
    },

    page_number: Number,

    chapter: String,

    speaker: String,

    comment: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Quote", quoteSchema);