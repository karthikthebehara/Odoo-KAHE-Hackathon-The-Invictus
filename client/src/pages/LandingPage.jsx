import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, DollarSign, CheckSquare, Globe, ArrowRight, Plane, Star } from 'lucide-react';

const features = [
  { icon: '🗺️', title: 'Multi-City Itinerary', desc: 'Plan stops across cities with smart scheduling.' },
  { icon: '💸', title: 'Budget Tracker', desc: 'Real-time spend tracking with visual breakdowns.' },
  { icon: '✅', title: 'Packing Checklist', desc: 'Never forget anything with smart packing lists.' },
  { icon: '🌍', title: 'Public Sharing', desc: 'Share your itinerary via a beautiful public page.' },
];

const stats = [
  { value: '10K+', label: 'Trips Planned' },
  { value: '50+', label: 'Countries' },
  { value: '98%', label: 'Happy Travelers' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30">
            <Plane size={18} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white drop-shadow-lg">Traveloop</span>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl border border-white/25 text-white/90 hover:border-white hover:bg-white/10 transition-all text-sm font-semibold backdrop-blur-md"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold mb-8 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          All-in-One Travel Planner
        </div>

        <h1 className="text-6xl md:text-8xl font-black leading-[1.05] mb-6 text-white tracking-tight drop-shadow-2xl">
          Your Dream Trip,
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: '2px rgba(255,255,255,0.9)' }}
          >
            Perfectly
          </span>{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300">
            Planned
          </span>
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-light">
          From budgeting to packing to sharing — Traveloop handles every detail so you can focus on the adventure.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-slate-900 font-black text-base hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(255,255,255,0.25)] transition-all active:scale-95"
          >
            Start Planning Free <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl border-2 border-white/30 text-white font-bold text-base hover:bg-white/10 hover:border-white/50 transition-all backdrop-blur-sm"
          >
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 md:gap-16 justify-center">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{value}</div>
              <div className="text-white/50 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:-translate-y-2 hover:bg-black/40 hover:border-white/20 transition-all duration-300 group cursor-default"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
              <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-white/20 text-xs">
        © 2026 Traveloop · Team The Invictus
      </footer>
    </div>
  );
}
