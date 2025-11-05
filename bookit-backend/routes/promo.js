import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

const router = express.Router();

// POST /promo/validate - Validate promo code
router.post('/validate',
  [
    body('code').trim().notEmpty().withMessage('Promo code is required'),
    body('orderAmount').isFloat({ min: 0 }).withMessage('Valid order amount is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { code, orderAmount } = req.body;

    try {
      const [rows] = await db.query(
        `SELECT * FROM promo_codes 
         WHERE code = ? 
           AND is_active = TRUE 
           AND valid_from <= NOW() 
           AND valid_until >= NOW()
           AND (usage_limit IS NULL OR used_count < usage_limit)`,
        [code.toUpperCase()]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Invalid or expired promo code'
        });
      }

      const promo = rows[0];
      const minOrderAmount = parseFloat(promo.min_order_amount);

      // Check minimum order requirement
      if (orderAmount < minOrderAmount) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount of Rs. ${minOrderAmount} required to use this promo code`
        });
      }

      let discountAmount = 0;

      // Calculate discount
      if (promo.discount_type === 'percentage') {
        discountAmount = (orderAmount * parseFloat(promo.discount_value)) / 100;
        
        // Apply max discount cap
        if (promo.max_discount_amount) {
          discountAmount = Math.min(discountAmount, parseFloat(promo.max_discount_amount));
        }
      } else if (promo.discount_type === 'fixed') {
        discountAmount = parseFloat(promo.discount_value);
      }

      const finalAmount = orderAmount - discountAmount;

      res.json({
        success: true,
        message: 'Promo code is valid',
        data: {
          code: promo.code,
          description: promo.description,
          discountType: promo.discount_type,
          discountValue: promo.discount_value,
          discountAmount: discountAmount.toFixed(2),
          originalAmount: orderAmount.toFixed(2),
          finalAmount: finalAmount.toFixed(2),
          savings: discountAmount.toFixed(2)
        }
      });

    } catch (error) {
      console.error('Error validating promo code:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate promo code',
        error: error.message
      });
    }
  }
);

export default router;
