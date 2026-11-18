import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import Analytics from "./pages/Analytics";
import DevicesPage from "./pages/DevicesPage";
import AISimulation from "./pages/AISimulation";
import "./App.css";

function App() {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="app">

      <Sidebar
        active={active}
        setActive={setActive}
      />

      <main className="main">

        <header className="header">
          <div>
            <div className="breadcrumb">
              ENERGY CONTROL / PANEL
            </div>

            <h2>{active}</h2>
          </div>

          <div className="header-right">
            <span className="status">
              <i />
              Sistema conectado
            </span>

            <div className="avatar">AD</div>
          </div>
        </header>

        <div className="page-content">

          {active === "Dashboard" && <Dashboard />}

          {active === "Vista principal" && <Overview />}

          {active === "Análisis y resumen" && <Analytics />}

          {active === "Listado y filtros" && <DevicesPage />}
          
          {active === "Simulación de IA" && <AISimulation />}

        </div>

        <footer>
          ENERGY CONTROL © 2026
        </footer>

      </main>

    </div>
  );
}

export default App;
