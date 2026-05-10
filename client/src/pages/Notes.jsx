import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Notes = () => {
  const tripId = 1; // Hardcoded for prototype
  const [notes, setNotes] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const timeoutRef = useRef(null);

  const wordCount = notes.trim().length > 0 ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  useEffect(() => {
    fetchTripDetails();
  }, []);

  const fetchTripDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const authConfig = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get(`http://localhost:5000/api/trips/${tripId}`, authConfig);
      // Backend returns { status: 'success', data: { trip: { ... } } }
      const trip = res.data.data ? res.data.data.trip : res.data;
      
      setTitle(trip.title);
      setNotes(trip.description || '');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    setSaving(true);
    setSaveMessage('Saving...');

    // Auto-save logic with debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const authConfig = { headers: { Authorization: `Bearer ${token}` } };
        
        await axios.put(`http://localhost:5000/api/trips/${tripId}`, { 
          title: title, 
          description: newNotes 
        }, authConfig);
        
        setSaving(false);
        setSaveMessage('Saved');
        
        // Clear the "Saved" message after a few seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } catch (err) {
        console.error(err);
        setSaveMessage('Error saving notes');
        setSaving(false);
      }
    }, 1000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-semibold text-xl">Loading Journal...</div>;

  return (
    <div className="min-h-screen text-white flex justify-center selection:bg-indigo-500">
      <div className="w-full max-w-4xl px-8 py-16 md:px-24 md:py-24">
        
        {/* Header Section */}
        <div className="mb-12 relative group flex justify-between items-start">
          <div>
            <h1 className="text-5xl font-bold tracking-tight outline-none" contentEditable suppressContentEditableWarning>
              {title ? title.replace(/hackathon/gi, '').trim() : 'Trip'} <span className="opacity-80">Journal</span>
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mt-6 rounded-full"></div>
          </div>
          <div className="absolute right-0 top-2 flex items-center gap-2">
            {saveMessage && (
              <span className={`text-sm ${saveMessage === 'Error saving notes' ? 'text-red-500' : 'text-gray-400'}`}>
                {saveMessage}
              </span>
            )}
            {saving && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
            )}
          </div>
        </div>

        {/* Notes Area - Glassmorphic Style */}
        <div className="relative mt-8">
          <textarea
            className="w-full h-[60vh] text-lg leading-relaxed text-white bg-black/30 backdrop-blur-md resize-none outline-none placeholder-white/40 font-serif focus:ring-2 focus:ring-indigo-400/50 rounded-3xl p-8 transition-all border border-white/20 shadow-2xl"
            placeholder="Start typing your trip notes, reminders, or journal entries..."
            value={notes}
            onChange={handleNotesChange}
            spellCheck="false"
          />
          
          {/* Status & Counter Bar */}
          <div className="absolute bottom-6 right-6 flex items-center gap-4 text-sm font-medium text-white/80 bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-lg border border-white/10 transition-all">
            <div className="flex gap-4">
              <span><strong className="text-white">{wordCount}</strong> words</span>
              <span><strong className="text-white">{charCount}</strong> chars</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notes;
