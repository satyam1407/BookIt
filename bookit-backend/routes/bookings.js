import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

const router = express.Router();

// POST /bookings - Create new booking
router.post('/',
  [
    body('experienceId').isInt().withMessage('Valid experience ID is required'),
    body('slotId').isInt().withMessage('Valid slot ID is required'),
    body('userName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('userEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('userPhone').optional().isMobilePhone().withMessage('Valid phone number is required'),
    body('numberOfPeople').isInt({ min: 1 }).withMessage('Number of people must be at least 1'),
    body('promoCode').optional().trim()
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      experienceId,
      slotId,
      userName,
      userEmail,
      userPhone,
      numberOfPeople,
      promoCode
    } = req.body;

    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      // Lock the slot row to prevent double booking (FOR UPDATE)
      const [slotRows] = await connection.query(
        `SELECT * FROM slots 
         WHERE id = ? AND experience_id = ? 
         FOR UPDATE`,
        [slotId, experienceId]
      );

      if (slotRows.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Slot not found'
        });
      }

      const slot = slotRows[0];

      // Check if slot is available
      if (slot.available_capacity < numberOfPeople) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          success: false,
          message: `Only ${slot.available_capacity} spots available. Please reduce number of people.`
        });
      }

      if (slot.status !== 'available') {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'This slot is no longer available'
        });
      }

      // Get experience price
      const [experienceRows] = await connection.query(
        'SELECT price FROM experiences WHERE id = ?',
        [experienceId]
      );

      if (experienceRows.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        });
      }

      const basePrice = parseFloat(experienceRows[0].price);
      const totalPrice = basePrice * numberOfPeople;
      let discountAmount = 0;
      let finalPrice = totalPrice;

      // Apply promo code if provided
      if (promoCode) {
        const [promoRows] = await connection.query(
          `SELECT * FROM promo_codes 
           WHERE code = ? 
             AND is_active = TRUE 
             AND valid_from <= NOW() 
             AND valid_until >= NOW()
             AND (usage_limit IS NULL OR used_count < usage_limit)`,
          [promoCode.toUpperCase()]
        );

        if (promoRows.length > 0) {
          const promo = promoRows[0];

          // Check minimum order amount
          if (totalPrice >= parseFloat(promo.min_order_amount)) {
            if (promo.discount_type === 'percentage') {
              discountAmount = (totalPrice * parseFloat(promo.discount_value)) / 100;
              
              // Apply max discount cap if exists
              if (promo.max_discount_amount) {
                discountAmount = Math.min(discountAmount, parseFloat(promo.max_discount_amount));
              }
            } else if (promo.discount_type === 'fixed') {
              discountAmount = parseFloat(promo.discount_value);
            }

            finalPrice = totalPrice - discountAmount;

            // Update promo code usage count
            await connection.query(
              'UPDATE promo_codes SET used_count = used_count + 1 WHERE id = ?',
              [promo.id]
            );
          }
        }
      }

      // Create booking
      const [bookingResult] = await connection.query(
        `INSERT INTO bookings (
          experience_id, slot_id, user_name, user_email, user_phone,
          number_of_people, total_price, promo_code, discount_amount, final_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          experienceId, slotId, userName, userEmail, userPhone,
          numberOfPeople, totalPrice, promoCode || null, discountAmount, finalPrice
        ]
      );

      // Update slot availability
      const newAvailableCapacity = slot.available_capacity - numberOfPeople;
      const newStatus = newAvailableCapacity === 0 ? 'sold_out' : 'available';

      await connection.query(
        `UPDATE slots 
         SET available_capacity = ?, status = ?
         WHERE id = ?`,
        [newAvailableCapacity, newStatus, slotId]
      );

      // Commit transaction
      await connection.commit();
      connection.release();

      // Fetch the created booking
      const [bookingRows] = await db.query(
        'SELECT * FROM bookings WHERE id = ?',
        [bookingResult.insertId]
      );

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: bookingRows[0]
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Error creating booking:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: error.message
      });
    }
  }
);

// GET /bookings/user/:email - Get bookings by email
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT 
        b.*, 
        e.title as experience_title, 
        e.location,
        e.image_url,
        s.date, 
        s.time_slot
       FROM bookings b
       JOIN experiences e ON b.experience_id = e.id
       JOIN slots s ON b.slot_id = s.id
       WHERE b.user_email = ?
       ORDER BY b.created_at DESC`,
      [email]
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

export default router;
