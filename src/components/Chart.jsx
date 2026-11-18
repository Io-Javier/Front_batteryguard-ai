
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const chartData = [
  { hora: "00:00", consumo: 18 },
  { hora: "02:00", consumo: 25 },
  { hora: "04:00", consumo: 20 },
  { hora: "06:00", consumo: 35 },
  { hora: "08:00", consumo: 30 },
  { hora: "10:00", consumo: 48 },
  { hora: "12:00", consumo: 42 },
  { hora: "14:00", consumo: 65 },
  { hora: "16:00", consumo: 55 },
  { hora: "18:00", consumo: 78 },
  { hora: "20:00", consumo: 68 },
  { hora: "22:00", consumo: 85 },
];

export default function Chart() {
  return (
    <div className="chart-container">

      <div className="chart-header">
        <div>
          <h3>Consumo energético</h3>
          <p>Historial de consumo eléctrico</p>
        </div>

        <select defaultValue="today">
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
              dataKey="consumo"
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
