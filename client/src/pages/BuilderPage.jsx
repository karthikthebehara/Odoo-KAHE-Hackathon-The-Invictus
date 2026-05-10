import { Map } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function BuilderPage() {
  const { tripId } = useParams();
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-bg)' }}>
      <div className="glass p-10 text-center">
        <Map size={40} className="text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold gradient-text mb-2">Itinerary Builder</h2>
        <p className="text-slate-400 text-sm">Trip #{tripId} — drag-and-drop stops coming next sprint</p>
      </div>
    </div>
  );
}
