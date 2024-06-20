import { tryCatch } from "../utils/common.js";
import ErrorHandler from "../utils/error-utility.js";
import { ProductTransactionTypes } from "../utils/types/product.js";
import Product from "../models/Product.Model.js";

const getProductTransactions = tryCatch(async (req, res, next) => {
  const { month, page, perPage, search } =
    req.query as unknown as ProductTransactionTypes;

  if (!month || !page || !perPage) {
    return next(new ErrorHandler("Required fields are missing", 400));
  }

  let query: any = {};

  if (search) {
    const priceMatch = search.match(/(\d+)/);
    const priceValue = priceMatch ? parseFloat(priceMatch[0]) : null;

    const reg = new RegExp(search.trim().split(/\s+/).join("|"), "i");

    query.$or = [{ title: reg }, { description: reg }];

    if (priceValue) {
      query.$or.push({ price: { $lte: priceValue } });
    }
  }

 
  const [year, monthStr] = month.split("-").map(Number);
  if (!year || !monthStr || monthStr < 1 || monthStr > 12) {
    return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
  }

  const startDate = new Date(Date.UTC(year, monthStr - 1, 1));
  const endDate = new Date(Date.UTC(year, monthStr, 0, 23, 59, 59, 999));

  if (!startDate || !endDate) {
    return next(new ErrorHandler("Something went wrong!", 400));
  }

  query.$or.push({ dateOfSale: { $gte: startDate, $lte: endDate } });

  const skip = (page - 1) * perPage;

  const data = await Product.find(query).skip(skip).limit(perPage);

  return res.status(200).json({
    success: true,
    message: "Transactions fetched",
    data,
  });
});

const getStatistics = tryCatch(async (req, res, next) => {
  const { month } = req.query as { month: string };

  if (!month) {
    return next(new ErrorHandler("Required field is missing", 400));
  }

  let query: any = {};

  
  const [year, monthStr] = month.split("-").map(Number);
  if (!year || !monthStr || monthStr < 1 || monthStr > 12) {
    return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
  }

  const startDate = new Date(Date.UTC(year, monthStr - 1, 1));
  const endDate = new Date(Date.UTC(year, monthStr, 0, 23, 59, 59, 999));

  if (!startDate || !endDate) {
    return next(new ErrorHandler("Something went wrong!", 400));
  }

  query.dateOfSale = { $gte: startDate, $lte: endDate };

  let data = await Product.find(query);

  const amount = data.reduce((total, current) => {
    return total + current.price;
  }, 0);

  const sold = data.reduce((total, current) => {
    return total + (current.sold ? 1 : 0);
  }, 0);

  const notSold = data.reduce((total, current) => {
    return total + (current.sold ? 0 : 1);
  }, 0);

  return res.status(200).json({
    success: true,
    message: "Data fetched",
    data: {
      amount,
      sold,
      notSold,
    },
  });
});

const getPieChartData = tryCatch(async (req, res, next) => {
  const { month } = req.query as { month: string };

  if (!month) {
    return next(new ErrorHandler("Required field is missing", 400));
  }

  
  const [year, monthStr] = month.split("-").map(Number);
  if (!year || !monthStr || monthStr < 1 || monthStr > 12) {
    return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
  }

  const startDate = new Date(Date.UTC(year, monthStr - 1, 1));
  const endDate = new Date(Date.UTC(year, monthStr, 0, 23, 59, 59, 999));

  if (!startDate || !endDate) {
    return next(new ErrorHandler("Something went wrong!", 400));
  }

  const data = await Product.aggregate([
    {
      $match: {
        dateOfSale: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: "Data fetched",
    data,
  });
});

const getBarChartData = tryCatch(async (req, res, next) => {
  const { month } = req.query as { month: string };

  if (!month) {
    return next(new ErrorHandler("Required field is missing", 400));
  }

 
  const [yearStr, monthStr] = month.split("-").map(Number);
  if (!yearStr || !monthStr || monthStr < 1 || monthStr > 12) {
    return next(new ErrorHandler("Invalid month format. Use YYYY-MM", 400));
  }

  const startMonth = monthStr - 1; 


  const data = await Product.aggregate([
    {
      $match: {
        dateOfSale: {
          $gte: new Date(Date.UTC(yearStr, startMonth, 1)),
          $lte: new Date(Date.UTC(yearStr, startMonth + 1, 0, 23, 59, 59, 999)),
        },
      },
    },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901, Infinity],
        default: "901-above",
        output: {
          count: { $sum: 1 },
        },
      },
    },
    {
      $project: {
        _id: 0,
        range: "$_id",
        count: 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    message: "Data fetched",
    data,
  });
});

export { getProductTransactions, getStatistics, getPieChartData, getBarChartData };
