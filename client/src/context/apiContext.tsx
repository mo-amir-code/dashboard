import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import toast from "react-hot-toast";
import { httpAxios } from "../utils/services";
import { TransactionType } from "../utils/types";

interface APIContextType{
    isLoading: boolean,
    fetchTransactions: Function,
    transactions: TransactionType[],
    totalItems: number
}

const APIContextInitialValue:APIContextType = {
    isLoading: false,
    fetchTransactions: () => {},
    transactions: [],
    totalItems: 0
}


const APIContext = createContext<APIContextType>(APIContextInitialValue);


const ApiContextProvider = ({children}:{children:ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);

    const fetchTransactions = useCallback( async ({query}:{query:string}) => {
        try {
            const res = await httpAxios.get(`/api/v1/product/transactions?${query}`);
            if(res?.data?.success){
                const { transactions, totalItems } = res.data.data;
                setTransactions(transactions);
                setTotalItems(totalItems);
            }else{
                toast.error("Something gone wrong!")
            }
        } catch (error) {
            console.error(error);
            toast.error("Error: While fetching transactions");
        }
    }, [httpAxios, toast, transactions, setTransactions]);
    

    return (
        <APIContext.Provider value={{isLoading, fetchTransactions, transactions, totalItems}} >
            {children}
        </APIContext.Provider>
    )
    
}

const useAPIContext = () => useContext(APIContext);

export { ApiContextProvider, useAPIContext }