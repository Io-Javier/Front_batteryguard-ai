import { Activity } from "lucide-react";

export default function PhaseCard({
  stage,
  primaryValue,
  primaryUnit,
  metricOneLabel,
  metricOneValue,
  metricTwoLabel,
  metricTwoValue,
  color,
}) {
  return (
    <div className="phase-card">

      <div className="phase-header">
        <div className="phase-name">
          <span style={{ background: color }} />
          <h3>{stage}</h3>
        </div>
        <Activity size={18} color={color} />
      </div>

      <div className="phase-voltage">
        {primaryValue}
        <small> {primaryUnit}</small>
      </div>

      <div className="phase-details">
        <div>
          <span>{metricOneLabel}</span>
          <strong>{metricOneValue}</strong>
        </div>

        <div>
          <span>{metricTwoLabel}</span>
          <strong>{metricTwoValue}</strong>
        </div>
      </div>

    </div>
  );
}
