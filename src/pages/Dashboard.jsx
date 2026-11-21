import { Car, BrainCircuit } from "lucide-react";
import { stats as initialStats } from "../data/mockData";
import StatCard from "../components/StatCard";
import Chart from "../components/Chart";
import Phases from "../components/Phases";
import Devices from "../components/Devices";

export default function Dashboard({
  vehicles = [],
  selectedVehicleId = "",
  onSelectVehicle,
  onEvaluateVehicle,
  stats = initialStats,
  chartData,
  tests,
}) {
  const selectedVehicle = vehicles.find(
    (v) => String(v.id) === String(selectedVehicleId)
  );

  const displayStats = stats.map((item) => {
    if (!selectedVehicle) return item;
    if (item.key === "pack_voltage") {
      return {
        ...item,
        change: `Arquitectura: ${selectedVehicle.packArchitecture}`,
      };
    }
    if (item.key === "state_of_charge") {
      return {
        ...item,
        change: `Capacidad: ${selectedVehicle.battery_capacity_kwh} kWh`,
      };
    }
    if (item.key === "state_of_health") {
      return {
        ...item,
        change: `Ciclos: ${selectedVehicle.cycle_count}`,
      };
    }
    return item;
  });

  return (
    <div className="dashboard">

      <div className="welcome welcome-wrap">
        <div>
          <h2>Monitoreo de baterías EV</h2>
          <p>
            Indicadores BMS, voltaje del paquete y estado térmico de vehículos
            eléctricos en taller.
          </p>
        </div>

        <div className="dashboard-toolbar">
          <div className="vehicle-selector">
            <Car size={15} />
            <select
              aria-label="Seleccionar vehículo a monitorear"
              value={selectedVehicleId}
              onChange={(e) =>
                onSelectVehicle && onSelectVehicle(e.target.value)
              }
            >
              <option value="">
                {vehicles.length === 0
                  ? "Sin vehículos registrados"
                  : "Seleccionar vehículo..."}
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate} · {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>
          </div>

          <span className="live-badge">
            <i />
            EN ESPERA
          </span>
        </div>
      </div>

      {selectedVehicle && (
        <div className="active-vehicle-banner">
          <div className="active-vehicle-info">
            <div className="device-icon">
              <Car size={18} />
            </div>
            <div>
              <strong>
                {selectedVehicle.brand} {selectedVehicle.model} (
                {selectedVehicle.year}) · {selectedVehicle.plate}
              </strong>
              <span>
                Paquete {selectedVehicle.batteryType} (
                {selectedVehicle.packArchitecture}) ·{" "}
                {selectedVehicle.battery_capacity_kwh} kWh ·{" "}
                {selectedVehicle.cycle_count} ciclos · Estado:{" "}
                {selectedVehicle.status}
              </span>
            </div>
          </div>

          {onEvaluateVehicle && (
            <button
              type="button"
              className="vehicle-explore"
              onClick={() => onEvaluateVehicle(selectedVehicle)}
            >
              <BrainCircuit size={14} />
              <span>Evaluar con IA</span>
            </button>
          )}
        </div>
      )}

      <div className="stats-grid">
        {displayStats.map((item) => (
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

      <Chart
        data={chartData}
        subtitle={
          selectedVehicle
            ? `Telemetría BMS de ${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.plate})`
            : "Selecciona un vehículo eléctrico para consultar su evolución de SoC (%)"
        }
      />

      <Phases tests={tests} />

      <Devices
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={onSelectVehicle}
        onEvaluateVehicle={onEvaluateVehicle}
      />

    </div>
  );
}
