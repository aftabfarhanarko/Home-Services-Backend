# Service API Documentation

Base URL: `/services`

## Endpoints

### 1. Create a Service
- **Method**: `POST`
- **URL**: `/services`
- **Description**: Creates a new service.
- **Request Body** (`application/json`):
  ```json
  {
    "name": "Home Cleaning",
    "subtitle": "Deep cleaning for your entire home",
    "slug": "home-cleaning",
    "description": "Full details about the home cleaning service...",
    "image": "https://example.com/image.jpg",
    "banner": "https://example.com/banner.jpg",
    "employee_id": 1,
    "category_id": 2
  }
  ```
  - `name` (string, required): The name of the service.
  - `subtitle` (string, optional): A short subtitle.
  - `slug` (string, required): A unique URL-friendly string.
  - `description` (string, optional): Detailed description.
  - `image` (string, optional): URL for the service image.
  - `banner` (string, optional): URL for the service banner.
  - `employee_id` (number, optional): The ID of the employee associated with the service.
  - `category_id` (number, optional): The ID of the category this service belongs to.

- **Response** (Success - `201 CREATED`):
  ```json
  {
    "statusCode": 201,
    "message": "Service created successfully",
    "data": { ...service object }
  }
  ```

### 2. Get All Services
- **Method**: `GET`
- **URL**: `/services`
- **Description**: Retrieves a list of all services. (Note: This endpoint is protected by `JwtAuthGuard` and may return services based on the authenticated user's context).
- **Headers**:
  - `Authorization`: Bearer `<JWT_TOKEN>`
- **Response** (Success - `200 OK`):
  ```json
  {
    "statusCode": 200,
    "message": "Services retrieved successfully",
    "data": [ ...array of services ]
  }
  ```

### 3. Get a Specific Service
- **Method**: `GET`
- **URL**: `/services/:id`
- **Description**: Retrieves a specific service by its ID.
- **URL Parameters**:
  - `id` (number): The ID of the service.
- **Response** (Success - `200 OK`):
  ```json
  {
    "statusCode": 200,
    "message": "Service retrieved successfully",
    "data": { ...service object }
  }
  ```

### 4. Update a Service
- **Method**: `PATCH`
- **URL**: `/services/:id`
- **Description**: Updates an existing service by its ID. Allows partial updates.
- **URL Parameters**:
  - `id` (number): The ID of the service.
- **Request Body** (`application/json`):
  Same fields as the creation body, but all fields are optional.
- **Response** (Success - `200 OK`):
  ```json
  {
    "statusCode": 200,
    "message": "Service updated successfully",
    "data": { ...updated service object }
  }
  ```

### 5. Delete a Service
- **Method**: `DELETE`
- **URL**: `/services/:id`
- **Description**: Deletes an existing service by its ID.
- **URL Parameters**:
  - `id` (number): The ID of the service.
- **Response** (Success - `200 OK`):
  ```json
  {
    "statusCode": 200,
    "message": "Service deleted successfully"
  }
  ```
