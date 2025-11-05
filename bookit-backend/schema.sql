-- ============================================
-- BOOKIT DATABASE - MYSQL SCHEMA
-- ============================================

-- Create Database
DROP DATABASE IF EXISTS bookit_db;
CREATE DATABASE bookit_db;
USE bookit_db;

-- ============================================
-- 1. EXPERIENCES TABLE
-- ============================================
CREATE TABLE experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration VARCHAR(100),
    image_url TEXT,
    category VARCHAR(100),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. SLOTS TABLE
-- ============================================
CREATE TABLE slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    experience_id INT NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    total_capacity INT NOT NULL,
    available_capacity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
    UNIQUE KEY unique_slot (experience_id, date, time_slot),
    CHECK (available_capacity >= 0 AND available_capacity <= total_capacity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    experience_id INT NOT NULL,
    slot_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    number_of_people INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    promo_code VARCHAR(50),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    final_price DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE CASCADE,
    CHECK (number_of_people > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. PROMO_CODES TABLE
-- ============================================
CREATE TABLE promo_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL COMMENT 'percentage or fixed',
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10, 2),
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX idx_slots_experience ON slots(experience_id);
CREATE INDEX idx_slots_date ON slots(date);
CREATE INDEX idx_bookings_email ON bookings(user_email);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);

-- ============================================
-- INSERT SAMPLE EXPERIENCES
-- ============================================
INSERT INTO experiences (title, description, location, price, duration, image_url, category, rating) VALUES
('Hot Air Balloon Ride', 'Experience breathtaking views from a hot air balloon over scenic landscapes', 'Jaipur, Rajasthan', 5000.00, '3 hours', 'https://images.unsplash.com/photo-1498550744921-75f79806b163', 'Adventure', 4.80),
('Scuba Diving Adventure', 'Explore the underwater world with professional instructors', 'Goa', 4500.00, '4 hours', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', 'Adventure', 4.90),
('Mountain Trek', 'Guided trek through beautiful mountain trails', 'Manali, Himachal Pradesh', 3500.00, '6 hours', 'https://images.unsplash.com/photo-1551632811-561732d1e306', 'Adventure', 4.70),
('Heritage Walk', 'Explore historical monuments with expert guides', 'Delhi', 1500.00, '3 hours', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da', 'Cultural', 4.60),
('River Rafting', 'Thrilling white water rafting experience', 'Rishikesh, Uttarakhand', 2500.00, '2 hours', 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3', 'Adventure', 4.80),
('Yoga Retreat', 'Rejuvenating yoga sessions in peaceful surroundings', 'Kerala', 2000.00, '2 hours', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', 'Wellness', 4.90);

-- ============================================
-- INSERT SAMPLE SLOTS (next 7 days)
-- ============================================
INSERT INTO slots (experience_id, date, time_slot, total_capacity, available_capacity, status) VALUES
-- Hot Air Balloon slots
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00 AM - 09:00 AM', 10, 10, 'available'),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '06:00 AM - 09:00 AM', 10, 8, 'available'),
(1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00 AM - 09:00 AM', 10, 10, 'available'),

-- Scuba Diving slots
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00 AM - 02:00 PM', 15, 15, 'available'),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00 AM - 02:00 PM', 15, 12, 'available'),
(2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '10:00 AM - 02:00 PM', 15, 15, 'available'),

-- Mountain Trek slots
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00 AM - 01:00 PM', 20, 20, 'available'),
(3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '07:00 AM - 01:00 PM', 20, 18, 'available'),

-- Heritage Walk slots
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00 AM - 12:00 PM', 25, 25, 'available'),
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '02:00 PM - 05:00 PM', 25, 22, 'available'),
(4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00 AM - 12:00 PM', 25, 25, 'available'),

-- River Rafting slots
(5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00 AM - 01:00 PM', 12, 12, 'available'),
(5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '11:00 AM - 01:00 PM', 12, 10, 'available'),

-- Yoga Retreat slots
(6, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00 AM - 08:00 AM', 30, 30, 'available'),
(6, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '06:00 AM - 08:00 AM', 30, 25, 'available'),
(6, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00 AM - 08:00 AM', 30, 30, 'available');

-- ============================================
-- INSERT SAMPLE PROMO CODES
-- ============================================
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, valid_from, valid_until, usage_limit) VALUES
('SAVE10', '10% off on all bookings', 'percentage', 10.00, 1000.00, 500.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 100),
('FLAT100', 'Flat Rs. 100 off', 'fixed', 100.00, 500.00, 100.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 200),
('WELCOME20', '20% off for new users', 'percentage', 20.00, 1500.00, 1000.00, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 50),
('ADVENTURE50', 'Rs. 50 off on adventure activities', 'fixed', 50.00, 1000.00, 50.00, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), NULL);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Check all tables
SHOW TABLES;

-- Count records
SELECT 'experiences' as table_name, COUNT(*) as record_count FROM experiences
UNION ALL
SELECT 'slots', COUNT(*) FROM slots
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'promo_codes', COUNT(*) FROM promo_codes;

-- View sample data
SELECT * FROM experiences;
SELECT * FROM slots ORDER BY date;
SELECT * FROM promo_codes WHERE is_active = TRUE;
