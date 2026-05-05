import { createBookService } from "../services/bookService.js";

export const createBookController = async (req,res) => {
    try {
        const {title,author,status,total_pages} = req.body;

        if(!title) {
            return res.status(400).json({message: "Title is required"})
        }

        const book = await createBookService({
            user_id: req.user.id,
            title,
            author,
            status,
            total_pages,
        })
        res.status(201).json(book)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}