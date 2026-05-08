import pool from "../config/db_config.js"

export const getDashboardStatsService = async(user_id) => {
    const result = await pool.query(
        `SELECT COUNT(*) AS total_books,
            COUNT(*) FILTER (
            WHERE status = 'Completed') AS completed_books,
            
            COUNT(*) FILTER (
            WHERE status = 'Ongoing') AS ongoing_books,

            COUNT(*) FILTER (
            WHERE status = 'Not Started') AS not_started_books,

            COUNT(*) FILTER (
            WHERE status = 'Paused') AS paused_books,

            COUNT(*) FILTER (
            WHERE status = 'Dropped') AS dropped_books,

            COALESCE(
                SUM(current_page),0) AS total_pages_read

            FROM chapterly_books.books
            WHERE user_id = $1`,
            [user_id]
    )
    return result.rows[0];
}

export const getRecentBooksService = async(user_id) => {
    const result = await pool.query(
        `SELECT 
            id,title,author,status,current_page,total_pages,updated_at
            FROM chapterly_books.books 
            WHERE user_id = $1 
            ORDER BY updated_at DESC LIMIT 5`,
            [user_id]
    );
    return result.rows;
}

export const getGenreAnalyticsService = async (user_id) => {
    const result = await pool.query(
        `SELECT genre, COUNT(*) AS count
        FROM chapterly_books.books
        WHERE user_id = $1 AND genre IS NOT NULL
        GROUP BY genre
        ORDER BY count DESC`,
        [user_id]
    );
    return result.rows;
}