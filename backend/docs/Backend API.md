# Harmony

# Authentication

## Register Company

**Endpoint**

```
POST /api/auth/register
```

### Backend Requires

| Field | Type | Required |
|-------|------|----------|
| companyName | string | ✓ |
| contactName | string | ✓ |
| contactPhone | string | No |
| email | string | ✓ |
| password | string | ✓ |

### Backend Returns

```json
{
    "success": true,
    "message": "Company registered successfully",
    "user": {
        "id": 1,
        "email": "company@email.com",
        "role": "COMPANY"
    },
    "company": {
        "id": 1,
        "companyName": "Harmony",
        "contactName": "Ahmed",
        "contactPhone": "01012345678"
    }
}
```

### Frontend Must Provide

- Company Name input
- Contact Name input
- Contact Phone input
- Email input
- Password input
- Register button

### Frontend Should Display

- Success message
- Validation errors
- Backend error messages
- Redirect to Company Dashboard on success

---

## Login

**Endpoint**

```
POST /api/auth/login
```

### Backend Requires

| Field | Type | Required |
|-------|------|----------|
| email | string | ✓ |
| password | string | ✓ |

### Backend Returns

```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 2,
        "email": "admin@harmony.com",
        "role": "ADMIN"
    }
}
```

### Frontend Must Provide

- Email input
- Password input
- Login button

### Frontend Should Display

If role is ADMIN

```
/admin/dashboard
```

If role is COMPANY

```
/company/dashboard
```

Display backend errors if login fails.

---

## Logout

**Endpoint**

```
POST /api/auth/logout
```

### Backend Requires

Nothing.

### Backend Returns

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### Frontend Must Provide

- Logout button

### Frontend Should Display

- Redirect to Home page

---

## Current User

**Endpoint**

```
GET /api/auth/me
```

### Backend Requires

Authenticated user.

### Backend Returns

Company

```json
{
    "success": true,
    "user": {},
    "company": {}
}
```

Admin

```json
{
    "success": true,
    "user": {}
}
```

### Frontend Must Provide

Nothing.

Call this endpoint whenever the frontend needs to determine the currently logged-in user.

Recommended use:

- On application initialization (to restore an existing session after a refresh).
- When rendering the profile/account icon in the navigation bar.
- Before redirecting a user to their dashboard.

### Frontend Should Display

If authenticated:

- Show the profile/account icon (eli beykoon fel top right keda).
- Clicking the profile icon should redirect (based on role):
  - ADMIN → Admin Dashboard
  - COMPANY → Company Dashboard

If not authenticated:

- Hide the profile icon.
- Show the Login / Sign Up buttons instead.

---

# Admin Dashboard

## Dashboard Statistics

**Endpoint**

```
GET /api/admin/dashboard
```

### Backend Requires

Authenticated ADMIN.

### Backend Returns

```json
{
    "success": true,
    "stats": {
        "totalCompanies": 12,
        "activeCompanies": 10,
        "inactiveCompanies": 2,
        "totalServices": 6,
        "activeServices": 5,
        "inactiveServices": 1
    }
}
```

### Frontend Must Provide

Nothing.

### Frontend Should Display

Dashboard cards:

- Total Companies
- Active Companies
- Inactive Companies
- Total Services
- Active Services
- Inactive Services

---

# Company Management

## Get All Companies

**Endpoint**

```
GET /api/admin/companies
```

### Backend Requires

Authenticated ADMIN.

### Backend Returns

Array of companies.

Each company contains

```text
id
email
company_name
contact_name
contact_phone
is_active
created_at
```

### Frontend Must Provide

Nothing.

### Frontend Should Display

Companies table.

Columns

- Company
- Contact
- Email
- Phone
- Status
- Created At
- Actions

Actions

- View
- Activate
- Deactivate

---

## Get Company

**Endpoint**

```
GET /api/admin/companies/:id
```

### Backend Requires

Company ID.

### Backend Returns

Single company object.

### Frontend Must Provide

View button.

### Frontend Should Display

Company details page or modal.

---

## Update Company Status

**Endpoint**

```
PUT /api/admin/companies/:id/status
```

### Backend Requires

Path Parameter

- Company ID

Request Body

```json
{
    "is_active": true
}
```

or

```json
{
    "is_active": false
}
```

### Backend Returns

```json
{
    "success": true,
    "message": "Company status updated successfully.",
    "is_active": true
}
```

### Frontend Must Provide

- Status toggle switch.

### Frontend Should Display

- Toggle reflects current company status.
- When toggled, send the new `is_active` value to the backend.
- Update the toggle state based on the returned `is_active` value.
---

# Service Management

## Get All Services

**Endpoint**

```
GET /api/admin/services
```

### Backend Requires

Authenticated ADMIN.

### Backend Returns

Array of services.

Each service contains

```text
id
title
description
is_active
created_at
updated_at
```

### Frontend Must Provide

Nothing.

### Frontend Should Display

Services table.

Columns

- Title
- Description
- Status
- Created At
- Updated At
- Actions

Actions

- Edit
- Activate
- Deactivate

---

## Get Service

**Endpoint**

```
GET /api/admin/services/:id
```

### Backend Requires

Service ID.

### Backend Returns

Single service.

### Frontend Must Provide

View button.

### Frontend Should Display

Service details or edit form.

---

## Create Service

**Endpoint**

```
POST /api/admin/services
```

### Backend Requires

| Field | Type | Required |
|-------|------|----------|
| title | string | ✓ |
| description | string | No |

### Backend Returns

```json
{
    "success": true,
    "message": "Service created successfully",
    "serviceId": 5
}
```

### Frontend Must Provide

- Title input
- Description textarea
- Create button

### Frontend Should Display

New service appears in services table.

---

## Update Service

**Endpoint**

```
PUT /api/admin/services/:id
```

### Backend Requires

Service ID.

| Field | Type | Required |
|-------|------|----------|
| title | string | ✓ |
| description | string | No |

### Backend Returns

Success message.

### Frontend Must Provide

Edit form.

### Frontend Should Display

Updated service information.

---

## Update Service Status

**Endpoint**

```
PUT /api/admin/services/:id/status
```

### Backend Requires

Path Parameter

- Service ID

Request Body

```json
{
    "is_active": true
}
```

or

```json
{
    "is_active": false
}
```

### Backend Returns

```json
{
    "success": true,
    "message": "Service status updated successfully.",
    "is_active": false
}
```

### Frontend Must Provide

- Status toggle switch.

### Frontend Should Display

- Toggle reflects current service status.
- When toggled, send the new `is_active` value to the backend.
- Update the toggle state based on the returned `is_active` value.

---