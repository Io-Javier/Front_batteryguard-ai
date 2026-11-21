import {
  LayoutDashboard,
  Car,
  ChartNoAxesCombined,
  Settings,
  Activity,
  BrainCircuit,
  UserPlus,
  LogOut
} from "lucide-react";
import batteryGuardIcon from "../assets/batteryguard-icon.png";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Vehículos", icon: Car },
  { name: "Simulación de IA", icon: BrainCircuit },
  { name: "Análisis y resumen", icon: ChartNoAxesCombined },
  { name: "Agregar empleado", icon: UserPlus, adminOnly: true },
];

export default function Sidebar({ active, setActive, onLogout, userRole }) {
  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || userRole === "Administrador"
  );

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="brand-logo brand-logo-img-wrap">
          <img
            src={batteryGuardIcon}
            alt="BatteryGuard"
            className="brand-logo-img"
          />
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
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
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

        <button
          type="button"
          className={`menu-item ${
            active === "Configuración" ? "active" : ""
          }`}
          onClick={() => setActive("Configuración")}
        >
          <Settings size={18} />
          <span>Configuración</span>
        </button>

        {onLogout && (
          <button
            type="button"
            className="menu-item logout-menu-item"
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        )}

        <small>BATTERYGUARD v1.0</small>

      </div>

    </aside>
  );
}
