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