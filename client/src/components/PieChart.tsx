import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Title,
  Tooltip,
} from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import { useAPIContext } from "../context/apiContext";
import { useEffect, useState } from "react";
import { getMonthNumber } from "../utils/services";
import toast from "react-hot-toast";
import { months } from "../utils/data";

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const [month, setMonth] = useState<string>("03");
  const [year, setYear] = useState<string>("2022");
  const { fetchPie, pie } = useAPIContext();

  const handleChangeYear = (value: string) => setYear(value);

  const handleMonthChange = (value: string) => {
    const month = getMonthNumber(value);

    if (!month) {
      toast.error("Something went wrong!");
      return;
    }

    setMonth(month);
  };

  useEffect(() => {
    fetchPie({ query: `month=${year}-${month}` });
  }, [month, year]);

  return (
    <div className="my-20">
      <div className="flex items-center">
        <h2 className="font-semibold text-lg">Unique Categories : </h2>
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
      <div className="w-[30%] mx-auto ">
        <Pie
          data={{
            labels: pie.labels,
            datasets: [
              {
                label: "Category items",
                data: pie.data,
                backgroundColor: ["red", "cyan", "green", "yellow", "pink"],
                hoverOffset: 4,
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;
