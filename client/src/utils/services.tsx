import axios from "axios";

export const httpAxios = axios.create({
    baseURL: import.meta.env.VITE_SERVER_ORIGIN
});

export const getMonthNumber = (month:string): string => {
    switch(month){
        case "january": return "01";
        case "february": return "02";
        case "march": return "03";
        case "april": return "04";
        case "may": return "05";
        case "june": return "06";
        case "july": return "07";
        case "august": return "08";
        case "september": return "09";
        case "october": return "10";
        case "november": return "11";
        case "december": return "12";
        default:
            console.error("Invalid month name");
            return ""
    }
}