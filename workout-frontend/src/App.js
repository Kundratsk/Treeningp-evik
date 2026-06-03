import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTheme } from './hooks/useTheme';
import WorkoutsPage from './pages/WorkoutsPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState('workouts');

  return (
    <div className="app">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <nav className="navbar">
        <div className="navbar-brand"> Treeningpäevik</div>
        <div className="navbar-actions">
          <button
            className={`nav-btn ${activePage === 'workouts' ? 'active' : ''}`}
            onClick={() => setActivePage('workouts')}
          >
            Treeningud
          </button>
          <button
            className={`nav-btn ${activePage === 'stats' ? 'active' : ''}`}
            onClick={() => setActivePage('stats')}
          >
             Statistika
          </button>
          <button className="nav-btn" onClick={toggleTheme}>
            {theme === 'light' ? ' Tume' : ' Hele'}
          </button>
        </div>
      </nav>

      <main className="main-container">
        {activePage === 'workouts' && <WorkoutsPage />}
        {activePage === 'stats' && <StatsPage />}
      </main>
    </div>
  );
}
