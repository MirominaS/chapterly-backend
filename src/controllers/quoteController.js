import pool from "../config/db_config.js"
import { createQuoteService, getQuotesByBookService } from "../services/quoteService.js";

export const createQuoteController = async (req, res) => {
    try {
        const {
            book_id,
            quote_text,
            page_number,
            chapter,
            speaker,
            comment,
        } = req.body;

        //verify
        const checkBook = await pool.query(
            "SELECT * FROM chapterly_books.books WHERE id = $1 AND user_id = $2",
            [book_id,req.user.id]
        )

        if(checkBook.rows.length === 0){
            return res.status(403).json({message: "Not authorized"})
        }

        const quote = await createQuoteService({
            book_id,
            quote_text,
            page_number,
            chapter,
            speaker,
            comment,
        })

        res.status(201).json(quote);
    } catch (error){
        res.status(500).json({error: error.message})
    }
}

//get quotes
export const getQuotesController = async(req,res) => {
    try {
        const {book_id} = req.params;

        //verify
        const checkBook = await pool.query(
            "SELECT * FROM chapterly_books.books WHERE id=$1 AND user_id=$2",
            [book_id, req.user.id]
        )

        if(checkBook.rowCount.length === 0){
            return res.status(403).json({message: "Not authorized",})
        }

        const quotes = await getQuotesByBookService(book_id);

        res.json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}