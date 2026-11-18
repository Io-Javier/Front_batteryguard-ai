import { stats } from "../data/mockData";
import StatCard from "../components/StatCard";
import Chart from "../components/Chart";
import Phases from "../components/Phases";
import Devices from "../components/Devices";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <div className="welcome">
        <div>
          <h2>Monitoreo eléctrico</h2>
          <p>
            Visualización general del comportamiento eléctrico.
          </p>
        </div>

        <span className="live-badge">
          <i />
          EN VIVO
        </span>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            unit={item.unit}
            icon={item.icon}
            change={item.change}
          />
        ))}
      </div>

      <Chart />
      <Phases />
      <Devices />

    </div>
  );
}
