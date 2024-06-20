import express, { Router } from "express";
import { getProductTransactions } from "../controller/production.controller.js";

const router: Router = express.Router();

router
   .get("/transactions", getProductTransactions)


export default router;