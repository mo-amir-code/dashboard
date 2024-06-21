import BarChart from "./components/BarChart"
import PieChart from "./components/PieChart"
import Statistics from "./components/Statistics"
import Transactions from "./components/Transactions"


const App = () => {

  return (
    <main className="max-w-7xl mx-auto py-8" > 
      <Transactions />
      <Statistics />
      <PieChart />
      <BarChart/>
    </main>
  )
}

export default App
