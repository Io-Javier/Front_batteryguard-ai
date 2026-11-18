
import {
  LayoutDashboard,
  Home,
  ChartNoAxesCombined,
  List,
  Zap,
  Settings,
  Activity,
  BrainCircuit
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Vista principal", icon: Home },
  { name: "Análisis y resumen", icon: ChartNoAxesCombined },
  { name: "Listado y filtros", icon: List },
  { name: "Simulación de IA", icon: BrainCircuit },
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-logo">
          <Zap size={23} />
        </div>

        <div>
          <h2>BATTERY<span>GUARD</span></h2>
          <small>MONITORING SYSTEM</small>
        </div>
      </div>

      <div className="menu-title">
        MENÚ PRINCIPAL
      </div>

      <nav className="menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`menu-item ${
                active === item.name ? "active" : ""
              }`}
              onClick={() => setActive(item.name)}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">

        <div className="system-status">
          <Activity size={17} />
          <span>Sistema operativo</span>
          <i />
        </div>

        <button className="menu-item">
          <Settings size={18} />
          <span>Configuración</span>
        </button>

        <small>BATTERYGUARD v1.0</small>

      </div>

    </aside>
  );
}
