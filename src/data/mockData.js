import {
  BatteryCharging,
  Activity,
  Zap,
  Thermometer
} from "lucide-react";

export const stats = [
  {
    key: "state_of_charge",
    title: "Nivel de carga (SoC)",
    value: "0",
    unit: "%",
    icon: BatteryCharging,
    change: "Sin datos"
  },
  {
    key: "state_of_health",
    title: "Salud de batería (SoH)",
    value: "0",
    unit: "%",
    icon: Activity,
    change: "Sin datos"
  },
  {
    key: "pack_voltage",
    title: "Voltaje del paquete",
    value: "0.0",
    unit: "V",
    icon: Zap,
    change: "Sin datos"
  },
  {
    key: "cell_temperature_max",
    title: "Temp. máx. de celda",
    value: "0.0",
    unit: "°C",
    icon: Thermometer,
    change: "Sin datos"
  }
];
