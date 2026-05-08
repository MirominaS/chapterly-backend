import { 
    createBookService, 
    deleteBookService, 
    getBookByIdService, 
    getBooksService, 
    updateBookService 
} from "../services/bookService.js";

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

//get all books
export const getBooksController = async (req,res) => {
    try {
        const books = await getBooksService(req.user.id);
        res.json(books);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//get one book
export const getBookByIdController = async (req,res) => {
    try {
        const book = await getBookByIdService(
            req.params.id,
            req.user.id
        )

        if(!book) {
            return res.status(404).json({message:"Book not found"})
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//update
export const updateController = async(req,res) => {
    try {
        const book = await updateBookService(
            req.params.id,
            req.user.id,
            req.body
        );
        res.json(book);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//delete
export const deleteBookController = async(req,res) => {
    try {
        const deleted = await deleteBookService(
            req.params.id, 
            req.user.id
        );
        if(!deleted){
            return res.status(404).json({message:"Book not found"})
        }
        res.json({message:"Book deleted",deleted})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}