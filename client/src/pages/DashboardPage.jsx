import { LayoutDashboard, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/checklist', icon: '✅', label: 'Packing Checklist', desc: 'Pack smart for your trip', color: 'from-purple-500 to-indigo-500' },
  { to: '/budget',    icon: '💰', label: 'Trip Budget',       desc: 'Track spending & savings', color: 'from-emerald-500 to-teal-500' },
  { to: '/notes',     icon: '📝', label: 'Travel Journal',    desc: 'Log your memories',         color: 'from-pink-500 to-rose-500' },
  { to: '/public/1',  icon: '🌍', label: 'Public View',       desc: 'Share your itinerary',      color: 'from-amber-500 to-orange-500' },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto animate-fade-in-up">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
            Welcome back! ✈️
          </h1>
          <p className="text-white/70 text-lg">Your trips and tools, all in one place.</p>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {quickLinks.map(({ to, icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/15 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{label}</h3>
              <p className="text-white/60 text-sm">{desc}</p>
            </Link>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <MapPin className="text-indigo-400" size={28} />
            <Calendar className="text-purple-400" size={28} />
            <TrendingUp className="text-pink-400" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Trip Dashboard</h2>
          <p className="text-white/60 max-w-md mx-auto">
            Your full trip overview with itinerary builder, destinations, and budget summaries will appear here once the Team Lead integrates all modules.
          </p>
        </div>

      </div>
    </div>
  );
}
