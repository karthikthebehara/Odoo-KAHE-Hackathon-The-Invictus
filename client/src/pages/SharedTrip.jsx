import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SharedTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      // For hackathon prototype, we will just use tripId=1 if none is passed via URL
      const idToFetch = tripId || 1; 
      const res = await axios.get(`http://localhost:5000/api/trips/public/${idToFetch}`);
      
      if (res.data && res.data.data) {
        // Transform backend response into what the frontend expects
        const { trip, stops } = res.data.data;
        setTrip({ ...trip, stops });
      } else {
        setTrip(res.data);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('This trip is private or does not exist.');
      setLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    setCopying(true);
    try {
      const idToCopy = tripId || 1;
      const res = await axios.post(`http://localhost:5000/api/trips/copy/${idToCopy}`);
      alert(`Trip copied successfully! New Trip ID: ${res.data.newTripId}`);
      // Usually would navigate to the new trip dashboard here
      navigate('/checklist'); 
    } catch (err) {
      console.error(err);
      alert('Failed to copy trip');
      setCopying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-pink-600 font-semibold text-xl">Loading Shared Trip...</div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md">
        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-80 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex flex-col items-center justify-center text-white px-4 print:hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center max-w-3xl">
          <span className="px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold uppercase tracking-widest mb-4 inline-block">Public Trip</span>
          <h1 className="text-5xl font-bold mb-4 tracking-tight shadow-sm">{trip.title}</h1>
          <p className="text-lg text-white/90 line-clamp-2">{trip.description || 'No description provided.'}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 -mt-10 relative z-20">
        
        {/* Action Bar - Hidden during print */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 mb-8 print:hidden">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Like this itinerary?</h3>
            <p className="text-gray-500">Copy this trip to your account and customize it!</p>
          </div>
          <button 
            onClick={handleCopyTrip}
            disabled={copying}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:bg-gradient-to-l text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {copying ? 'Copying...' : (
              <>
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                Copy Trip
              </>
            )}
          </button>
        </div>

        {/* Itinerary Timeline */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 px-2">Itinerary Preview</h2>
          
          {(!trip.stops || trip.stops.length === 0) ? (
            <div className="bg-white p-10 rounded-2xl text-center text-gray-500 border border-gray-100">
              No stops have been added to this trip yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-purple-200 ml-6 space-y-12 pb-8">
              {trip.stops.map((stop, idx) => (
                <div key={stop.id} className="relative pl-8">
                  {/* Timeline Dot with Pulse Animation for first stop */}
                  <div className="absolute -left-[11px] top-2 flex h-5 w-5 items-center justify-center">
                    {idx === 0 && <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>}
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500 border-4 border-gray-50 shadow-sm"></span>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{stop.city_name} {stop.country_code && <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded"> {stop.country_code}</span>}</h3>
                      <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Stop {idx + 1}</span>
                    </div>

                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold uppercase text-gray-400 tracking-wider">Activities</h4>
                        {stop.activities.map(act => (
                          <div key={act.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl">
                              {act.category === 'food' ? '🍕' : act.category === 'accommodation' ? '🏨' : act.category === 'transport' ? '✈️' : '📸'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{act.title}</p>
                              <p className="text-xs text-gray-500 capitalize">{act.category} • {act.cost > 0 ? `$${act.cost}` : 'Free'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 mt-4 italic">No activities planned.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Floating Print Button - Hidden on Print */}
      <button 
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 bg-gray-900 hover:bg-black text-white p-4 rounded-full shadow-2xl transition-transform hover:-translate-y-1 active:scale-95 print:hidden group z-50"
        title="Print Itinerary"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </button>
    </div>
  );
};

export default SharedTrip;
