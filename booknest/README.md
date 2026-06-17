# BookNest - Modern Full-Stack Online Bookstore

BookNest is an elegant, Pinterest-inspired bookstore web application designed for bibliophiles. Users can browse titles, search by genres, read reviews, manage wishlists, utilize discount coupons, and checkout securely. Additionally, it features an interactive administration dashboard with chart visualizations for revenue, book inventories, order state controllers, and dynamic user role privileges.

---

## 🎨 Design & Aesthetic Guidelines

- **Primary Themes**: Soft Literary Cream and espresso palette.
- **Backgrounds**: Cozy cream (`#FAF6F0`) and warm beige (`#F4EAE1`) backgrounds.
- **Typography**: Playfair Display (Serif) for headers and Outfit (Sans-Serif) for readouts.
- **Dark Mode**: Soft espresso (`#1E110F`) backdrops with tan accents.
- **UI Elements**: Rounded cards, floating heart pins, slides, and micro-hover lifts.

---

## ⚙️ Technology Stack

- **Frontend Client**: React + Vite, Tailwind CSS, Lucide Icons, Recharts (Sales visualization)
- **Backend Server**: Node.js, Express.js (REST API architecture)
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with cryptographically hashed passwords (`bcryptjs`)
- **AI recommendation**: Hybrid Engine (local content matches + customizable Gemini API hooks)

---

## 📂 Project Directory Structure

```
booknest/
├── backend/
│   ├── config/db.js          # Database connection
│   ├── models/               # Mongoose Schemas (Book, User, Order, Review)
│   ├── controllers/          # Request handlers (auth, books, orders, admin)
│   ├── middleware/           # JWT & role authorization verifications
│   ├── routes/               # API Router endpoints
│   ├── scripts/seed.js       # Database seeder with 20+ books & historic orders
│   ├── server.js             # Main server entry file
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/       # Reusable UI parts (Navbar, Footer, BookCard)
    │   ├── context/          # State scopes (AuthContext, CartContext)
    │   ├── pages/            # Core views (Home, Shop, Details, Cart, Admin)
    │   ├── App.jsx           # Main Router and Theme toggler
    │   ├── index.css         # Tailwind directives and custom animation styles
    │   └── main.jsx          # Vite React mounting point
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🛣️ API Endpoint Routes Reference

### 🔐 Authentication (`/api/auth`)
- `POST /register` - Register a profile.
- `POST /login` - User login.
- `GET /profile` - Retrieve profile (requires token).
- `PUT /profile` - Update profile settings (requires token).

### 📚 Books Catalog & Cart Sync (`/api/books`)
- `GET /` - Retrieve catalog books (supports pagination, search, price ranges, ratings).
- `GET /:id` - Get details & reviews for a book.
- `POST /:id/view` - Add to recently viewed shelf.
- `POST /:id/reviews` - Add or update a book review.
- `GET /:id/recommendations` - Retrieve related books + AI match reasons.
- `POST /cart` - Sync client cart array to database.
- `POST /wishlist` - Add/remove book from user wishlist.

### 🛒 Checkouts & Coupons (`/api/orders`)
- `POST /` - Place order & decrement inventory stock.
- `GET /myorders` - Get order history.
- `POST /coupon` - Verify coupon code (`NEST20`, `BOOKWORM10`, `READMORE30`).
- `GET /:id` - Retrieve single order details.

### 👑 Admin Nerve Center (`/api/admin`)
- `GET /analytics` - Get charts data, top sellers, and low stock warnings.
- `GET /orders` - Fetch all store orders.
- `PUT /orders/:id/status` - Modify order status (`processing`, `shipped`, etc.).
- `GET /users` - Fetch all profiles.
- `PUT /users/:id/role` - Toggle user privilege (`user` / `admin`).
- `POST /books` - Add new book.
- `PUT /books/:id` - Edit book details.
- `DELETE /books/:id` - Delete book from catalog.

---

## 🛠️ Setup & Installation Instructions

### Prerequisites
- Node.js (v16+) installed.
- MongoDB running locally or a MongoDB Atlas URI string.

### 1. Database & Backend Setup
1. Open terminal and navigate to the backend:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Populate `.env` parameters:
   Create a `.env` file in the `backend/` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.5.1:27017/booknest
   JWT_SECRET=booknestsecretkey123
   NODE_ENV=development
   ```
4. Seed mock database entries (24 books, admin, orders, reviews):
   ```bash
   npm run seed
   ```
5. Start backend Express server:
   ```bash
   npm run dev
   ```
   *The server runs at `http://localhost:5000`.*

### 2. Frontend Client Setup
1. Open another terminal and navigate to the client:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
   *Vite client is available at `http://localhost:5173`.*

---

## 🔑 Demo Sandbox Login Credentials

For testing checkout flows and admin dashboards:
- **Regular Customer**: `user@booknest.com` / `user123`
- **Store Administrator**: `admin@booknest.com` / `admin123`
