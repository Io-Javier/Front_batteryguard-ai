import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Gauge,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

const INITIAL = {
  voltage: 3.1,
  nominalPower: 12,
  temperature: 45,
  outputVoltage: 425,
  resistance: 2.1,
};

const controls = [
  {
    key: "voltage",
    label: "Voltaje (tensión nominal)",
    min: 1,
    max: 6,
    step: 0.1,
    unit: "V",
    minLabel: "1.0 V",
    maxLabel: "6.0 V",
    color: "teal",
  },
  {
    key: "nominalPower",
    label: "Potencia nominal",
    min: 5,
    max: 20,
    step: 1,
    unit: "W",
    minLabel: "5 W",
    maxLabel: "20 W",
    color: "green",
  },
  {
    key: "temperature",
    label: "Temperatura de trabajo",
    min: 20,
    max: 80,
    step: 1,
    unit: "°C",
    minLabel: "20 °C",
    maxLabel: "80 °C",
    color: "amber",
  },
  {
    key: "outputVoltage",
    label: "Voltaje de salida",
    min: 300,
    max: 500,
    step: 1,
    unit: "V",
    minLabel: "300 V",
    maxLabel: "500 V",
    color: "blue",
  },
  {
    key: "resistance",
    label: "Resistencia",
    min: 0.5,
    max: 5,
    step: 0.1,
    unit: "Ω",
    minLabel: "0.5 Ω",
    maxLabel: "5 Ω",
    color: "slate",
  },
];

export default function AISimulation() {
  const [params, setParams] = useState(INITIAL);
  const [hasRun, setHasRun] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [carAnimationKey, setCarAnimationKey] = useState(0);

  const result = useMemo(() => {
    const tempFactor = Math.max(0, params.temperature - 35) * 0.22;
    const voltageDeviation = Math.abs(params.voltage - 3.1) * 2.4;
    const outputFactor = Math.abs(params.outputVoltage - 425) / 20;
    const resistanceFactor = Math.max(0, params.resistance - 2) * 2.8;
    const risk = Math.min(95, Math.max(8, 18 + tempFactor + voltageDeviation + outputFactor + resistanceFactor));
    const life = Math.max(5, Math.min(99, Math.round(100 - risk)));
    const savingMinutes = Math.max(2, Math.round((params.nominalPower * 1.25) + (100 - params.temperature) * 0.08 - params.resistance));
    const efficiency = Math.max(70, Math.min(99.9, 99 - risk * 0.12));
    const estimatedPower = params.nominalPower * (1 + risk / 180);
    const alert = params.temperature >= 65 || params.resistance >= 4.2 || params.voltage >= 5.2;
    return { risk, life, savingMinutes, efficiency, estimatedPower, alert };
  }, [params]);

  const updateParam = (key, value) => {
    setParams((current) => ({ ...current, [key]: value }));
    setHasRun(false);
    setShowRecommendations(false);
  };

  const reset = () => {
    setParams(INITIAL);
    setHasRun(false);
    setShowRecommendations(false);
  };

  const runSimulation = () => {
    setHasRun(true);
    setShowRecommendations(false);
    setCarAnimationKey(prev => prev + 1);
  };

  const recommendations = [];
  if (params.temperature > 55) recommendations.push("Reduce la temperatura de operación: mejora la ventilación y revisa el sistema de refrigeración.");
  if (params.voltage < 2.5 || params.voltage > 4.5) recommendations.push("Verifica que el voltaje nominal se encuentre dentro del rango recomendado por el fabricante.");
  if (params.resistance > 3) recommendations.push("Revisa conexiones y terminales para detectar resistencia elevada o posibles pérdidas eléctricas.");
  if (params.outputVoltage > 460 || params.outputVoltage < 350) recommendations.push("Comprueba el regulador de salida y ajusta el voltaje al rango de operación esperado.");
  if (recommendations.length === 0) recommendations.push("Los parámetros se encuentran en un rango de operación estable. Mantén el monitoreo periódico y realiza mantenimiento preventivo.");

  return (
    <div className="ai-simulation">
      <div className="welcome">
        <div>
          <h2>Simulación y Análisis con IA</h2>
          <p>Predicción del comportamiento energético y evaluación del sistema.</p>
        </div>
        <span className="ai-badge"><Sparkles size={14} /> INTELIGENCIA ARTIFICIAL</span>
      </div>

      <div className="ai-notice">
        <AlertTriangle size={17} />
        <span>Los resultados son estimaciones demostrativas calculadas localmente a partir de los parámetros ingresados; no sustituyen un diagnóstico técnico.</span>
      </div>

      <div className="ai-reference-grid">
        <section className="simulation-panel ai-parameters">
          <div className="ai-section-heading">
            <div>
              <h3>Parámetros de simulación</h3>
              <p>Ajusta los valores para ver cómo afectan el escenario energético.</p>
            </div>
            <Gauge size={21} />
          </div>

          <div className="ai-controls-list">
            {controls.map((control) => (
              <div className={`ai-parameter ai-${control.color}`} key={control.key}>
                <label htmlFor={`ai-${control.key}`}>
                  <span>{control.label}</span>
                  <strong>{params[control.key]} {control.unit}</strong>
                </label>
                <input
                  id={`ai-${control.key}`}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={params[control.key]}
                  onChange={(event) => updateParam(control.key, Number(event.target.value))}
                />
                <div className="ai-range-labels"><span>{control.minLabel}</span><span>{control.maxLabel}</span></div>
              </div>
            ))}
          </div>

          <div className="ai-actions">
            <button type="button" className="ai-reset-button" onClick={reset}>
              <RotateCcw size={15} /> Restablecer
            </button>

            <button type="button" className="run-simulation" onClick={runSimulation}>
              <Sparkles size={16} /> Generar
            </button>
          </div>

          {carAnimationKey > 0 && (
            <div className="ai-car-track" key={carAnimationKey}>
              <div className="ai-moving-car">
                🚗
                <span>⚡</span>
              </div>
              <span className="ai-track-label">
                Generando simulación energética...
              </span>
            </div>
          )}
        </section>

        <section className="simulation-panel ai-prediction-panel">
          <h3><Activity size={18} /> Resultado de la IA</h3>
          <div className={`ai-prediction-alert ${result.alert ? "is-warning" : "is-stable"}`}>
            {result.alert ? <AlertTriangle size={25} /> : <CheckCircle2 size={25} />}
            <div>
              <strong>{result.alert ? "Precaución" : "Operación estable"}</strong>
              <p>{result.alert ? "Se detectan parámetros que podrían elevar el desgaste del sistema. Revisa las recomendaciones." : "Los parámetros actuales muestran un comportamiento dentro del rango de referencia."}</p>
            </div>
          </div>

          <div className="ai-prediction-stats">
            <div className="ai-prediction-stat">
              <span>Predicción de vida útil</span>
              <strong>{result.life}%</strong>
              <small><BatteryCharging size={12} /> {result.life >= 75 ? "Favorable" : "Requiere revisión"}</small>
            </div>
            <div className="ai-prediction-stat">
              <span>Ahorro estimado</span>
              <strong>{result.savingMinutes} min</strong>
              <small><Clock3 size={12} /> Por ciclo de operación</small>
            </div>
            <div className="ai-prediction-stat">
              <span>Precisión estimada</span>
              <strong>{result.efficiency.toFixed(1)}%</strong>
              <small><Activity size={12} /> Indicador del escenario</small>
            </div>
          </div>

          <div className="ai-prediction-extra">
            <div><span>Potencia calculada</span><strong>{result.estimatedPower.toFixed(2)} W</strong></div>
            <div><span>Nivel de riesgo estimado</span><strong>{result.risk.toFixed(1)}%</strong></div>
          </div>

          <button type="button" className="ai-recommendation-button" onClick={() => { setHasRun(true); setShowRecommendations((value) => !value); }}>
            <Sparkles size={15} /> {showRecommendations ? "Ocultar recomendaciones IA" : "Recomendaciones de la IA"}
          </button>
        </section>
      </div>

      {hasRun && (
        <section className="ai-recommendations ai-recommendations-detail">
          <h3><Sparkles size={18} /> Recomendaciones inteligentes</h3>
          <p className="ai-recommendation-intro">{showRecommendations ? "Acciones sugeridas para los valores que configuraste:" : "Simulación ejecutada. Puedes consultar las acciones sugeridas con el botón de recomendaciones."}</p>
          {showRecommendations && (
            <div className="ai-recommendation-list">
              {recommendations.map((recommendation, index) => (
                <div className="ai-recommendation-item" key={recommendation}>
                  <span>{index + 1}</span><p>{recommendation}</p>
                </div>
              ))}
            </div>
          )}
          <small>Simulación local de EnergyControl · Los indicadores no provienen de un modelo de IA conectado.</small>
        </section>
      )}
    </div>
  );
}
