import {
  createQuoteService,
  deleteQuoteService,
  getQuoteByIdService,
  getQuotesByBookService,
  updateQuoteService,
  verifyBookOwnershipService,
} from "../services/quoteService.js";

import Book from "../models/Book.js";

const allowedPageNumber = (page_number) => {
  return page_number >= 0;
};

export const createQuoteController = async (req, res) => {
  try {
    const { book_id, quote_text, page_number, chapter, speaker, comment } =
      req.body;

    if (!quote_text || quote_text.trim() === "") {
      return res.status(400).json({ message: "Quote text is required" });
    }

    if (page_number && !allowedPageNumber(page_number)) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    //verify
    const checkBook = await verifyBookOwnershipService(book_id, req.user.id);

    if (!checkBook) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const quote = await createQuoteService({
      book_id,
      quote_text,
      page_number,
      chapter,
      speaker,
      comment,
    });

    res.status(201).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get quotes
export const getQuotesController = async (req, res) => {
  try {
    const { book_id } = req.params;

    //verify
    const checkBook = await verifyBookOwnershipService(book_id, req.user.id);

    if (!checkBook) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const quotes = await getQuotesByBookService(book_id);

    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get quote by id
export const getQuoteByIdController = async (req, res) => {
  try {
    const quote = await getQuoteByIdService(req.params.id);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    const book = await Book.findOne({
      _id: quote.book_id,
      user_id: req.user.id,
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.json(quote);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//update
export const updateQuoteController = async (req, res) => {
  try {
    const { id } = req.params;
    const { quote_text, page_number, chapter, speaker, comment } = req.body;

    if (!quote_text || quote_text.trim() === "") {
      return res.status(400).json({ message: "Quote text is required" });
    }

    if (page_number && !allowedPageNumber(page_number)) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    const quote = await getQuoteByIdService(id);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    const book = await Book.findOne({
      _id: quote.book_id,
      user_id: req.user.id,
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const updated = await updateQuoteService(id, {
      quote_text,
      page_number,
      chapter,
      speaker,
      comment,
    });

    if (!updated) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete
export const deleteQuoteController = async (req, res) => {
  try {
    const quote = await getQuoteByIdService(req.params.id);

    if (!quote) {
      return res.status(404).json({
        message: "Quote not found",
      });
    }

    const book = await Book.findOne({
      _id: quote.book_id,
      user_id: req.user.id,
    });

    if (!book) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const deleted = await deleteQuoteService(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Quote not found" });
    }

    res.json({ message: "Quote deleted", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
