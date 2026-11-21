import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const emptyChartData = [
  { hora: "00:00", soc: 0 },
  { hora: "02:00", soc: 0 },
  { hora: "04:00", soc: 0 },
  { hora: "06:00", soc: 0 },
  { hora: "08:00", soc: 0 },
  { hora: "10:00", soc: 0 },
  { hora: "12:00", soc: 0 },
  { hora: "14:00", soc: 0 },
  { hora: "16:00", soc: 0 },
  { hora: "18:00", soc: 0 },
  { hora: "20:00", soc: 0 },
  { hora: "22:00", soc: 0 },
];

export default function Chart({
  data = emptyChartData,
  title = "Comportamiento del paquete de batería",
  subtitle = "Evolución del nivel de carga (SoC %) y pruebas BMS",
  onRangeChange,
}) {
  const [range, setRange] = useState("today");
  const chartData = data.length > 0 ? data : emptyChartData;

  const handleRangeChange = (event) => {
    const nextRange = event.target.value;
    setRange(nextRange);
    if (onRangeChange) {
      onRangeChange(nextRange);
    }
  };

  return (
    <div className="chart-container">

      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

        <select value={range} onChange={handleRangeChange}>
          <option value="today">Hoy</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mes</option>
        </select>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorConsumo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d6a0" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#00d6a0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1c3932"
            />

            <XAxis
              dataKey="hora"
              stroke="#78918a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#78918a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />

            <Tooltip
              contentStyle={{
                background: "#102722",
                border: "1px solid #1c3932",
                borderRadius: "8px",
                color: "#ffffff"
              }}
            />

            <Area
              type="monotone"
              dataKey="soc"
              name="SoC (%)"
              stroke="#00d6a0"
              strokeWidth={3}
              fill="url(#colorConsumo)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
