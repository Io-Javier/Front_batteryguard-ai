
import PhaseCard from "./PhaseCard";

const phases = [
  {
    phase: "L1",
    voltage: "220.4",
    current: "15.2",
    power: "3.35",
    color: "#00d6a0"
  },
  {
    phase: "L2",
    voltage: "219.8",
    current: "16.1",
    power: "3.54",
    color: "#38a5ff"
  },
  {
    phase: "L3",
    voltage: "221.1",
    current: "15.6",
    power: "3.45",
    color: "#b58aff"
  }
];

export default function Phases() {
  return (
    <section className="phases-section">

      <div className="section-heading">
        <div>
          <h2>Parámetros por fase</h2>
          <p>Distribución eléctrica trifásica</p>
        </div>
      </div>

      <div className="phases-grid">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.phase}
            {...phase}
          />
        ))}
      </div>

    </section>
  );
}
