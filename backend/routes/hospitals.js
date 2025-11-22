const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const [hospitals] = await db.query(
      'SELECT * FROM Hospitals ORDER BY Hospital_Name'
    );
    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get hospital by ID
router.get('/:id', async (req, res) => {
  try {
    const [hospitals] = await db.query(
      'SELECT * FROM Hospitals WHERE Hospital_ID = ?',
      [req.params.id]
    );

    if (hospitals.length === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json(hospitals[0]);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get hospital statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const hospitalId = req.params.id;

    const [inventoryStats] = await db.query(
      `SELECT Blood_Type, SUM(Quantity) as total
       FROM Blood_Inventory
       WHERE Hospital_ID = ? AND Status = 'Available'
       GROUP BY Blood_Type`,
      [hospitalId]
    );

    const [donationCount] = await db.query(
      'SELECT COUNT(*) as count FROM Donation_Records WHERE Hospital_ID = ?',
      [hospitalId]
    );

    const [requestStats] = await db.query(
      `SELECT Status, COUNT(*) as count
       FROM Blood_Requests
       WHERE Hospital_ID = ?
       GROUP BY Status`,
      [hospitalId]
    );

    res.json({
      inventory: inventoryStats,
      totalDonations: donationCount[0].count,
      requests: requestStats
    });
  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
