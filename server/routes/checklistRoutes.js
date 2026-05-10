const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Get all checklist items for a trip
router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM packing_checklist WHERE trip_id = ? ORDER BY category, id',
      [tripId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching checklist' });
  }
});

// Add a new checklist item
router.post('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { item_name, category, quantity } = req.body;
    
    // Basic validation
    if (!item_name || item_name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO packing_checklist (trip_id, item_name, category, quantity) VALUES (?, ?, ?, ?)',
      [tripId, item_name, category || 'General', quantity || 1]
    );

    res.status(201).json({ id: result.insertId, trip_id: tripId, item_name, category: category || 'General', quantity: quantity || 1, is_packed: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error adding item' });
  }
});

// Update packed status
router.put('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const { is_packed } = req.body;

    await pool.query(
      'UPDATE packing_checklist SET is_packed = ? WHERE id = ?',
      [is_packed ? 1 : 0, itemId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error updating item' });
  }
});

// Delete an item
router.delete('/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    await pool.query('DELETE FROM packing_checklist WHERE id = ?', [itemId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error deleting item' });
  }
});

module.exports = router;
