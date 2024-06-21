import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import toast from "react-hot-toast";
import { httpAxios } from "../utils/services";
import { TransactionType } from "../utils/types";

interface APIContextType {
  isLoading: boolean;
  fetchTransactions: Function;
  fetchStatistics: Function;
  fetchBar: Function;
  fetchPie: Function;
  transactions: TransactionType[];
  totalItems: number;
  statistics: StatisticType;
  pie: PieType;
  bar: PieType;
}

export type PieType = {
  labels: string[];
  data: number[];
};

const APIContextInitialValue: APIContextType = {
  isLoading: false,
  fetchTransactions: () => {},
  fetchStatistics: () => {},
  fetchPie: () => {},
  fetchBar: () => {},
  transactions: [],
  totalItems: 0,
  statistics: {
    amount: 0,
    notSold: 0,
    sold: 0,
  },
  pie: {
    labels: [],
    data: [],
  },
  bar: {
    labels: [],
    data: [],
  },
};

type StatisticType = {
  amount: number;
  sold: number;
  notSold: number;
};

const APIContext = createContext<APIContextType>(APIContextInitialValue);

const ApiContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [statistics, setStatistics] = useState<StatisticType>({
    amount: 0,
    notSold: 0,
    sold: 0,
  });
  const [pie, setPie] = useState<PieType>({ data: [], labels: [] });
  const [bar, setBar] = useState<PieType>({ data: [], labels: [] });

  const fetchTransactions = useCallback(
    async ({ query }: { query: string }) => {
      try {
        const res = await httpAxios.get(
          `/api/v1/product/transactions?${query}`
        );
        if (res?.data?.success) {
          const { transactions, totalItems } = res.data.data;
          setTransactions(transactions);
          setTotalItems(totalItems);
        } else {
          toast.error("Something gone wrong!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error: While fetching transactions");
      }
    },
    []
  );

  const fetchStatistics = useCallback(async ({ query }: { query: string }) => {
    try {
      const res = await httpAxios.get(`/api/v1/product/statistics?${query}`);
      if (res?.data?.success) {
        setStatistics(res.data.data);
      } else {
        toast.error("Something gone wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: While fetching transactions");
    }
  }, []);

  const fetchPie = useCallback(async ({ query }: { query: string }) => {
    try {
      const res = await httpAxios.get(`/api/v1/product/pie?${query}`);
      if (res?.data?.success) {
        let data: PieType = {
          data: [],
          labels: [],
        };
        await res?.data?.data?.forEach(
          (item: { category: string; count: number }) => {
            data.labels.push(item.category);
            data.data.push(item.count);
          }
        );
        setPie(data);
      } else {
        toast.error("Something gone wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: While fetching transactions");
    }
  }, []);

  const fetchBar = useCallback(async ({ query }: { query: string }) => {
    try {
      const res = await httpAxios.get(`/api/v1/product/bar?${query}`);
      if (res?.data?.success) {
        let data: PieType = {
          data: [],
          labels: [],
        };
        await res?.data?.data?.forEach(
          ({ count, range }: { count: number; range: number }) => {
            data.labels.push(`${range}-${range + (range === 0 ? 100 : 99)}`);
            data.data.push(count);
          }
        );
        setBar(data);
      } else {
        toast.error("Something gone wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: While fetching transactions");
    }
  }, []);

  return (
    <APIContext.Provider
      value={{
        isLoading,
        fetchTransactions,
        fetchStatistics,
        fetchPie,
        fetchBar,
        bar,
        transactions,
        totalItems,
        statistics,
        pie,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

const useAPIContext = () => useContext(APIContext);

export { ApiContextProvider, useAPIContext };
