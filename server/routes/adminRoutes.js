const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/adminController');

const router = express.Router();

// All admin routes require auth (in production you'd add an isAdmin middleware)
router.use(protect);

// GET /api/admin/stats — platform-wide analytics
router.get('/stats', getStats);

module.exports = router;
