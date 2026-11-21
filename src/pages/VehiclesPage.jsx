import { useState } from "react";
import {
  Search,
  Car,
  BatteryCharging,
  X,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  BrainCircuit,
} from "lucide-react";

const INITIAL_VEHICLE_FORM = {
  plate: "",
  brand: "",
  model: "",
  year: "",
  batteryType: "Li-ion (NMC)",
  packArchitecture: "400 V",
  battery_capacity_kwh: "",
  cycle_count: "0",
  status: "En ingreso",
};

const BATTERY_TYPES = ["Li-ion (NMC)", "LFP (LiFePO4)", "NCA", "Estado sólido"];
const PACK_ARCHITECTURES = ["400 V", "800 V"];
const WORKSHOP_STATUSES = ["En ingreso", "En diagnóstico", "En carga", "Listo"];

function getStatusClass(status) {
  if (status === "Listo") return "online";
  if (status === "En diagnóstico" || status === "En carga") return "warning";
  return "neutral";
}

export default function VehiclesPage({
  vehicles = [],
  userRole = "Empleado",
  onAddVehicle,
  onUpdateVehicleStatus,
  onSelectForDashboard,
  onSelectForAI,
}) {
  const isAdmin = userRole === "Administrador";
  const [form, setForm] = useState(INITIAL_VEHICLE_FORM);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("Todas");
  const [batteryFilter, setBatteryFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const brands = [...new Set(vehicles.map((v) => v.brand))];

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (feedback) setFeedback(null);
  };

  const resetForm = () => {
    setForm(INITIAL_VEHICLE_FORM);
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const plate = form.plate.trim().toUpperCase();
    const brand = form.brand.trim();
    const model = form.model.trim();
    const year = Number(form.year);
    const capacityKwh = Number(form.battery_capacity_kwh);
    const cycleCount = form.cycle_count === "" ? 0 : Number(form.cycle_count);

    if (
      !plate ||
      !brand ||
      !model ||
      !form.year ||
      !form.battery_capacity_kwh
    ) {
      setFeedback({
        type: "error",
        message:
          "Completa los campos obligatorios (incluyendo capacidad energética en kWh).",
      });
      return;
    }

    if (Number.isNaN(year) || year < 2005 || year > 2035) {
      setFeedback({
        type: "error",
        message: "Ingresa un año válido para el vehículo eléctrico.",
      });
      return;
    }

    if (Number.isNaN(capacityKwh) || capacityKwh <= 0) {
      setFeedback({
        type: "error",
        message: "La capacidad energética (kWh) debe ser mayor a 0.",
      });
      return;
    }

    if (Number.isNaN(cycleCount) || cycleCount < 0) {
      setFeedback({
        type: "error",
        message: "Los ciclos de carga no pueden ser negativos.",
      });
      return;
    }

    const exists = vehicles.some(
      (v) => v.plate.toUpperCase() === plate.toUpperCase()
    );
    if (exists) {
      setFeedback({
        type: "error",
        message:
          "Ya existe un vehículo registrado con esa placa. Puedes repetir marca y modelo, pero la placa debe ser única.",
      });
      return;
    }

    const newVehicle = {
      id: Date.now(),
      plate,
      brand,
      model,
      year,
      batteryType: form.batteryType,
      packArchitecture: form.packArchitecture,
      battery_capacity_kwh: capacityKwh,
      cycle_count: cycleCount,
      status: form.status,
    };

    try {
      if (onAddVehicle) {
        await onAddVehicle(newVehicle);
      }

      setForm(INITIAL_VEHICLE_FORM);
      setFeedback({
        type: "success",
        message: `Vehículo ${brand} ${model} (${plate}) registrado correctamente.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err?.message || "No se pudo registrar el vehículo.",
      });
    }
  };

  const handleStatusChange = async (vehicle, nextStatus) => {
    if (!onUpdateVehicleStatus || vehicle.status === nextStatus) return;
    try {
      const updated = await onUpdateVehicleStatus(vehicle.id, nextStatus);
      if (selectedVehicle && selectedVehicle.id === vehicle.id && updated) {
        setSelectedVehicle(updated);
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err?.message || "No se pudo actualizar el estado en taller.",
      });
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const text = search.trim().toLowerCase();

    const matchesSearch =
      !text ||
      vehicle.plate.toLowerCase().includes(text) ||
      vehicle.brand.toLowerCase().includes(text) ||
      vehicle.model.toLowerCase().includes(text) ||
      `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(text);

    const matchesBrand =
      brandFilter === "Todas" || vehicle.brand === brandFilter;

    const matchesBattery =
      batteryFilter === "Todos" || vehicle.batteryType === batteryFilter;

    const matchesStatus =
      statusFilter === "Todos" || vehicle.status === statusFilter;

    return matchesSearch && matchesBrand && matchesBattery && matchesStatus;
  });

  return (
    <div className="devices-page">
      <div className="welcome">
        <div>
          <h2>Vehículos eléctricos del taller</h2>
          <p>
            {isAdmin
              ? "Registra vehículos con su paquete de tracción (kWh, arquitectura de voltaje y ciclos), consulta su ficha y envíalos a diagnóstico BMS o simulación con IA."
              : "Consulta y filtra los vehículos eléctricos asignados al taller, revisa su ficha técnica y envíalos a diagnóstico BMS o simulación con IA."}
          </p>
        </div>
      </div>

      {isAdmin && (
        <section className="form-panel vehicle-register-panel">
        <div className="form-panel-header">
          <div>
            <h3>Registrar vehículo eléctrico</h3>
            <p>
              Ingresa los datos de identificación y las especificaciones del
              paquete de batería de tracción.
            </p>
          </div>
          <div className="stat-icon">
            <Car size={18} />
          </div>
        </div>

        {feedback && (
          <div className={`form-feedback is-${feedback.type}`}>
            {feedback.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form className="panel-form" onSubmit={handleSubmit} noValidate>
          <div className="vehicle-form-grid">
            <div className="login-field">
              <label htmlFor="veh-plate">Placas / VIN</label>
              <div className="login-input-wrap">
                <input
                  id="veh-plate"
                  type="text"
                  placeholder="Ej. EV-402-MX"
                  value={form.plate}
                  onChange={(e) => updateField("plate", e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-brand">Marca</label>
              <div className="login-input-wrap">
                <input
                  id="veh-brand"
                  type="text"
                  placeholder="Ej. Tesla, BYD, Nissan, Kia"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-model">Modelo</label>
              <div className="login-input-wrap">
                <input
                  id="veh-model"
                  type="text"
                  placeholder="Ej. Model 3, Dolphin, EV6"
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-year">Año</label>
              <div className="login-input-wrap">
                <input
                  id="veh-year"
                  type="number"
                  min="2005"
                  max="2035"
                  placeholder="Ej. 2024"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-battery-type">Química de batería</label>
              <div className="login-input-wrap">
                <select
                  id="veh-battery-type"
                  className="form-select"
                  value={form.batteryType}
                  onChange={(e) => updateField("batteryType", e.target.value)}
                >
                  {BATTERY_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-architecture">Arquitectura del paquete</label>
              <div className="login-input-wrap">
                <select
                  id="veh-architecture"
                  className="form-select"
                  value={form.packArchitecture}
                  onChange={(e) =>
                    updateField("packArchitecture", e.target.value)
                  }
                >
                  {PACK_ARCHITECTURES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-capacity">Capacidad energética</label>
              <div className="login-input-wrap">
                <input
                  id="veh-capacity"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Ej. 75"
                  value={form.battery_capacity_kwh}
                  onChange={(e) =>
                    updateField("battery_capacity_kwh", e.target.value)
                  }
                />
                <span className="settings-unit-tag">kWh</span>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-cycles">Ciclos acumulados</label>
              <div className="login-input-wrap">
                <input
                  id="veh-cycles"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={form.cycle_count}
                  onChange={(e) => updateField("cycle_count", e.target.value)}
                />
                <span className="settings-unit-tag">ciclos</span>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="veh-status">Estado en taller</label>
              <div className="login-input-wrap">
                <select
                  id="veh-status"
                  className="form-select"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  {WORKSHOP_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="vehicle-form-actions">
            <button
              type="button"
              className="ai-reset-button"
              onClick={resetForm}
            >
              <RotateCcw size={15} /> Limpiar
            </button>

            <button type="submit" className="login-submit form-submit-btn">
              <Plus size={16} />
              <span>Registrar vehículo</span>
            </button>
          </div>
        </form>
      </section>
      )}

      <div className="device-filters">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por placas, VIN, marca o modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="Todas">Todas las marcas</option>
          {brands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={batteryFilter}
          onChange={(e) => setBatteryFilter(e.target.value)}
        >
          <option value="Todos">Química de batería</option>
          {BATTERY_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          {WORKSHOP_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="devices-table-container">
        <table className="devices-table">
          <thead>
            <tr>
              <th>PLACAS / VIN</th>
              <th>VEHÍCULO</th>
              <th>BATERÍA DE TRACCIÓN</th>
              <th>CAPACIDAD / CICLOS</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>
                  <strong>{vehicle.plate}</strong>
                </td>

                <td>
                  <div className="device-info">
                    <div>
                      <strong>
                        {vehicle.brand} {vehicle.model}
                      </strong>
                      <small>Año {vehicle.year}</small>
                    </div>
                  </div>
                </td>

                <td>
                  {vehicle.batteryType} · {vehicle.packArchitecture}
                </td>

                <td>
                  <strong>{vehicle.battery_capacity_kwh} kWh</strong> ·{" "}
                  {vehicle.cycle_count} ciclos
                </td>

                <td>
                  {onUpdateVehicleStatus ? (
                    <select
                      aria-label={`Estado en taller de ${vehicle.plate}`}
                      className={`device-status ${getStatusClass(vehicle.status)}`}
                      value={vehicle.status}
                      onChange={(e) =>
                        handleStatusChange(vehicle, e.target.value)
                      }
                      style={{
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        outline: "none",
                      }}
                    >
                      {WORKSHOP_STATUSES.map((item) => (
                        <option
                          key={item}
                          value={item}
                          style={{ background: "#0d1f1b", color: "#e8f5f0" }}
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`device-status ${getStatusClass(vehicle.status)}`}
                    >
                      {vehicle.status}
                    </span>
                  )}
                </td>

                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="table-action-btn"
                      onClick={() => setSelectedVehicle(vehicle)}
                    >
                      Ficha
                    </button>

                    {onSelectForDashboard && (
                      <button
                        type="button"
                        className="table-action-btn"
                        onClick={() => onSelectForDashboard(vehicle)}
                      >
                        <LayoutDashboard size={13} />
                        <span>Dashboard</span>
                      </button>
                    )}

                    {onSelectForAI && (
                      <button
                        type="button"
                        className="vehicle-explore"
                        onClick={() => onSelectForAI(vehicle)}
                      >
                        <BrainCircuit size={13} />
                        <span>Evaluar IA</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  {vehicles.length === 0
                    ? isAdmin
                      ? "No hay vehículos eléctricos registrados. Da de alta un vehículo o conecta la API."
                      : "No hay vehículos eléctricos disponibles todavía. Solicita el alta a un administrador o conecta la API."
                    : "No se encontraron vehículos con esos filtros."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="devices-count">
        Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
      </p>

      {selectedVehicle && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="vehicle-sheet-title"
          onClick={() => setSelectedVehicle(null)}
        >
          <div
            className="modal-card"
            style={{ maxWidth: 780, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3
                  id="vehicle-sheet-title"
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <Car size={20} />
                  <span>
                    {selectedVehicle.brand} {selectedVehicle.model} (
                    {selectedVehicle.plate})
                  </span>
                </h3>
                <p>Ficha técnica y estado BMS del paquete de tracción EV</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedVehicle(null)}
                aria-label="Cerrar ficha"
              >
                <X size={18} />
              </button>
            </div>

            <div className="vehicle-details-grid">
              <div>
                <small>Placas / VIN</small>
                <strong>{selectedVehicle.plate}</strong>
              </div>

              <div>
                <small>Año</small>
                <strong>{selectedVehicle.year}</strong>
              </div>

              <div>
                <small>Química de batería</small>
                <strong>{selectedVehicle.batteryType}</strong>
              </div>

              <div>
                <small>Arquitectura</small>
                <strong>{selectedVehicle.packArchitecture}</strong>
              </div>

              <div>
                <small>Capacidad energética</small>
                <strong style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <BatteryCharging size={15} />
                  {selectedVehicle.battery_capacity_kwh} kWh
                </strong>
              </div>

              <div>
                <small>Ciclos acumulados</small>
                <strong>{selectedVehicle.cycle_count} ciclos</strong>
              </div>

              <div>
                <small>Estado en taller</small>
                <strong>
                  <span
                    className={`device-status ${getStatusClass(
                      selectedVehicle.status
                    )}`}
                  >
                    {selectedVehicle.status}
                  </span>
                </strong>
              </div>

              {selectedVehicle.preset && (
                <>
                  <div>
                    <small>Salud estimada (SoH)</small>
                    <strong>
                      {Number(
                        selectedVehicle.preset.state_of_health ??
                          selectedVehicle.preset.battery_health_percent ??
                          0
                      ).toFixed(1)}{" "}
                      %
                    </strong>
                  </div>

                  <div>
                    <small>Carga actual (SoC)</small>
                    <strong>
                      {Number(
                        selectedVehicle.preset.state_of_charge ?? 0
                      ).toFixed(1)}{" "}
                      %
                    </strong>
                  </div>

                  <div>
                    <small>Voltaje paquete / celda</small>
                    <strong>
                      {Number(selectedVehicle.preset.pack_voltage ?? 0).toFixed(
                        1
                      )}{" "}
                      V ·{" "}
                      {Number(
                        selectedVehicle.preset.cell_voltage_avg ?? 0
                      ).toFixed(2)}{" "}
                      V
                    </strong>
                  </div>

                  <div>
                    <small>Temp. máx. celda</small>
                    <strong>
                      {Number(
                        selectedVehicle.preset.cell_temperature_max ?? 0
                      ).toFixed(1)}{" "}
                      °C
                    </strong>
                  </div>

                  <div>
                    <small>Resistencia interna</small>
                    <strong>
                      {Number(
                        selectedVehicle.preset.internal_resistance ?? 0
                      ).toFixed(2)}{" "}
                      Ω
                    </strong>
                  </div>
                </>
              )}
            </div>

            <div
              className="vehicle-form-actions"
              style={{ marginTop: 20, justifyContent: "flex-end" }}
            >
              {onSelectForDashboard && (
                <button
                  type="button"
                  className="ai-reset-button"
                  onClick={() => {
                    onSelectForDashboard(selectedVehicle);
                    setSelectedVehicle(null);
                  }}
                >
                  <LayoutDashboard size={15} /> Ver en Dashboard
                </button>
              )}

              {onSelectForAI && (
                <button
                  type="button"
                  className="login-submit form-submit-btn"
                  onClick={() => {
                    onSelectForAI(selectedVehicle);
                    setSelectedVehicle(null);
                  }}
                >
                  <BrainCircuit size={15} />
                  <span>Evaluar con IA</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
