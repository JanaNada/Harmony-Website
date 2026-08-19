const db = require('../config/db');

// Increment view count for a service
exports.recordView = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    // Validate serviceId length to prevent issues
    if (!serviceId || serviceId.length > 50) {
      return res.status(400).json({ error: 'Invalid service ID' });
    }

    await db.query(`
      INSERT INTO service_metrics (service_id, view_count) 
      VALUES (?, 1)
      ON DUPLICATE KEY UPDATE view_count = view_count + 1
    `, [serviceId]);

    res.status(200).json({ message: 'View recorded successfully' });
  } catch (error) {
    console.error('Error recording view:', error);
    res.status(500).json({ error: 'Failed to record view' });
  }
};

// Get view counts for all services
exports.getMetrics = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT service_id, view_count FROM service_metrics');
    
    // Convert to a nice key-value object
    const metrics = {};
    for (const row of rows) {
      metrics[row.service_id] = row.view_count;
    }
    
    res.json({ metrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};