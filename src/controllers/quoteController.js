import pool from "../config/db_config.js"
import { createQuoteService, deleteQuoteService, getQuotesByBookService, updateQuoteService } from "../services/quoteService.js";

const allowedPageNumber = (page_number) => {
    return page_number >= 0;
}

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

        if(!quote_text || quote_text.trim() === ""){
            return res.status(400).json({message: "Quote text is required"})
        }

        if(page_number && !allowedPageNumber(page_number)){
            return res.status(400).json({message: "Invalid page number"})
        }

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

        if(checkBook.rows.length === 0){
            return res.status(403).json({message: "Not authorized",})
        }

        const quotes = await getQuotesByBookService(book_id);

        res.json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
}

//update
export const updateQuoteController = async(req,res) => {
    try {
        const {id} = req.params;
        const {
            quote_text,
            page_number,
            chapter,
            speaker,
            comment,
        }= req.body

        if (!quote_text || quote_text.trim() === "") {
            return res.status(400).json({message: "Quote text is required",});
        }

        if (page_number && !allowedPageNumber(page_number)) {
            return res.status(400).json({message: "Invalid page number",});
        }

        const quoteCheck = await pool.query(
            `SELECT * FROM chapterly_quotes.quotes q
            JOIN chapterly_books.books b
            ON q.book_id = b.id
            WHERE q.id = $1 AND b.user_id = $2`,
            [id,req.user.id]
        )

        if(quoteCheck.rows.length === 0){
            return res.status(403).json({message: "Not authorized"})
        }

        const updated = await updateQuoteService(id,{
            quote_text,
            page_number,
            chapter,
            speaker,
            comment,
        })        

        if(!updated) {
            return res.status(404).json({message:"Quote not found",})
        }

        res.json(updated)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//delete
export const deleteQuoteController = async (req,res) => {
    try {
        const deleted = await deleteQuoteService(req.params.id,req.user.id);

        if(!deleted) {
            return res.status(404).json({message:"Quote not found"})
        }

        res.json({ message: "Quote deleted", deleted })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}