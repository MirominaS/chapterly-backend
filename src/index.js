import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db_config.js";
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import thoughtRoutes from "./routes/thoughtRoutes.js"
import quoteRoutes from "./routes/quoteRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import folderRoutes from "./routes/folderRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js"



connectDB();

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)

app.use("/api/books",bookRoutes)

app.use("/api/thoughts",thoughtRoutes)

app.use("/api/quotes",quoteRoutes)

app.use("/api/dashboard", dashboardRoutes)

app.use("/api/folders", folderRoutes);
app.use("/api/media", mediaRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})