import express, { Router } from "express";
import {
  getBarChartData,
  getPieChartData,
  getProductTransactions,
  getStatistics,
} from "../controller/product.controller.js";

const router: Router = express.Router();

router
  .get("/transactions", getProductTransactions)
  .get("/statistics", getStatistics)
  .get("/pie", getPieChartData)
  .get("/bar", getBarChartData);

export default router;