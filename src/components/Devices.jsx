import { Car, BrainCircuit } from "lucide-react";

function getStatusClass(status) {
  if (status === "Listo") return "online";
  if (status === "En diagnóstico" || status === "En carga") return "warning";
  return "neutral";
}

export default function Devices({
  vehicles = [],
  selectedVehicleId = "",
  onSelectVehicle,
  onEvaluateVehicle,
}) {
  return (
    <section className="devices-section">

      <div className="section-heading">
        <div>
          <h2>Vehículos eléctricos en taller</h2>
          <p>Selecciona un vehículo para visualizar su diagnóstico BMS o evaluarlo con IA</p>
        </div>
      </div>

      <div className="devices-table-container">
        <table className="devices-table">
          <thead>
            <tr>
              <th>VEHÍCULO</th>
              <th>PLACAS / VIN</th>
              <th>BATERÍA DE TRACCIÓN</th>
              <th>CAPACIDAD / CICLOS</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => {
              const isSelected = String(vehicle.id) === String(selectedVehicleId);

              return (
                <tr
                  key={vehicle.id}
                  className={isSelected ? "is-row-selected" : ""}
                >
                  <td>
                    <div className="device-info">
                      <div className="device-icon">
                        <Car size={18} />
                      </div>
                      <div>
                        <strong>{vehicle.brand} {vehicle.model}</strong>
                        <small>Año {vehicle.year}</small>
                      </div>
                    </div>
                  </td>

                  <td>{vehicle.plate}</td>
                  <td>{vehicle.batteryType} · {vehicle.packArchitecture}</td>
                  <td>{vehicle.battery_capacity_kwh} kWh · {vehicle.cycle_count} ciclos</td>

                  <td>
                    <span className={`device-status ${getStatusClass(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>

                  <td>
                    <div className="row-actions">
                      {onSelectVehicle && (
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => onSelectVehicle(vehicle.id)}
                        >
                          {isSelected ? "Seleccionado" : "Monitorear"}
                        </button>
                      )}
                      {onEvaluateVehicle && (
                        <button
                          type="button"
                          className="table-action-btn"
                          onClick={() => onEvaluateVehicle(vehicle)}
                        >
                          <BrainCircuit size={13} />
                          <span>IA</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {vehicles.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  No hay vehículos eléctricos registrados en taller. Agrégalos en el apartado Vehículos o conecta la API.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </section>
  );
}
