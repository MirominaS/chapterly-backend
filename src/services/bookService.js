import Book from "../models/Book.js";

export const createBookService = async (data) => {
  return await Book.create(data);
};

export const duplicateCheckService = async (
  user_id,
  title,
  author
) => {
  const book = await Book.findOne({
    user_id,
    title: { $regex: `^${title}$`, $options: "i" },
    author: { $regex: `^${author}$`, $options: "i" },
  });

  return !!book;
};

export const getBooksService = async (user_id) => {
  return await Book.find({ user_id })
    .sort({ createdAt: -1 })
    .lean();
};

export const getBookByIdService = async (
  id,
  user_id
) => {
  return await Book.findOne({
    _id: id,
    user_id,
  }).lean();
};

export const updateBookService = async (
  id,
  user_id,
  data
) => {
  return await Book.findOneAndUpdate(
    {
      _id: id,
      user_id,
    },
    data,
    {
     returnDocument: 'after'
    }
  );
};

export const deleteBookService = async (
  id,
  user_id
) => {
  return await Book.findOneAndDelete({
    _id: id,
    user_id,
  });
};