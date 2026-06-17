# Nested Service API Documentation

This document provides details on the `NestedService` API endpoints available in the Rajsheba application.

## Base URL
`/nested-services`

## Data Model (NestedService)
```json
{
  "id": 1,
  "name": "Ac Repairing",
  "description": "Expert AC repairing service.",
  "image": "http://example.com/image.jpg",
  "price": 500.00,
  "createdAt": "2024-06-16T12:00:00.000Z",
  "updatedAt": "2024-06-16T12:00:00.000Z",
  "deletedAt": null,
  "service": {
    // Parent service details
  }
}
```

---

## Endpoints

### 1. Create a Nested Service
- **Endpoint**: `POST /nested-services`
- **Description**: Creates a new nested service under a parent service.
- **Request Body**:
  ```json
  {
    "service_id": 1,
    "name": "Filter Replacement",
    "description": "Replacement of old AC filters.",
    "image": "http://example.com/filter.jpg",
    "price": 200.00
  }
  ```
  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `service_id` | number | Yes | ID of the parent service. |
  | `name` | string | Yes | Name of the nested service. |
  | `description` | string | No | Description of the nested service. |
  | `image` | string | No | URL of the image. |
  | `price` | number | No | Price of the nested service. |

- **Response**:
  ```json
  {
    "statusCode": 201,
    "message": "Nested Service created successfully",
    "data": { /* NestedService Object */ }
  }
  ```

### 2. Get All Nested Services
- **Endpoint**: `GET /nested-services`
- **Description**: Retrieves a list of all nested services.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Nested Services retrieved successfully",
    "data": [
      { /* NestedService Object 1 */ },
      { /* NestedService Object 2 */ }
    ]
  }
  ```

### 3. Get Nested Services by Parent Service ID
- **Endpoint**: `GET /nested-services/service/:serviceId`
- **Description**: Retrieves all nested services associated with a specific parent service ID.
- **Path Parameters**:
  - `serviceId` (number): The ID of the parent service.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Nested Services by Service retrieved successfully",
    "data": [
      { /* NestedService Object */ }
    ]
  }
  ```

### 4. Get a Single Nested Service by ID
- **Endpoint**: `GET /nested-services/:id`
- **Description**: Retrieves details of a specific nested service by its ID.
- **Path Parameters**:
  - `id` (number): The ID of the nested service.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Nested Service retrieved successfully",
    "data": { /* NestedService Object */ }
  }
  ```

### 5. Update a Nested Service
- **Endpoint**: `PATCH /nested-services/:id`
- **Description**: Updates an existing nested service.
- **Path Parameters**:
  - `id` (number): The ID of the nested service to update.
- **Request Body**:
  Fields are optional. Only provided fields will be updated.
  ```json
  {
    "name": "Updated Filter Replacement",
    "price": 250.00
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Nested Service updated successfully",
    "data": { /* Updated NestedService Object */ }
  }
  ```

### 6. Delete a Nested Service
- **Endpoint**: `DELETE /nested-services/:id`
- **Description**: Soft deletes a nested service.
- **Path Parameters**:
  - `id` (number): The ID of the nested service to delete.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Nested Service deleted successfully"
  }
  ```
