import pool from "../config/db_config.js"

//create
export const createQuoteService = async(data) => {
    const {
        book_id,
        quote_text,
        page_number,
        chapter,
        speaker,
        comment,
    } = data;

    const result = await pool.query(
        `INSERT INTO chapterly_quotes.quotes 
        (book_id, quote_text, page_number, chapter, speaker, comment)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *`,
        [book_id, quote_text, page_number, chapter, speaker, comment,]
    )

    return result.rows[0];
}