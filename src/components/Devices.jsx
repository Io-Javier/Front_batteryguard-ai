
import { Monitor, Lightbulb, Fan, MoreVertical } from "lucide-react";

const devices = [
  {
    name: "Motor principal",
    type: "Motor industrial",
    power: "4.5 kW",
    current: "15.2 A",
    status: "Activo",
    icon: Monitor
  },
  {
    name: "Iluminación",
    type: "Sistema de iluminación",
    power: "2.1 kW",
    current: "9.5 A",
    status: "Activo",
    icon: Lightbulb
  },
  {
    name: "Sistema HVAC",
    type: "Climatización",
    power: "3.7 kW",
    current: "16.8 A",
    status: "Revisión",
    icon: Fan
  }
];

export default function Devices() {
  return (
    <section className="devices-section">

      <div className="section-heading">
        <div>
          <h2>Dispositivos eléctricos</h2>
          <p>Estado y consumo de los equipos conectados</p>
        </div>
      </div>

      <div className="devices-table-container">
        <table className="devices-table">
          <thead>
            <tr>
              <th>DISPOSITIVO</th>
              <th>POTENCIA</th>
              <th>CORRIENTE</th>
              <th>ESTADO</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {devices.map((device) => {
              const Icon = device.icon;

              return (
                <tr key={device.name}>
                  <td>
                    <div className="device-info">
                      <div className="device-icon">
                        <Icon size={18} />
                      </div>
                      <div>
                        <strong>{device.name}</strong>
                        <small>{device.type}</small>
                      </div>
                    </div>
                  </td>

                  <td>{device.power}</td>
                  <td>{device.current}</td>

                  <td>
                    <span className={`device-status ${
                      device.status === "Activo" ? "online" : "warning"
                    }`}>
                      {device.status}
                    </span>
                  </td>

                  <td>
                    <MoreVertical size={18} color="#78918a" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </section>
  );
}
