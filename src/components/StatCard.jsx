
export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  change
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">
        <span>{title}</span>

        <div className="stat-icon">
          <Icon size={20} />
        </div>
      </div>

      <div className="stat-value">
        {value}
        <small>{unit}</small>
      </div>

      <div className="stat-change">
        {change}
      </div>

    </div>
  );
}
