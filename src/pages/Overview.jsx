
import {
  Activity,
  Zap,
  Gauge,
  ShieldCheck
} from "lucide-react";

export default function Overview() {
  return (
    <div className="overview">

      <div className="welcome">
        <div>
          <h2>Vista principal</h2>
          <p>Resumen general del sistema eléctrico.</p>
        </div>
      </div>

      <div className="overview-grid">

        <div className="overview-card">
          <Activity size={23} />
          <h3>Estado del sistema</h3>
          <strong className="green-text">Operativo</strong>
          <p>Todos los sistemas funcionando.</p>
        </div>

        <div className="overview-card">
          <Zap size={23} />
          <h3>Consumo actual</h3>
          <strong>10.3 kW</strong>
          <p>Potencia activa total.</p>
        </div>

        <div className="overview-card">
          <Gauge size={23} />
          <h3>Factor de potencia</h3>
          <strong>0.96</strong>
          <p>Rendimiento eléctrico.</p>
        </div>

        <div className="overview-card">
          <ShieldCheck size={23} />
          <h3>Dispositivos</h3>
          <strong>3 equipos</strong>
          <p>Equipos registrados.</p>
        </div>

      </div>

    </div>
  );
}
