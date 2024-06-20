import mongoose from "mongoose"
import { ENVIRONMENT, LOCALDBURI, PRODUCTIONDBURI } from "./envVar.js";
import { DEVELOPMENT } from "./constants.js";


export const connectToDB = async () => {
    try {   

        if(mongoose.connection.readyState === 1) return 1;

        await mongoose.connect(ENVIRONMENT === DEVELOPMENT? LOCALDBURI : PRODUCTIONDBURI);
        console.log("Database connected successfully......!");

    } catch (error) {
        console.error(error);
    }
}