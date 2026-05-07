import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db_config.js"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import thoughtRoutes from "./routes/thoughtRoutes.js"
import quoteRoutes from "./routes/quoteRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)

app.use("/api/books",bookRoutes)

app.use("/api/thoughts",thoughtRoutes)

app.use("/api/quotes",quoteRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})