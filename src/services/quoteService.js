import Quote from "../models/Quote.js";
import Book from "../models/Book.js";

// create
export const createQuoteService = async (data) => {
  return await Quote.create(data);
};

// get quotes by book
export const getQuotesByBookService = async (book_id) => {
  return await Quote.find({ book_id })
    .sort({ createdAt: -1 });
};

// get quote by id
export const getQuoteByIdService = async (id) => {
  return await Quote.findById(id);
};

// update
export const updateQuoteService = async (
  id,
  data
) => {
  return await Quote.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

// delete
export const deleteQuoteService = async (
  id
) => {
  return await Quote.findByIdAndDelete(id);
};

// verify ownership
export const verifyBookOwnershipService = async (
  book_id,
  user_id
) => {
  return await Book.findOne({
    _id: book_id,
    user_id,
  });
};