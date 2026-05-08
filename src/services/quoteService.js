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

//get quotes by books
export const getQuotesByBookService = async(book_id) => {
    const result = await pool.query(
        `SELECT * FROM chapterly_quotes.quotes WHERE 
        book_id = $1 ORDER BY created_at DESC`,
        [book_id]
    )
    return result.rows;
}

//update
export const updateQuoteService = async (id, data) => {
    const {
        quote_text,
        page_number,
        chapter,
        speaker,
        comment,
    } = data;

    const result = await pool.query(
        `UPDATE chapterly_quotes.quotes SET
        quote_text = $1,
        page_number = $2,
        chapter = $3,
        speaker = $4,
        comment = $5 WHERE id = $6 RETURNING *`,
        [   quote_text,
            page_number,
            chapter,
            speaker,
            comment,
            id,]
    )
    return result.rows[0];
}

//delete
export const deleteQuoteService = async (id) => {
    const result = await pool.query(
        `DELETE FROM chapterly_quotes.quotes
            WHERE id = $1
            AND book_id IN (
            SELECT id FROM chapterly_books.books WHERE user_id = $2
            )
            RETURNING *
            `,
        [id, user_id]
    )

    return result.rows[0]
}