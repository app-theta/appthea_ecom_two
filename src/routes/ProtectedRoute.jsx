import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthed, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <div style={{ padding: 'var(--sp-9) var(--gutter)', textAlign: 'center', color: 'var(--muted)' }}>
        Loading…
      </div>
    );
  }
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
