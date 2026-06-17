# Package API Documentation

This document provides details on the `Package` API endpoints available in the Rajsheba application.

## Base URL
`/packages`

## Data Model (Package)
```json
{
  "id": 1,
  "name": "Standard AC Servicing Package",
  "description": "Includes filter replacement, gas check, and basic cleaning.",
  "price": 800.00,
  "createdAt": "2024-06-16T12:00:00.000Z",
  "updatedAt": "2024-06-16T12:00:00.000Z",
  "deletedAt": null,
  "service": {
    "id": 1,
    "name": "Ac Repairing"
    // Other parent service details
  },
  "items": [
    {
      "id": 1,
      "nestedService": {
        "id": 1,
        "name": "Filter Replacement"
        // Other nested service details
      }
    }
  ]
}
```

---

## Endpoints

### 1. Create a Package
- **Endpoint**: `POST /packages`
- **Description**: Creates a new package under a parent service, optionally including specific nested services.
- **Request Body**:
  ```json
  {
    "service_id": 1,
    "name": "Premium Service Package",
    "description": "Comprehensive servicing including all nested services.",
    "price": 1500.00,
    "nested_service_ids": [1, 2, 3]
  }
  ```
  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `service_id` | number | Yes | ID of the parent service. |
  | `name` | string | Yes | Name of the package. |
  | `description` | string | No | Description of the package. |
  | `price` | number | No | Price of the package. |
  | `nested_service_ids` | array of numbers | No | Array of IDs for the nested services included in this package. |

- **Response**:
  ```json
  {
    "statusCode": 201,
    "message": "Package created successfully",
    "data": { /* Package Object */ }
  }
  ```

### 2. Get All Packages
- **Endpoint**: `GET /packages`
- **Description**: Retrieves a list of all packages.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Packages retrieved successfully",
    "data": [
      { /* Package Object 1 */ },
      { /* Package Object 2 */ }
    ]
  }
  ```

### 3. Get Packages by Parent Service ID
- **Endpoint**: `GET /packages/service/:serviceId`
- **Description**: Retrieves all packages associated with a specific parent service ID.
- **Path Parameters**:
  - `serviceId` (number): The ID of the parent service.
- **Response**:
  ```json
  [
    { /* Package Object 1 */ },
    { /* Package Object 2 */ }
  ]
  ```
  *(Note: This endpoint currently returns the array of data directly without the `statusCode`/`message` wrapper.)*

### 4. Get a Single Package by ID
- **Endpoint**: `GET /packages/:id`
- **Description**: Retrieves details of a specific package by its ID.
- **Path Parameters**:
  - `id` (number): The ID of the package.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Package retrieved successfully",
    "data": { /* Package Object */ }
  }
  ```

### 5. Update a Package
- **Endpoint**: `PATCH /packages/:id`
- **Description**: Updates an existing package.
- **Path Parameters**:
  - `id` (number): The ID of the package to update.
- **Request Body**:
  Fields are optional. Only provided fields will be updated.
  ```json
  {
    "name": "Updated Premium Service Package",
    "price": 1600.00,
    "nested_service_ids": [1, 2, 4]
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Package updated successfully",
    "data": { /* Updated Package Object */ }
  }
  ```

### 6. Delete a Package
- **Endpoint**: `DELETE /packages/:id`
- **Description**: Soft deletes a package.
- **Path Parameters**:
  - `id` (number): The ID of the package to delete.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Package deleted successfully"
  }
  ```
