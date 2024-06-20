import { FETCHDATAURL } from "./constants.js";
import Product from "../models/Product.Model.js";

const fetchAndInsertProductData = async () => {
    try {
        const data = await (await fetch(FETCHDATAURL)).json();
        await Product.create(data);
        console.log("Product has been created");
    } catch (error) {
        console.error(error);
    }
}

export {fetchAndInsertProductData}