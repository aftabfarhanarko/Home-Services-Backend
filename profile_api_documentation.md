# Profile API Documentation

This document provides details on the `Profile` API endpoints available in the Rajsheba application.

## Base URL
`/profiles`

## Data Model (Profile)
```json
{
  "id": 1,
  "type": "personal", // "personal" | "company"
  "rating": 4.5, // Work rating for personal, company rating for company
  "total_projects": 12, // Total work done for personal, total projects for company
  "location": "Dhaka, Bangladesh",
  "description": "Experienced AC technician with 5 years of experience.",
  "company_name": "Cooling Experts Ltd.", // Applicable mainly for 'company' type
  "min_starting_price": 500.00,
  "google_map_link": "https://maps.google.com/...",
  "createdAt": "2024-06-16T12:00:00.000Z",
  "updatedAt": "2024-06-16T12:00:00.000Z",
  "user": {
    // Associated User object details
  },
  "category": {
    // Associated Category object details
  }
}
```

---

## Endpoints

### 1. Create a Profile
- **Endpoint**: `POST /profiles`
- **Description**: Creates a new profile. Defaults `user_id` to the currently authenticated user if not provided.
- **Authorization**: Required (`Bearer Token`)
- **Request Body**:
  ```json
  {
    "type": "personal",
    "location": "Dhaka, Bangladesh",
    "description": "Expert in home appliance repair.",
    "category_id": 1
  }
  ```
  | Field | Type | Required | Description |
  |-------|------|----------|-------------|
  | `type` | string (enum) | Yes | Either `"personal"` or `"company"`. |
  | `location` | string | No | Physical location or service area. |
  | `description` | string | No | About the person or company. |
  | `company_name` | string | No | Name of the company. |
  | `min_starting_price`| number | No | Minimum starting price for services. |
  | `google_map_link` | string (URL)| No | Google Maps link for the business location. |
  | `user_id` | number | No | ID of the user. Automatically inferred from JWT if omitted. |
  | `category_id` | number | No | ID of the associated category. |

- **Response**:
  ```json
  {
    "statusCode": 201,
    "message": "Profile created successfully",
    "data": { /* Created Profile Object */ }
  }
  ```

### 2. Get All Profiles
- **Endpoint**: `GET /profiles`
- **Description**: Retrieves a list of all profiles.
- **Authorization**: None required
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Profiles retrieved successfully",
    "data": [
      { /* Profile Object 1 */ },
      { /* Profile Object 2 */ }
    ]
  }
  ```

### 3. Get a Single Profile by ID
- **Endpoint**: `GET /profiles/:id`
- **Description**: Retrieves details of a specific profile by its ID.
- **Authorization**: None required
- **Path Parameters**:
  - `id` (number): The ID of the profile.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Profile retrieved successfully",
    "data": { /* Profile Object */ }
  }
  ```

### 4. Update a Profile
- **Endpoint**: `PATCH /profiles/:id`
- **Description**: Updates an existing profile.
- **Authorization**: Required (`Bearer Token`)
- **Path Parameters**:
  - `id` (number): The ID of the profile to update.
- **Request Body**:
  Fields are optional. Only provided fields will be updated.
  ```json
  {
    "location": "Chittagong, Bangladesh",
    "rating": 4.8
  }
  ```
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Profile updated successfully",
    "data": { /* Updated Profile Object */ }
  }
  ```

### 5. Delete a Profile
- **Endpoint**: `DELETE /profiles/:id`
- **Description**: Soft deletes a profile.
- **Authorization**: Required (`Bearer Token`)
- **Path Parameters**:
  - `id` (number): The ID of the profile to delete.
- **Response**:
  ```json
  {
    "statusCode": 200,
    "message": "Profile deleted successfully"
  }
  ```
