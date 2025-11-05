import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// GET /experiences - Get all experiences
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id, title, description, location, price, 
        duration, image_url, category, rating, 
        created_at, updated_at
      FROM experiences
      ORDER BY rating DESC, created_at DESC
    `);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
      error: error.message
    });
  }
});

// GET /experiences/:id - Get single experience with available slots
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get experience details
    const [experienceRows] = await db.query(
      'SELECT * FROM experiences WHERE id = ?',
      [id]
    );

    if (experienceRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Get available slots for this experience
    const [slotRows] = await db.query(`
      SELECT 
        id, experience_id, date, time_slot, 
        total_capacity, available_capacity, status,
        created_at, updated_at
      FROM slots
      WHERE experience_id = ? 
        AND date >= CURDATE()
        AND available_capacity > 0
        AND status = 'available'
      ORDER BY date ASC, time_slot ASC
    `, [id]);

    // Group slots by date
    const slotsByDate = slotRows.reduce((acc, slot) => {
      const date = slot.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        experience: experienceRows[0],
        slots: slotsByDate,
        totalSlots: slotRows.length
      }
    });
  } catch (error) {
    console.error('Error fetching experience details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience details',
      error: error.message
    });
  }
});

export default router;
