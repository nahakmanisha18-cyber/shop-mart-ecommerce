# 🛒 ShopMart E-Commerce

**A full-stack e-commerce web application built with Next.js, MongoDB, and Redux Toolkit, covering the customer shopping journey and an admin panel for store operations.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?logo=redux&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-React_Bootstrap-7952B3?logo=bootstrap&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451?logo=razorpay&logoColor=white)

> **Portfolio project.** ShopMart was built to demonstrate full-stack development skills with Next.js. It is not a production-hardened commerce platform. See [Security Considerations](#-security-considerations) and [Future Improvements](#-future-improvements).

---

## 📖 Project Overview

ShopMart E-Commerce is a single Next.js application that serves both the user interface and the backend API through the App Router. Customers can browse products, manage a cart and wishlist, place orders, request returns, and track refunds. Administrators get a dedicated panel to manage products, users, orders, payments, returns, and refunds.

The project demonstrates:

- Full-stack development in one Next.js codebase (UI + API route handlers)
- JWT authentication with hashed passwords
- MongoDB data modelling with Mongoose
- Centralized client state with Redux Toolkit
- Third-party integrations for image storage (Cloudinary) and payments (Razorpay)
- A multi-stage order lifecycle that includes returns and refunds

---

## ✨ Key Features

> Features below reflect the modules present in the project structure. Items marked with 🔎 should be confirmed against the implementation before publishing.

### 👤 User & Authentication
- User registration and login
- JWT-based authentication
- Password hashing with bcryptjs
- Profile page and profile editing
- Protected user operations (token verification via `src/lib/verifyToken.js`)

### 🔍 Product Discovery
- Product listing (home page) and product detail pages
- Search 🔎 (filtering options to be confirmed)
- Product image upload via Cloudinary 🔎

### 🛍️ Shopping
- Shopping cart with quantity updates and item removal 🔎
- Wishlist management
- Buy Now flow with a dedicated form page
- Checkout and order placement

### 📦 Orders & Payments
- Order history and order details
- Order cancellation 🔎
- Razorpay payment integration
- Cash on Delivery (COD) 🔎
- Payment status handling and payment administration 🔎

### 🔁 Returns & Refunds
- Return request creation and tracking
- Return status management by admins
- Refund records linked to orders and return requests
- Cancellation-related refunds for eligible paid Razorpay orders (`src/lib/createCancellationRefund.js`) 🔎
- Manual payout confirmation for eligible COD refunds 🔎
- Full vs. partial returns 🔎 (document only if confirmed in the code)

> **Important:** Razorpay refunds depend on valid Razorpay configuration, an eligible captured payment, and a successful response from the provider. COD refunds are **not** processed automatically through Razorpay; they require manual payout and confirmation by an admin.

### 🛠️ Admin Panel
- Dashboard
- Product management
- User management
- Order management
- Payment management
- Return request management
- Refund management
- Admin profile and settings 🔎

### ➕ Additional Functionality
- Notifications page
- Form validation (`src/utils/validate.js`)
- Loading component and error states 🔎
- Redux-based centralized state management
- Mobile-oriented bottom tab bar component

---

## 🧰 Technology Stack

| Technology | Role |
|---|---|
| **Next.js (App Router)** | Routing, server rendering, and API route handlers |
| **React** | Component-based UI |
| **JavaScript** | Primary language |
| **MongoDB + Mongoose** | Database and schema modelling |
| **Redux Toolkit + React Redux** | Client-side state management |
| **JWT** | Stateless authentication tokens |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Image hosting and upload |
| **Razorpay** | Online payments and refunds |
| **Bootstrap / React Bootstrap** | Layout and UI components |
| **Bootstrap Icons / React Icons** | Iconography |
| **ESLint** | Linting (`eslint.config.mjs`) |

<!-- VERIFY: compare this table with the dependencies in package.json. Add HTTP client (e.g. axios/fetch), toast libraries, chart libraries, etc. only if present. -->

---

## 🏗️ Application Architecture

ShopMart follows a monolithic full-stack architecture:

```
Browser (React + Redux)
        │
        ▼
Next.js App Router ── pages & layouts (src/app)
        │
        ▼
API Route Handlers ── auth, products, cart, orders, payments, returns, refunds, admin
        │
        ├── MongoDB (Mongoose models)
        ├── Cloudinary (image storage)
        └── Razorpay (payments & refunds)
```

### Project Structure

```text
full-stack-app/
├── public/                     # Static assets (logos)
├── src/
│   ├── app/
│   │   ├── admin/              # Admin pages: dashboard, orders, payments,
│   │   │                       #   products, profile, refunds, returns,
│   │   │                       #   settings, users
│   │   ├── api/                # Route handlers: admin, auth, cart, order,
│   │   │                       #   payment, product, refund, return, user, wishlist
│   │   ├── (user-facing routes)# buynowForm, checkout, details, notification,
│   │   │                       #   order-success, orders, profile, profile-edit,
│   │   │                       #   return-request
│   │   ├── layout.js
│   │   ├── LayoutClient.jsx
│   │   ├── page.js
│   │   └── StoreProvider.js    # Redux provider
│   ├── Components/             # UI components grouped by feature
│   │   └── Common/AdminPenal/  # Admin UI (header, sidebar, dashboard, etc.)
│   ├── lib/
│   │   ├── model/              # Mongoose models
│   │   ├── createCancellationRefund.js
│   │   ├── dbConnect.js
│   │   └── verifyToken.js
│   ├── redux/                  # action/, slice/, store.js
│   ├── services/               # Image upload helpers (Cloudinary)
│   └── utils/validate.js       # Validation helpers
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
└── README.md
```

<!-- VERIFY: In your provided tree, buynowForm, checkout, details, notification, order-success, orders, profile, profile-edit, and return-request appear nested under api/. They look like page routes under app/. Confirm their real location and adjust this tree. -->

---

## 🔐 Authentication & Authorization

- Users register and log in; passwords are hashed with **bcryptjs** before storage.
- On login, the server issues a **JWT**.
- Protected API routes validate the token using the shared helper in `src/lib/verifyToken.js`.
- Admin routes (`/api/admin/*`) and pages (`/admin/*`) are intended for administrator accounts only. 🔎

<!-- VERIFY: Where the token is stored (cookie vs. localStorage), token expiry, and how the admin role is checked (e.g. a role field on the User model). Describe these precisely. -->

---

## 🗄️ Database Models

Models live in `src/lib/model/`:

| Model | Purpose |
|---|---|
| `user.js` | Account details, credentials (hashed), role 🔎 |
| `product.js` | Catalogue items, pricing, stock, images 🔎 |
| `cart.js` | A user's cart items and quantities 🔎 |
| `wishlist.js` | A user's saved products 🔎 |
| `order.js` | Orders, items, payment method/status, order status 🔎 |
| `return.js` | Return requests tied to an order 🔎 |
| `refund.js` | Refund records tied to orders/returns, provider status 🔎 |

**Expected relationships (confirm in schemas):**
- A user has one cart, one wishlist, and many orders.
- An order belongs to a user and references products.
- A return belongs to an order (and user).
- A refund references an order and, where applicable, a return request.

<!-- VERIFY: Replace with actual field names and ObjectId refs from each schema. -->

---

## 🔌 API Organization

Route handlers are grouped under `src/app/api/`:

| Group | Route folder |
|---|---|
| Authentication | `/api/auth` |
| Products | `/api/product` |
| Cart | `/api/cart` |
| Wishlist | `/api/wishlist` |
| Orders / checkout | `/api/order` |
| Payments | `/api/payment` |
| Users & profiles | `/api/user` |
| Returns | `/api/return` |
| Refunds | `/api/refund` |
| Admin | `/api/admin` |

<!-- VERIFY: Open each route.js and list real sub-paths and HTTP methods (e.g. | POST | /api/auth/login | ... |). Do not claim full CRUD unless every method exists. Add a Notifications row if a notification API exists. -->

---

## 💳 Payment & Refund Workflow

### Orders
1. User adds items to the cart (or uses **Buy Now**) and proceeds to checkout.
2. User selects a payment method: **Razorpay** (online) or **COD** 🔎.
3. The order is created and stored in MongoDB.
4. Razorpay orders are completed after provider payment confirmation 🔎; COD orders are settled on delivery.

### Cancellations & Returns
- A user can cancel an eligible order 🔎 or submit a return request after delivery.
- Admins review return requests and update their status.

### Refunds

| | Razorpay (online) | COD |
|---|---|---|
| Refund method | Initiated via the Razorpay API when eligible | Manual payout by the store |
| Requirements | Valid API keys, a captured payment, a successful provider response | Admin confirms the payout manually |
| Automatic? | Attempted automatically where implemented 🔎 | **No**; not processed via Razorpay |

> Provider failures (e.g. invalid configuration or ineligible payments) can leave a refund unprocessed, so refund status should be reviewed in the admin panel.

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (LTS recommended)
- npm
- A MongoDB database (local or Atlas)
- Cloudinary account (for image uploads)
- Razorpay account (test mode keys are sufficient)

### Steps

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd full-stack-app

# 2. Install dependencies
npm install

# 3. Create your local environment file (see below)

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## ⚙️ Environment Variables

Create a `.env` (or `.env.local`) file in the project root. **Never commit this file or any real credentials.**

> ⚠️ The names below are **examples** and must be adjusted to match the variables your code actually reads (search the codebase for `process.env`).

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_long_random_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
```

---

## 📜 Available Scripts

<!-- VERIFY: Replace with the exact scripts block from package.json. -->

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## 🖼️ Screenshots

Screenshots have not been added yet. To add them:

1. Create a `docs/screenshots/` folder.
2. Add images (e.g. `home.png`, `product-details.png`, `checkout.png`, `admin-dashboard.png`).
3. Replace this section with:

```md
![Home Page](docs/screenshots/home.png)
```

| Screen | Status |
|---|---|
| Home page | _Placeholder_ |
| Product details | _Placeholder_ |
| Cart & checkout | _Placeholder_ |
| Admin dashboard | _Placeholder_ |

---

## 🔒 Security Considerations

- Passwords are hashed with bcryptjs; plain-text passwords are never stored.
- Secrets (JWT, Cloudinary, Razorpay) belong in environment variables and must stay out of version control (`.env` is git-ignored).
- Protected API routes verify JWTs server-side.
- Server-side validation and role checks should be applied on every sensitive route, not only in the UI.
- Razorpay secret keys must only be used on the server.
- Because this is a portfolio project, review it for rate limiting, input sanitization, and CSRF/XSS hardening before any real-world deployment.

---

## 🩺 Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Cannot connect to MongoDB | Check the connection string, network access (Atlas IP allowlist), and that the database is running |
| `JWT` / unauthorized errors | Confirm the JWT secret is set and the token is being sent with requests |
| Image upload fails | Verify Cloudinary credentials and cloud name |
| Razorpay checkout does not open | Check the public key ID and that you are using matching test/live keys |
| Refund not processed | Refunds require a captured Razorpay payment and valid configuration; COD refunds are manual |
| Environment changes not applied | Restart the dev server after editing `.env` |
| Port 3000 in use | Run `npx next dev -p 3001` |

---

## 🗺️ Future Improvements

- [ ] Add automated tests (unit and integration)
- [ ] Add product reviews and ratings
- [ ] Add advanced filtering and sorting
- [ ] Add email notifications for order updates
- [ ] Add rate limiting and stronger input sanitization
- [ ] Add CI workflow and deployment documentation
- [ ] Migrate to TypeScript

<!-- VERIFY: Remove any item that is already implemented. -->

---

## 📄 License

No license file is currently included in this repository. Until one is added, all rights are reserved by the author. To make the project open source, add a `LICENSE` file (e.g. MIT) and update this section.

---

## 🙌 Closing

ShopMart E-Commerce is a portfolio project showing how a full-stack commerce workflow, from browsing to checkout, returns, and refunds, can be built with Next.js, MongoDB, and Redux Toolkit. Feedback and suggestions are welcome through GitHub issues.