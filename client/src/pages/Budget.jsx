import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const Budget = () => {
  const tripId = 1; // Hardcoded for hackathon testing
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#64748b'];

  const token = localStorage.getItem('token');
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/trips/${tripId}/budget`, authConfig);
      // The new backend might return data inside a data object
      setBudgetData(res.data.data ? res.data.data : res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load budget data. Ensure backend is running and you are logged in.');
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-semibold text-xl">Loading Budget...</div>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-8 rounded-2xl text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Trip Budget & Expenses</h1>
          <p className="text-indigo-100">Keep track of your spending to avoid surprises.</p>
        </div>

        {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}

        {budgetData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Summary Cards */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 group">
                <h3 className="text-sm font-semibold text-indigo-900/60 uppercase tracking-wider mb-2 group-hover:text-indigo-600 transition-colors">Total Budget</h3>
                <p className="text-4xl font-bold text-gray-800">
                  {budgetData.total_budget.toLocaleString()} <span className="text-xl text-gray-400">{budgetData.currency || 'USD'}</span>
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pink-200 group">
                <h3 className="text-sm font-semibold text-pink-900/60 uppercase tracking-wider mb-2 group-hover:text-pink-600 transition-colors">Total Spent</h3>
                <p className="text-4xl font-bold text-pink-500">
                  {budgetData.total_spent.toLocaleString()} <span className="text-xl text-pink-300">{budgetData.currency || 'USD'}</span>
                </p>
              </div>

              <div className={`p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${budgetData.remaining >= 0 ? 'bg-emerald-50/90 border-emerald-200/50 hover:shadow-emerald-500/20' : 'bg-red-50/90 border-red-200/50 hover:shadow-red-500/20'}`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${budgetData.remaining >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  Remaining Balance
                </h3>
                <p className={`text-4xl font-bold ${budgetData.remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {budgetData.remaining.toLocaleString()} <span className="text-xl opacity-70">{budgetData.currency || 'USD'}</span>
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="md:col-span-2 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Expenses by Category</h3>
              {(!budgetData.by_category || budgetData.by_category.length === 0) ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
                  <div className="w-24 h-24 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                    <span className="text-4xl opacity-50">💸</span>
                  </div>
                  <p className="text-lg font-medium text-gray-500">No expenses recorded yet.</p>
                  <p className="text-sm mt-1">Add activities to your itinerary to see your chart!</p>
                </div>
              ) : (
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetData.by_category}
                        dataKey="total"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                      >
                        {budgetData.by_category.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString()} ${budgetData.currency || 'USD'}`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
