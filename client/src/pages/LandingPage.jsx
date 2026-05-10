import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Map, CheckSquare, DollarSign, ArrowRight, Plane, BookOpen } from 'lucide-react';

const features = [
  { icon: Map,          title: 'Multi-City Itinerary', desc: 'Plan stops across cities with full drag-and-drop reordering.', color: 'from-indigo-500 to-blue-500' },
  { icon: DollarSign,   title: 'Budget Tracker',       desc: 'Track spend per category with real-time remaining budget charts.', color: 'from-emerald-500 to-teal-500' },
  { icon: CheckSquare,  title: 'Packing Checklist',    desc: 'Never forget a thing — smart checklists with progress tracking.', color: 'from-purple-500 to-pink-500' },
  { icon: Globe,        title: 'Public Sharing',       desc: 'Share your itinerary with the world via a beautiful public link.', color: 'from-amber-500 to-orange-500' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plane size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Traveloop</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-xl border border-white/30 text-white/90 hover:border-white hover:text-white transition-all text-sm font-semibold backdrop-blur-sm bg-white/10"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all active:scale-95"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 relative">
        {/* Glow blob */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] bg-gradient-radial from-indigo-500 to-purple-600"></div>
        </div>

        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border border-indigo-400/40 text-indigo-300 bg-indigo-500/10 backdrop-blur-sm">
            ✈️ Your All-in-One Travel Planner
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-white drop-shadow-2xl">
            Plan Trips That
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Feel Like Magic
            </span>
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Traveloop is your all-in-one travel planner — build multi-city itineraries,
            track budgets, pack smarter, and share your adventures with the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all active:scale-95"
            >
              Start Planning Free <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-3">Everything you need to travel better</h2>
          <p className="text-center text-white/60 mb-12">Packed with powerful features for every type of traveler</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl hover:bg-white/15 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${color} shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-white/30 text-xs border-t border-white/10">
        Traveloop · Built with ❤️ by Team The Invictus
      </footer>
    </div>
  );
}
