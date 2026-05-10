import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// ── Page imports ───────────────────────────────────────────────
import LandingPage   from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import BuilderPage   from './pages/BuilderPage';
import Checklist     from './pages/Checklist';
import Budget        from './pages/Budget';
import Notes         from './pages/Notes';
import SharedTrip    from './pages/SharedTrip';
import { AuthProvider, useAuth } from './context/AuthContext';

// ──────────────────────────────────────────────────────────────
// Auth guard — checks for JWT in localStorage
// ──────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ──────────────────────────────────────────────────────────────
// Login page
// ──────────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data?.token) {
        login(response.data.token, response.data.data?.user);
      }
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.errors?.[0] || 'Invalid credentials or server not reachable.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black/30 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full max-w-md border border-white/20">
        <div className="flex justify-center mb-4">
          <span className="text-4xl drop-shadow-md">✈️</span>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">Welcome Back</h2>
        {error && <div className="bg-red-500/20 text-red-200 border border-red-500/50 p-3 rounded-xl mb-4 text-sm text-center backdrop-blur-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-400 hover:to-indigo-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 active:scale-95"
          >
            Sign In
          </button>
        </form>
        <p className="mt-8 text-center text-white/70">
          Don't have an account? <Link to="/signup" className="text-purple-300 font-bold hover:text-purple-200 hover:underline transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Signup page
// ──────────────────────────────────────────────────────────────
function Signup() {
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                 = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      if (response.data?.token) {
        login(response.data.token, response.data.data?.user);
      }
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.message) setError(data.message);
      else if (data?.errors?.length) setError(data.errors[0]);
      else setError('Registration failed or server not reachable.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-black/30 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full max-w-md border border-white/20 my-8">
        <div className="flex justify-center mb-4">
          <span className="text-4xl drop-shadow-md">✈️</span>
        </div>
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">Create Account</h2>
        {error && <div className="bg-red-500/20 text-red-200 border border-red-500/50 p-3 rounded-xl mb-4 text-sm text-center backdrop-blur-sm">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="John Doe"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1.5">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all shadow-inner"
              placeholder="••••••••"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-400 hover:to-purple-400 transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:-translate-y-0.5 active:scale-95 mt-8"
          >
            Create Account
          </button>
        </form>
        <p className="mt-8 text-center text-white/70">
          Already have an account? <Link to="/login" className="text-pink-300 font-bold hover:text-pink-200 hover:underline transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// App Content Wrapper
// ──────────────────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAuth = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';
  const path = location.pathname;

  const navLinkClass = (targetPath) => 
    `flex items-center gap-2 font-semibold transition-all px-3 py-2 rounded-lg text-sm ${
      path.startsWith(targetPath) 
        ? 'text-white bg-white/20 shadow-sm ring-1 ring-white/30' 
        : 'text-white/70 hover:text-white hover:bg-white/10'
    }`;

  return (
    <>
      {!isAuth && (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-black/40 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] px-6 py-3 rounded-2xl flex flex-wrap gap-2 md:gap-4 justify-between border border-white/15 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">✈️</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white hidden sm:block">Traveloop</span>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>🏠 <span className="hidden md:inline">Dashboard</span></Link>
            <Link to="/checklist" className={navLinkClass('/checklist')}>✅ <span className="hidden md:inline">Checklist</span></Link>
            <Link to="/budget" className={navLinkClass('/budget')}>💰 <span className="hidden md:inline">Budget</span></Link>
            <Link to="/notes" className={navLinkClass('/notes')}>📝 <span className="hidden md:inline">Journal</span></Link>
            <Link to="/public/1" className={navLinkClass('/public')}>🌍 <span className="hidden md:inline">Public View</span></Link>
          </div>

          <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="flex items-center gap-2 text-red-300 hover:text-white hover:bg-red-500/80 px-4 py-2 rounded-xl font-bold transition-all active:scale-95 text-sm border border-red-400/30 hover:border-red-500"
          >
            🚪 <span className="hidden md:inline">Logout</span>
          </button>
        </nav>
      )}
      {/* Advanced Cinematic Travel Background */}
      <div className="fixed inset-0 z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')" }}
        ></div>
        {/* Dark Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/80"></div>
      </div>

      <div className={`animate-fade-in-up ${!isAuth ? "pt-28 pb-10" : ""}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/"               element={<LandingPage />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/signup"         element={<Signup />} />
          <Route path="/public/:tripId" element={<SharedTrip />} />

          {/* Protected routes */}
          <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/builder/:tripId" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
          <Route path="/checklist"      element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
          <Route path="/budget"         element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/notes"          element={<ProtectedRoute><Notes /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Root App
// ──────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
