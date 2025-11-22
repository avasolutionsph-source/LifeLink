const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all donation records
router.get('/', async (req, res) => {
  try {
    const { donorId, hospitalId, bloodType, startDate, endDate } = req.query;

    let query = `
      SELECT dr.*, d.First_Name, d.Last_Name, d.Blood_Type as Donor_Blood_Type,
             h.Hospital_Name
      FROM Donation_Records dr
      JOIN Donors d ON dr.Donor_ID = d.Donor_ID
      LEFT JOIN Hospitals h ON dr.Hospital_ID = h.Hospital_ID
      WHERE 1=1
    `;
    const params = [];

    if (donorId) {
      query += ' AND dr.Donor_ID = ?';
      params.push(donorId);
    }

    if (hospitalId) {
      query += ' AND dr.Hospital_ID = ?';
      params.push(hospitalId);
    }

    if (bloodType) {
      query += ' AND dr.Blood_Type = ?';
      params.push(bloodType);
    }

    if (startDate) {
      query += ' AND dr.Donation_Date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND dr.Donation_Date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY dr.Donation_Date DESC';

    const [donations] = await db.query(query, params);
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const [donations] = await db.query(
      `SELECT dr.*, d.First_Name, d.Last_Name, d.Contact_Number, d.Email,
              h.Hospital_Name, h.Address
       FROM Donation_Records dr
       JOIN Donors d ON dr.Donor_ID = d.Donor_ID
       LEFT JOIN Hospitals h ON dr.Hospital_ID = h.Hospital_ID
       WHERE dr.Donation_ID = ?`,
      [req.params.id]
    );

    if (donations.length === 0) {
      return res.status(404).json({ error: 'Donation record not found' });
    }

    res.json(donations[0]);
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new donation record
router.post('/', auth, async (req, res) => {
  try {
    const {
      donorId,
      hospitalId,
      donationDate,
      bloodType,
      unitsDonated,
      healthStatus,
      notes
    } = req.body;

    if (!donorId || !donationDate || !bloodType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert donation record
      const [result] = await connection.query(
        `INSERT INTO Donation_Records
         (Donor_ID, Hospital_ID, Donation_Date, Blood_Type, Units_Donated, Health_Status, Notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [donorId, hospitalId, donationDate, bloodType, unitsDonated || 1, healthStatus, notes]
      );

      // Update donor's last donation date
      await connection.query(
        'UPDATE Donors SET Last_Donation_Date = ? WHERE Donor_ID = ?',
        [donationDate, donorId]
      );

      // Add to inventory (expiry 90 days from collection)
      const expiryDate = new Date(donationDate);
      expiryDate.setDate(expiryDate.getDate() + 90);

      await connection.query(
        `INSERT INTO Blood_Inventory
         (Blood_Type, Quantity, Collection_Date, Expiry_Date, Status, Hospital_ID)
         VALUES (?, ?, ?, ?, 'Available', ?)`,
        [bloodType, unitsDonated || 1, donationDate, expiryDate.toISOString().split('T')[0], hospitalId]
      );

      await connection.commit();

      const [newDonation] = await db.query(
        'SELECT * FROM Donation_Records WHERE Donation_ID = ?',
        [result.insertId]
      );

      res.status(201).json(newDonation[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donation statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { startDate, endDate, hospitalId } = req.query;

    let query = 'SELECT COUNT(*) as total FROM Donation_Records WHERE 1=1';
    const params = [];

    if (startDate) {
      query += ' AND Donation_Date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND Donation_Date <= ?';
      params.push(endDate);
    }

    if (hospitalId) {
      query += ' AND Hospital_ID = ?';
      params.push(hospitalId);
    }

    const [total] = await db.query(query, params);

    let bloodTypeQuery = `
      SELECT Blood_Type, COUNT(*) as count
      FROM Donation_Records
      WHERE 1=1
    `;

    if (startDate) {
      bloodTypeQuery += ' AND Donation_Date >= ?';
    }
    if (endDate) {
      bloodTypeQuery += ' AND Donation_Date <= ?';
    }
    if (hospitalId) {
      bloodTypeQuery += ' AND Hospital_ID = ?';
    }

    bloodTypeQuery += ' GROUP BY Blood_Type';

    const [byBloodType] = await db.query(bloodTypeQuery, params);

    let hospitalQuery = `
      SELECT h.Hospital_Name, COUNT(*) as count
      FROM Donation_Records dr
      JOIN Hospitals h ON dr.Hospital_ID = h.Hospital_ID
      WHERE 1=1
    `;

    if (startDate) {
      hospitalQuery += ' AND dr.Donation_Date >= ?';
    }
    if (endDate) {
      hospitalQuery += ' AND dr.Donation_Date <= ?';
    }

    hospitalQuery += ' GROUP BY h.Hospital_Name';

    const hospitalParams = [];
    if (startDate) hospitalParams.push(startDate);
    if (endDate) hospitalParams.push(endDate);

    const [byHospital] = await db.query(hospitalQuery, hospitalParams);

    res.json({
      total: total[0].total,
      byBloodType,
      byHospital
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
