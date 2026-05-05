import pool from "../config/db_config.js"

//create
export const createBookService = async (data) => {
    const {user_id,title,author,status,total_pages} = data;

    const result = await pool.query(
        `INSERT INTO chapterly_books.books (user_id,title,author,status,total_pages)
        VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [user_id,title,author,status,total_pages]
    )

    return result.rows[0];
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
    const {title,author,status,total_pages,current_page} = data;

    const result = await pool.query(
        `UPDATE chapterly_books.books
        SET title=$1, author=$2, status=$3, total_pages=$4, current_page=$5
        WHERE id=$6 AND user_id=$7 RETURNING *`,
        [title, author, status, total_pages, current_page, id, user_id]
    )
    return result.rows[0]
}