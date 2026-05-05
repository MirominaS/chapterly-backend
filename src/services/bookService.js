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