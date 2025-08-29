# API Test Cases - Unacademy Backend

Comprehensive test cases for the Unacademy Backend API. This document provides detailed examples for testing all endpoints using various tools like `curl`, Postman, or any HTTP client.

## 🧪 Prerequisites

1. **Server Running**: Ensure your backend is running on `http://localhost:3000`
2. **Database Setup**: Database should be initialized with `npm run db:push`
3. **Environment Variables**: All required env vars should be configured

## 📋 Test Categories

- [Authentication Tests](#authentication-tests)
- [Session Management Tests](#session-management-tests)
- [File Upload Tests](#file-upload-tests)
- [Error Handling Tests](#error-handling-tests)
- [Integration Tests](#integration-tests)

---

## 🔐 Authentication Tests

### Test Case 1: User Registration (Success)

**Endpoint**: `POST /api/v1/signup`

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

**Expected Response** (201):
```json
{
  "message": "User successfully registered",
  "userId": "clx1234567890abcdef",
  "username": "testuser"
}
```

### Test Case 2: User Registration (Duplicate Email)

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser2"
  }'
```

**Expected Response** (409):
```json
{
  "message": "Email or username already exists"
}
```

### Test Case 3: User Registration (Invalid Email)

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123",
    "username": "testuser"
  }'
```

**Expected Response** (400):
```json
{
  "message": "Validation errors",
  "errors": [
    {
      "code": "invalid_string",
      "message": "Invalid email",
      "path": ["email"]
    }
  ]
}
```

### Test Case 4: User Login (Success)

**Endpoint**: `POST /api/v1/signin`

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "clx1234567890abcdef"
}
```

### Test Case 5: User Login (Invalid Credentials)

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response** (400):
```json
{
  "msg": "Incorrect password"
}
```

---

## 📊 Session Management Tests

### Test Case 6: Create Session (Authenticated)

**Endpoint**: `POST /api/v1/session`

**Prerequisites**: Get JWT token from login

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Presentation"
  }'
```

**Expected Response** (200):
```json
{
  "sessionId": "clx1234567890abcdef"
}
```

### Test Case 7: Create Session (Unauthenticated)

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/session \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Presentation"
  }'
```

**Expected Response** (401):
```json
{
  "error": "Unauthorized: No token provided"
}
```

### Test Case 8: Get All Sessions

**Endpoint**: `GET /api/v1/sessionsResponse`

**Request**:
```bash
curl -X GET http://localhost:3000/api/v1/sessionsResponse \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response** (200):
```json
[
  {
    "sessionId": "clx1234567890abcdef",
    "title": "My First Presentation",
    "startTime": null,
    "status": "inactive"
  }
]
```

### Test Case 9: Start Session

**Endpoint**: `POST /api/v1/session/{sessionId}/start`

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/session/clx1234567890abcdef/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response** (200):
```json
{
  "message": "Session started successfully"
}
```

### Test Case 10: End Session

**Endpoint**: `POST /api/v1/session/{sessionId}/end`

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/session/clx1234567890abcdef/end \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response** (200):
```json
{
  "message": "Session ended successfully"
}
```

---

## 📄 File Upload Tests

### Test Case 11: Upload PDF and Convert to Slides

**Endpoint**: `POST /api/v1/session/{sessionId}/slides/pdf`

**Prerequisites**: 
- Valid session ID
- PDF file ready for upload
- Supabase storage configured

**Request** (using curl with file):
```bash
curl -X POST http://localhost:3000/api/v1/session/clx1234567890abcdef/slides/pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/presentation.pdf"
```

**Expected Response** (200):
```json
{
  "message": "PDF processed successfully",
  "totalPages": 5,
  "imageUrls": [
    "https://your-project.supabase.co/storage/v1/object/public/images/session/clx1234567890abcdef/page-1.png",
    "https://your-project.supabase.co/storage/v1/object/public/images/session/clx1234567890abcdef/page-2.png"
  ]
}
```

### Test Case 12: Get Session Slides

**Endpoint**: `GET /api/v1/session/{sessionId}/slides`

**Request**:
```bash
curl -X GET http://localhost:3000/api/v1/session/clx1234567890abcdef/slides \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response** (200):
```json
{
  "slides": [
    {
      "id": "clx1234567890abcdef",
      "type": "image",
      "imageUrl": "https://your-project.supabase.co/storage/v1/object/public/images/session/clx1234567890abcdef/page-1.png",
      "sessionId": "clx1234567890abcdef"
    }
  ]
}
```

---

## 🚨 Error Handling Tests

### Test Case 13: Invalid File Type Upload

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/session/clx1234567890abcdef/slides/pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/document.txt"
```

**Expected Response** (400):
```json
{
  "error": "Only PDF and JPG files are allowed"
}
```

### Test Case 14: Invalid Session ID

**Request**:
```bash
curl -X GET http://localhost:3000/api/v1/session/invalid-session-id/slides \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response** (500):
```json
{
  "error": "Internal server error"
}
```

### Test Case 15: Expired/Invalid Token

**Request**:
```bash
curl -X GET http://localhost:3000/api/v1/sessionsResponse \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response** (401):
```json
{
  "error": "Unauthorized: Invalid or expired token"
}
```

---

## 🔄 Integration Tests

### Test Case 16: Complete User Flow

**Step 1: Register User**
```bash
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration@test.com",
    "password": "password123",
    "username": "integrationuser"
  }'
```

**Step 2: Login and Get Token**
```bash
curl -X POST http://localhost:3000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration@test.com",
    "password": "password123"
  }'
```

**Step 3: Create Session**
```bash
curl -X POST http://localhost:3000/api/v1/session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_FROM_STEP_2" \
  -d '{
    "title": "Integration Test Session"
  }'
```

**Step 4: Start Session**
```bash
curl -X POST http://localhost:3000/api/v1/session/SESSION_ID_FROM_STEP_3/start \
  -H "Authorization: Bearer TOKEN_FROM_STEP_2"
```

**Step 5: Upload PDF**
```bash
curl -X POST http://localhost:3000/api/v1/session/SESSION_ID_FROM_STEP_3/slides/pdf \
  -H "Authorization: Bearer TOKEN_FROM_STEP_2" \
  -F "file=@/path/to/test.pdf"
```

**Step 6: Get Slides**
```bash
curl -X GET http://localhost:3000/api/v1/session/SESSION_ID_FROM_STEP_3/slides \
  -H "Authorization: Bearer TOKEN_FROM_STEP_2"
```

**Step 7: End Session**
```bash
curl -X POST http://localhost:3000/api/v1/session/SESSION_ID_FROM_STEP_3/end \
  -H "Authorization: Bearer TOKEN_FROM_STEP_2"
```

---

## 🛠️ Testing Tools

### 1. Using curl (Command Line)
All examples above use `curl`. Make sure to:
- Replace `YOUR_JWT_TOKEN` with actual tokens
- Replace `SESSION_ID` with actual session IDs
- Use correct file paths for uploads

### 2. Using Postman
1. Import the collection (if available)
2. Set up environment variables for `base_url` and `token`
3. Use the pre-request scripts to automatically set tokens

### 3. Using JavaScript/Node.js
```javascript
const axios = require('axios');

const baseURL = 'http://localhost:3000';

// Test health check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${baseURL}/ping`);
    console.log('Health check:', response.data);
  } catch (error) {
    console.error('Health check failed:', error.response.data);
  }
}

// Test user registration
async function testSignup() {
  try {
    const response = await axios.post(`${baseURL}/api/v1/signup`, {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser'
    });
    console.log('Signup successful:', response.data);
  } catch (error) {
    console.error('Signup failed:', error.response.data);
  }
}

testHealthCheck();
testSignup();
```

### 4. Using Python
```python
import requests

base_url = 'http://localhost:3000'

# Test health check
def test_health_check():
    response = requests.get(f'{base_url}/ping')
    print('Health check:', response.json())

# Test user registration
def test_signup():
    data = {
        'email': 'test@example.com',
        'password': 'password123',
        'username': 'testuser'
    }
    response = requests.post(f'{base_url}/api/v1/signup', json=data)
    print('Signup response:', response.json())

test_health_check()
test_signup()
```

---

## 📊 Test Results Template

| Test Case | Endpoint | Status | Response Time | Notes |
|-----------|----------|--------|---------------|-------|
| TC1 | POST /signup | ✅ PASS | 150ms | User created successfully |
| TC2 | POST /signup | ✅ PASS | 120ms | Duplicate email handled |
| TC3 | POST /signin | ✅ PASS | 100ms | Login successful |
| TC4 | POST /session | ✅ PASS | 200ms | Session created |

---

## 🚨 Common Issues & Solutions

### 1. CORS Errors
**Issue**: Browser blocks requests due to CORS
**Solution**: Ensure CORS middleware is properly configured

### 2. File Upload Size Limits
**Issue**: Large files fail to upload
**Solution**: Check multer configuration (currently set to 50MB)

### 3. Database Connection Issues
**Issue**: Database queries fail
**Solution**: Verify DATABASE_URL and database status

### 4. Supabase Storage Issues
**Issue**: File uploads to Supabase fail
**Solution**: Check SUPABASE_URL, SUPABASE_KEY, and bucket permissions

---

## 📝 Notes

- All timestamps are in ISO format
- File uploads support PDF and JPG formats only
- Maximum file size is 50MB
- JWT tokens expire (check your JWT_SECRET configuration)
- Database operations are case-sensitive
- Supabase storage bucket must be named `images`

---

**Happy Testing! 🧪✨**
