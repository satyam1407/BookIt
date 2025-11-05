# BookIt - Experiences & Slots Booking System

A full-stack web application for booking travel experiences with real-time slot availability, promo code validation, and secure bookings. Built with React + TypeScript for the frontend and Node.js + Express + MySQL for the backend.

## 🎯 Project Overview

**BookIt** is an end-to-end booking platform where users can:
- Browse and search travel experiences across different categories
- Select available dates and time slots for experiences
- Apply promo codes for discounts
- Complete secure bookings with real-time price calculation
- View booking confirmations and history

The application demonstrates modern fullstack development practices including:
- Responsive UI with TailwindCSS
- Type-safe frontend with TypeScript
- REST API with proper validation
- Database transaction handling to prevent double-booking
- Production-ready deployment architecture

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL 8.0** - Database
- **mysql2/promise** - MySQL driver with connection pooling
- **express-validator** - Input validation and sanitization
- **CORS** - Cross-origin request handling
- **dotenv** - Environment variable management

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway MySQL

---

## 📁 Project Structure

```
bookit-project/
│
├── bookit-frontend/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Navigation component
│   │   │   └── Footer.tsx             # Footer component
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # Home page with search & grid
│   │   │   ├── DetailsPage.tsx        # Experience details page
│   │   │   ├── CheckoutPage.tsx       # Booking checkout page
│   │   │   ├── ResultPage.tsx         # Booking confirmation page
│   │   │   ├── AboutPage.tsx          # About page
│   │   │   └── ContactPage.tsx        # Contact & FAQ page
│   │   ├── services/
│   │   │   └── api.ts                 # API service & types
│   │   ├── App.tsx                    # Main app component
│   │   ├── main.tsx                   # Entry point
│   │   ├── index.css                  # Global styles + Tailwind
│   │   └── vite-env.d.ts              # Vite types
│   ├── public/                        # Static assets
│   ├── .env                           # Environment variables (local)
│   ├── .env.example                   # Example env file
│   ├── vite.config.ts                 # Vite configuration
│   ├── tailwind.config.js             # TailwindCSS configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── package.json                   # Dependencies
│   └── index.html                     # HTML template
│
├── bookit-backend/                    # Express + MySQL Backend
│   ├── config/
│   │   └── database.js                # MySQL connection pool
│   ├── routes/
│   │   ├── experiences.js             # Experience API routes
│   │   ├── bookings.js                # Booking API routes
│   │   └── promo.js                   # Promo code API routes
│   ├── .env                           # Environment variables (local)
│   ├── .env.example                   # Example env file
│   ├── .gitignore                     # Git ignore rules
│   ├── package.json                   # Dependencies
│   ├── schema.sql                     # Database schema & seed data
│   ├── server.js                      # Main server file
│   └── README.md                      # Backend documentation
│
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MySQL 8.0+ installed locally (for development)
- GitHub account (for deployment)
- Vercel account (for frontend deployment)
- Railway account (for backend & database deployment)

### Local Development Setup

#### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/bookit-project.git
cd bookit-project
```

#### Step 2: Backend Setup

**Install dependencies:**
```bash
cd bookit-backend
npm install
```

**Create MySQL database locally:**
```bash
# Open MySQL CLI
mysql -u root -p

# Create database and run schema
mysql> source schema.sql
```

**Configure environment variables:**
```bash
# Create .env file
cp .env.example .env

# Edit .env with your local MySQL credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bookit_db
DB_PORT=3306
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Start backend server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

Verify with:
```bash
curl http://localhost:5000/api/health
```

#### Step 3: Frontend Setup

**Install dependencies:**
```bash
cd ../bookit-frontend
npm install
```

**Configure environment variables:**
```bash
# Create .env file
cp .env.example .env

# Edit .env
VITE_API_URL=http://localhost:5000/api
```

**Start development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

#### Step 4: Test the Application

1. Open http://localhost:5173 in browser
2. Browse experiences on home page
3. Click on an experience to view details
4. Select date and time slot
5. Proceed to checkout
6. Use promo code: `SAVE10` (10% discount)
7. Complete booking

---

## 📚 Features

### Home Page
- Search experiences by title, location, category, or description
- Grid layout showing 4 experiences per row (responsive)
- Price display with "View Details" button
- Real-time filtering with search functionality

### Details Page
- Large experience image
- Complete description and information
- Date selection with availability count
- Time slot selection showing remaining spots
- Quantity selector with +/- buttons
- Real-time price calculation with taxes
- Sticky price card for easy reference
- Confirm button (active only when date & time selected)

### Checkout Page
- Full name and email input (required)
- Promo code application with real-time validation
- Order summary showing experience details
- Breakdown of subtotal, taxes, and discount
- Terms & safety policy acceptance checkbox
- Pay and Confirm button (yellow, prominent)
- Loading states and error messages

### Result Page
- Success confirmation with booking details
- Booking ID display
- Experience summary with date and time
- Booking confirmation email notification
- Failed booking error messaging
- Print booking confirmation functionality

### About Page
- Company mission and vision
- Core values section with icons
- Statistics display (bookings, experiences, cities)
- Team member profiles with photos and bios
- Company journey timeline
- Call-to-action section

### Contact Page
- Contact information cards (email, phone, address, hours)
- Contact form with validation
- FAQ section with collapsible answers
- Social media links
- Map integration placeholder
- Professional form styling

---

## 🔌 API Endpoints

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://bookit-backend.up.railway.app/api`

### Experiences
- **GET** `/experiences` - Get all experiences
  - Response: Array of experience objects with pricing and details
  
- **GET** `/experiences/:id` - Get experience details with available slots
  - Response: Experience object with slots grouped by date

### Bookings
- **POST** `/bookings` - Create new booking
  - Body: { experienceId, slotId, userName, userEmail, userPhone, numberOfPeople, promoCode }
  - Response: Created booking object with confirmation details
  - Includes: Database transaction with row-level locking to prevent double-booking
  
- **GET** `/bookings/user/:email` - Get user's bookings
  - Response: Array of user's previous bookings with experience details

### Promo Codes
- **POST** `/promo/validate` - Validate promo code
  - Body: { code, orderAmount }
  - Response: Discount calculation with final amount
  - Validates: Minimum order amount, expiry dates, usage limits

---

## 💾 Database Schema

### experiences
```sql
- id (PRIMARY KEY)
- title, description, location
- price, duration
- image_url, category, rating
- created_at, updated_at
```

### slots
```sql
- id (PRIMARY KEY)
- experience_id (FOREIGN KEY)
- date, time_slot
- total_capacity, available_capacity
- status (available/sold_out)
- created_at, updated_at
```

### bookings
```sql
- id (PRIMARY KEY)
- experience_id, slot_id (FOREIGN KEYS)
- user_name, user_email, user_phone
- number_of_people
- total_price, promo_code, discount_amount, final_price
- booking_status (confirmed/failed)
- created_at, updated_at
```

### promo_codes
```sql
- id (PRIMARY KEY)
- code (UNIQUE), description
- discount_type (percentage/fixed)
- discount_value, min_order_amount, max_discount_amount
- valid_from, valid_until
- usage_limit, used_count
- is_active
- created_at, updated_at
```

---

## 🎟️ Sample Promo Codes

Use these codes during checkout (valid for 30-60 days from deployment):

| Code | Type | Discount | Min Order | Max Discount |
|------|------|----------|-----------|--------------|
| SAVE10 | Percentage | 10% | ₹1000 | ₹500 |
| FLAT100 | Fixed | ₹100 | ₹500 | ₹100 |
| WELCOME20 | Percentage | 20% | ₹1500 | ₹1000 |
| ADVENTURE50 | Fixed | ₹50 | ₹1000 | ₹50 |

---

## 🔒 Security Features

- **SQL Injection Prevention:** Parameterized queries using mysql2/promise
- **XSS Protection:** Input sanitization with express-validator
- **CORS Configuration:** Restricted to frontend origin only
- **Double-Booking Prevention:** Database-level row-level locking in transactions
- **Email Validation:** RFC-compliant email verification
- **Password Hashing:** Ready for authentication (not implemented in this version)
- **HTTPS:** Enforced in production on Railway/Vercel
- **Environment Variables:** Sensitive data kept out of codebase

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Create Vercel Account:** https://vercel.com/signup
2. **Import Project:**
   - Go to Vercel Dashboard → New Project
   - Select GitHub repository
   - Choose `bookit-frontend` folder
   - Framework: Vite
3. **Environment Variables:**
   - VITE_API_URL = (your Railway backend URL)/api
4. **Deploy:** Click Deploy
5. **Get URL:** Copy Vercel deployment URL

### Backend Deployment (Railway)

1. **Create Railway Account:** https://railway.app/
2. **Create New Project:**
   - Click New Project → Deploy from GitHub
   - Select `bookit-backend` repository
3. **Add MySQL Database:**
   - In same project: New → Add MySQL
   - Wait for provisioning
   - Copy MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT
4. **Configure Backend Service:**
   - Build Command: npm install
   - Start Command: node server.js
   - Add Environment Variables:
     ```
     PORT=5000
     NODE_ENV=production
     DB_HOST=(from MySQL service)
     DB_USER=(from MySQL service)
     DB_PASSWORD=(from MySQL service)
     DB_NAME=(from MySQL service)
     DB_PORT=(from MySQL service)
     FRONTEND_URL=(your Vercel URL)
     ```
5. **Deploy & Get URL:** Copy Railway deployment URL
6. **Import Database Schema:**
   - Connect to Railway MySQL using provided credentials
   - Run schema.sql to create tables and seed data

### Update Frontend with Backend URL

1. Go to Vercel Project → Settings → Environment Variables
2. Update `VITE_API_URL` with Railway backend URL
3. Redeploy frontend

---

## 📝 Environment Variables

### Frontend (.env.example)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env.example)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bookit_db
DB_PORT=3306

FRONTEND_URL=http://localhost:5173
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Home page loads experiences correctly
- [ ] Search functionality filters experiences
- [ ] Details page shows all slots with availability
- [ ] Date selection updates available time slots
- [ ] Price calculation updates with quantity changes
- [ ] Promo code validation works
- [ ] Double-booking prevention (try same slot simultaneously)
- [ ] Checkout form validation shows errors
- [ ] Successful booking shows confirmation
- [ ] Failed booking shows error message
- [ ] Responsive design works on mobile/tablet/desktop

### API Testing (Postman)

**Get All Experiences:**
```
GET /api/experiences
```

**Get Experience with Slots:**
```
GET /api/experiences/1
```

**Create Booking:**
```
POST /api/bookings
Body: {
  "experienceId": 1,
  "slotId": 1,
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "numberOfPeople": 2,
  "promoCode": "SAVE10"
}
```

**Validate Promo:**
```
POST /api/promo/validate
Body: {
  "code": "SAVE10",
  "orderAmount": 5000
}
```

---

## 🐛 Troubleshooting

### Backend Connection Issues
**Problem:** Backend not connecting to MySQL
- Check MySQL service is running
- Verify DB credentials in .env
- Ensure database `bookit_db` exists
- Run schema.sql to create tables

### CORS Errors
**Problem:** Frontend can't reach backend
- Verify FRONTEND_URL in backend .env matches your deployment URL
- Check VITE_API_URL in frontend .env is correct
- Redeploy backend after changing FRONTEND_URL

### Promo Code Not Working
**Problem:** Promo code validation fails
- Ensure promo code exists in database
- Check valid_from and valid_until dates
- Verify order amount meets min_order_amount
- Check usage_limit hasn't been exceeded

### Slots Not Showing
**Problem:** No time slots visible
- Verify slots table has data with future dates
- Check slot status is 'available'
- Confirm available_capacity > 0
- Check database connection is working

---

## 📊 Performance Optimization

- Connection pooling for MySQL (10 connections)
- Indexed database queries for fast lookups
- Vite for optimized bundle building
- TailwindCSS purging unused styles
- Image lazy loading on card components
- Sticky price card reduces scroll fatigue

---

## 📄 License

This project is created for educational purposes as part of a fullstack internship assignment.

---

## 👥 Author

**Your Name**  
BTech Computer Science Student  
2025

---

## 📞 Support & Contact

- **Email:** support@bookit.com
- **Phone:** +91 9876543210
- **Website:** https://bookit-frontend.vercel.app
- **GitHub:** https://github.com/yourusername/bookit-project

---

## ✅ Checklist for Submission

- [ ] Frontend deployed on Vercel with working URL
- [ ] Backend deployed on Railway with working URL
- [ ] MySQL database set up with all tables and sample data
- [ ] All environment variables configured correctly
- [ ] Search functionality working on home page
- [ ] Booking flow complete (home → details → checkout → confirmation)
- [ ] Promo codes validated and applied correctly
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] No console errors in browser DevTools
- [ ] API endpoints responding correctly
- [ ] GitHub repository with clean commit history
- [ ] README.md complete and up-to-date
- [ ] All code properly commented
- [ ] Double-booking prevention verified

---

## 🎉 Completion

Congratulations! You have successfully built and deployed BookIt - a complete fullstack booking application. The project demonstrates:
- Modern React + TypeScript frontend development
- RESTful API design with Express.js
- Database design and transaction handling
- Production-ready deployment architecture
- Real-world software engineering practices

Good luck with your internship!
