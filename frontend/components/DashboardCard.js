export default function DashboardCard({ label, value, tone = 'blue' }) {
  const toneClass = {
    blue: 'blue-tone',
    orange: 'orange-tone',
    green: 'green-tone',
    red: 'red-tone'
  }[tone] || 'blue-tone';

  return (
    <div className="stat-card">
      <h3>{label}</h3>
      <div className="stat-value-row">
        <span className="stat-value">{value}</span>
        <span className={`stat-icon ${toneClass}`}>•</span>
      </div>
    </div>
  );
}
