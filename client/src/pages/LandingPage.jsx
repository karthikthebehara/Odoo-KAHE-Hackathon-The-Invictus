import { useNavigate } from 'react-router-dom';
import { Plane, Map, DollarSign, CheckSquare, Globe, ArrowRight } from 'lucide-react';

const features = [
  { icon: Map,         emoji: '🗺️', title: 'Multi-City Itinerary', desc: 'Plan stops across cities with smart scheduling & drag-and-drop.' },
  { icon: DollarSign, emoji: '💸', title: 'Budget Tracker',        desc: 'Real-time spend tracking with beautiful visual breakdowns.' },
  { icon: CheckSquare,emoji: '✅', title: 'Packing Checklist',     desc: 'Smart checklists with progress tracking so you never forget a thing.' },
  { icon: Globe,      emoji: '🌍', title: 'Public Sharing',        desc: 'Share your itinerary with the world via a stunning public page.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[40%] left-[20%] w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
            <Plane size={20} className="text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight drop-shadow">Traveloop</span>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-xl border-2 border-white/40 text-white font-semibold text-sm hover:bg-white/10 hover:border-white transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 rounded-xl bg-white text-indigo-700 font-black text-sm hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-xl transition-all active:scale-95"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 border border-white/25 text-white font-semibold text-sm mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Your All-in-One Travel Planner ✈️
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6 drop-shadow-2xl">
          Plan Trips That<br/>
          <span className="text-white/85">Feel Like</span>{' '}
          <span className="bg-clip-text text-transparent bg-white drop-shadow-lg" style={{WebkitTextStroke: '2px rgba(255,255,255,0.6)'}}>Magic</span>
        </h1>

        <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
          Build multi-city itineraries, track your budget, check off your packing list, and share your adventures — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-indigo-700 font-black text-lg hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all active:scale-95"
          >
            Start Planning Free <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border-2 border-white/50 text-white font-bold text-lg hover:bg-white/10 hover:border-white transition-all"
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-12 justify-center">
          {[['10K+', 'Trips Planned'], ['50+', 'Countries'], ['98%', 'Happy Users']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-white">{val}</div>
              <div className="text-white/60 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ emoji, title, desc }) => (
            <div key={title} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:-translate-y-1 hover:bg-white/15 transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{emoji}</div>
              <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
              <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center pb-8 text-white/30 text-xs relative z-10">
        © 2026 Traveloop · Team The Invictus
      </footer>
    </div>
  );
}
