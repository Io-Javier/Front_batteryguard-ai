
import { Activity, Zap } from "lucide-react";

export default function PhaseCard({ phase, voltage, current, power, color }) {
  return (
    <div className="phase-card">

      <div className="phase-header">
        <div className="phase-name">
          <span style={{ background: color }} />
          <h3>Fase {phase}</h3>
        </div>
        <Activity size={18} color={color} />
      </div>

      <div className="phase-voltage">
        {voltage}
        <small> V</small>
      </div>

      <div className="phase-details">
        <div>
          <span>Corriente</span>
          <strong>{current} A</strong>
        </div>

        <div>
          <span>Potencia</span>
          <strong>{power} kW</strong>
        </div>
      </div>

    </div>
  );
}
