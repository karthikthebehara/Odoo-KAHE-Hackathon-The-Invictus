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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-600 font-semibold text-xl">Loading Checklist...</div>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Packing Checklist</h1>
            <p className="text-purple-100 opacity-90">Don't forget anything important for your trip.</p>
          </div>
          
          {/* Dynamic Progress Bar */}
          <div className="mt-6 relative z-10">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Packing Progress</span>
              <span>{progressPercent}% ({packedItems}/{totalItems})</span>
            </div>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)] ${progressPercent === 100 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-green-400 to-emerald-400'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          
          {progressPercent === 100 && totalItems > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-center animate-celebrate shadow-lg">
              <span className="text-2xl mr-2">✈️ 🎉</span>
              <span className="font-bold text-lg">Fully Packed! You are ready for takeoff!</span>
            </div>
          )}
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
          <div className="absolute bottom-0 right-1/4 mb-4 w-24 h-24 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
        </div>

        <div className="p-8">
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="mb-10 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="What do you need to pack?"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-700"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors shadow-md shadow-purple-500/20"
            >
              Add Item
            </button>
          </form>

          {/* Checklist by Category */}
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-10 text-gray-400">Your checklist is empty. Start adding items!</div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([category, catItems]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-8 h-px bg-gray-300"></span>
                    {category}
                    <span className="text-sm font-normal text-gray-400">({catItems.length})</span>
                  </h3>
                  <div className="space-y-3 pl-2">
                    {catItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 hover:-translate-y-[2px] rounded-xl group transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm">
                        <label className="flex items-center gap-4 cursor-pointer flex-1">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${item.is_packed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                            {item.is_packed && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={item.is_packed === 1}
                            onChange={() => togglePacked(item.id, item.is_packed)}
                          />
                          <span className={`text-lg transition-all ${item.is_packed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {item.item_name}
                          </span>
                        </label>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all bg-red-50 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
