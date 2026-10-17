# Payment Gateway Assessment

A modern, Payment Gateway Assessment built with **Next.js 16** and **React 19**, featuring product browsing, cart & wishlist management, order placement, JWT-based authentication, image uploads via Cloudinary, and an admin section for application management.

> 📁 This is a **portfolio/project application** built to demonstrate full-stack development skills using the modern React/Next.js ecosystem.

---

## 🏷️ Badges

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-State%20Management-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Upload-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-UI-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

---

## 📖 Project Overview

This project is a **full-stack e-commerce application** that allows users to browse products, view detailed product information, search for items, manage a shopping cart and wishlist, place orders, and make payments. Users can also manage their profiles and view their order history.

The application includes secure **JWT-based authentication**, **protected API routes**, **image uploading via Cloudinary**, structured **order management**, and an **admin section** for managing the platform.

---

## 🚀 Technology Stack

### Frontend
- Next.js 16
- React 19
- JavaScript
- Bootstrap
- React Bootstrap
- Bootstrap Icons
- React Icons
- CSS

### State Management
- Redux Toolkit
- React Redux

### Backend
- Next.js API Routes
- REST APIs
- Node.js environment

### Database
- MongoDB
- Mongoose

### Authentication & Security
- JWT (JSON Web Token)
- bcryptjs for password hashing
- Protected API routes using token verification

### Image Upload
- **Cloudinary** — used to upload and manage product images

### Payment Integration
The project includes payment-related functionality and integrations using:
- Razorpay
- Stripe
- PayPal

> ⚠️ These are included as **payment integrations available in the project**. Not every gateway is guaranteed to be fully functional in all environments — please verify configuration before relying on any specific gateway in production.

---

## ✨ Main Features

### 👤 User Features
- User Registration
- User Login and Logout
- JWT Authentication
- Password Hashing
- Protected User Routes
- User Profile
- Edit Profile
- Browse Products
- View Product Details
- Search Products
- Add Products to Cart
- Update Cart Quantity
- Remove Products from Cart
- Wishlist Management
- Buy Now functionality
- Checkout Process
- Place Orders
- Order Success Page
- View Order History

### 📦 Product Features
- Product Listing
- Product Details Page
- Product Search
- Product Filtering
- Product Image Upload
- Cloudinary Image Management

### 🛒 Cart Features
- Add to Cart
- Update Product Quantity
- Remove Items from Cart
- Cart Data Management
- Redux State Management

### 💖 Wishlist Features
- Add Products to Wishlist
- Remove Products from Wishlist
- Manage Wishlist Items

### 📋 Order Features
- Create Orders
- Fetch User Orders
- Fetch Individual Order Details
- Order Success Page
- Order History

### 💳 Payment Features
- Payment integration architecture
- Razorpay integration
- Stripe integration
- PayPal integration

### 🛠️ Admin Features
- Admin section
- Admin APIs
- Product management architecture
- User management architecture
- Order management capabilities

> Admin functionality reflects the architecture currently present in the project structure and is not exaggerated beyond what is implemented.

---

## 🔐 Authentication Flow

1. User registers an account.
2. Password is securely hashed using **bcryptjs**.
3. User logs into the application.
4. A **JWT token** is generated upon successful login.
5. The token is used to authenticate protected API requests.
6. Token verification logic validates authenticated users via a reusable **`verifyToken.js`** utility.

---

## 🗄️ Database Models

| Model | Description |
|-------|-------------|
| **User** | Stores user account details, credentials, and profile information |
| **Product** | Stores product details such as name, price, description, and images |
| **Cart** | Manages items added to a user's shopping cart |
| **Wishlist** | Manages products saved by a user for later |
| **Order** | Stores order details, including items, status, and payment information |

---

## 🔗 API Structure

The application uses **Next.js API Routes** to handle backend functionality, structured as follows:

```text
/api
├── admin
├── auth
├── cart
├── order
├── payment
├── product
├── user
└── wishlist
```

Each directory contains route handlers responsible for its respective domain (e.g., `auth` handles login/registration, `product` handles product CRUD operations, etc.).

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── admin/
│   ├── api/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── product/
│   │   ├── user/
│   │   └── wishlist/
│   ├── cart/
│   ├── checkout/
│   ├── details/
│   ├── orders/
│   ├── profile/
│   ├── wishlist/
│   └── page.js
│
├── Components/
│   ├── AddToCart/
│   ├── CheckoutPage/
│   ├── Common/
│   ├── LogIn/
│   ├── OrdersPage/
│   ├── ProductDetails/
│   ├── ProfilePage/
│   ├── Search/
│   ├── SignUp/
│   └── WishlistPage/
│
├── lib/
│   ├── model/
│   │   ├── cart.js
│   │   ├── order.js
│   │   ├── product.js
│   │   ├── user.js
│   │   └── wishlist.js
│   ├── dbConnect.js
│   └── verifyToken.js
│
├── redux/
│   ├── action/
│   ├── slice/
│   └── store.js
│
├── services/
│   └── product/
│       ├── productImageUpload.js
│       └── imageUpload.js
│
└── utils/
    └── validate.js
```

---

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd full-stack-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the required environment variables. The values below are **placeholders only** — use the variable names actually configured in your project, and never commit real secrets.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key

STRIPE_SECRET_KEY=your_stripe_secret_key

NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

> 🔒 Never commit your `.env` file or expose real API keys/secrets in version control.

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Runs the app in development mode with hot reloading |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production build |
| `npm run lint` | Runs the linter to check code quality |

---

## 🖼️ Screenshots

> Add your application screenshots below by replacing the placeholder image paths.

| Page | Preview |
|------|---------|
| Home Page | `![Home Page](./screenshots/home.png)` |
| Product Details | `![Product Details](./screenshots/product-details.png)` |
| Cart | `![Cart](./screenshots/cart.png)` |
| Wishlist | `![Wishlist](./screenshots/wishlist.png)` |
| Login / Signup | `![Login Signup](./screenshots/auth.png)` |
| Checkout | `![Checkout](./screenshots/checkout.png)` |
| Payment | `![Payment](./screenshots/payment.png)` |
| Orders | `![Orders](./screenshots/orders.png)` |
| Profile | `![Profile](./screenshots/profile.png)` |
| Admin Panel | `![Admin Panel](./screenshots/admin.png)` |

---

## 🌟 Key Highlights

- 🏗️ **Full Stack Application** — Frontend, backend, and database working together
- ⚡ **Next.js App Router** — Modern routing and server-side capabilities
- 🔗 **REST API Architecture** — Clean, organized API endpoints
- 🍃 **MongoDB Database** — Flexible, scalable NoSQL data storage
- 🔐 **JWT Authentication** — Secure, token-based user authentication
- 🧩 **Redux Toolkit State Management** — Predictable and centralized app state
- ☁️ **Cloudinary Image Upload** — Efficient product image management
- 🛒 **Shopping Cart** — Full cart management functionality
- 💖 **Wishlist** — Save products for later
- 📦 **Order Management** — Complete order lifecycle handling
- 💳 **Multiple Payment Gateway Integration** — Razorpay, Stripe, and PayPal
- 🔍 **Search & Filtering** — Quickly find products with search and filter options

---

## 🔮 Future Improvements

- [ ] Improve Admin Dashboard
- [ ] Product Categories and Filters
- [ ] Product Reviews and Ratings
- [ ] Payment Status Tracking
- [ ] Email Notifications
- [ ] Inventory Management
- [ ] Order Tracking
- [ ] Responsive UI Improvements
- [ ] Deployment using Vercel
- [ ] CI/CD Integration

---

## 📄 License

This project is open for learning and portfolio purposes. Feel free to explore the code and structure.

---

<p align="center">Built with ❤️ using Next.js, React, and MongoDB</p>
