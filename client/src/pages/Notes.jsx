import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Notes = () => {
  const [tripId, setTripId] = useState(null);
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');
  const timeoutRef = useRef(null);

  const wordCount = notes.trim().length > 0 ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const token = localStorage.getItem('traveloop_token') || localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { 
    const initData = async () => {
      try {
        const tripsRes = await axios.get('http://localhost:5000/api/trips', authConfig);
        const trips = tripsRes.data.data?.trips || [];
        if (trips.length > 0) {
          const activeTripId = trips[0].id;
          setTripId(activeTripId);
          fetchTripDetails(activeTripId);
        } else {
          setError('No trips found. Please create a trip first.');
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch trips. Please login again.');
        setLoading(false);
      }
    };
    initData();
  }, []);

  const fetchTripDetails = async (activeTripId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trips/${activeTripId}`, authConfig);
      const trip = res.data.data ? res.data.data.trip : res.data;
      setTitle(trip.title);
      setNotes(trip.description || '');
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    setSaving(true);
    setSaveMessage('Saving...');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const authConfig = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://localhost:5000/api/trips/${tripId}`, { title, description: newNotes }, authConfig);
        setSaving(false);
        setSaveMessage('✓ Saved');
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (err) { console.error(err); setSaveMessage('Error saving'); setSaving(false); }
    }, 1000);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="glass p-12 text-center">
        <div className="text-6xl mb-4 animate-bounce">📝</div>
        <p className="text-white font-bold text-xl">Loading Journal...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-full min-h-[70vh] px-6">
      <div className="glass p-12 text-center max-w-lg w-full">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-white font-extrabold text-2xl mb-3">{error.includes('No trips') ? 'No Trips Yet' : 'Could not load journal'}</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary px-8 py-3 w-full justify-center">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 md:px-8 pb-20">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="glass p-10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-indigo-500/5" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">
                {title ? title.replace(/hackathon/gi, '').trim() : 'Trip'} <span className="text-slate-400">Journal</span>
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              {saveMessage && (
                <span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${saveMessage.includes('Error') ? 'text-red-400 bg-red-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                  {saveMessage}
                </span>
              )}
              {saving && (
                <div className="w-5 h-5 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
              )}
            </div>
          </div>
        </div>

        {/* Notes Area */}
        <div className="glass overflow-hidden relative">
          <textarea
            className="w-full h-[60vh] text-lg leading-relaxed text-slate-200 bg-transparent resize-none outline-none placeholder-slate-600 font-serif p-10 transition-all"
            placeholder="Start typing your trip notes, reminders, or journal entries..."
            value={notes}
            onChange={handleNotesChange}
            spellCheck="false"
          />
          
          {/* Status Bar */}
          <div className="absolute bottom-5 right-5 flex items-center gap-4 text-sm font-medium text-slate-500 bg-[var(--color-surface)] px-5 py-2.5 rounded-full border border-[var(--color-border)]">
            <span><strong className="text-slate-300">{wordCount}</strong> words</span>
            <span className="w-px h-4 bg-[var(--color-border)]" />
            <span><strong className="text-slate-300">{charCount}</strong> chars</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notes;
