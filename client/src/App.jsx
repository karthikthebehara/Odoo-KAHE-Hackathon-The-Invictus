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
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      if (response.data?.token) {
        login(response.data.token, response.data.data?.user);
      }
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || data?.errors?.[0] || 'Invalid credentials or server not reachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white text-lg">✈️</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Traveloop</span>
        </Link>
        <div>
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Every great journey<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-pink-300">starts here.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Plan, budget, pack and share your adventures — all in one beautiful place.
          </p>
        </div>
        <div className="flex gap-6">
          {['✅ Packing Lists', '💰 Budget Tracker', '🌍 Public Sharing'].map(f => (
            <span key={f} className="text-white/50 text-xs font-medium">{f}</span>
          ))}
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/15 p-10 shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <span className="text-3xl">✈️</span>
              <span className="text-xl font-black text-white">Traveloop</span>
            </Link>

            <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
            <p className="text-white/50 mb-8">Sign in to continue your journey</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/15 text-red-300 border border-red-500/30 p-4 rounded-2xl mb-6 text-sm">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Email address</label>
                <input
                  type="email" required
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/50 transition-all text-sm"
                  placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Password</label>
                <input
                  type="password" required
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/50 transition-all text-sm"
                  placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-black text-base shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 mt-2"
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p className="mt-8 text-center text-white/40 text-sm">
              New to Traveloop?{' '}
              <Link to="/signup" className="text-violet-300 font-bold hover:text-violet-200 transition-colors">Create an account</Link>
            </p>
          </div>
        </div>
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
  const [loading, setLoading]             = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white text-lg">✈️</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Traveloop</span>
        </Link>
        <div>
          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Join thousands of<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-violet-300">happy travelers.</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Start planning your perfect trip today — it only takes 30 seconds to get started.
          </p>
        </div>
        <div className="flex gap-6">
          {['🗺️ Itinerary Builder', '📝 Travel Journal', '✈️ Trip Sharing'].map(f => (
            <span key={f} className="text-white/50 text-xs font-medium">{f}</span>
          ))}
        </div>
      </div>

      {/* Right — Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 py-16">
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl border border-white/15 p-10 shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <span className="text-3xl">✈️</span>
              <span className="text-xl font-black text-white">Traveloop</span>
            </Link>

            <h2 className="text-3xl font-black text-white mb-2">Create account</h2>
            <p className="text-white/50 mb-8">Start your travel journey today</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/15 text-red-300 border border-red-500/30 p-4 rounded-2xl mb-6 text-sm">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text" required
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500/50 transition-all text-sm"
                  placeholder="John Doe"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Email address</label>
                <input
                  type="email" required
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500/50 transition-all text-sm"
                  placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Password</label>
                <input
                  type="password" required
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500/50 transition-all text-sm"
                  placeholder="Create a strong password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-semibold mb-2">Confirm Password</label>
                <input
                  type="password" required
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/60 focus:border-pink-500/50 transition-all text-sm"
                  placeholder="Repeat your password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-black text-base shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 mt-2"
              >
                {loading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>

            <p className="mt-8 text-center text-white/40 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-pink-300 font-bold hover:text-pink-200 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
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
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl bg-white/15 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] px-6 py-3.5 rounded-2xl flex items-center justify-between border border-white/25">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
              <span className="text-sm">✈️</span>
            </div>
            <span className="font-black text-lg text-white tracking-tight hidden sm:block">Traveloop</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>🏠 <span className="hidden md:inline">Dashboard</span></Link>
            <Link to="/checklist" className={navLinkClass('/checklist')}>✅ <span className="hidden md:inline">Checklist</span></Link>
            <Link to="/budget" className={navLinkClass('/budget')}>💰 <span className="hidden md:inline">Budget</span></Link>
            <Link to="/notes" className={navLinkClass('/notes')}>📝 <span className="hidden md:inline">Journal</span></Link>
            <Link to="/public/1" className={navLinkClass('/public')}>🌍 <span className="hidden md:inline">Public</span></Link>
          </div>

          <button 
            onClick={() => { logout(); navigate('/login'); }} 
            className="flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold transition-all active:scale-95 text-sm border border-red-400/50"
          >
            🚪 <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      )}
      {/* Vibrant Gradient Background */}
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px]"></div>
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
