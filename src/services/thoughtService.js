import pool from "../config/db_config.js"

//create
export const createThoughtService = async (data) => {
    const {book_id,type,title,content,page_number,mood} = data;

    const result = await pool.query(
        `INSERT INTO chapterly_thoughts.thoughts (book_id,type,title,content,page_number,mood)
        VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [book_id,type,title,content,page_number,mood]
    );
    return result.rows[0];
}

//get by book
export const getThoughtsByBookService = async (book_id) => {
    const result = await pool.query(
        `SELECT * FROM chapterly_thoughts.thoughts WHERE book_id=$1 ORDER BY created_at DESC`,
        [book_id]
    );
    return result.rows;
}

//delete thoughts
export const deleteThoughtService = async(id) => {
    await pool.query(
        `DELETE FROM chapterly_thoughts.thoughts WHERE id=$1`,
        [id]
    );
}