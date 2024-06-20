import express from "express";
import { PORT } from "./utils/envVar.js";
import { connectToDB } from "./utils/db.js";
import routers from "./router/index.js"
import cors from "cors";
import { errorHandler } from "./utils/common.js";
import { fetchAndInsertProductData } from "./utils/services.js";

const app = express();
connectToDB();
// fetchAndInsertProductData();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", routers);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}......!`);
});