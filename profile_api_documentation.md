# Profile API Documentation

This document provides details on the available endpoints for managing user profiles within the Rajsheba application. It is intended for frontend developers integrating the Profile management features.

## Base URL
`/profiles`

## Enums and Types

### ProfileType
The `type` of a profile must be one of these predefined values:
- `personal`
- `company`

### Profile Object
```typescript
interface Profile {
  id: number;
  user: User; // Full User object relation
  type: "personal" | "company";
  rating: number; // Work rating for personal, company rating for company
  total_projects: number; // Total work done for personal, total projects for company
  location: string | null;
  description: string | null;
  company_name: string | null; // For company profiles
  min_starting_price: number | null; // For company profiles
  google_map_link: string | null; // For company profiles
  category: Category | null; // Full Category object relation
  createdAt: string; // ISO 8601 Date
  updatedAt: string; // ISO 8601 Date
}
```

---

## Endpoints

### 1. Create Profile
Create a new profile. If `user_id` is not provided in the request body, it will automatically use the ID of the currently authenticated user.

- **Method:** `POST`
- **Path:** `/profiles`
- **Authentication:** `Bearer Token` required (`JwtAuthGuard`)
- **Request Body:**
  ```json
  {
    "type": "personal", // Required. "personal" or "company"
    "location": "Dhaka, Bangladesh", // Optional
    "description": "Expert in web development", // Optional
    "company_name": "Tech Solutions", // Optional, useful if type is "company"
    "min_starting_price": 500, // Optional
    "google_map_link": "https://maps.google.com/...", // Optional
    "user_id": 1, // Optional. Defaults to the logged-in user if omitted.
    "category_id": 2 // Optional
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 201,
    "message": "Profile created successfully",
    "data": {
      "id": 1,
      "type": "personal",
      "location": "Dhaka, Bangladesh",
      "description": "Expert in web development",
      "rating": 0,
      "total_projects": 0,
      "user": { "id": 1 },
      "category": { "id": 2 },
      "createdAt": "2024-06-16T12:00:00.000Z",
      "updatedAt": "2024-06-16T12:00:00.000Z"
    }
  }
  ```

---

### 2. Get All Profiles
Retrieve a list of all profiles. This endpoint is public and does not require authentication. It includes relations for the `user` and `category`.

- **Method:** `GET`
- **Path:** `/profiles`
- **Authentication:** `Public`
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Profiles retrieved successfully",
    "data": [
      {
        "id": 1,
        "type": "personal",
        "location": "Dhaka, Bangladesh",
        "description": "Expert in web development",
        "rating": 0,
        "total_projects": 0,
        "user": { /* User object details */ },
        "category": { /* Category object details */ },
        "createdAt": "2024-06-16T12:00:00.000Z",
        "updatedAt": "2024-06-16T12:00:00.000Z"
      }
    ]
  }
  ```

---

### 3. Get Profile By ID
Retrieve the details of a specific profile by its ID. Includes relations for the `user` and `category`.

- **Method:** `GET`
- **Path:** `/profiles/:id`
- **Authentication:** `Public`
- **Parameters:**
  - `id` (number): The ID of the profile.
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Profile retrieved successfully",
    "data": {
      "id": 1,
      "type": "personal",
      // ... profile details
      "user": { /* User object details */ },
      "category": { /* Category object details */ }
    }
  }
  ```

---

### 4. Update Profile
Update an existing profile's information. 

- **Method:** `PATCH`
- **Path:** `/profiles/:id`
- **Authentication:** `Bearer Token` required (`JwtAuthGuard`)
- **Parameters:**
  - `id` (number): The ID of the profile.
- **Request Body (Partial update):**
  ```json
  {
    "description": "Updated description",
    "min_starting_price": 600,
    "category_id": 3
  }
  ```
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Profile updated successfully",
    "data": {
      "id": 1,
      "type": "personal",
      "description": "Updated description",
      // ... updated profile details
    }
  }
  ```

---

### 5. Delete Profile
Remove a profile from the system by ID.

- **Method:** `DELETE`
- **Path:** `/profiles/:id`
- **Authentication:** `Bearer Token` required (`JwtAuthGuard`)
- **Parameters:**
  - `id` (number): The ID of the profile.
- **Response:**
  ```json
  {
    "statusCode": 200,
    "message": "Profile deleted successfully"
  }
  ```
