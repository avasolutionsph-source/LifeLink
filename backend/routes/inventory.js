const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get inventory with filters
router.get('/', async (req, res) => {
  try {
    const { bloodType, hospitalId, status, expiringWithin } = req.query;

    let query = `
      SELECT bi.*, h.Hospital_Name
      FROM Blood_Inventory bi
      LEFT JOIN Hospitals h ON bi.Hospital_ID = h.Hospital_ID
      WHERE 1=1
    `;
    const params = [];

    if (bloodType) {
      query += ' AND bi.Blood_Type = ?';
      params.push(bloodType);
    }

    if (hospitalId) {
      query += ' AND bi.Hospital_ID = ?';
      params.push(hospitalId);
    }

    if (status) {
      query += ' AND bi.Status = ?';
      params.push(status);
    }

    if (expiringWithin) {
      query += ' AND bi.Expiry_Date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)';
      params.push(parseInt(expiringWithin));
    }

    query += ' ORDER BY bi.Expiry_Date ASC';

    const [inventory] = await db.query(query, params);
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get inventory summary
router.get('/summary', async (req, res) => {
  try {
    const [totalUnits] = await db.query(
      "SELECT SUM(Quantity) as total FROM Blood_Inventory WHERE Status = 'Available'"
    );

    const [byBloodType] = await db.query(
      `SELECT Blood_Type, SUM(Quantity) as total
       FROM Blood_Inventory
       WHERE Status = 'Available'
       GROUP BY Blood_Type`
    );

    const [expiringSoon] = await db.query(
      `SELECT COUNT(*) as count
       FROM Blood_Inventory
       WHERE Status = 'Available'
       AND Expiry_Date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)`
    );

    const [byHospital] = await db.query(
      `SELECT h.Hospital_Name, SUM(bi.Quantity) as total
       FROM Blood_Inventory bi
       JOIN Hospitals h ON bi.Hospital_ID = h.Hospital_ID
       WHERE bi.Status = 'Available'
       GROUP BY h.Hospital_Name`
    );

    res.json({
      totalUnits: totalUnits[0].total || 0,
      byBloodType,
      expiringSoon: expiringSoon[0].count || 0,
      byHospital
    });
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add inventory unit
router.post('/', auth, async (req, res) => {
  try {
    const {
      bloodType,
      quantity,
      collectionDate,
      expiryDate,
      hospitalId,
      status
    } = req.body;

    if (!bloodType || !quantity || !collectionDate || !expiryDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO Blood_Inventory
       (Blood_Type, Quantity, Collection_Date, Expiry_Date, Status, Hospital_ID)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bloodType, quantity, collectionDate, expiryDate, status || 'Available', hospitalId]
    );

    const [newUnit] = await db.query(
      'SELECT * FROM Blood_Inventory WHERE Unit_ID = ?',
      [result.insertId]
    );

    res.status(201).json(newUnit[0]);
  } catch (error) {
    console.error('Error adding inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update inventory unit
router.put('/:id', auth, async (req, res) => {
  try {
    const { quantity, status, expiryDate } = req.body;

    await db.query(
      'UPDATE Blood_Inventory SET Quantity = ?, Status = ?, Expiry_Date = ? WHERE Unit_ID = ?',
      [quantity, status, expiryDate, req.params.id]
    );

    const [updatedUnit] = await db.query(
      'SELECT * FROM Blood_Inventory WHERE Unit_ID = ?',
      [req.params.id]
    );

    res.json(updatedUnit[0]);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete inventory unit
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM Blood_Inventory WHERE Unit_ID = ?', [req.params.id]);
    res.json({ message: 'Inventory unit deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
