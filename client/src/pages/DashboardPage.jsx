import { MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/checklist', icon: '✅', label: 'Packing Checklist', desc: 'Never forget a thing — organised checklists per trip.', color: 'from-purple-500 to-indigo-600' },
  { to: '/budget',    icon: '💰', label: 'Trip Budget',       desc: 'Track spend per category and get real-time remaining budget.', color: 'from-emerald-500 to-teal-600' },
  { to: '/notes',     icon: '📝', label: 'Travel Journal',    desc: 'Log your memories, notes, and reflections from your trip.', color: 'from-pink-500 to-rose-600' },
  { to: '/public/1',  icon: '🌍', label: 'Public View',       desc: 'Share your full itinerary with friends via a public link.', color: 'from-amber-500 to-orange-600' },
];

export default function DashboardPage() {
  return (
    <div className="w-full px-4 md:px-8 pb-20">
      <div className="w-full max-w-7xl mx-auto">

        {/* Header */}
        <div className="glass p-10 rounded-2xl mb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-cyan-500/10" />
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Welcome back! ✈️
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Your trips and tools, all in one place. Choose a module below to get started.</p>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {quickLinks.map(({ to, icon, label, desc, color }) => (
            <Link
              key={to}
              to={to}
              className="glass group p-8 hover:border-indigo-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                {icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-indigo-300 transition-colors">{label}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 text-indigo-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="glass p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5" />
          <div className="relative z-10">
            <div className="flex justify-center gap-5 mb-5">
              <MapPin className="text-indigo-400" size={32} />
              <Calendar className="text-purple-400" size={32} />
              <TrendingUp className="text-cyan-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Trip Dashboard</h2>
            <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
              Your full trip overview with itinerary builder, destinations, and budget summaries will appear here once the Team Lead integrates all modules.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
