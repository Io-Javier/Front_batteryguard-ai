import PhaseCard from "./PhaseCard";

const emptyBmsBlocks = [
  {
    stage: "Celdas y desbalance",
    primaryValue: "0.00",
    primaryUnit: "V / celda",
    metricOneLabel: "Desbalance",
    metricOneValue: "0 mV",
    metricTwoLabel: "Resistencia interna",
    metricTwoValue: "0.00 Ω",
    color: "#00d6a0",
  },
  {
    stage: "Energía y carga",
    primaryValue: "0.0",
    primaryUnit: "kWh rest.",
    metricOneLabel: "Potencia carga",
    metricOneValue: "0.0 kW",
    metricTwoLabel: "Pérdida capacidad",
    metricTwoValue: "0.0 %",
    color: "#38a5ff",
  },
  {
    stage: "Alertas del BMS",
    primaryValue: "0",
    primaryUnit: "avisos",
    metricOneLabel: "Fallas sensores",
    metricOneValue: "0",
    metricTwoLabel: "Voltaje anormal",
    metricTwoValue: "0",
    color: "#b58aff",
  },
];

export default function Phases({ tests = emptyBmsBlocks }) {
  return (
    <section className="phases-section">

      <div className="section-heading">
        <div>
          <h2>Diagnóstico BMS del paquete</h2>
          <p>Estado por celda, energía restante y contadores de seguridad del BMS</p>
        </div>
      </div>

      <div className="phases-grid">
        {tests.map((test) => (
          <PhaseCard
            key={test.stage}
            {...test}
          />
        ))}
      </div>

    </section>
  );
}
