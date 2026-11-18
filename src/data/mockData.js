
import {
  Zap,
  Activity,
  Gauge,
  ChartLine
} from "lucide-react";

export const stats = [
  {
    title: "Voltaje promedio",
    value: "220.4",
    unit: "V",
    icon: Zap,
    change: "↑ 2.4% respecto al anterior"
  },
  {
    title: "Corriente total",
    value: "46.9",
    unit: "A",
    icon: Activity,
    change: "↓ 1.2% respecto al anterior"
  },
  {
    title: "Potencia activa",
    value: "10.3",
    unit: "kW",
    icon: Gauge,
    change: "↑ 4.8% respecto al anterior"
  },
  {
    title: "Factor de potencia",
    value: "0.96",
    unit: "",
    icon: ChartLine,
    change: "Estado óptimo"
  }
];
