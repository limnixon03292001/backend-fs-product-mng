## Product Management App

# Features

- User Authentication (Login with Email & Password) (JWT refresh, accessToken)
- Create Product
- View Products
- Update Product
- Delete Product
- Minimalist UI
- TailwindCSS

---

## Backend

- NodeJS/ExpressJS
- Drizzle ORM
- JWT
- postgres
- Zustand
- express-validator
- TypeScript

---

# Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/limnixon03292001/frontend-fs-product-mng.git
```

```bash
cd frontend-fs-product-mng
```

## 2. Create Front End Environment Variables

.Create a `.env` file inside the **frontend** folder.
Example configuration:

```
VITE_BASE_URL=http://localhost:5000
```

## 3. Install Dependencies

```
npm install
```

## 4. Run the client

```
npm run dev
```

---

# Backend Setup

## 5. Clone Backend Repository

```
git clone https://github.com/limnixon03292001/backend-fs-product-mng.git
```

```
cd backend-fs-product-mng
```

## 6. Install Dependencies

```bash
npm install
```

## 7. Create Back End Environment Variables

.Create a `.env` file inside the **backend** folder.
Example configuration:

```
DATABASE_URL="postgres_url"
BASE_URL="http://localhost:5173" (should matched the front-end url)
```

## 8. Migrate Schema

```bash
npx drizzle-kit migrate
```

## 9. Start the Server

Go to backend folder and run

```
npm start
```

The backend server should run at:

```
http://localhost:5000
```

---

# API Endpoints

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| POST   | auth/login        | Authenticate user    |
| POST   | auth/register     | Register             |
| POST   | auth/logout       | De-Authenticate user |
| GET    | /api/products     | Get all products     |
| POST   | /api/products     | Create a product     |
| PUT    | /api/products/:id | Update product       |
| DELETE | /api/products/:id | Delete product       |

---

# Future Improvements

- Pagination for product list
- Search and filtering
- Role-based authentication
- Product image upload
- Unit and integration testing

---

# Dev

Nixon Lim

---
