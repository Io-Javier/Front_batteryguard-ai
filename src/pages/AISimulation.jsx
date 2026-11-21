import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Car,
  CheckCircle2,
  Gauge,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const INITIAL_PARAMS = {
  pack_voltage: 0,
  cell_voltage_avg: 3.06,
  state_of_charge: 0,
  depth_of_discharge: 0,
  cell_temperature_max: 0,
  internal_resistance: 0.13,
  cycle_count: 0,
};

const EMPTY_RESULT = {
  state_of_health: 0,
  remaining_capacity: 0,
  charge_efficiency: 0,
  capacity_loss_percent: 0,
  risk: 0,
  alert: false,
  statusTitle: "Sin datos",
  statusMessage:
    "Selecciona un vehículo eléctrico, configura las variables del BMS y ejecuta la simulación para obtener el diagnóstico desde la API.",
  recommendations: [],
};

const controls = [
  {
    key: "pack_voltage",
    label: "Voltaje del paquete (pack_voltage)",
    min: 0,
    max: 850,
    step: 5,
    decimals: 0,
    unit: "V",
    minLabel: "0 V",
    maxLabel: "850 V",
    color: "teal",
  },
  {
    key: "cell_voltage_avg",
    label: "Voltaje promedio de celda",
    min: 3.06,
    max: 3.85,
    step: 0.01,
    decimals: 2,
    unit: "V",
    minLabel: "3.06 V",
    maxLabel: "3.85 V",
    color: "blue",
  },
  {
    key: "state_of_charge",
    label: "Nivel de carga (SoC)",
    min: 0,
    max: 100,
    step: 1,
    decimals: 0,
    unit: "%",
    minLabel: "0 %",
    maxLabel: "100 %",
    color: "green",
  },
  {
    key: "depth_of_discharge",
    label: "Profundidad de descarga (DoD)",
    min: 0,
    max: 100,
    step: 1,
    decimals: 0,
    unit: "%",
    minLabel: "0 %",
    maxLabel: "100 %",
    color: "teal",
  },
  {
    key: "cell_temperature_max",
    label: "Temperatura máxima de celda",
    min: 0,
    max: 80,
    step: 1,
    decimals: 0,
    unit: "°C",
    minLabel: "0 °C",
    maxLabel: "80 °C",
    color: "amber",
  },
  {
    key: "internal_resistance",
    label: "Resistencia interna",
    min: 0.13,
    max: 0.52,
    step: 0.01,
    decimals: 2,
    unit: "Ω",
    minLabel: "0.13 Ω",
    maxLabel: "0.52 Ω",
    color: "slate",
  },
  {
    key: "cycle_count",
    label: "Ciclos de carga acumulados",
    min: 0,
    max: 2000,
    step: 10,
    decimals: 0,
    unit: "ciclos",
    minLabel: "0",
    maxLabel: "2000",
    color: "blue",
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildParamsFromVehicle(vehicle) {
  const source = vehicle?.preset || vehicle;
  if (!source) return INITIAL_PARAMS;

  const next = { ...INITIAL_PARAMS };
  for (const control of controls) {
    const raw = source[control.key];
    if (typeof raw === "number" && !Number.isNaN(raw)) {
      next[control.key] = Number(
        clamp(raw, control.min, control.max).toFixed(control.decimals)
      );
    }
  }
  return next;
}

export default function AISimulation({
  vehicles = [],
  selectedVehicleId = "",
  onSelectVehicle,
  thresholds = null,
  onSimulate,
  onSimulationRecorded,
}) {
  const selectedVehicle = vehicles.find(
    (v) => String(v.id) === String(selectedVehicleId)
  );

  const [params, setParams] = useState(() =>
    buildParamsFromVehicle(selectedVehicle)
  );
  const [result, setResult] = useState(EMPTY_RESULT);
  const [hasRun, setHasRun] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [carAnimationKey, setCarAnimationKey] = useState(0);

  const handleVehicleChange = (nextId) => {
    if (onSelectVehicle) {
      onSelectVehicle(nextId);
    }
    const nextVehicle = vehicles.find((v) => String(v.id) === String(nextId));
    setParams(buildParamsFromVehicle(nextVehicle));
    setResult(EMPTY_RESULT);
    setHasRun(false);
    setError("");
    setShowRecommendations(false);
  };

  const updateParam = (key, value) => {
    setParams((current) => ({ ...current, [key]: value }));
    setHasRun(false);
    setError("");
    setShowRecommendations(false);
  };

  const reset = () => {
    setParams(buildParamsFromVehicle(selectedVehicle));
    setResult(EMPTY_RESULT);
    setHasRun(false);
    setError("");
    setShowRecommendations(false);
    setCarAnimationKey(0);
  };

  const runSimulation = async () => {
    setError("");
    setLoading(true);
    setHasRun(true);
    setShowRecommendations(false);
    setCarAnimationKey((prev) => prev + 1);

    let nextResult = EMPTY_RESULT;

    try {
      if (onSimulate) {
        const apiResult = await onSimulate({
          vehicleId: selectedVehicle?.id ?? null,
          battery_capacity_kwh: selectedVehicle?.battery_capacity_kwh ?? 0,
          ...params,
        });
        if (apiResult) {
          nextResult = { ...EMPTY_RESULT, ...apiResult };
          setResult(nextResult);
        }
      }

      if (onSimulationRecorded) {
        onSimulationRecorded({
          id: Date.now(),
          date: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          vehicleId: selectedVehicle?.id ?? null,
          vehicleLabel: selectedVehicle
            ? `${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.plate})`
            : "Sin vehículo seleccionado",
          pack_voltage: params.pack_voltage,
          state_of_charge: params.state_of_charge,
          cell_temperature_max: params.cell_temperature_max,
          cycle_count: params.cycle_count,
          state_of_health: nextResult.state_of_health,
          status: nextResult.statusTitle,
        });
      }
    } catch (err) {
      setError(err?.message || "Error al ejecutar la simulación con la IA.");
      setHasRun(false);
    } finally {
      setLoading(false);
    }
  };

  const recommendations = result.recommendations || [];

  const maxTempLimit = Number(thresholds?.cell_temperature_max || 0);
  const maxResLimit = Number(thresholds?.internal_resistance || 0);
  const minSohLimit = Number(thresholds?.min_state_of_health || 0);

  const liveBreaches = [];
  if (maxTempLimit > 0 && params.cell_temperature_max >= maxTempLimit) {
    liveBreaches.push(
      `Temp. máx. ${params.cell_temperature_max} °C ≥ ${maxTempLimit} °C`
    );
  }
  if (maxResLimit > 0 && params.internal_resistance >= maxResLimit) {
    liveBreaches.push(
      `Resistencia ${Number(params.internal_resistance).toFixed(2)} Ω ≥ ${maxResLimit.toFixed(2)} Ω`
    );
  }
  if (
    hasRun &&
    minSohLimit > 0 &&
    result.state_of_health > 0 &&
    result.state_of_health < minSohLimit
  ) {
    liveBreaches.push(
      `SoH ${result.state_of_health}% < ${minSohLimit}%`
    );
  }

  const hasLiveWarning = liveBreaches.length > 0;
  const activeLimitsSummary = [
    maxTempLimit > 0 ? `máx. ${maxTempLimit} °C` : null,
    maxResLimit > 0 ? `${maxResLimit.toFixed(2)} Ω` : null,
    minSohLimit > 0 ? `SoH mín. ${minSohLimit}%` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="ai-simulation">
      <div className="welcome welcome-wrap">
        <div>
          <h2>Simulación y Diagnóstico EV con IA</h2>
          <p>
            Evalúa la salud (SoH), degradación y riesgo térmico del paquete de
            batería de tracción usando variables del BMS.
          </p>
        </div>
        <span className="ai-badge">
          <Sparkles size={14} /> INTELIGENCIA ARTIFICIAL
        </span>
      </div>

      <div
        className="ai-notice"
        style={
          !hasLiveWarning && selectedVehicle
            ? {
                borderColor: "rgba(47, 214, 166, 0.28)",
                background: "rgba(47, 214, 166, 0.08)",
                color: "#bfe9dc",
              }
            : undefined
        }
      >
        {hasLiveWarning ? (
          <AlertTriangle size={17} />
        ) : selectedVehicle ? (
          <CheckCircle2 size={17} style={{ color: "#2fd6a6" }} />
        ) : (
          <AlertTriangle size={17} />
        )}
        <span>
          {!selectedVehicle ? (
            "Selecciona un vehículo eléctrico para cargar sus lecturas base del BMS y ejecutar el diagnóstico con IA."
          ) : hasLiveWarning ? (
            <>
              <strong>Alerta preventiva BMS:</strong> los parámetros actuales
              superan los umbrales configurados ({liveBreaches.join(" · ")}).
              Presiona <strong>Generar</strong> para evaluar el riesgo con IA.
            </>
          ) : (
            <>
              Evaluando{" "}
              <strong>
                {selectedVehicle.plate} · {selectedVehicle.brand}{" "}
                {selectedVehicle.model}
              </strong>
              {activeLimitsSummary
                ? ` (umbrales BMS: ${activeLimitsSummary})`
                : ""}
              . El diagnóstico de IA es apoyo técnico y no sustituye inspección
              física.
            </>
          )}
        </span>
      </div>

      <div className="ai-reference-grid">
        <section className="simulation-panel ai-parameters">
          <div className="ai-section-heading">
            <div>
              <h3>Parámetros del BMS</h3>
              <p>
                Selecciona un vehículo del taller y ajusta las lecturas del
                paquete de tracción.
              </p>
            </div>
            <Gauge size={21} />
          </div>

          <div className="ai-vehicle-select-block">
            <label htmlFor="ai-vehicle-select">
              Vehículo eléctrico a evaluar
            </label>
            <div className="login-input-wrap">
              <Car size={16} />
              <select
                id="ai-vehicle-select"
                className="form-select"
                value={selectedVehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
              >
                <option value="">
                  {vehicles.length === 0
                    ? "Sin vehículos registrados"
                    : "Selecciona un vehículo eléctrico..."}
                </option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate} · {vehicle.brand} {vehicle.model} (
                    {vehicle.battery_capacity_kwh} kWh ·{" "}
                    {vehicle.packArchitecture})
                  </option>
                ))}
              </select>
            </div>

            {selectedVehicle && (
              <div className="ai-vehicle-specs">
                <span>
                  Paquete: <strong>{selectedVehicle.batteryType}</strong> (
                  {selectedVehicle.packArchitecture})
                </span>
                <span>
                  Capacidad:{" "}
                  <strong>{selectedVehicle.battery_capacity_kwh} kWh</strong> ·{" "}
                  <strong>{selectedVehicle.cycle_count} ciclos</strong>
                </span>
              </div>
            )}
          </div>

          <div className="ai-controls-list">
            {controls.map((control) => (
              <div
                className={`ai-parameter ai-${control.color}`}
                key={control.key}
              >
                <label htmlFor={`ai-${control.key}`}>
                  <span>{control.label}</span>
                  <strong>
                    {Number(params[control.key]).toFixed(control.decimals)}{" "}
                    {control.unit}
                  </strong>
                </label>
                <input
                  id={`ai-${control.key}`}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={params[control.key]}
                  onChange={(event) =>
                    updateParam(control.key, Number(event.target.value))
                  }
                />
                <div className="ai-range-labels">
                  <span>{control.minLabel}</span>
                  <span>{control.maxLabel}</span>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="form-feedback is-error" style={{ marginTop: 12 }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="ai-actions">
            <button type="button" className="ai-reset-button" onClick={reset}>
              <RotateCcw size={15} /> Restablecer
            </button>

            <button
              type="button"
              className="run-simulation"
              onClick={runSimulation}
              disabled={loading}
            >
              <Sparkles size={16} /> {loading ? "Evaluando..." : "Generar"}
            </button>
          </div>

          {carAnimationKey > 0 && (
            <div className="ai-car-track" key={carAnimationKey}>
              <div className="ai-moving-car">
                🚗
                <span>⚡</span>
              </div>
              <span className="ai-track-label">
                Evaluando paquete de tracción EV...
              </span>
            </div>
          )}
        </section>

        <section className="simulation-panel ai-prediction-panel">
          <h3>
            <Activity size={18} /> Resultado de la IA
          </h3>
          <div
            className={`ai-prediction-alert ${
              result.alert ? "is-warning" : "is-stable"
            }`}
          >
            {result.alert ? (
              <AlertTriangle size={25} />
            ) : (
              <CheckCircle2 size={25} />
            )}
            <div>
              <strong>{result.statusTitle}</strong>
              <p>{result.statusMessage}</p>
            </div>
          </div>

          <div className="ai-prediction-stats">
            <div className="ai-prediction-stat">
              <span>Salud estimada (SoH)</span>
              <strong>{result.state_of_health}%</strong>
              <small>
                <BatteryCharging size={12} /> State of Health
              </small>
            </div>
            <div className="ai-prediction-stat">
              <span>Capacidad restante</span>
              <strong>{result.remaining_capacity.toFixed(1)} kWh</strong>
              <small>
                <Gauge size={12} /> Energía disponible
              </small>
            </div>
            <div className="ai-prediction-stat">
              <span>Eficiencia de carga</span>
              <strong>{result.charge_efficiency.toFixed(1)}%</strong>
              <small>
                <Activity size={12} /> Rendimiento BMS
              </small>
            </div>
          </div>

          <div className="ai-prediction-extra">
            <div>
              <span>Pérdida de capacidad</span>
              <strong>{result.capacity_loss_percent.toFixed(1)}%</strong>
            </div>
            <div>
              <span>Nivel de riesgo BMS</span>
              <strong>{result.risk.toFixed(1)}%</strong>
            </div>
          </div>

          <button
            type="button"
            className="ai-recommendation-button"
            onClick={() => {
              setHasRun(true);
              setShowRecommendations((value) => !value);
            }}
          >
            <Sparkles size={15} />{" "}
            {showRecommendations
              ? "Ocultar recomendaciones IA"
              : "Recomendaciones de la IA"}
          </button>
        </section>
      </div>

      {hasRun && (
        <section className="ai-recommendations ai-recommendations-detail">
          <h3>
            <Sparkles size={18} /> Recomendaciones inteligentes
          </h3>
          <p className="ai-recommendation-intro">
            {recommendations.length > 0
              ? "Acciones sugeridas para el paquete de batería evaluado:"
              : "No hay recomendaciones disponibles todavía. Conecta la API de IA para generar sugerencias."}
          </p>
          {showRecommendations && recommendations.length > 0 && (
            <div className="ai-recommendation-list">
              {recommendations.map((recommendation, index) => (
                <div className="ai-recommendation-item" key={recommendation}>
                  <span>{index + 1}</span>
                  <p>{recommendation}</p>
                </div>
              ))}
            </div>
          )}
          <small>
            {result.modelo
              ? `BatteryGuard · Modelo activo: ${result.modelo}`
              : "BatteryGuard · Servicio de diagnóstico IA conectado."}
          </small>
        </section>
      )}
    </div>
  );
}
