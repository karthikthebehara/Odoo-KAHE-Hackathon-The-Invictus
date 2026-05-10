const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Get trip details (including notes/description)
router.get('/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const [[trip]] = await pool.query(
      'SELECT id, title, description, sharing_status FROM trips WHERE id = ?',
      [tripId]
    );

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching trip details' });
  }
});

// Get Public Trip (Read-only)
router.get('/public/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const [[trip]] = await pool.query(
      'SELECT id, title, description, start_date, end_date, cover_image_url FROM trips WHERE id = ? AND sharing_status = "public"',
      [tripId]
    );

    if (!trip) {
      return res.status(404).json({ error: 'Trip is private or does not exist' });
    }

    // Fetch related public data (stops, activities)
    const [stops] = await pool.query('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index', [tripId]);
    
    // Attach activities to stops
    for (let stop of stops) {
      const [activities] = await pool.query('SELECT * FROM activities WHERE stop_id = ? ORDER BY start_time', [stop.id]);
      stop.activities = activities;
    }

    trip.stops = stops;

    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error fetching public trip' });
  }
});

// Copy Public Trip
router.post('/copy/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = 1; // Hardcoded until Auth is done

    // 1. Get original trip
    const [[originalTrip]] = await pool.query(
      'SELECT * FROM trips WHERE id = ? AND sharing_status = "public"',
      [tripId]
    );

    if (!originalTrip) {
      return res.status(404).json({ error: 'Cannot copy private trip' });
    }

    // 2. Create new trip
    const [newTripResult] = await pool.query(
      'INSERT INTO trips (user_id, title, description, start_date, end_date, total_budget, currency) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, `Copy of ${originalTrip.title}`, originalTrip.description, originalTrip.start_date, originalTrip.end_date, originalTrip.total_budget, originalTrip.currency]
    );
    const newTripId = newTripResult.insertId;

    // 3. Copy Stops and Activities
    const [stops] = await pool.query('SELECT * FROM stops WHERE trip_id = ?', [tripId]);
    for (let stop of stops) {
      const [newStopResult] = await pool.query(
        'INSERT INTO stops (trip_id, city_name, country_code, latitude, longitude, arrival_date, departure_date, order_index, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [newTripId, stop.city_name, stop.country_code, stop.latitude, stop.longitude, stop.arrival_date, stop.departure_date, stop.order_index, stop.notes]
      );
      const newStopId = newStopResult.insertId;

      const [activities] = await pool.query('SELECT * FROM activities WHERE stop_id = ?', [stop.id]);
      for (let act of activities) {
        await pool.query(
          'INSERT INTO activities (stop_id, title, description, category, cost, start_time, end_time, location_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [newStopId, act.title, act.description, act.category, act.cost, act.start_time, act.end_time, act.location_name]
        );
      }
    }

    res.json({ success: true, newTripId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error copying trip' });
  }
});

// Update trip notes (description)
router.put('/:tripId/notes', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { notes } = req.body;

    await pool.query(
      'UPDATE trips SET description = ? WHERE id = ?',
      [notes, tripId]
    );

    res.json({ success: true, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error updating notes' });
  }
});

// Update trip sharing status
router.put('/:tripId/share', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { sharing_status } = req.body;

    if (!['private', 'shared', 'public'].includes(sharing_status)) {
      return res.status(400).json({ error: 'Invalid sharing status' });
    }

    await pool.query(
      'UPDATE trips SET sharing_status = ? WHERE id = ?',
      [sharing_status, tripId]
    );

    res.json({ success: true, sharing_status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error updating sharing status' });
  }
});

module.exports = router;
