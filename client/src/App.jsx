import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Checklist from './pages/Checklist'
import Budget from './pages/Budget'
import Notes from './pages/Notes'
import SharedTrip from './pages/SharedTrip'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // Simulate API call to port 5000
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      console.log('Logged in:', response.data)
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      navigate('/checklist')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors[0])
      } else {
        setError('Invalid credentials or server not reachable.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-tight">Welcome Back</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="text-purple-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    try {
      // Simulate API call to port 5000
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password })
      console.log('Signed up:', response.data)
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      navigate('/')
    } catch (err) {
      if (err.response && err.response.data) {
        const { message, errors } = err.response.data;
        if (message) setError(message);
        else if (errors && errors.length > 0) setError(errors[0]);
        else setError('Registration failed');
      } else {
        setError('Registration failed or server not reachable.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-tight">Create Account</h2>
        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/30"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link to="/" className="text-purple-600 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const isAuth = location.pathname === '/' || location.pathname === '/signup'
  const path = location.pathname

  const navLinkClass = (targetPath) => 
    `flex items-center gap-2 font-semibold transition-all px-3 py-2 rounded-lg ${
      path.startsWith(targetPath) 
        ? 'text-indigo-700 bg-indigo-50 shadow-sm ring-1 ring-indigo-100' 
        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
    }`

  return (
    <>
      {!isAuth && (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-6 py-3 rounded-2xl flex flex-wrap gap-2 md:gap-4 justify-between border border-white/50 items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl drop-shadow-sm">✈️</span>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hidden sm:block">Traveloop</span>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/checklist" className={navLinkClass('/checklist')}>✅ <span className="hidden md:inline">Checklist</span></Link>
            <Link to="/budget" className={navLinkClass('/budget')}>💰 <span className="hidden md:inline">Budget</span></Link>
            <Link to="/notes" className={navLinkClass('/notes')}>📝 <span className="hidden md:inline">Journal</span></Link>
            <Link to="/public/1" className={navLinkClass('/public')}>🌍 <span className="hidden md:inline">Public View</span></Link>
          </div>

          <button 
            onClick={() => { localStorage.clear(); window.location.href='/' }} 
            className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-xl font-bold transition-all active:scale-95 shadow-sm"
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
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/public/:tripId" element={<SharedTrip />} />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
