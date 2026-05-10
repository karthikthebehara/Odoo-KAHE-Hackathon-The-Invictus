import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Checklist = () => {
  // Hardcoded tripId for hackathon prototype
  const tripId = 1;
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['General', 'Clothes', 'Toiletries', 'Documents', 'Electronics'];

  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trips/${tripId}/checklist`, authConfig);
      // The new backend might return data inside a data object or directly
      setItems(res.data.data ? res.data.data.items : res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load checklist. Ensure backend is running and you are logged in.');
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      setError('Item name cannot be empty.');
      return;
    }
    setError('');
    try {
      const res = await axios.post(`http://localhost:5000/api/trips/${tripId}/checklist`, {
        item_name: newItemName,
        category: newCategory,
        quantity: 1
      }, authConfig);
      
      // Update with new item from response
      const addedItem = res.data.data ? res.data.data.item : res.data;
      setItems([...items, addedItem]);
      setNewItemName('');
    } catch (err) {
      console.error(err);
      setError('Failed to add item.');
    }
  };

  const togglePacked = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      // Optimistic update
      setItems(items.map(item => item.id === id ? { ...item, is_packed: newStatus } : item));
      await axios.patch(`http://localhost:5000/api/trips/${tripId}/checklist/${id}`, { is_packed: newStatus }, authConfig);
    } catch (err) {
      console.error(err);
      // Revert if error
      fetchItems();
    }
  };

  const handleDelete = async (id) => {
    try {
      setItems(items.filter(item => item.id !== id));
      await axios.delete(`http://localhost:5000/api/trips/${tripId}/checklist/${id}`, authConfig);
    } catch (err) {
      console.error(err);
      fetchItems();
    }
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const totalItems = items.length;
  const packedItems = items.filter(item => item.is_packed === 1).length;
  const progressPercent = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/30">
        <div className="text-5xl mb-4 animate-bounce">✅</div>
        <p className="text-white font-bold text-xl">Loading Checklist...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Packing Checklist</h1>
            <p className="text-purple-100 opacity-90">Don't forget anything important for your trip.</p>
          </div>
          <div className="mt-6 relative z-10">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Packing Progress</span>
              <span>{progressPercent}% ({packedItems}/{totalItems})</span>
            </div>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${progressPercent === 100 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-green-400 to-emerald-400'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {progressPercent === 100 && totalItems > 0 && (
            <div className="mt-4 p-4 rounded-xl bg-white/20 border border-white/30 text-center animate-celebrate">
              <span className="text-2xl mr-2">✈️ 🎉</span>
              <span className="font-bold text-lg">Fully Packed! Ready for takeoff!</span>
            </div>
          )}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-5"></div>
        </div>

        {/* Body */}
        <div className="p-8">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="mb-8 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="What do you need to pack?"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-800 font-medium"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 outline-none bg-white text-gray-700 font-medium"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button
              type="submit"
              className="px-7 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 active:scale-95"
            >
              Add Item
            </button>
          </form>

          {/* Checklist Items */}
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-6xl mb-4">🧳</div>
              <p className="text-lg font-medium">Your checklist is empty.</p>
              <p className="text-sm mt-1">Start adding items above!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, catItems]) => (
                <div key={category}>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="flex-1 h-px bg-gray-200"></span>
                    {category} <span className="text-gray-400 font-normal">({catItems.length})</span>
                    <span className="flex-1 h-px bg-gray-200"></span>
                  </h3>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 rounded-xl group transition-all border border-transparent hover:border-purple-100">
                        <label className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => togglePacked(item.id, item.is_packed)}>
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.is_packed ? 'bg-green-500 border-green-500' : 'border-gray-300 group-hover:border-purple-400'}`}>
                            {item.is_packed && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`font-medium transition-all ${item.is_packed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.item_name}</span>
                        </label>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklist;
