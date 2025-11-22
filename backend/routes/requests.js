const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all blood requests
router.get('/', async (req, res) => {
  try {
    const { status, hospitalId, bloodType, urgency } = req.query;

    let query = `
      SELECT br.*, h.Hospital_Name, h.Contact, h.Address,
             a.Full_Name as Approved_By_Name
      FROM Blood_Requests br
      JOIN Hospitals h ON br.Hospital_ID = h.Hospital_ID
      LEFT JOIN Admins a ON br.Approved_By = a.Admin_ID
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND br.Status = ?';
      params.push(status);
    }

    if (hospitalId) {
      query += ' AND br.Hospital_ID = ?';
      params.push(hospitalId);
    }

    if (bloodType) {
      query += ' AND br.Blood_Type = ?';
      params.push(bloodType);
    }

    if (urgency) {
      query += ' AND br.Urgency_Level = ?';
      params.push(urgency);
    }

    query += ' ORDER BY br.Request_Date DESC';

    const [requests] = await db.query(query, params);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get request by ID
router.get('/:id', async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT br.*, h.Hospital_Name, h.Contact, h.Address, h.Email,
              a.Full_Name as Approved_By_Name
       FROM Blood_Requests br
       JOIN Hospitals h ON br.Hospital_ID = h.Hospital_ID
       LEFT JOIN Admins a ON br.Approved_By = a.Admin_ID
       WHERE br.Request_ID = ?`,
      [req.params.id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(requests[0]);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new blood request
router.post('/', async (req, res) => {
  try {
    const {
      hospitalId,
      bloodType,
      unitsRequested,
      urgencyLevel,
      requiredByDate,
      notes
    } = req.body;

    if (!hospitalId || !bloodType || !unitsRequested) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [result] = await db.query(
      `INSERT INTO Blood_Requests
       (Hospital_ID, Blood_Type, Units_Requested, Urgency_Level, Required_By_Date, Notes, Status)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [hospitalId, bloodType, unitsRequested, urgencyLevel || 'Medium', requiredByDate, notes]
    );

    const [newRequest] = await db.query(
      `SELECT br.*, h.Hospital_Name
       FROM Blood_Requests br
       JOIN Hospitals h ON br.Hospital_ID = h.Hospital_ID
       WHERE br.Request_ID = ?`,
      [result.insertId]
    );

    res.status(201).json(newRequest[0]);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update request status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const adminId = req.admin.adminId;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const updateData = { Status: status };

      if (status === 'Approved') {
        updateData.Approved_By = adminId;
        updateData.Approval_Date = new Date();
      } else if (status === 'Completed') {
        updateData.Completion_Date = new Date();

        // Get request details
        const [requests] = await connection.query(
          'SELECT * FROM Blood_Requests WHERE Request_ID = ?',
          [requestId]
        );

        if (requests.length > 0) {
          const request = requests[0];

          // Update inventory - reduce available units
          await connection.query(
            `UPDATE Blood_Inventory
             SET Quantity = Quantity - ?
             WHERE Blood_Type = ? AND Status = 'Available' AND Quantity >= ?
             LIMIT 1`,
            [request.Units_Requested, request.Blood_Type, request.Units_Requested]
          );
        }
      }

      await connection.query(
        'UPDATE Blood_Requests SET Status = ?, Approved_By = ?, Approval_Date = ?, Completion_Date = ? WHERE Request_ID = ?',
        [status, updateData.Approved_By || null, updateData.Approval_Date || null, updateData.Completion_Date || null, requestId]
      );

      await connection.commit();

      const [updatedRequest] = await db.query(
        `SELECT br.*, h.Hospital_Name
         FROM Blood_Requests br
         JOIN Hospitals h ON br.Hospital_ID = h.Hospital_ID
         WHERE br.Request_ID = ?`,
        [requestId]
      );

      res.json(updatedRequest[0]);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete request
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM Blood_Requests WHERE Request_ID = ?', [req.params.id]);
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get request statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [statusStats] = await db.query(
      'SELECT Status, COUNT(*) as count FROM Blood_Requests GROUP BY Status'
    );

    const [urgencyStats] = await db.query(
      'SELECT Urgency_Level, COUNT(*) as count FROM Blood_Requests GROUP BY Urgency_Level'
    );

    const [pending] = await db.query(
      "SELECT COUNT(*) as count FROM Blood_Requests WHERE Status = 'Pending'"
    );

    res.json({
      byStatus: statusStats,
      byUrgency: urgencyStats,
      pendingCount: pending[0].count
    });
  } catch (error) {
    console.error('Error fetching request stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
