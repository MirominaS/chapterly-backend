import pool from '../config/db_config.js'

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM chapterly_users.users WHERE email = $1",
        [email]
    )
    return result.rows[0]
};

export const createUser = async(name,email,password) => {
    const result = await pool.query(
        `INSERT INTO chapterly_users.users (name,email,password)
        VALUES ($1,$2,$3)
        RETURNING id,name,email`,
        [name,email,password]
    )
    return result.rows[0]
}