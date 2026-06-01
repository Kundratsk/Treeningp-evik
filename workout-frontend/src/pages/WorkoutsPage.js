import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../services/api';
import WorkoutForm from '../components/WorkoutForm';

const CATEGORIES = ['', 'Jõud', 'Kardio', 'Venitus', 'Muud'];

function getBadgeClass(category) {
  const map = { 'Jõud': 'badge-joud', 'Kardio': 'badge-kardio', 'Venitus': 'badge-venitus' };
  return map[category] || 'badge-muud';
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [meta, setMeta] = useState({ totalCount: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);
  const [detailWorkout, setDetailWorkout] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getWorkouts({ search, category, sortBy, sortDesc, page, pageSize: 5 });
      setWorkouts(res.data.data);
      setMeta({ totalCount: res.data.totalCount, totalPages: res.data.totalPages, currentPage: res.data.currentPage });
    } catch {
      toast.error('Treeningute laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, sortDesc, page]);

  useEffect(() => { fetchWorkouts(); }, [fetchWorkouts]);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await createWorkout(data);
      toast.success('Treening lisatud! 💪');
      setShowModal(false);
      setPage(1);
      fetchWorkouts();
    } catch (err) {
      toast.error('Lisamine ebaõnnestus');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await updateWorkout(editWorkout.id, data);
      toast.success('Treening uuendatud!');
      setEditWorkout(null);
      fetchWorkouts();
    } catch {
      toast.error('Uuendamine ebaõnnestus');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWorkout(confirmDelete.id);
      toast.success('Treening kustutatud');
      setConfirmDelete(null);
      fetchWorkouts();
    } catch {
      toast.error('Kustutamine ebaõnnestus');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}> Minu Treeningud</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Lisa treening</button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input className="form-control search-input" placeholder="🔍 Otsi treeningut..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
        <select className="form-control" style={{ width: 140 }} value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c || 'Kõik kategooriad'}</option>)}
        </select>
        <select className="form-control" style={{ width: 160 }} value={sortBy}
          onChange={e => setSortBy(e.target.value)}>
          <option value="date">Kuupäev</option>
          <option value="title">Pealkiri</option>
          <option value="duration">Kestus</option>
          <option value="calories">Kalorid</option>
        </select>
        <button className="btn btn-secondary" onClick={() => setSortDesc(d => !d)}>
          {sortDesc ? '↓ Kahanevalt' : '↑ Kasvavalt'}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="spinner"> Laadin...</div>
      ) : workouts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏃</div>
          <p>Treeninguid ei leitud. Lisa esimene treening!</p>
        </div>
      ) : (
        <div className="workout-list">
          {workouts.map(w => (
            <div key={w.id} className="workout-card">
              <div className="workout-info">
                <h3>{w.title}</h3>
                <div className="workout-meta">
                  <span>📅 {new Date(w.date).toLocaleDateString('et-EE')}</span>
                  <span>⏱ {w.durationMinutes} min</span>
                  <span>🔥 {w.caloriesBurned} kcal</span>
                  {w.exercises?.length > 0 && <span>💪 {w.exercises.length} harjutust</span>}
                </div>
                <span className={`badge ${getBadgeClass(w.category)}`} style={{ marginTop: '0.4rem' }}>{w.category}</span>
              </div>
              <div className="workout-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => setDetailWorkout(w)}>Vaata</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditWorkout(w)}>✏️</button>
                <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(w)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" disabled={page === meta.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Kokku {meta.totalCount} treeningut
      </div>

      {/* Lisa treening modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>➕ Lisa uus treening</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <WorkoutForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} loading={formLoading} />
          </div>
        </div>
      )}

      {/* Muuda treening modal */}
      {editWorkout && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditWorkout(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>✏️ Muuda treeningut</h2>
              <button className="modal-close" onClick={() => setEditWorkout(null)}>×</button>
            </div>
            <WorkoutForm
              initial={{
                title: editWorkout.title,
                date: editWorkout.date?.split('T')[0],
                durationMinutes: editWorkout.durationMinutes,
                category: editWorkout.category,
                notes: editWorkout.notes || '',
                caloriesBurned: editWorkout.caloriesBurned,
                exercises: editWorkout.exercises || []
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditWorkout(null)}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Detail vaade */}
      {detailWorkout && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetailWorkout(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{detailWorkout.title}</h2>
              <button className="modal-close" onClick={() => setDetailWorkout(null)}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kuupäev</span><br />{new Date(detailWorkout.date).toLocaleDateString('et-EE')}</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kestus</span><br />{detailWorkout.durationMinutes} minutit</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kategooria</span><br /><span className={`badge ${getBadgeClass(detailWorkout.category)}`}>{detailWorkout.category}</span></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kalorid</span><br />{detailWorkout.caloriesBurned} kcal</div>
            </div>
            {detailWorkout.notes && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>📝 {detailWorkout.notes}</p>}
            {detailWorkout.exercises?.length > 0 && (
              <div className="exercise-list">
                <strong style={{ fontSize: '0.9rem' }}>Harjutused:</strong>
                {detailWorkout.exercises.map(ex => (
                  <div key={ex.id} className="exercise-item">
                    <span>{ex.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{ex.sets}×{ex.reps} @ {ex.weightKg}kg</span>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailWorkout(null)}>Sulge</button>
            </div>
          </div>
        </div>
      )}

      {/* Kustuta kinnitus */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>🗑️ Kustuta treening</h2>
            </div>
            <p>Kas oled kindel, et soovid kustutada treeningut <strong>"{confirmDelete.title}"</strong>? Seda tegevust ei saa tagasi võtta.</p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Tühista</button>
              <button className="btn btn-danger" onClick={handleDelete}>Jah, kustuta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
