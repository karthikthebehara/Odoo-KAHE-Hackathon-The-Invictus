import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BuilderPage   from './pages/BuilderPage';
import LandingPage   from './pages/LandingPage';

/**
 * Simple auth guard — checks if a JWT exists in localStorage.
 * Replace with a proper AuthContext in future iterations.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('traveloop_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/builder/:tripId"
          element={<ProtectedRoute><BuilderPage /></ProtectedRoute>}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
