import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}>
      <div className="glass p-10 text-center">
        <LayoutDashboard size={40} className="text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold gradient-text mb-2">Dashboard</h2>
        <p className="text-slate-400 text-sm">Trip cards & budget overview — coming next sprint</p>
      </div>
    </div>
  );
}
