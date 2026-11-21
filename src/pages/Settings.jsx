import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  SlidersHorizontal,
  Save,
  ShieldCheck,
  Thermometer,
  Zap,
  Gauge,
  Activity,
  Clock3,
} from "lucide-react";

const ZERO_THRESHOLDS = {
  cell_temperature_max: 0,
  min_state_of_health: 0,
  voltage_imbalance: 0,
  internal_resistance: 0,
  BMS_warning_count: 0,
  refreshInterval: 0,
};

export default function Settings({
  user,
  thresholds = ZERO_THRESHOLDS,
  onChangePassword,
  onSaveThresholds,
}) {
  const isAdmin = user?.role === "Administrador";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(null);

  const [draftThresholds, setDraftThresholds] = useState(null);
  const [alertFeedback, setAlertFeedback] = useState(null);
  const alertForm = draftThresholds ?? thresholds;

  const clearPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setPasswordFeedback(null);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({
        type: "error",
        message: "Completa todos los campos de contraseña.",
      });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFeedback({
        type: "error",
        message: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordFeedback({
        type: "error",
        message: "La nueva contraseña debe ser diferente a la actual.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({
        type: "error",
        message: "Las contraseñas nuevas no coinciden.",
      });
      return;
    }

    try {
      if (onChangePassword) {
        await onChangePassword({
          email: user?.email || "",
          currentPassword,
          newPassword,
        });
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setPasswordFeedback({
        type: "success",
        message: "Tu contraseña se actualizó correctamente.",
      });
    } catch (err) {
      setPasswordFeedback({
        type: "error",
        message: err?.message || "No se pudo actualizar la contraseña.",
      });
    }
  };

  const updateThreshold = (key, rawValue) => {
    const parsed = rawValue === "" ? 0 : Math.max(0, Number(rawValue));
    setDraftThresholds((current) => ({
      ...(current ?? thresholds),
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
    if (alertFeedback) setAlertFeedback(null);
  };

  const resetThresholds = async () => {
    try {
      setDraftThresholds(null);
      if (onSaveThresholds) {
        await onSaveThresholds(ZERO_THRESHOLDS);
      }
      setAlertFeedback({
        type: "success",
        message: "Umbrales BMS restablecidos en 0.",
      });
    } catch (err) {
      setAlertFeedback({
        type: "error",
        message: err?.message || "No se pudieron restablecer los umbrales.",
      });
    }
  };

  const handleThresholdsSubmit = async (event) => {
    event.preventDefault();

    if (alertForm.min_state_of_health > 100) {
      setAlertFeedback({
        type: "error",
        message: "El umbral mínimo de SoH no puede superar 100%.",
      });
      return;
    }

    try {
      if (onSaveThresholds) {
        await onSaveThresholds(alertForm);
      }
      setDraftThresholds(null);

      setAlertFeedback({
        type: "success",
        message: "Umbrales de alerta BMS guardados correctamente.",
      });
    } catch (err) {
      setAlertFeedback({
        type: "error",
        message: err?.message || "No se pudieron guardar los umbrales BMS.",
      });
    }
  };

  return (
    <div className="settings-page">
      <div className="welcome">
        <div>
          <h2>Configuración</h2>
          <p>
            Administra tu cuenta, contraseña y umbrales de seguridad del BMS.
          </p>
        </div>
      </div>

      <div className="admin-grid">
        <section className="form-panel">
          <div className="form-panel-header">
            <div>
              <h3>Mi cuenta y seguridad</h3>
              <p>Consulta tu perfil activo y actualiza tu contraseña.</p>
            </div>
            <div className="stat-icon">
              <KeyRound size={18} />
            </div>
          </div>

          <div className="settings-account-card">
            <div className="avatar settings-avatar">{user?.initials || "US"}</div>
            <div className="settings-account-info">
              <strong>{user?.name || "Usuario"}</strong>
              <span>{user?.email || "Sin correo asignado"}</span>
            </div>
            <span className="employee-role-badge">
              {user?.role || "Empleado"}
            </span>
          </div>

          {passwordFeedback && (
            <div className={`form-feedback is-${passwordFeedback.type}`}>
              {passwordFeedback.type === "success" ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span>{passwordFeedback.message}</span>
            </div>
          )}

          <form
            className="panel-form"
            onSubmit={handlePasswordSubmit}
            noValidate
          >
            <div className="login-field">
              <label htmlFor="settings-current-password">
                Contraseña actual
              </label>
              <div className="login-input-wrap">
                <Lock size={16} />
                <input
                  id="settings-current-password"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Ingresa tu contraseña actual"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordFeedback) setPasswordFeedback(null);
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowCurrent((prev) => !prev)}
                  aria-label={
                    showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-row-two">
              <div className="login-field">
                <label htmlFor="settings-new-password">Nueva contraseña</label>
                <div className="login-input-wrap">
                  <Lock size={16} />
                  <input
                    id="settings-new-password"
                    type={showNew ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordFeedback) setPasswordFeedback(null);
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNew((prev) => !prev)}
                    aria-label={
                      showNew ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="settings-confirm-password">
                  Confirmar contraseña
                </label>
                <div className="login-input-wrap">
                  <Lock size={16} />
                  <input
                    id="settings-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repite la nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordFeedback) setPasswordFeedback(null);
                    }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    aria-label={
                      showConfirm
                        ? "Ocultar confirmación"
                        : "Mostrar confirmación"
                    }
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="ai-reset-button"
                onClick={clearPasswordForm}
              >
                <RotateCcw size={15} /> Limpiar
              </button>

              <button type="submit" className="login-submit form-submit-btn">
                <KeyRound size={16} />
                <span>Actualizar contraseña</span>
              </button>
            </div>
          </form>
        </section>

        {isAdmin ? (
          <section className="form-panel">
            <div className="form-panel-header">
              <div>
                <h3>Umbrales de alerta del BMS</h3>
                <p>
                  Define límites de seguridad térmica, salud SoH y desbalance de
                  celdas para baterías de tracción EV.
                </p>
              </div>
              <div className="stat-icon">
                <SlidersHorizontal size={18} />
              </div>
            </div>

            {alertFeedback && (
              <div className={`form-feedback is-${alertFeedback.type}`}>
                {alertFeedback.type === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{alertFeedback.message}</span>
              </div>
            )}

            <form
              className="panel-form"
              onSubmit={handleThresholdsSubmit}
              noValidate
            >
              <div className="form-row-two">
                <div className="login-field">
                  <label htmlFor="threshold-temp">Temp. máx. de celda</label>
                  <div className="login-input-wrap">
                    <Thermometer size={16} />
                    <input
                      id="threshold-temp"
                      type="number"
                      min="0"
                      step="1"
                      value={alertForm.cell_temperature_max}
                      onChange={(e) =>
                        updateThreshold("cell_temperature_max", e.target.value)
                      }
                    />
                    <span className="settings-unit-tag">°C</span>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="threshold-soh">SoH mínimo de alerta</label>
                  <div className="login-input-wrap">
                    <Activity size={16} />
                    <input
                      id="threshold-soh"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={alertForm.min_state_of_health}
                      onChange={(e) =>
                        updateThreshold("min_state_of_health", e.target.value)
                      }
                    />
                    <span className="settings-unit-tag">%</span>
                  </div>
                </div>
              </div>

              <div className="form-row-two">
                <div className="login-field">
                  <label htmlFor="threshold-imbalance">
                    Desbalance máx. celdas
                  </label>
                  <div className="login-input-wrap">
                    <Zap size={16} />
                    <input
                      id="threshold-imbalance"
                      type="number"
                      min="0"
                      step="1"
                      value={alertForm.voltage_imbalance}
                      onChange={(e) =>
                        updateThreshold("voltage_imbalance", e.target.value)
                      }
                    />
                    <span className="settings-unit-tag">mV</span>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="threshold-resistance">
                    Resistencia interna máx.
                  </label>
                  <div className="login-input-wrap">
                    <Gauge size={16} />
                    <input
                      id="threshold-resistance"
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={alertForm.internal_resistance}
                      onChange={(e) =>
                        updateThreshold("internal_resistance", e.target.value)
                      }
                    />
                    <span className="settings-unit-tag">Ω</span>
                  </div>
                </div>
              </div>

              <div className="form-row-two">
                <div className="login-field">
                  <label htmlFor="threshold-bms">Límite avisos BMS</label>
                  <div className="login-input-wrap">
                    <AlertCircle size={16} />
                    <input
                      id="threshold-bms"
                      type="number"
                      min="0"
                      step="1"
                      value={alertForm.BMS_warning_count}
                      onChange={(e) =>
                        updateThreshold("BMS_warning_count", e.target.value)
                      }
                    />
                    <span className="settings-unit-tag">avisos</span>
                  </div>
                </div>

                <div className="login-field">
                  <label htmlFor="threshold-interval">
                    Intervalo de lectura
                  </label>
                  <div className="login-input-wrap">
                    <Clock3 size={16} />
                    <input
                      id="threshold-interval"
                      type="number"
                      min="0"
                      step="1"
                      value={alertForm.refreshInterval}
                      onChange={(e) =>
                        updateThreshold("refreshInterval", e.target.value)
                      }
                    />
                    <span className="settings-unit-tag">seg</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="ai-reset-button"
                  onClick={resetThresholds}
                >
                  <RotateCcw size={15} /> Dejar en 0
                </button>

                <button type="submit" className="login-submit form-submit-btn">
                  <Save size={16} />
                  <span>Guardar umbrales</span>
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="form-panel">
            <div className="form-panel-header">
              <div>
                <h3>Permisos de cuenta</h3>
                <p>Resumen de accesos habilitados para tu rol actual.</p>
              </div>
              <div className="stat-icon">
                <ShieldCheck size={18} />
              </div>
            </div>

            <ul className="security-tips">
              <li>
                Acceso operativo a Dashboard, Vehículos, Simulación de IA y
                Análisis y resumen.
              </li>
              <li>
                Puedes actualizar tu propia contraseña en cualquier momento
                desde esta pantalla.
              </li>
              <li>
                El alta de vehículos, la gestión de empleados y los umbrales de
                alerta del BMS son administrados únicamente por el rol
                Administrador.
              </li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
