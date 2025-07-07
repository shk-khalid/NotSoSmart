
# 📡 NotSoSmart API Documentation

Base URL (production):  
`https://notsosmart.onrender.com/api/`

All requests and responses use `application/json`.  
Authenticated routes require this header:

```http
Authorization: Bearer <access_token>
````

---

## 🔐 Auth Endpoints

### 📥 Register

* **POST** `/auth/register/`
  Registers a new user via Supabase.

#### ✅ Request

```json
{
  "username": "khalid001",
  "email": "khalid@example.com",
  "password": "YourSecurePass123"
}
```

#### 🔁 Success

```json
{
  "message": "User registered successfully."
}
```

#### ❌ Errors

```json
{
  "detail": "Email already registered"
}
```

---

### 🔐 Login

* **POST** `/auth/login/`
  Returns JWT tokens and user info.

#### ✅ Request

```json
{
  "email": "khalid@example.com",
  "password": "YourSecurePass123"
}
```

#### 🔁 Success

```json
{
  "access_token": "jwt_token_here",
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "abc123",
    "email": "khalid@example.com",
    ...
  }
}
```

#### ❌ Errors

```json
{
  "detail": "Login failed: invalid credentials."
}
```

---

### 🔄 Reset Password

* **POST** `/auth/reset-password/`
  Sends a reset link using Supabase.

#### ✅ Request

```json
{
  "email": "khalid@example.com"
}
```

#### 🔁 Success

```json
{
  "message": "Password reset email sent."
}
```

---

## ✅ Tasks API

All endpoints require authentication.

---

### 📋 Get Tasks

* **GET** `/tasks/`

#### 🔁 Response

```json
[
  {
    "id": 1,
    "title": "Write AI docs",
    "description": "Document all AI endpoints",
    "category": 2,
    "context": [3],
    "created_at": "2025-07-07T12:00:00Z"
  },
  ...
]
```

---

### ➕ Create Task

* **POST** `/tasks/`

#### ✅ Request

```json
{
  "title": "Plan launch",
  "description": "Marketing and feature finalization",
  "category": 1,
  "context": [2, 3]
}
```

#### 🔁 Success

```json
{
  "id": 4,
  "title": "Plan launch",
  ...
}
```

---

### 📝 Update Task

* **PUT** `/tasks/<id>/`

#### ✅ Request

```json
{
  "title": "Plan release",
  "description": "Updated desc...",
  "category": 1,
  "context": [1]
}
```

---

### ❌ Delete Task

* **DELETE** `/tasks/<id>/`

---

## 🧠 AI-Enhanced Features

### 🎯 Category Suggestion

* **POST** `/tasks/suggest-category/`

Uses your task’s title and description to predict a suitable category.

#### ✅ Request

```json
{
  "title": "Buy groceries",
  "description": "Need to restock fruits and snacks"
}
```

#### 🔁 Response

```json
{
  "suggested_category": "Personal"
}
```

---

### 🤖 AI Task Suggestions

* **POST** `/ai/suggestions/`

Uses Hugging Face model to generate enhancements.

#### ✅ Request

```json
{
  "title": "Finish report",
  "description": "End-of-quarter financials",
  "context": "Due next week. Requires input from sales."
}
```

#### 🔁 Response

```json
{
  "priority_score": 8.9,
  "suggested_deadline": "2025-07-10",
  "enhanced_description": "Complete Q2 financial report with sales input and present to stakeholders.",
  "suggested_category": "Work"
}
```

#### ❌ Error

```json
{
  "error": "Model request failed"
}
```

---

## 🗃️ Category & Context API

### 📦 Get Categories

* **GET** `/categories/`

### ➕ Create Category

* **POST** `/categories/`

```json
{
  "name": "Urgent"
}
```

---

### 🧾 Get Contexts

* **GET** `/contexts/`

### ➕ Create Context

* **POST** `/contexts/`

```json
{
  "text": "Meeting with client on Monday"
}
```

---

## ⚠️ Errors & Codes

| Code | Meaning                         |
| ---- | ------------------------------- |
| 200  | Success                         |
| 201  | Resource created                |
| 400  | Bad input (validation)          |
| 401  | Unauthorized (no/invalid token) |
| 403  | Forbidden (not allowed)         |
| 404  | Resource not found              |
| 500  | Internal server error           |

---

## 🧪 Testing Tips

Use [Postman](https://www.postman.com/) or `curl`:

```bash
curl -X POST https://notsosmart.onrender.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "khalid@example.com", "password": "123456"}'
```

---

## 📌 Notes

* All timestamps are in ISO 8601 UTC.
* `access_token` is valid for 1 hour (per Supabase default).
* Supabase handles email delivery for registration & reset.

---
