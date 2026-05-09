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
            status,
            genre,
            format,
            language,
            rating,
            description,
            start_date,
            finished_date,
            total_pages,
            current_page
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
        current_page = Number(current_page) || 0; 
        rating = rating ? Number(rating) : null;
        
        if(total_pages < 0 || current_page < 0) {
            return res.status(400).json({message: "Pages cannot be negative"})
        }

        if(current_page > total_pages){
            return res.status(400).json({message: "Current page cannot exceed total pages"})
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message:"Rating must be between 1 and 5",});
        }

        if(current_page === 0){
            status = "Not Started"
        } else if(current_page === total_pages && total_pages > 0) {
            status = "Completed";

            finished_date = new Date().toISOString().split("T")[0];
        } else if( status !== "Paused" && status !== "Dropped"){
            status = "Ongoing"
        }

        if(current_page > 0 && !start_date){
            start_date = new Date().toISOString().split("T")[0];
        }        

        if(!allowedStatuses.includes(status)){
            return res.status(400).json({message: "Invalid status"})
        }        

        const book = await createBookService({
            user_id: req.user.id,
            title,
            author,
            genre,
            format,
            language,
            rating,
            description,
            start_date,
            finished_date,
            status,
            total_pages,
            current_page,
        })

        const progress = total_pages > 0 ? 
            Math.round(
                (current_page/total_pages)*100
            ) : 0;

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
        let{
           title,
            author,
            genre,
            format,
            language,
            rating,
            description,
            start_date,
            finished_date,
            status,
            total_pages,
            current_page,
        } = req.body;

        if(!title || title.trim() === ""){
            return res.status(400).json({message: "Title is required",})
        }

        title = title.trim();

        total_pages = Number(total_pages) ||0;
        current_page = Number(current_page) || 0;
        rating = rating ? Number(rating) : null;

        if(total_pages < 0 || current_page < 0) {
            return res.status(400).json({message: "Pages cannot be negative",})
        }

        if(current_page > total_pages) {
            return res.status(400).json({message: "Current page cannot exceed total pages"})
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({message: "Rating must be between 1 and 5",});
        }

        if (current_page === 0) {
            status = "Not Started";

            start_date = null;
            finished_date = null;

        } else if (current_page === total_pages && total_pages > 0) {
            status = "Completed";

            finished_date = new Date().toISOString().split("T")[0];

            if(!start_date){
                start_date = new Date().toISOString().split("T")[0];
            }
        } else if (status !== "Paused" && status !== "Dropped") {
            status = "Ongoing";

            finished_date = null;

            if(!start_date) {
                start_date = new Date().toISOString().split("T")[0]
            }
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({message: "Invalid status"})
        }

        const book = await updateBookService(
            req.params.id,
            req.user.id,
            {
                title,
                author,
                genre,
                format,
                language,
                rating,
                description,
                start_date,
                finished_date,
                status,
                total_pages,
                current_page,
            }
        );

        if(!book) {
            return res.status(404).json({message: "Book not found"})
        }

        const progress = total_pages > 0
            ? Math.round(
                (current_page/total_pages)*100
            ) : 0;

        res.json({...book,progress_percentage:progress});
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