import { useState } from "react";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  UserCheck,
  LogOut,
} from "lucide-react";

const TEMP_PASSWORD = "cambiame1234";

export default function ChangePasswordModal({
  user,
  onSavePassword,
  onLogout,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Completa la nueva contraseña y su confirmación.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword === TEMP_PASSWORD) {
      setError("La nueva contraseña debe ser diferente a la contraseña temporal.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await onSavePassword(newPassword);
    } catch (err) {
      setError(err?.message || "No se pudo guardar la nueva contraseña.");
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h3 id="change-password-title">Cambiar contraseña</h3>
            <p>
              Tu contraseña fue restablecida por un administrador. Define una
              nueva contraseña personal para continuar.
            </p>
          </div>
        </div>

        <div className="selected-employee-banner">
          <UserCheck size={17} />
          <div>
            <strong>{user.name}</strong>
            <span>
              {user.role ? `${user.role} · ` : ""}
              {user.email || "Cuenta de empleado"}
            </span>
          </div>
        </div>

        {error && (
          <div className="form-feedback is-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="panel-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="emp-change-new-password">Nueva contraseña</label>
            <div className="login-input-wrap">
              <Lock size={16} />
              <input
                id="emp-change-new-password"
                type={showNew ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="new-password"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNew((prev) => !prev)}
                aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="emp-change-confirm-password">
              Confirmar nueva contraseña
            </label>
            <div className="login-input-wrap">
              <Lock size={16} />
              <input
                id="emp-change-confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Repite la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((prev) => !prev)}
                aria-label={
                  showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"
                }
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="ai-reset-button"
              onClick={onLogout}
            >
              <LogOut size={15} /> Salir
            </button>

            <button type="submit" className="login-submit form-submit-btn">
              <KeyRound size={16} />
              <span>Guardar contraseña</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
