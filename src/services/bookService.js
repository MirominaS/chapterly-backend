import pool from "../config/db_config.js"

//create
export const createBookService = async (data) => {
    const {
        user_id,
        title,
        author,
        genre,
        format,
        language,
        description,
        total_pages,
        cover_image,

        status,
        current_page,
        rating,
        start_date,
        finished_date,
    } = data;

    const result = await pool.query(
        `INSERT INTO chapterly_books.books (
            user_id,
            title,
            author,
            genre,
            format,
            language,
            description,
            total_pages,
            cover_image,   

            status,
            current_page,
            rating,
            start_date,
            finished_date
        )
        VALUES ($1,$2,$3,$4,$5,$6,
            $7,$8,$9,$10,$11,
            $12,$13,$14) RETURNING *`,
        [  
            user_id,
            title,
            author,
            genre,
            format,
            language,
            description,
            total_pages,
            cover_image,

            status,
            current_page,
            rating,
            start_date,
            finished_date,
        ]
    )

    return result.rows[0];
}
//duplicate check
export const duplicateCheckService = async(user_id,title,author) => {
    const result = await pool.query(
        `SELECT * FROM chapterly_books.books
        WHERE user_id = $1
        AND LOWER(title) = LOWER($2)
        AND LOWER(author) = LOWER($3)`,
        [user_id,title,author]
    )
    return result.rowCount > 0
}

//get all books
export const getBooksService = async (user_id) => {
    const result = await pool.query(
        `SELECT * FROM chapterly_books.books WHERE user_id = $1 ORDER BY created_at DESC`,
        [user_id]
    );
    return result.rows;
}

//get one book
export const getBookByIdService = async (id, user_id) => {
    const result = await pool.query(
        `SELECT * FROM chapterly_books.books WHERE id = $1 AND user_id = $2`,
        [id,user_id]
    );

    return result.rows[0];
}

//update
export const updateBookService = async(id,user_id,data) => {
    const {
        title,
        author,
        genre,
        format,
        language,
        description,
        total_pages,
        cover_image,

        status,
        current_page,
        rating,
        start_date,
        finished_date,
    } = data;

    const result = await pool.query(
        `UPDATE chapterly_books.books
        SET 
            title = $1,
            author = $2,
            genre = $3,
            format = $4,
            language = $5,
            description = $6,
            total_pages = $7,
            cover_image = $8,

            status = $9,
            current_page = $10,
            rating = $11,
            start_date = $12,
            finished_date = $13,
            updated_at=CURRENT_TIMESTAMP
        WHERE id=$14 AND user_id=$15 RETURNING *`,
        [
            title,
            author,
            genre,
            format,
            language,
            description,
            total_pages,
            cover_image,

            status,
            current_page,
            rating,
            start_date,
            finished_date,
            id,
            user_id,
        ]
    )
    return result.rows[0]
}

//delete
export const deleteBookService = async(id, user_id) => {
    const result = await pool.query(
        `DELETE FROM chapterly_books.books WHERE id=$1 AND user_id=$2 RETURNING *`,
        [id,user_id]
    )

    return result.rows[0]
}