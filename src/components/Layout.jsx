import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="container">
      <header>
        <h1>ARAKFORUM - Politique</h1>
        <p className="subtitle">Discutez anonymement de politique (Afrique & Monde)</p>

        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link>
          <Link to="/chat" className={location.pathname === '/chat' ? 'active' : ''}>Chat 🐱</Link>

          <button onClick={toggleTheme} className="btn-toggle" aria-label="Toggle Theme">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
