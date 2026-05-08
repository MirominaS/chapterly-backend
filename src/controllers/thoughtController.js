import pool from "../config/db_config.js"
import { createThoughtService, deleteThoughtService, getThoughtsByBookService, updateThoughtService } from "../services/thoughtService.js";

const allowedTypes = [
    "before",
    "during",
    "after",
]
//create thought
export const createThoughtController = async(req, res) => {
    try {
        const {book_id,type,title,content,page_number,mood} = req.body;

        if(!allowedTypes.includes(type)) {
            return res.status(400).json({message: "Content is required"})
        }

        if(page_number < 0){
            return res.status(400).json({message: "Invalid page number"})
        }
        //verify book belongs to user
        const checkBook = await pool.query(
            "SELECT * FROM chapterly_books.books WHERE id=$1 AND user_id=$2",
            [book_id,req.user.id]
        )
        
        if(checkBook.rows.length === 0) {
            return res.status(403).json({message:"Not authorized"})
        }

        const thought = await createThoughtService({
            book_id,
            type,
            title,
            content,
            page_number,
            mood,
        })
        res.status(201).json(thought)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//get thoughts of a book
export const getThoughtsController = async(req,res) => {
    try {
        const{book_id} = req.params;

        //verify ownership
        const checkBook = await pool.query(
            "SELECT * FROM chapterly_books.books WHERE id=$1 AND user_id=$2",
            [book_id,req.user.id]
        )

        if(checkBook.rows.length === 0){
            return res.status(403).json({message:"Not authorized"})
        }

        const thoughts = await getThoughtsByBookService(book_id);

        res.json(thoughts);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//update
export const updateThoughtController = async(req,res) => {
    try {
        const {id} = req.params;

        if(!allowedTypes.includes(type)){
            return res.status(400).json({message: "Invalid thought type"})
        }

        if(!content || content.trim() === "") {
            return res.status(400).json({message:"Content is required"})
        }

        if (page_number < 0) {
            return res.status(400).json({message: "Invalid page number",});
        }

        //verify ownership
        const checkBook = await pool.query(
            `SELECT t.* FROM chapterly_thoughts.thoughts t 
            JOIN chapterly_books.books b ON t.book_id = b.id
            WHERE t.id=$1 AND b.user_id=$2`,
            [id, req.user.id]
        )

        if(checkBook.rows.length === 0){
            return res.status(403).json({message:"Not authorized"})
        }

        const updated = await updateThoughtService(id,{
            type,title,content,page_number,mood,
        })

        if (!updated) {
            return res.status(404).json({message: "Thought not found",});
        }

        res.json(updated)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//delete
export const deleteThoughtController = async(req,res) => {
    try {
        const {id} = req.params;

        //verify ownership
        const checkBook = await pool.query(
            `SELECT t.* FROM chapterly_thoughts.thoughts t 
            JOIN chapterly_books.books b ON t.book_id = b.id
            WHERE t.id=$1 AND b.user_id=$2`,
            [id, req.user.id]
        )

        if(checkBook.rows.length === 0){
            return res.status(403).json({message:"Not authorized"})
        }

         const deleted = await deleteThoughtService(id);

        if (!deleted) {
            return res.status(404).json({message: "Thought not found",});
        }
        
        res.json({message:"Thought Deleted",deleted})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}