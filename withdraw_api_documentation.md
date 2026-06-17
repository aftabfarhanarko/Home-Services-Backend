# Withdraw API Documentation

This document provides details on the `Withdraw` API endpoints available in the Rajsheba application.

## Base URL
`/withdraws`

## Data Model (Withdraw)
```json
{
  "id": 1,
  "amount": 500.00,
  "status": "pending", // "pending" | "approved" | "rejected"
  "createdAt": "2024-06-16T12:00:00.000Z",
  "updatedAt": "2024-06-16T12:00:00.000Z",
  "deletedAt": null,
  "vendor": {
    // Associated User object details (the vendor)
  }
}
```

---

## Endpoints

### 1. Request a Withdraw
- **Endpoint**: `POST /withdraws/request`
- **Description**: Creates a new withdraw request for a vendor.
- **Request Body**:
  ```json
  {
    "amount": 500.00
  }
  ```
  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `amount` | number | Yes | The amount to withdraw. Must be at least 1. |

  *(Note: The vendor ID is currently automatically inferred in the backend based on the authenticated user session).*

- **Response**:
  ```json
  {
    "statusCode": 201,
    "message": "Withdraw requested successfully",
    "data": { /* Created Withdraw Object */ }
  }
  ```

### 2. Get All Withdraws
- **Endpoint**: `GET /withdraws`
- **Description**: Retrieves a list of all withdraw requests.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Withdraws retrieved successfully",
    "data": [
      { /* Withdraw Object 1 */ },
      { /* Withdraw Object 2 */ }
    ]
  }
  ```

### 3. Get Withdraws by Vendor ID
- **Endpoint**: `GET /withdraws/vendor/:vendorId`
- **Description**: Retrieves all withdraw requests made by a specific vendor.
- **Path Parameters**:
  - `vendorId` (number): The ID of the vendor (User).
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Vendor withdraws retrieved successfully",
    "data": [
      { /* Withdraw Object */ }
    ]
  }
  ```

### 4. Get a Single Withdraw by ID
- **Endpoint**: `GET /withdraws/:id`
- **Description**: Retrieves details of a specific withdraw request by its ID.
- **Path Parameters**:
  - `id` (number): The ID of the withdraw request.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Withdraw retrieved successfully",
    "data": { /* Withdraw Object */ }
  }
  ```

### 5. Update Withdraw Status
- **Endpoint**: `PATCH /withdraws/:id/status`
- **Description**: Updates the status of an existing withdraw request.
- **Path Parameters**:
  - `id` (number): The ID of the withdraw request to update.
- **Request Body**:
  ```json
  {
    "status": "approved" // "pending" | "approved" | "rejected"
  }
  ```
  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `status` | string (enum)| Yes | The new status for the withdraw. |

- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Withdraw status updated successfully",
    "data": { /* Updated Withdraw Object */ }
  }
  ```

### 6. Delete a Withdraw
- **Endpoint**: `DELETE /withdraws/:id`
- **Description**: Soft deletes a withdraw request.
- **Path Parameters**:
  - `id` (number): The ID of the withdraw request to delete.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Withdraw deleted successfully"
  }
  ```
