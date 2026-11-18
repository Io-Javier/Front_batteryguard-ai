
import {
  Activity,
  Zap,
  TrendingUp,
  Gauge
} from "lucide-react";

import Chart from "../components/Chart";

export default function Analytics() {
  return (
    <div className="analytics">

      <div className="welcome">
        <div>
          <h2>Análisis y estadísticas</h2>
          <p>
            Análisis del comportamiento y rendimiento eléctrico.
          </p>
        </div>
      </div>

      <div className="analytics-grid">

        <div className="analytics-card">
          <Activity />
          <span>Consumo promedio</span>
          <strong>8.6 kW</strong>
          <small>Potencia promedio</small>
        </div>

        <div className="analytics-card">
          <Zap />
          <span>Consumo máximo</span>
          <strong>12.8 kW</strong>
          <small>Demanda máxima</small>
        </div>

        <div className="analytics-card">
          <TrendingUp />
          <span>Energía acumulada</span>
          <strong>245 kWh</strong>
          <small>Consumo registrado</small>
        </div>

        <div className="analytics-card">
          <Gauge />
          <span>Factor de potencia</span>
          <strong>0.96</strong>
          <small>Rendimiento eléctrico</small>
        </div>

      </div>

      <Chart />

    </div>
  );
}
