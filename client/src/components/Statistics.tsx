import { useEffect, useState } from "react";
import { useAPIContext } from "../context/apiContext";
import { months } from "../utils/data";
import { getMonthNumber } from "../utils/services";
import toast from "react-hot-toast";

const Statistics = () => {
  const [month, setMonth] = useState<string>("03");
  const [year, setYear] = useState<string>("2022");
  const { statistics, fetchStatistics } = useAPIContext();

  const handleChangeYear = (value: string) => setYear(value);

  const handleMonthChange = (value: string) => {
    const month = getMonthNumber(value);

    if(!month){
        toast.error("Something went wrong!");
        return;
    }

    setMonth(month);
  };

  useEffect(() => {
    fetchStatistics({ query: `month=${year}-${month}` });
  }, [fetchStatistics, month, year]);
  return (
    <div className="w-full p-3 rounded-lg space-y-4 border">

      <div className="flex items-center">
        <h2 className="font-semibold text-lg">Statistics of : </h2>
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => handleChangeYear(e.target.value)}
            defaultValue={2022}
            className="bg-transparent px-2 py-1 cursor-pointer"
          >
            <option value={2021}>2021</option>
            <option value={2022}>2022</option>
          </select>
          <select
            onChange={(e) => handleMonthChange(e.target.value)}
            defaultValue={"march"}
            className="bg-transparent px-2 py-1 cursor-pointer"
          >
            {months.map((mon: string, idx: number) => (
              <option key={idx} value={mon}>
                {mon.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul>
        <li className="flex items-centers font-medium">
          <span className="w-[30%]">Total sale</span>
          <span className="">{(statistics?.amount).toFixed(2)}</span>
        </li>
        <li className="flex items-centers font-medium">
          <span className="w-[30%]">Total sold items</span>
          <span className="">{statistics?.sold}</span>
        </li>
        <li className="flex items-centers font-medium">
          <span className="w-[30%]">Total not sold items</span>
          <span className="">{statistics?.notSold}</span>
        </li>
      </ul>
    </div>
  );
};

export default Statistics;
