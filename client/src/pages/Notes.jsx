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
    <div className="min-h-screen bg-[#f7f6f3] text-[#37352f] flex justify-center selection:bg-indigo-200">
      <div className="w-full max-w-4xl px-8 py-16 md:px-24 md:py-24">
        
        {/* Header Section */}
        <div className="mb-12 relative group">
          <h1 className="text-5xl font-bold tracking-tight outline-none" contentEditable suppressContentEditableWarning>
            {title} Journal
          </h1>
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

        {/* Notes Area - Notion Style */}
        <textarea
          className="w-full min-h-[500px] bg-transparent resize-none outline-none text-lg leading-relaxed placeholder-gray-300"
          placeholder="Start typing your trip notes, reminders, or journal entries..."
          value={notes}
          onChange={handleNotesChange}
          spellCheck="false"
        />

      </div>
    </div>
  );
};

export default Notes;
