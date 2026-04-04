# 💰 Finance Dashboard Backend System

## 📌 Overview

This project is a backend system for a finance dashboard built as part of an assessment to demonstrate API design, data handling, and role-based access control.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## ✨ Features Implemented

### 👤 User and Role Management

* Users can have roles: **Viewer, Analyst, Admin**
* Role-based permissions enforced

---

### 🔐 Authentication (Login & Token)

![Login](https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/backend/screenshots/login-success-token.png?raw=true)
* JWT-based authentication implemented
* Secure login with token generation

---

### ❌ Validation Example (Login Error)

![Login Error](https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/backend/screenshots/login-error-missing-password.png?raw=true)

* API validates required fields properly

---

### 💰 Financial Records CRUD

#### ✅ Create Transaction (Analyst)

![Create Transaction](.backend/screenshots/create-transaction-success.png)

* Create financial transactions securely

---

#### 📥 Get Transactions

![Get Transactions](.backend/screenshots/get-transactions-success.png)

* Fetch all transactions with user details

---

#### ✏️ Update Transaction

![Update Transaction](.backend/screenshots/update-transaction-success.png)

* Update transaction using unique ID

---

### 🔐 Role-Based Access Control

| Action           | Viewer | Analyst | Admin |
| ---------------- | ------ | ------- | ----- |
| View Records     | ✅      | ✅       | ✅     |
| Create Records   | ❌      | ✅       | ✅     |
| Edit Own Records | ❌      | ✅       | ✅     |
| Edit Any Records | ❌      | ❌       | ✅     |
| Delete Records   | ❌      | ❌       | ✅     |

---

### ❌ Viewer Restriction (RBAC Proof)

![Viewer Blocked](.backend/screenshots/viewer-create-blocked.png)

* Viewer cannot create transactions

---

### ❌ Analyst Delete Restriction

![Delete Blocked](.backend/screenshots/delete-transaction-analyst-blocked.png)

* Only Admin can delete records

---

### 🔍 Record Filtering

Supports filtering transactions using query parameters:

* `type` (income/expense)
* `category`
* `startDate` and `endDate`
* Pagination (`page`, `limit`)

Example:
GET /api/transactions?category=food&type=expense&page=1&limit=10

---

### 📊 Dashboard Summary APIs

* Total income
* Total expenses
* Net balance
* Category-wise breakdown
* Sorted recent transactions

---

### ⚠️ Validation and Error Handling

* Input validation for required fields
* Proper HTTP status codes
* Error messages for invalid operations

---

### 💾 Data Persistence

* MongoDB used for storing transactions and users
* Soft delete implemented using `isDeleted` flag

---

## 🔌 API Endpoints

### Transactions

* GET /api/transactions → Get all (with filters)
* GET /api/transactions/:id → Get one
* POST /api/transactions → Create
* PATCH /api/transactions/:id → Update
* DELETE /api/transactions/:id → Soft delete

---

## 🧠 Key Design Decisions

* Used **separation of concerns** (routes, controllers, models)
* Implemented **role-based access control**
* Used **dynamic query filtering**
* Applied **pagination for scalability**

---

## ▶️ How to Run

```bash
npm install
npm start
```

---

## ⚡ Summary

A secure and scalable backend system with:

* JWT Authentication
* Role-Based Access Control (RBAC)
* Transaction Management APIs
* Filtering & Pagination
* Dashboard Analytics
