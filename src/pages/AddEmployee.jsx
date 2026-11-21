import { useState } from "react";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
} from "lucide-react";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  role: "Empleado",
  password: "",
  confirmPassword: "",
};

const ROLES = ["Empleado", "Administrador"];
const DEFAULT_RESET_PASSWORD = "cambiame1234";

export default function AddEmployee({
  employees = [],
  onCreateEmployee,
  onResetEmployeePassword,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [listFeedback, setListFeedback] = useState(null);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (feedback) setFeedback(null);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setShowPassword(false);
    setShowConfirm(false);
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim();

    if (!fullName || !email || !form.password || !form.confirmPassword) {
      setFeedback({
        type: "error",
        message: "Completa todos los campos para registrar al empleado.",
      });
      return;
    }

    if (!email.includes("@")) {
      setFeedback({
        type: "error",
        message: "Ingresa un correo electrónico válido.",
      });
      return;
    }

    if (form.password.length < 6) {
      setFeedback({
        type: "error",
        message: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFeedback({
        type: "error",
        message: "Las contraseñas no coinciden.",
      });
      return;
    }

    const exists = employees.some(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      setFeedback({
        type: "error",
        message: "Ya existe un empleado registrado con ese correo.",
      });
      return;
    }

    const newEmployee = {
      id: Date.now(),
      fullName,
      email,
      role: form.role,
      status: "Activo",
      mustChangePassword: false,
    };

    try {
      if (onCreateEmployee) {
        await onCreateEmployee({
          ...newEmployee,
          password: form.password,
        });
      }

      setForm(INITIAL_FORM);
      setShowPassword(false);
      setShowConfirm(false);
      setFeedback({
        type: "success",
        message: `Usuario creado correctamente para ${fullName}.`,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err?.message || "No se pudo crear el empleado.",
      });
    }
  };

  const handleResetEmployee = async (employee) => {
    try {
      let temporaryPassword = DEFAULT_RESET_PASSWORD;
      if (onResetEmployeePassword) {
        const res = await onResetEmployeePassword({
          employeeId: employee.id ?? null,
          email: employee.email,
          temporaryPassword: DEFAULT_RESET_PASSWORD,
        });
        if (res?.temporaryPassword) {
          temporaryPassword = res.temporaryPassword;
        }
      }

      setListFeedback({
        type: "success",
        employeeName: employee.fullName,
        temporaryPassword,
      });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err?.message || "No se pudo restablecer la contraseña.",
      });
    }
  };

  return (
    <div className="employee-page">
      <div className="welcome">
        <div>
          <h2>Agregar empleado</h2>
          <p>
            Crea el usuario y la contraseña de acceso para nuevos integrantes
            del equipo y gestiona sus credenciales.
          </p>
        </div>
      </div>

      <div className="admin-grid">
        <section className="form-panel">
          <div className="form-panel-header">
            <div>
              <h3>Nuevo usuario</h3>
              <p>Define las credenciales de inicio de sesión del empleado.</p>
            </div>
            <div className="stat-icon">
              <UserPlus size={18} />
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
            <div className="login-field">
              <label htmlFor="emp-name">Nombre completo</label>
              <div className="login-input-wrap">
                <User size={16} />
                <input
                  id="emp-name"
                  type="text"
                  placeholder="Ingresa el nombre completo"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="emp-email">Correo electrónico</label>
              <div className="login-input-wrap">
                <Mail size={16} />
                <input
                  id="emp-email"
                  type="email"
                  placeholder="Ingresa el correo electrónico"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="emp-role">Rol del empleado</label>
              <div className="login-input-wrap">
                <Shield size={16} />
                <select
                  id="emp-role"
                  className="form-select"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-two">
              <div className="login-field">
                <label htmlFor="emp-password">Contraseña</label>
                <div className="login-input-wrap">
                  <Lock size={16} />
                  <input
                    id="emp-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="emp-confirm-password">
                  Confirmar contraseña
                </label>
                <div className="login-input-wrap">
                  <Lock size={16} />
                  <input
                    id="emp-confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
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
                onClick={resetForm}
              >
                <RotateCcw size={15} /> Limpiar
              </button>

              <button type="submit" className="login-submit form-submit-btn">
                <UserPlus size={16} />
                <span>Crear empleado</span>
              </button>
            </div>
          </form>
        </section>

        <section className="form-panel">
          <div className="form-panel-header">
            <div>
              <h3>Empleados registrados</h3>
              <p>
                {employees.length}{" "}
                {employees.length === 1
                  ? "usuario registrado"
                  : "usuarios registrados"}
              </p>
            </div>
          </div>

          {listFeedback && (
            <div className="form-feedback is-success">
              <CheckCircle2 size={16} />
              <span>
                Contraseña temporal de <strong>{listFeedback.employeeName}</strong>:{" "}
                <code className="temp-password-code">
                  {listFeedback.temporaryPassword}
                </code>
                . Al iniciar sesión deberá cambiarla.
              </span>
            </div>
          )}

          <div className="devices-table-container">
            <table className="devices-table">
              <thead>
                <tr>
                  <th>EMPLEADO</th>
                  <th>ROL</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id || employee.email}>
                    <td>
                      <div className="device-info">
                        <div>
                          <strong>{employee.fullName}</strong>
                          <small>{employee.email}</small>
                        </div>
                      </div>
                    </td>

                    <td>{employee.role}</td>

                    <td>
                      <span
                        className={`device-status ${
                          employee.mustChangePassword ? "warning" : "online"
                        }`}
                      >
                        {employee.mustChangePassword
                          ? "Cambio pendiente"
                          : employee.status || "Activo"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="table-action-btn"
                        onClick={() => handleResetEmployee(employee)}
                      >
                        <KeyRound size={13} />
                        <span>Restablecer contraseña</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {employees.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No hay empleados registrados. Agrega uno nuevo o conecta
                      la API.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
