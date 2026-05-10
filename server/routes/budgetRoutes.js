const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Get budget breakdown for a trip
router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;

    // 1. Get total budget from trip
    const [[trip]] = await pool.query(
      'SELECT total_budget, currency FROM trips WHERE id = ?',
      [tripId]
    );

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // 2. Get total spent by summing activity costs
    // Since we don't have stops yet, we'll join activities with stops
    const [expenses] = await pool.query(
      `SELECT category, SUM(cost) as total_cost 
       FROM activities a
       JOIN stops s ON a.stop_id = s.id
       WHERE s.trip_id = ?
       GROUP BY category`,
      [tripId]
    );

    // Calculate total spent
    const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.total_cost), 0);

    res.json({
      totalBudget: parseFloat(trip.total_budget),
      currency: trip.currency,
      totalSpent: totalSpent,
      remaining: parseFloat(trip.total_budget) - totalSpent,
      expensesByCategory: expenses.map(e => ({
        category: e.category,
        total: parseFloat(e.total_cost)
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching budget' });
  }
});

module.exports = router;
