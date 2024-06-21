import { useEffect, useState } from "react";
import { useAPIContext } from "../context/apiContext";
import { PER_PAGE, months } from "../utils/data";
import { TransactionType } from "../utils/types";
import { getMonthNumber } from "../utils/services";
import toast from "react-hot-toast";

const Transactions = () => {
  const [query, setQuery] = useState<string>(
    `month=2022-03&page=1&perPage=${PER_PAGE}`
  );
  const [search, setSearch] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(1);
  const { fetchTransactions, transactions, totalItems } = useAPIContext();

  const handleSearchValueChange = (value: string) => {
    setSearch(value);

    if (value.length === 0) {
      let newQuery: string[] | string = query.split("&");
      const pageIndex = newQuery.findIndex((query) => query.startsWith("page"));
      newQuery[pageIndex] = "page=1";
      newQuery = newQuery.filter((qu) => !qu.startsWith("search"));
      newQuery = newQuery.join("&");
      setQuery(newQuery);
      setPageNo(1);
    }
  };

  const handleChangeYear = (year: string) => {
    let newQuery: string | string[] = query.split("&");
    const searchIndex = newQuery.findIndex((query) =>
      query.startsWith("month")
    );
    const pageIndex = newQuery.findIndex((query) => query.startsWith("page"));

    if (searchIndex === -1 || pageIndex === -1) {
      toast.error("Something went wrong!");
      return;
    }

    newQuery = newQuery.filter((item) => !item.startsWith("search"));
    newQuery[pageIndex] = "page=1";
    let modifyYear: string[] | string = newQuery[searchIndex].split("-");
    modifyYear[0] = year;
    modifyYear = modifyYear.join("-");

    newQuery[searchIndex] = `month=${modifyYear}`;

    newQuery = newQuery.join("&");

    setQuery(newQuery);
    setPageNo(1);
    setSearch(null);
  };

  const handleMonthChange = (month: string) => {
    const monthNumber = getMonthNumber(month);

    if (!monthNumber) {
      toast.error("Something went wrong!");
    }

    let newQuery: string | string[] = query.split("&");
    const searchIndex = newQuery.findIndex((query) =>
      query.startsWith("month")
    );

    const pageIndex = newQuery.findIndex((query) => query.startsWith("page"));

    if (searchIndex === -1 || pageIndex === -1) {
      toast.error("Something went wrong!");
      return;
    }

    newQuery = newQuery.filter((item) => !item.startsWith("search"));

    newQuery[pageIndex] = "page=1";
    let modifyMonth: string[] | string = newQuery[searchIndex].split("-");
    modifyMonth[1] = monthNumber;
    modifyMonth = modifyMonth.join("-");

    newQuery[searchIndex] = modifyMonth;

    newQuery = newQuery.join("&");

    setQuery(newQuery);
    setPageNo(1);
    setSearch(null);
  };

  const handleGetQuery = () => {
    let newQuery: string | string[] = query.split("&");
    const searchIndex = newQuery.findIndex((query) =>
      query.startsWith("search")
    );
    const pageIndex = newQuery.findIndex((query) => query.startsWith("page"));
    if (searchIndex !== -1) {
      newQuery[pageIndex] = "page=1";
      newQuery[searchIndex] = `search=${search}`;
    } else {
      newQuery.push(`search=${search}`);
    }

    newQuery = newQuery.join("&");
    setQuery(newQuery);
    setPageNo(1);
  };

  const handlePageNavigate = ({
    type,
    pageNo,
  }: {
    type: "next" | "prev";
    pageNo: number;
  }) => {
    let newQuery: string | string[] = query.split("&");
    const searchIndex = newQuery.findIndex((query) => query.startsWith("page"));

    if (searchIndex === -1) {
      toast.error("Something went wrong!");
      return;
    }

    setPageNo(pageNo);

    let page: string[] | string = newQuery[searchIndex].split("=");

    if (type === "next") {
      page[1] = `${pageNo}`;
    } else {
      page[1] = `${pageNo}`;
    }

    page = page.join("=");

    newQuery[searchIndex] = page;
    newQuery = newQuery.join("&");
    setQuery(newQuery);
  };

  useEffect(() => {
    fetchTransactions({ query });
  }, [query]);

  return (
    <div className="flex flex-wrap -mx-3 mb-5">
      <div className="w-full max-w-full px-3 mb-6  mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  onChange={(e) => handleSearchValueChange(e.target.value)}
                  className="outline-none p-2 border rounded-lg"
                  placeholder="Search here..."
                  value={search || ""}
                />
                <button
                  onClick={() => handleGetQuery()}
                  className="bg-black text-white font-medium px-3 py-2 rounded-lg"
                >
                  Search
                </button>
              </div>
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
            {/* <!-- end card header --> */}
            {/* <!-- card body  --> */}
            <div className="flex-auto block py-8 pt-6 px-9">
              <div className="overflow-x-auto">
                <table className="w-full my-0 align-middle text-dark border-neutral-200">
                  <thead className="align-bottom">
                    <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                      <th className="pb-3 text-start min-w-[175px]">ID</th>
                      <th className="pb-3 text-end min-w-[100px]">Title</th>
                      <th className="pb-3 text-end min-w-[100px]">
                        Description
                      </th>
                      <th className="pb-3 pr-12 text-end min-w-[175px]">
                        Price
                      </th>
                      <th className="pb-3 pr-12 text-end min-w-[100px]">
                        Category
                      </th>
                      <th className="pb-3 text-end min-w-[50px]">Sold</th>
                      <th className="pb-3 pr-12 text-end min-w-[100px]">
                        Image
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.map((txn: TransactionType) => (
                      <tr
                        key={txn._id}
                        className="border-b border-dashed last:border-b-0"
                      >
                        <td className="p-3 pl-0">{txn.id}</td>
                        <td className="p-3 pr-0 text-end">
                          <span className="font-semibold text-sm text-light-inverse text-md/normal">
                            {txn.title}
                          </span>
                        </td>
                        <td className="p-3 pr-0 text-end text-xs">
                          {txn.description}
                        </td>
                        <td className="p-3 pr-12 text-end">{txn.price}</td>
                        <td className="pr-0 text-start">{txn.category}</td>
                        <td className="p-3 pr-0 text-end">{txn.sold}</td>
                        <td className="p-3 pr-0 text-end">
                          <div className="w-20 h-20">
                            <img src={txn.image} className="w-20 h-20" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="flex px-4 items-start justify-between">
          <span>
            Page: <strong>{pageNo}</strong>
          </span>
          <span className="flex items-center gap-4">
            {pageNo !== 1 && (
              <strong
                onClick={() =>
                  handlePageNavigate({ type: "prev", pageNo: pageNo - 1 })
                }
                className="cursor-pointer"
              >
                {"<--"} Prev
              </strong>
            )}
            {PER_PAGE * pageNo < totalItems && (
              <strong
                onClick={() =>
                  handlePageNavigate({ type: "prev", pageNo: pageNo + 1 })
                }
                className="cursor-pointer"
              >
                Next {"-->"}
              </strong>
            )}
          </span>
          <span>
            Per Page: <strong>{PER_PAGE}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
