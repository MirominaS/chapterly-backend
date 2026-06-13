import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: String,
    genre: String,
    format: String,
    language: String,
    description: String,
    total_pages: Number,
    cover_image: String,

    status: {
      type: String,
      default: "Not Started",
    },

    current_page: {
      type: Number,
      default: 0,
    },

    rating: Number,

    start_date: Date,
    finished_date: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);