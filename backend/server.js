import express from "express";
import cors from "cors";
import { connectToDatabase }  from "./config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

connectToDatabase();

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
