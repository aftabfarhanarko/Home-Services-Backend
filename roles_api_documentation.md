# Roles API Documentation

This document provides details on the available endpoints for managing roles and permissions within the Rajsheba application. It is intended for frontend developers integrating the Role management features.

## Base URL
`/roles`

## Enums and Types

### RoleType
The `name` of a role must be one of these predefined values:
- `Super Admin`
- `Agent`
- `Vendor`
- `Employee`
- `Client`

### Permission
Available permissions:
- `MANAGE_USERS`
- `MANAGE_ROLES`
- `VIEW_AUDIT_LOGS`

### Role Object
```typescript
interface Role {
  id: number;
  name: RoleType;
  permissions: Permission[];
  createdAt: string; // ISO 8601 Date
  updatedAt: string; // ISO 8601 Date
}
```

---

## Endpoints

### 1. Get All Public Roles
Retrieve a list of all roles. This endpoint does not require authentication.

- **Method:** `GET`
- **Path:** `/roles/public`
- **Authentication:** `Public`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Roles retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "Super Admin",
        "permissions": ["MANAGE_USERS", "MANAGE_ROLES"],
        "createdAt": "2024-06-16T12:00:00.000Z",
        "updatedAt": "2024-06-16T12:00:00.000Z"
      }
    ]
  }
  ```

---

### 2. Get All Roles (Protected)
Retrieve a list of all roles. This endpoint is protected and restricted to specific roles.

- **Method:** `GET`
- **Path:** `/roles`
- **Authentication:** `Bearer Token` required
- **Allowed Roles:** `Super Admin`, `Agent`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Roles retrieved successfully",
    "data": [
      {
        "id": 1,
        "name": "Super Admin",
        "permissions": ["MANAGE_USERS", "MANAGE_ROLES"],
        "createdAt": "2024-06-16T12:00:00.000Z",
        "updatedAt": "2024-06-16T12:00:00.000Z"
      }
    ]
  }
  ```

---

### 3. Get Role By ID
Retrieve the details of a specific role by its ID.

- **Method:** `GET`
- **Path:** `/roles/:id`
- **Authentication:** `Bearer Token` required
- **Allowed Roles:** `Super Admin`, `Agent`
- **Parameters:**
  - `id` (number): The ID of the role.
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Role retrieved successfully",
    "data": {
      "id": 1,
      "name": "Super Admin",
      "permissions": ["MANAGE_USERS", "MANAGE_ROLES"],
      "createdAt": "2024-06-16T12:00:00.000Z",
      "updatedAt": "2024-06-16T12:00:00.000Z"
    }
  }
  ```

---

### 4. Create Role
Create a new role in the system. Ensure the role name is unique and belongs to the `RoleType` enum.

- **Method:** `POST`
- **Path:** `/roles`
- **Authentication:** `Bearer Token` required
- **Allowed Roles:** `Super Admin`
- **Request Body:**
  ```json
  {
    "name": "Super Admin", // Must be a valid RoleType
    "permissions": ["MANAGE_USERS", "MANAGE_ROLES"] // Optional array of Permission
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Role created successfully",
    "data": {
      "id": 2,
      "name": "Super Admin",
      "permissions": ["MANAGE_USERS", "MANAGE_ROLES"],
      "createdAt": "2024-06-16T12:05:00.000Z",
      "updatedAt": "2024-06-16T12:05:00.000Z"
    }
  }
  ```

---

### 5. Update Role
Update an existing role's information.

- **Method:** `PATCH`
- **Path:** `/roles/:id`
- **Authentication:** `Bearer Token` required
- **Allowed Roles:** `Super Admin`
- **Parameters:**
  - `id` (number): The ID of the role.
- **Request Body (Partial):**
  ```json
  {
    "permissions": ["MANAGE_USERS", "MANAGE_ROLES", "VIEW_AUDIT_LOGS"]
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Role updated successfully",
    "data": {
      "id": 2,
      "name": "Super Admin",
      "permissions": ["MANAGE_USERS", "MANAGE_ROLES", "VIEW_AUDIT_LOGS"],
      "createdAt": "2024-06-16T12:05:00.000Z",
      "updatedAt": "2024-06-16T12:10:00.000Z"
    }
  }
  ```

---

### 6. Delete Role
Remove a role from the system by ID.

- **Method:** `DELETE`
- **Path:** `/roles/:id`
- **Authentication:** `Bearer Token` required
- **Allowed Roles:** `Super Admin`
- **Parameters:**
  - `id` (number): The ID of the role.
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Role deleted successfully"
  }
  ```
