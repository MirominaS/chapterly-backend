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