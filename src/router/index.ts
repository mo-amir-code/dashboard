import express, { Router } from "express";
import productRouter from "./product.Router.js"

const router: Router = express.Router();

router.use("/product", productRouter);


export default router;