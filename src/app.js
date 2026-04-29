import express from "express";
import cors from "cors"
import morgan from "morgan";

import routes from "./routes/index.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("dev"))

app.use("/api/v1",routes)

app.get("/", (req,res) => {
    res.send("Chapterly API running")
});

export default app;