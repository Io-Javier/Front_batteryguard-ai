
import { useState } from "react";
import { Search, Car, BatteryCharging, X } from "lucide-react";

const vehicles = [
  {
    id: 1,
    brand: "Tesla",
    model: "Model 3",
    year: 2020,
    battery: "Li-ion",
    capacity: "75 kWh",
    fastCharge: "Sí",
    range: "491 km",
    connector: "Tipo 2 / CCS",
    power: "250 kW"
  },
  {
    id: 2,
    brand: "Nissan",
    model: "Leaf",
    year: 2019,
    battery: "Li-ion",
    capacity: "40 kWh",
    fastCharge: "Sí",
    range: "270 km",
    connector: "CHAdeMO",
    power: "100 kW"
  },
  {
    id: 3,
    brand: "Chevrolet",
    model: "Bolt EV",
    year: 2020,
    battery: "Li-ion",
    capacity: "66 kWh",
    fastCharge: "Sí",
    range: "417 km",
    connector: "CCS",
    power: "55 kW"
  },
  {
    id: 4,
    brand: "Hyundai",
    model: "Kona Electric",
    year: 2021,
    battery: "Li-ion",
    capacity: "64 kWh",
    fastCharge: "Sí",
    range: "484 km",
    connector: "CCS",
    power: "100 kW"
  },
  {
    id: 5,
    brand: "Renault",
    model: "Zoe",
    year: 2020,
    battery: "Li-ion",
    capacity: "52 kWh",
    fastCharge: "No",
    range: "395 km",
    connector: "Tipo 2",
    power: "50 kW"
  },
  {
    id: 6,
    brand: "BMW",
    model: "i3",
    year: 2019,
    battery: "Li-ion",
    capacity: "42 kWh",
    fastCharge: "Sí",
    range: "310 km",
    connector: "CCS",
    power: "50 kW"
  },
  {
    id: 7,
    brand: "Kia",
    model: "EV6",
    year: 2022,
    battery: "Li-ion",
    capacity: "77.4 kWh",
    fastCharge: "Sí",
    range: "528 km",
    connector: "CCS",
    power: "240 kW"
  }
];

export default function DevicesPage() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("Todas");
  const [year, setYear] = useState("Todos");
  const [fastCharge, setFastCharge] = useState("Todos");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const brands = [...new Set(vehicles.map(v => v.brand))];
  const years = [...new Set(vehicles.map(v => v.year))].sort(
    (a, b) => b - a
  );

  const filteredVehicles = vehicles.filter(vehicle => {
    const text = search.toLowerCase();

    const matchesSearch =
      vehicle.brand.toLowerCase().includes(text) ||
      vehicle.model.toLowerCase().includes(text) ||
      `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(text);

    const matchesBrand =
      brand === "Todas" || vehicle.brand === brand;

    const matchesYear =
      year === "Todos" || vehicle.year.toString() === year;

    const matchesCharge =
      fastCharge === "Todos" ||
      vehicle.fastCharge === fastCharge;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesYear &&
      matchesCharge
    );
  });

  const clearFilters = () => {
    setSearch("");
    setBrand("Todas");
    setYear("Todos");
    setFastCharge("Todos");
  };

  return (
    <div className="devices-page">

      <div className="welcome">
        <div>
          <h2>Vehículos compatibles</h2>
          <p>
            Consulta y filtra los vehículos compatibles con
            nuestro sistema de gestión de energía.
          </p>
        </div>
      </div>

      {/* BUSCADOR Y FILTROS */}

      <div className="device-filters">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar vehículo, marca o modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          value={brand}
          onChange={e => setBrand(e.target.value)}
        >
          <option value="Todas">Todas las marcas</option>

          {brands.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={e => setYear(e.target.value)}
        >
          <option value="Todos">Todos los años</option>

          {years.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={fastCharge}
          onChange={e => setFastCharge(e.target.value)}
        >
          <option value="Todos">Carga rápida</option>
          <option value="Sí">Compatible</option>
          <option value="No">No compatible</option>
        </select>

      </div>

      {/* TABLA DE VEHÍCULOS */}

      <div className="devices-table-container">

        <table className="devices-table">

          <thead>
            <tr>
              <th>MARCA</th>
              <th>MODELO</th>
              <th>AÑO</th>
              <th>BATERÍA</th>
              <th>CAPACIDAD</th>
              <th>CARGA RÁPIDA</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>

          <tbody>
            {filteredVehicles.map(vehicle => (

              <tr key={vehicle.id}>

                <td>
                  <strong>{vehicle.brand}</strong>
                </td>

                <td>{vehicle.model}</td>

                <td>{vehicle.year}</td>

                <td>{vehicle.battery}</td>

                <td>{vehicle.capacity}</td>

                <td>
                  <span className={`device-status ${
                    vehicle.fastCharge === "Sí"
                      ? "online"
                      : "offline"
                  }`}>
                    {vehicle.fastCharge}
                  </span>
                </td>

                <td>
                  <button
                    className="vehicle-explore"
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    Explorar
                  </button>
                </td>

              </tr>
            ))}

            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-state">
                  No se encontraron vehículos compatibles.
                </td>
              </tr>
            )}

          </tbody>
        </table>

      </div>

      <p className="devices-count">
        Mostrando {filteredVehicles.length} de {vehicles.length} vehículos
      </p>

      {/* DETALLES DEL VEHÍCULO */}

      {selectedVehicle && (
        <div className="vehicle-details">

          <div className="vehicle-details-header">
            <div>
              <h3>
                <Car size={20} />
                {selectedVehicle.brand} {selectedVehicle.model}
              </h3>
              <p>Información del vehículo seleccionado</p>
            </div>

            <button
              className="vehicle-close"
              onClick={() => setSelectedVehicle(null)}
              aria-label="Cerrar detalles"
            >
              <X size={20} />
            </button>
          </div>

          <div className="vehicle-details-grid">

            <div>
              <small>Año</small>
              <strong>{selectedVehicle.year}</strong>
            </div>

            <div>
              <small>Tipo de batería</small>
              <strong>{selectedVehicle.battery}</strong>
            </div>

            <div>
              <small>Capacidad</small>
              <strong>{selectedVehicle.capacity}</strong>
            </div>

            <div>
              <small>Autonomía estimada</small>
              <strong>{selectedVehicle.range}</strong>
            </div>

            <div>
              <small>Conector</small>
              <strong>{selectedVehicle.connector}</strong>
            </div>

            <div>
              <small>Potencia de carga</small>
              <strong>{selectedVehicle.power}</strong>
            </div>

            <div>
              <small>Carga rápida</small>
              <strong>
                <BatteryCharging size={16} />
                {selectedVehicle.fastCharge}
              </strong>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
