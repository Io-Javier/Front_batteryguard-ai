import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import VehiclesPage from "./pages/VehiclesPage";
import AISimulation from "./pages/AISimulation";
import AddEmployee from "./pages/AddEmployee";
import Settings from "./pages/Settings";
import ChangePasswordModal from "./components/ChangePasswordModal";
import Login from "./pages/Login";
import { stats as baseStats } from "./data/mockData";
import {
  changePasswordRequest,
  createEmployeeRequest,
  createVehicleRequest,
  getEmployeesRequest,
  getEvaluationsRequest,
  getMeRequest,
  getStoredToken,
  getThresholdsRequest,
  getVehiclesRequest,
  loginRequest,
  resetEmployeePasswordRequest,
  setStoredToken,
  simulateBatteryRequest,
  updateThresholdsRequest,
  updateVehicleStatusRequest,
} from "./services/api";
import "./App.css";

const INITIAL_THRESHOLDS = {
  cell_temperature_max: 0,
  min_state_of_health: 0,
  voltage_imbalance: 0,
  internal_resistance: 0,
  BMS_warning_count: 0,
  refreshInterval: 0,
};

function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return "US";
}

function normalizeUser(apiUser) {
  if (!apiUser) return null;
  const fullName = apiUser.fullName || apiUser.name || "Usuario";
  return {
    id: apiUser.id,
    name: fullName,
    fullName,
    email: apiUser.email || "",
    role: apiUser.role || "Empleado",
    status: apiUser.status || "Activo",
    initials: getInitials(fullName),
    mustChangePassword: Boolean(apiUser.mustChangePassword),
  };
}

function formatNumber(value, decimals = 1) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return decimals === 0 ? "0" : (0).toFixed(decimals);
  }
  return value.toFixed(decimals);
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(() =>
    Boolean(getStoredToken())
  );
  const [active, setActive] = useState("Dashboard");
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [thresholds, setThresholds] = useState(INITIAL_THRESHOLDS);
  const scrollAreaRef = useRef(null);

  const loadWorkspaceData = useCallback(async (role) => {
    const requests = [
      getVehiclesRequest(),
      getEvaluationsRequest(),
      getThresholdsRequest(),
    ];
    if (role === "Administrador") {
      requests.push(getEmployeesRequest());
    }

    const [vehiclesData, evaluationsData, thresholdsData, employeesData] =
      await Promise.all(requests);

    setVehicles(vehiclesData || []);
    setEvaluations(evaluationsData || []);
    if (thresholdsData) {
      setThresholds(thresholdsData);
    }
    if (role === "Administrador") {
      setEmployees(employeesData || []);
    } else {
      setEmployees([]);
    }

    setSelectedVehicleId((currentId) => {
      if (
        currentId &&
        (vehiclesData || []).some((v) => String(v.id) === String(currentId))
      ) {
        return currentId;
      }
      return vehiclesData && vehiclesData.length > 0
        ? String(vehiclesData[0].id)
        : "";
    });
  }, []);

  useEffect(() => {
    if (!getStoredToken()) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const response = await getMeRequest();
        if (cancelled) return;
        const normalized = normalizeUser(response?.user);
        setUser(normalized);
        await loadWorkspaceData(normalized.role);
      } catch {
        if (!cancelled) {
          setStoredToken("");
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadWorkspaceData]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [active]);

  const handleLogin = async ({ email, password }) => {
    const response = await loginRequest({ email, password });
    setStoredToken(response.token);
    const normalized = normalizeUser(response.user);
    setUser(normalized);
    setActive("Dashboard");
    await loadWorkspaceData(normalized.role);
  };

  const handleLogout = () => {
    setStoredToken("");
    setUser(null);
    setEmployees([]);
    setVehicles([]);
    setEvaluations([]);
    setSelectedVehicleId("");
    setThresholds(INITIAL_THRESHOLDS);
    setActive("Dashboard");
  };

  const handleCreateEmployee = async (newEmployee) => {
    const created = await createEmployeeRequest({
      fullName: newEmployee.fullName,
      email: newEmployee.email,
      role: newEmployee.role,
      password: newEmployee.password,
    });
    setEmployees((current) => [created, ...current]);
    return created;
  };

  const handleResetEmployeePassword = async ({ employeeId }) => {
    const response = await resetEmployeePasswordRequest(employeeId);
    const updated = response?.employee;
    if (updated) {
      setEmployees((current) =>
        current.map((emp) => (emp.id === updated.id ? updated : emp))
      );
    }
    return response;
  };

  const handleSaveOwnPassword = async (newPassword) => {
    const response = await changePasswordRequest({ newPassword });
    const updated = normalizeUser(response?.user);
    setUser(updated);
    if (updated?.role === "Administrador") {
      setEmployees((current) =>
        current.map((emp) =>
          emp.id === updated.id
            ? {
                ...emp,
                mustChangePassword: false,
                status: updated.status,
              }
            : emp
        )
      );
    }
  };

  const handleChangePasswordFromSettings = async ({
    currentPassword,
    newPassword,
  }) => {
    const response = await changePasswordRequest({
      currentPassword,
      newPassword,
    });
    if (response?.user) {
      setUser(normalizeUser(response.user));
    }
  };

  const handleAddVehicle = async (newVehicle) => {
    const created = await createVehicleRequest(newVehicle);
    setVehicles((current) => [created, ...current]);
    setSelectedVehicleId(String(created.id));
    return created;
  };

  const handleUpdateVehicleStatus = async (vehicleId, nextStatus) => {
    const updated = await updateVehicleStatusRequest(vehicleId, nextStatus);
    setVehicles((current) =>
      current.map((v) => (v.id === updated.id ? updated : v))
    );
    return updated;
  };

  const handleSaveThresholds = async (nextThresholds) => {
    const saved = await updateThresholdsRequest(nextThresholds);
    setThresholds(saved);
    return saved;
  };

  const handleSelectForDashboard = (vehicle) => {
    setSelectedVehicleId(String(vehicle.id));
    setActive("Dashboard");
  };

  const handleSelectForAI = (vehicle) => {
    setSelectedVehicleId(String(vehicle.id));
    setActive("Simulación de IA");
  };

  const handleSimulate = async (payload) => {
    const response = await simulateBatteryRequest(payload);
    if (response?.evaluation) {
      setEvaluations((current) => [response.evaluation, ...current]);
    }
    if (response?.vehicle) {
      setVehicles((current) =>
        current.map((v) =>
          v.id === response.vehicle.id ? response.vehicle : v
        )
      );
    }
    return response;
  };

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => String(v.id) === String(selectedVehicleId)),
    [vehicles, selectedVehicleId]
  );

  const selectedVehicleEvaluations = useMemo(
    () =>
      selectedVehicleId
        ? evaluations.filter(
            (item) => String(item.vehicleId) === String(selectedVehicleId)
          )
        : evaluations,
    [evaluations, selectedVehicleId]
  );

  const dashboardStats = useMemo(() => {
    if (!selectedVehicle) return baseStats;
    const latest = selectedVehicleEvaluations[0];
    const preset = selectedVehicle.preset || {};

    const soc = latest?.state_of_charge ?? preset.state_of_charge ?? 0;
    const soh =
      latest?.state_of_health ??
      preset.state_of_health ??
      preset.battery_health_percent ??
      0;
    const packV = latest?.pack_voltage ?? preset.pack_voltage ?? 0;
    const tempMax =
      latest?.cell_temperature_max ?? preset.cell_temperature_max ?? 0;

    return baseStats.map((item) => {
      if (item.key === "state_of_charge") {
        return {
          ...item,
          value: formatNumber(Number(soc), 1),
          change: `Capacidad: ${selectedVehicle.battery_capacity_kwh} kWh`,
        };
      }
      if (item.key === "state_of_health") {
        return {
          ...item,
          value: formatNumber(Number(soh), 1),
          change: `Ciclos: ${latest?.cycle_count ?? selectedVehicle.cycle_count}`,
        };
      }
      if (item.key === "pack_voltage") {
        return {
          ...item,
          value: formatNumber(Number(packV), 1),
          change: `Arquitectura: ${selectedVehicle.packArchitecture}`,
        };
      }
      if (item.key === "cell_temperature_max") {
        return {
          ...item,
          value: formatNumber(Number(tempMax), 1),
          change:
            thresholds.cell_temperature_max > 0
              ? `Umbral BMS: ${thresholds.cell_temperature_max} °C`
              : "Sin umbral configurado",
        };
      }
      return item;
    });
  }, [selectedVehicle, selectedVehicleEvaluations, thresholds]);

  const dashboardTests = useMemo(() => {
    if (!selectedVehicle) return undefined;
    const latest = selectedVehicleEvaluations[0];
    const preset = selectedVehicle.preset || {};

    const cellV = latest?.cell_voltage_avg ?? preset.cell_voltage_avg ?? 0;
    const imbalance = preset.voltage_imbalance ?? 0;
    const resistance =
      latest?.internal_resistance ?? preset.internal_resistance ?? 0;
    const remainingCap =
      latest?.remaining_capacity ?? preset.remaining_capacity ?? 0;
    const chargePower = preset.average_charge_power_kw ?? 0;
    const capLoss =
      latest?.capacity_loss_percent ?? preset.capacity_loss_percent ?? 0;
    const bmsWarnings = preset.BMS_warning_count ?? 0;
    const sensorFaults = preset.sensor_fault_count ?? 0;
    const abnormalVoltage = preset.abnormal_voltage_events ?? 0;

    return [
      {
        stage: "Celdas y desbalance",
        primaryValue: formatNumber(Number(cellV), 2),
        primaryUnit: "V / celda",
        metricOneLabel: "Desbalance",
        metricOneValue: `${formatNumber(Number(imbalance), 1)} mV`,
        metricTwoLabel: "Resistencia interna",
        metricTwoValue: `${formatNumber(Number(resistance), 2)} Ω`,
        color: "#00d6a0",
      },
      {
        stage: "Energía y carga",
        primaryValue: formatNumber(Number(remainingCap), 1),
        primaryUnit: "kWh rest.",
        metricOneLabel: "Potencia carga",
        metricOneValue: `${formatNumber(Number(chargePower), 1)} kW`,
        metricTwoLabel: "Pérdida capacidad",
        metricTwoValue: `${formatNumber(Number(capLoss), 1)} %`,
        color: "#38a5ff",
      },
      {
        stage: "Alertas del BMS",
        primaryValue: formatNumber(Number(bmsWarnings), 0),
        primaryUnit: "avisos",
        metricOneLabel: "Fallas sensores",
        metricOneValue: formatNumber(Number(sensorFaults), 0),
        metricTwoLabel: "Voltaje anormal",
        metricTwoValue: formatNumber(Number(abnormalVoltage), 0),
        color: "#b58aff",
      },
    ];
  }, [selectedVehicle, selectedVehicleEvaluations]);

  const chartData = useMemo(() => {
    if (selectedVehicleEvaluations.length > 0) {
      return [...selectedVehicleEvaluations]
        .slice(0, 12)
        .reverse()
        .map((item) => ({
          hora: item.date,
          soc: Number(item.state_of_charge) || 0,
        }));
    }
    if (selectedVehicle?.preset?.state_of_charge != null) {
      const baseSoc = Number(selectedVehicle.preset.state_of_charge) || 0;
      return [{ hora: "Actual", soc: Number(baseSoc.toFixed(1)) }];
    }
    return undefined;
  }, [selectedVehicle, selectedVehicleEvaluations]);

  const analyticsMetrics = useMemo(() => {
    if (selectedVehicleEvaluations.length > 0) {
      const count = selectedVehicleEvaluations.length;
      const avgSoh =
        selectedVehicleEvaluations.reduce(
          (acc, item) => acc + (Number(item.state_of_health) || 0),
          0
        ) / count;
      const avgRem =
        selectedVehicleEvaluations.reduce(
          (acc, item) => acc + (Number(item.remaining_capacity) || 0),
          0
        ) / count;
      const avgPower =
        selectedVehicle?.preset?.average_charge_power_kw ?? 0;

      return {
        averageSoh: `${avgSoh.toFixed(1)} %`,
        remainingCapacity: `${avgRem.toFixed(1)} kWh`,
        averageChargePower: `${Number(avgPower).toFixed(1)} kW`,
      };
    }

    const pool = selectedVehicle ? [selectedVehicle] : vehicles;
    if (pool.length === 0) {
      return {
        averageSoh: "0 %",
        remainingCapacity: "0.0 kWh",
        averageChargePower: "0.0 kW",
      };
    }

    const avgSoh =
      pool.reduce(
        (acc, v) =>
          acc +
          (Number(
            v.preset?.state_of_health ?? v.preset?.battery_health_percent
          ) || 0),
        0
      ) / pool.length;
    const avgRem =
      pool.reduce(
        (acc, v) => acc + (Number(v.preset?.remaining_capacity) || 0),
        0
      ) / pool.length;
    const avgPower =
      pool.reduce(
        (acc, v) => acc + (Number(v.preset?.average_charge_power_kw) || 0),
        0
      ) / pool.length;

    return {
      averageSoh: `${avgSoh.toFixed(1)} %`,
      remainingCapacity: `${avgRem.toFixed(1)} kWh`,
      averageChargePower: `${avgPower.toFixed(1)} kW`,
    };
  }, [selectedVehicle, selectedVehicleEvaluations, vehicles]);

  if (checkingSession) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ maxWidth: 420, margin: "auto" }}>
          <span className="breadcrumb">BATTERYGUARD / SESIÓN</span>
          <h2>Conectando...</h2>
          <p>Verificando sesión con el servidor de BatteryGuard.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
        userRole={user.role}
      />

      <main className="main">
        <header className="header">
          <div>
            <div className="breadcrumb">BATTERYGUARD / PANEL</div>

            <h2>{active}</h2>
          </div>

          <div className="header-right">
            <span className="status">
              <i />
              Sistema conectado
            </span>

            <div className="header-user">
              <div className="user-meta">
                <strong>{user.name}</strong>
                <small>
                  {user.role}
                  {user.email ? ` · ${user.email}` : ""}
                </small>
              </div>

              <div className="avatar" title={user.name}>
                {user.initials}
              </div>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={15} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </header>

        <div className="main-scroll" ref={scrollAreaRef}>
          <div className="page-content">
            {active === "Dashboard" && (
              <Dashboard
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={setSelectedVehicleId}
                onEvaluateVehicle={handleSelectForAI}
                stats={dashboardStats}
                chartData={chartData}
                tests={dashboardTests}
              />
            )}

            {active === "Vehículos" && (
              <VehiclesPage
                vehicles={vehicles}
                userRole={user.role}
                onAddVehicle={
                  user.role === "Administrador" ? handleAddVehicle : undefined
                }
                onUpdateVehicleStatus={handleUpdateVehicleStatus}
                onSelectForDashboard={handleSelectForDashboard}
                onSelectForAI={handleSelectForAI}
              />
            )}

            {active === "Simulación de IA" && (
              <AISimulation
                key={selectedVehicleId || "none"}
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={setSelectedVehicleId}
                thresholds={thresholds}
                onSimulate={handleSimulate}
              />
            )}

            {active === "Análisis y resumen" && (
              <Analytics
                vehicles={vehicles}
                selectedVehicleId={selectedVehicleId}
                onSelectVehicle={setSelectedVehicleId}
                metrics={analyticsMetrics}
                chartData={chartData}
                evaluations={evaluations}
              />
            )}

            {active === "Agregar empleado" &&
              user.role === "Administrador" && (
                <AddEmployee
                  employees={employees}
                  onCreateEmployee={handleCreateEmployee}
                  onResetEmployeePassword={handleResetEmployeePassword}
                />
              )}

            {active === "Configuración" && (
              <Settings
                user={user}
                thresholds={thresholds}
                onChangePassword={handleChangePasswordFromSettings}
                onSaveThresholds={
                  user.role === "Administrador"
                    ? handleSaveThresholds
                    : undefined
                }
              />
            )}
          </div>

          <footer>BATTERYGUARD © 2026</footer>
        </div>
      </main>

      {user.mustChangePassword && (
        <ChangePasswordModal
          user={user}
          onSavePassword={handleSaveOwnPassword}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
