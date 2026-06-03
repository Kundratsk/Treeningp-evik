import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getStats } from '../services/api';

const COLORS = ['#4f46e5', '#e53e3e', '#38a169', '#805ad5'];

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner"> Laadin statistikat...</div>;
  if (!stats) return <div className="empty-state">Statistikat ei leitud.</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}> Statistika</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalWorkouts}</div>
          <div className="stat-label">Treeningut kokku</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Math.round(stats.totalMinutes / 60)}h</div>
          <div className="stat-label">Treeninguid tunde</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalCalories}</div>
          <div className="stat-label">Kalorit põletatud</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.last7Days?.length || 0}</div>
          <div className="stat-label">Viimase 7 päeva treeningut</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Viimase 7 päeva kalorid */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Kalorid viimase 7 päeva</h3>
          {stats.last7Days?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)' }} />
                <Bar dataKey="calories" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Kalorid" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: '2rem' }}>Pole andmeid</div>}
        </div>

        {/* Kategooriate jaotus */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Treeningute jaotus kategooriate kaupa</h3>
          {stats.byCategory?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.byCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                  {stats.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: '2rem' }}>Pole andmeid</div>}
        </div>
      </div>
    </div>
  );
}
