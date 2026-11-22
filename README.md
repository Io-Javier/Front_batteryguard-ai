# BatteryGuard AI — Frontend

Interfaz web de monitoreo BMS, gestión de vehículos eléctricos, control de roles y simulación predictiva con IA para **BatteryGuard AI** (Proyecto final de Fundamentos de la IA, LITIID-73, UT Cancún).

## URLs en producción

- **Aplicación web (Vercel):** https://batteryguard-ai-front.vercel.app
- **Backend API + IA (Render):** https://batteryguard-ai.onrender.com (Swagger: https://batteryguard-ai.onrender.com/docs)

---

## Versiones exactas y frameworks utilizados

| Tecnología | Versión | Uso |
| :--- | :--- | :--- |
| **Node.js** | `22.16.0` | Entorno de ejecución y build |
| **npm** | `10.9.2` | Gestor de paquetes |
| **React** | `^19.3.1` | Librería de interfaz de usuario |
| **React DOM** | `^19.3.1` | Renderizado web |
| **Vite** | `^8.3.6` | Servidor de desarrollo y empaquetado |
| **Recharts** | `^3.11.0` | Gráficas de telemetría SoC / SoH |
| **Lucide React** | `^1.75.0` | Iconografía de la interfaz |
| **ESLint** | `^10.14.0` | Análisis estático de código |

---

## Dependencias requeridas (`package.json`)

Definidas en [`package.json`](package.json) y bloqueadas en [`package-lock.json`](package-lock.json).

Instalación:

```bash
npm install
```

---

## Variables de entorno necesarias (`.env.example`)

Consulta [`.env.example`](.env.example). Crea un archivo `.env` en la raíz si deseas apuntar a otro backend:

| Variable | Requerida | Valor por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Producción *(opcional en local)* | `http://127.0.0.1:8000` | URL base del backend FastAPI (`https://batteryguard-ai.onrender.com` en Vercel) |

---

## Comandos exactos de arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar servidor de desarrollo (http://localhost:5173)
npm run dev

# 3. Compilar para producción (carpeta dist/)
npm run build

# 4. Validar reglas de ESLint
npm run lint
```

---

## Credenciales de prueba

La autenticación y los roles (`Administrador` y `Empleado`) se validan contra el backend mediante JWT:

- **Administrador inicial:**
  - **Correo:** `admin@batteryguard.ai`
  - **Contraseña:** `admin1234`
- **Restablecimiento de contraseña de empleados:**
  - Contraseña temporal asignada por el Administrador: **`cambiame1234`** (el sistema obliga a cambiarla al iniciar sesión).
- **Permisos por rol:**
  - **Administrador:** acceso total (Dashboard, Vehículos y altas, Simulación de IA, Análisis, Gestión de empleados y restablecimiento de contraseñas, Configuración de umbrales BMS).
  - **Empleado:** consulta de Dashboard y Vehículos, actualización de estado en taller, Simulación de IA, Análisis y cambio de su propia contraseña.
