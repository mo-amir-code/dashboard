import express from "express";
import { PORT } from "./utils/envVar.js";
import { connectToDB } from "./utils/db.js";

const app = express();
connectToDB();



app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}......!`);
});