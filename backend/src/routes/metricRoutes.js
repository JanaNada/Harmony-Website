const express = require('express');
const router = express.Router();
const metricController = require('../controllers/metricController');

// Public route to record a view (no auth needed)
router.post('/views/:serviceId', metricController.recordView);

// Route to fetch metrics (admin dashboard)
router.get('/views', metricController.getMetrics);

module.exports = router;