# 💰 Zorvyn Finance Dashboard Backend

## 📌 Overview
This project is a backend system for a finance dashboard built as part of an assessment to demonstrate API design, data handling, and role-based access control.

---

## 🚀 Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## ✨ Features Implemented

### 👤 User and Role Management
- Users can have roles: **Viewer, Analyst, Admin**
- Role-based permissions enforced

---

### 💰 Financial Records CRUD
- Create, read, update, delete transactions
- Each transaction includes:
  - amount
  - type (income/expense)
  - category
  - date
  - notes

---

### 🔍 Record Filtering
Supports filtering transactions using query parameters:
- `type` (income/expense)
- `category`
- `startDate` and `endDate`
- Pagination (`page`, `limit`)

Example:
GET /api/transactions?category=food&type=expense&page=1&limit=10

---

### 📊 Dashboard Summary APIs
- Total income
- Total expenses
- Net balance
- Category-wise breakdown
- Sorted recent transactions

---

### 🔐 Role-Based Access Control

| Action | Viewer | Analyst | Admin |
|--------|--------|--------|--------|
| View Records | ✅ | ✅ | ✅ |
| Create Records | ❌ | ✅ | ✅ |
| Edit Own Records | ❌ | ✅ | ✅ |
| Edit Any Records | ❌ | ❌ | ✅ |
| Delete Records | ❌ | ❌ | ✅ |

---

### ⚠️ Validation and Error Handling
- Input validation for required fields
- Proper HTTP status codes
- Error messages for invalid operations

---

### 💾 Data Persistence
- MongoDB used for storing transactions and users
- Soft delete implemented using `isDeleted` flag

---

## 🔌 API Endpoints

### Transactions
- GET /api/transactions → Get all (with filters)
- GET /api/transactions/:id → Get one
- POST /api/transactions → Create
- PATCH /api/transactions/:id → Update
- DELETE /api/transactions/:id → Soft delete

---

## 🧠 Key Design Decisions
- Used **separation of concerns** (routes, controllers, models)
- Implemented **role-based access control**
- Used **dynamic query filtering**
- Applied **pagination for scalability**

---

## ▶️ How to Run

```bash
npm install
npm start
