import {
  Activity,
  BatteryCharging,
  Car,
  Gauge,
  Zap,
} from "lucide-react";

import Chart from "../components/Chart";

const defaultMetrics = {
  averageSoh: "0 %",
  remainingCapacity: "0.0 kWh",
  averageChargePower: "0.0 kW",
};

export default function Analytics({
  vehicles = [],
  selectedVehicleId = "",
  onSelectVehicle,
  metrics = defaultMetrics,
  chartData,
  evaluations = [],
}) {
  const selectedVehicle = vehicles.find(
    (v) => String(v.id) === String(selectedVehicleId)
  );

  const filteredEvaluations = selectedVehicleId
    ? evaluations.filter(
        (item) => String(item.vehicleId) === String(selectedVehicleId)
      )
    : evaluations;

  return (
    <div className="analytics">

      <div className="welcome welcome-wrap">
        <div>
          <h2>Análisis y estadísticas BMS</h2>
          <p>
            Resumen histórico de salud (SoH), capacidad restante (kWh) y
            evaluaciones por vehículo eléctrico.
          </p>
        </div>

        <div className="vehicle-selector">
          <Car size={15} />
          <select
            aria-label="Filtrar análisis por vehículo"
            value={selectedVehicleId}
            onChange={(e) =>
              onSelectVehicle && onSelectVehicle(e.target.value)
            }
          >
            <option value="">Todos los vehículos</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate} · {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="analytics-grid">

        <div className="analytics-card">
          <BatteryCharging />
          <span>SoH promedio</span>
          <strong>{metrics.averageSoh}</strong>
          <small>Estado de salud del paquete</small>
        </div>

        <div className="analytics-card">
          <Gauge />
          <span>Capacidad restante</span>
          <strong>{metrics.remainingCapacity}</strong>
          <small>Energía disponible promedio</small>
        </div>

        <div className="analytics-card">
          <Zap />
          <span>Potencia de carga</span>
          <strong>{metrics.averageChargePower}</strong>
          <small>Potencia promedio registrada</small>
        </div>

        <div className="analytics-card">
          <Activity />
          <span>Evaluaciones BMS</span>
          <strong>{filteredEvaluations.length}</strong>
          <small>
            {selectedVehicle
              ? `Pruebas de ${selectedVehicle.plate}`
              : "Diagnósticos registrados"}
          </small>
        </div>

      </div>

      <Chart
        data={chartData}
        title="Tendencia de carga y salud (SoC / SoH)"
        subtitle={
          selectedVehicle
            ? `Histórico de ${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.plate})`
            : "Comportamiento general de los vehículos eléctricos del taller"
        }
      />

      <section className="devices-section">
        <div className="section-heading">
          <div>
            <h2>Historial de evaluaciones</h2>
            <p>Simulaciones BMS y diagnósticos de IA por vehículo</p>
          </div>
        </div>

        <div className="devices-table-container">
          <table className="devices-table">
            <thead>
              <tr>
                <th>HORA</th>
                <th>VEHÍCULO</th>
                <th>VOLTAJE PACK</th>
                <th>SoC / CICLOS</th>
                <th>TEMP. MÁX.</th>
                <th>SoH ESTIMADO</th>
                <th>RESULTADO</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>
                    <strong>{item.vehicleLabel}</strong>
                  </td>
                  <td>{item.pack_voltage} V</td>
                  <td>
                    {item.state_of_charge}% · {item.cycle_count} ciclos
                  </td>
                  <td>{item.cell_temperature_max} °C</td>
                  <td>{item.state_of_health}%</td>
                  <td>
                    <span className="device-status neutral">{item.status}</span>
                  </td>
                </tr>
              ))}

              {filteredEvaluations.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    Sin evaluaciones registradas. Ejecuta una simulación de IA o
                    conecta la API.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
