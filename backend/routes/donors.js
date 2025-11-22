const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all donors
router.get('/', async (req, res) => {
  try {
    const { bloodType, eligibility, search } = req.query;

    let query = 'SELECT * FROM Donors WHERE 1=1';
    const params = [];

    if (bloodType) {
      query += ' AND Blood_Type = ?';
      params.push(bloodType);
    }

    if (eligibility) {
      query += ' AND Eligibility_Status = ?';
      params.push(eligibility);
    }

    if (search) {
      query += ' AND (First_Name LIKE ? OR Last_Name LIKE ? OR Email LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY Created_At DESC';

    const [donors] = await db.query(query, params);
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donor by ID
router.get('/:id', async (req, res) => {
  try {
    const [donors] = await db.query(
      'SELECT * FROM Donors WHERE Donor_ID = ?',
      [req.params.id]
    );

    if (donors.length === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json(donors[0]);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new donor
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bloodType,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      address,
      medicalHistory
    } = req.body;

    // Validation
    if (!firstName || !lastName || !bloodType || !dateOfBirth || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO Donors
       (First_Name, Last_Name, Blood_Type, Date_Of_Birth, Gender,
        Contact_Number, Email, Address, Medical_History, Eligibility_Status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Eligible')`,
      [firstName, lastName, bloodType, dateOfBirth, gender,
       contactNumber, email, address, medicalHistory]
    );

    const [newDonor] = await db.query(
      'SELECT * FROM Donors WHERE Donor_ID = ?',
      [result.insertId]
    );

    res.status(201).json(newDonor[0]);
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update donor
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bloodType,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      address,
      medicalHistory,
      eligibilityStatus,
      lastDonationDate
    } = req.body;

    await db.query(
      `UPDATE Donors SET
       First_Name = ?, Last_Name = ?, Blood_Type = ?, Date_Of_Birth = ?,
       Gender = ?, Contact_Number = ?, Email = ?, Address = ?,
       Medical_History = ?, Eligibility_Status = ?, Last_Donation_Date = ?
       WHERE Donor_ID = ?`,
      [firstName, lastName, bloodType, dateOfBirth, gender, contactNumber,
       email, address, medicalHistory, eligibilityStatus, lastDonationDate,
       req.params.id]
    );

    const [updatedDonor] = await db.query(
      'SELECT * FROM Donors WHERE Donor_ID = ?',
      [req.params.id]
    );

    res.json(updatedDonor[0]);
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete donor
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM Donors WHERE Donor_ID = ?', [req.params.id]);
    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get donor statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalCount] = await db.query('SELECT COUNT(*) as count FROM Donors');
    const [eligibleCount] = await db.query(
      "SELECT COUNT(*) as count FROM Donors WHERE Eligibility_Status = 'Eligible'"
    );
    const [bloodTypeStats] = await db.query(
      'SELECT Blood_Type, COUNT(*) as count FROM Donors GROUP BY Blood_Type'
    );

    res.json({
      total: totalCount[0].count,
      eligible: eligibleCount[0].count,
      byBloodType: bloodTypeStats
    });
  } catch (error) {
    console.error('Error fetching donor stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
