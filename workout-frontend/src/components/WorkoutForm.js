import { useState } from 'react';

const CATEGORIES = ['Jõud', 'Kardio', 'Venitus', 'Muud'];

const emptyForm = {
  title: '',
  date: new Date().toISOString().split('T')[0],
  durationMinutes: '',
  category: 'Jõud',
  notes: '',
  caloriesBurned: '',
  exercises: []
};

export default function WorkoutForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weightKg: '' });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Pealkiri on kohustuslik';
    if (!form.date) e.date = 'Kuupäev on kohustuslik';
    if (!form.durationMinutes || form.durationMinutes < 1) e.durationMinutes = 'Kestus peab olema vähemalt 1 min';
    if (!form.category) e.category = 'Kategooria on kohustuslik';
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: undefined }));
  };

  const addExercise = () => {
    if (!newExercise.name.trim()) return;
    setForm(f => ({
      ...f,
      exercises: [...f.exercises, {
        name: newExercise.name,
        sets: parseInt(newExercise.sets) || 3,
        reps: parseInt(newExercise.reps) || 10,
        weightKg: parseFloat(newExercise.weightKg) || 0
      }]
    }));
    setNewExercise({ name: '', sets: '', reps: '', weightKg: '' });
  };

  const removeExercise = (idx) => {
    setForm(f => ({ ...f, exercises: f.exercises.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      ...form,
      durationMinutes: parseInt(form.durationMinutes),
      caloriesBurned: parseInt(form.caloriesBurned) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Pealkiri *</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="nt. Jalgade treening" />
          {errors.title && <div className="error-msg">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Kuupäev *</label>
          <input className="form-control" type="date" name="date" value={form.date} onChange={handleChange} />
          {errors.date && <div className="error-msg">{errors.date}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Kestus (minutit) *</label>
          <input className="form-control" type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} placeholder="60" min="1" max="600" />
          {errors.durationMinutes && <div className="error-msg">{errors.durationMinutes}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Kategooria *</label>
          <select className="form-control" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Kalorid</label>
          <input className="form-control" type="number" name="caloriesBurned" value={form.caloriesBurned} onChange={handleChange} placeholder="400" min="0" />
        </div>
        <div className="form-group">
          <label className="form-label">Märkmed</label>
          <input className="form-control" name="notes" value={form.notes || ''} onChange={handleChange} placeholder="Vabatahtlik märge..." />
        </div>
      </div>

      {/* Harjutused */}
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label className="form-label">Harjutused</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <input className="form-control" style={{ flex: 2, minWidth: 120 }} placeholder="Harjutuse nimi" value={newExercise.name}
            onChange={e => setNewExercise(n => ({ ...n, name: e.target.value }))} />
          <input className="form-control" style={{ flex: 1, minWidth: 60 }} placeholder="Sarju" type="number" value={newExercise.sets}
            onChange={e => setNewExercise(n => ({ ...n, sets: e.target.value }))} />
          <input className="form-control" style={{ flex: 1, minWidth: 60 }} placeholder="Kordusi" type="number" value={newExercise.reps}
            onChange={e => setNewExercise(n => ({ ...n, reps: e.target.value }))} />
          <input className="form-control" style={{ flex: 1, minWidth: 70 }} placeholder="kg" type="number" step="0.5" value={newExercise.weightKg}
            onChange={e => setNewExercise(n => ({ ...n, weightKg: e.target.value }))} />
          <button type="button" className="btn btn-secondary" onClick={addExercise}>+ Lisa</button>
        </div>
        {form.exercises.length > 0 && (
          <div className="exercise-list">
            {form.exercises.map((ex, i) => (
              <div key={i} className="exercise-item">
                <span><strong>{ex.name}</strong> — {ex.sets}×{ex.reps} @ {ex.weightKg}kg</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeExercise(i)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Tühista</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Salvestamine...' : 'Salvesta'}
        </button>
      </div>
    </form>
  );
}
