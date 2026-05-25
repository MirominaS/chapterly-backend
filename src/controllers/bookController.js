import { 
    createBookService, 
    deleteBookService, 
    duplicateCheckService, 
    getBookByIdService, 
    getBooksService, 
    updateBookService 
} from "../services/bookService.js";

const allowedStatuses = [
    "Not Started",
    "Ongoing",
    "Completed",
    "Paused",
    "Dropped"
];

export const createBookController = async (req,res) => {
    try {
        let {
            title,
            author,
            genre,
            format,
            language,
            description,
            total_pages,
            cover_image,
        } = req.body;

        if(!title || title.trim() === "") {
            return res.status(400).json({message: "Title is required"})
        }

        title = title.trim();
        author = author?.trim() || null;

        const duplicate = await duplicateCheckService(req.user.id, title,author);
        
        if(duplicate){
            return res.status(400).json({message: "Book already exist in your library"})
        }

        total_pages = Number(total_pages) || 0;
        
        if(total_pages < 0) {
            return res.status(400).json({message: "Pages cannot be negative"})
        }

        const status = "Not Started";
        const current_page = 0;
        const rating = null;
        const start_date = null;
        const finished_date = null;
        const progress = 0;

        const book = await createBookService({
            user_id: req.user.id,
            title,
            author,
            genre,
            format,
            language,
            total_pages,
            description,
            cover_image,

            rating,
            start_date,
            finished_date,
            status,
            current_page,
        })

        res.status(201).json({...book, progress_percentage: progress})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//get all books
export const getBooksController = async (req,res) => {
    try {
        const books = await getBooksService(req.user.id);

        const booksWithProgress = books.map((book) => {
            const progress = 
            book.total_pages > 0 
            ? Math.round(
                (
                    book.current_page/book.total_pages
                )*100
            ) : 0;

            return {
                ...book, progress_percentage:progress,
            }
        })
        
        res.json(booksWithProgress)
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

        const progress = book.total_pages > 0 
        ? Math.round(
            (book.current_page/book.total_pages)* 100
        ) : 0;

        res.json({...book,progress_percentage:progress});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//update
export const updateController = async(req,res) => {
    try {
        //get existing book
        const existingBook = await getBookByIdService(
            req.params.id,
            req.user.id
        )

        if(!existingBook) {
            return res.status(404).json({
                message:"Book not found",
            })
        }

        //merge existing data with new data
        let updatedData = {
            ...existingBook,
            ...req.body,
        }
      
        //trim strings
        updatedData.title = updatedData.title?.trim();

        updatedData.author = updatedData.author?.trim();

        //validations
        if(req.body.title !== undefined && updatedData.title.trim() === ""){
                return res.status(400).json({
                message:"Title is required"
            })
        }

        updatedData.total_pages = Number(updatedData.total_pages) || 0;
        
        updatedData.current_page = Number(updatedData.current_page) || 0;

        updatedData.rating = updatedData.rating ? Number(updatedData.rating): null;

        if ( updatedData.total_pages < 0 || updatedData.current_page < 0) {
            return res.status(400).json({
            message: "Pages cannot be negative",
            });
        }

        if ( updatedData.current_page > updatedData.total_pages) {
            return res.status(400).json({
            message: "Current page cannot exceed total pages",
            });
        }

        if ( updatedData.rating && (updatedData.rating < 1 || updatedData.rating > 5)) {
            return res.status(400).json({
            message: "Rating must be between 1 and 5",
            });
        }

         // smart status logic
        if ( updatedData.current_page === 0) {
            updatedData.status = "Not Started";
            updatedData.start_date = null;
            updatedData.finished_date = null;

        } else if ( updatedData.current_page === updatedData.total_pages && updatedData.total_pages > 0) {

            updatedData.status = "Completed";

            updatedData.finished_date = new Date().toISOString().split("T")[0];

            if ( !updatedData.start_date) {
            updatedData.start_date = new Date().toISOString().split("T")[0];
            }

        } else if ( updatedData.status !== "Paused" && updatedData.status !=="Dropped") {

            updatedData.status = "Ongoing";

            updatedData.finished_date = null;

            if ( !updatedData.start_date ) {
            updatedData.start_date = new Date().toISOString().split("T")[0];
            }
        }

        // validate status
        if (!allowedStatuses.includes(
            updatedData.status
            )
        ) {
            return res.status(400).json({
            message: "Invalid status",
            });
        }

        const updatedBook =
            await updateBookService(
            req.params.id,
            req.user.id,
            updatedData
            );

        const progress =
            updatedBook.total_pages > 0
            ? Math.round(
                (
                    updatedBook.current_page /
                    updatedBook.total_pages
                ) * 100
                )
            : 0;

        res.json({
            ...updatedBook,
            progress_percentage:
            progress,
      });
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