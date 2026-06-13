import Thought from "../models/Thought.js";
import Book from "../models/Book.js";

// create
export const createThoughtService = async (data) => {
  return await Thought.create(data);
};

// get by book
export const getThoughtsByBookService = async (
  book_id
) => {
  return await Thought.find({ book_id })
    .sort({ createdAt: -1 });
};

// get by id
export const getThoughtByIdService = async (
  id
) => {
  return await Thought.findById(id);
};

// update
export const updateThoughtService = async (
  id,
  data
) => {
  return await Thought.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

// delete
export const deleteThoughtService = async (
  id
) => {
  return await Thought.findByIdAndDelete(id);
};

// verify ownership
export const verifyBookOwnershipService = async (
  book_id,
  user_id
) => {
  return await Book.findOne({
    _id: book_id,
    user_id: user_id,
  });
};