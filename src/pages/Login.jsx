import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  ShieldCheck,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";
import batteryGuardLogo from "../assets/batteryguard-logo.png";

function buildUserProfile(rawEmail) {
  const trimmed = rawEmail.trim();

  if (!trimmed) {
    return {
      name: "Usuario",
      email: "",
      initials: "US",
    };
  }

  const baseName = trimmed.includes("@") ? trimmed.split("@")[0] : trimmed;

  const words = baseName
    .split(/[\s._-]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const formattedName =
    words.length > 0
      ? words
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
      : "Usuario";

  let initials = "US";
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].slice(0, 2).toUpperCase();
  }

  return {
    name: formattedName,
    email: trimmed,
    initials,
  };
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Ingresa tu correo electrónico y contraseña.");
      return;
    }

    setSubmitting(true);
    try {
      await onLogin({
        ...buildUserProfile(trimmedEmail),
        password,
      });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" aria-hidden="true" />

      <div className="login-shell">
        <section className="login-aside">
          <div className="login-brand">
            <img
              src={batteryGuardLogo}
              alt="BatteryGuard"
              className="login-brand-img"
            />
          </div>

          <div className="login-hero">
            <span className="live-badge login-pill">
              <i />
              PLATAFORMA ACTIVA 24/7
            </span>

            <h2>Control inteligente para tu infraestructura energética</h2>
            <p>
              Supervisa consumo eléctrico, estado trifásico, dispositivos
              conectados y simulaciones predictivas con IA desde un solo panel.
            </p>
          </div>

          <div className="login-highlights">
            <div className="login-highlight-item">
              <Activity size={17} />
              <div>
                <strong>Telemetría en tiempo real</strong>
                <span>Voltaje, corriente y factor de potencia al instante.</span>
              </div>
            </div>

            <div className="login-highlight-item">
              <BrainCircuit size={17} />
              <div>
                <strong>Simulación predictiva con IA</strong>
                <span>Proyección de autonomía y optimización de carga.</span>
              </div>
            </div>

            <div className="login-highlight-item">
              <ShieldCheck size={17} />
              <div>
                <strong>Gestión centralizada</strong>
                <span>Diagnóstico rápido de fases y vehículos compatibles.</span>
              </div>
            </div>
          </div>

          <div className="login-aside-footer">BATTERYGUARD v1.0 · © 2026</div>
        </section>

        <section className="login-card">
          <div className="login-card-header">
            <span className="breadcrumb">BATTERYGUARD / ACCESO</span>
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus datos para acceder al panel de monitoreo.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-feedback is-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="login-field">
              <label htmlFor="login-email">Correo electrónico</label>
              <div className="login-input-wrap">
                <Mail size={16} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="login-input-wrap">
                <Lock size={16} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={submitting}
            >
              <span>{submitting ? "Verificando..." : "Ingresar al panel"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-card-footer">
            <span className="status">
              <i />
              Sistema conectado
            </span>
            <small>BATTERYGUARD © 2026</small>
          </div>
        </section>
      </div>
    </div>
  );
}
