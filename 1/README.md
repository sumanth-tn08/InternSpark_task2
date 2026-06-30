# Tasks RESTful CRUD API

A production-ready RESTful CRUD API for managing tasks, built using Node.js, Express, and MongoDB (via Mongoose). It follows professional architecture, featuring ES6 Modules, strict schema validation, unified error handling middleware, logging, and query utilities like pagination, sorting, search, and filtering.

---

## Technical Stack & Features

- **Core Framework**: Node.js & Express.
- **Database Engine**: MongoDB with Mongoose ODM schemas.
- **Logging**: Morgan HTTP logger for console monitoring.
- **Environment Management**: Dotenv configuration.
- **CORS**: Express CORS middleware pre-configured.
- **JavaScript Module System**: ES Modules (`"type": "module"`).
- **Error Handling**: Custom centralized error handling middleware formatting Mongoose validations, cast errors, duplicate keys, and 404s.
- **Advanced Query Support**: Supports pagination, sorting, search, and field-level filters.

---

## Getting Started

### Prerequisites

- Node.js installed (v18.x or above recommended).
- MongoDB installed locally OR a remote MongoDB Atlas database connection URI.

### Installation

1. Clone or copy the project files to your local workspace directory.
2. Navigate to the project root directory and install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory by copying the sample environment template:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file and customize the port and database URI configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/taskdb
   ```

### Running the Application

- **Development Mode** (uses native watch mode for auto-reloading):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## API Endpoints Documentation

All endpoints return JSON responses with standard success flags.

### 1. Get All Tasks

- **URL**: `/api/tasks`
- **Method**: `GET`
- **Query Parameters (Optional)**:
  - `completed`: Filter by completion state (`true` or `false`).
  - `priority`: Filter by priority level (`low`, `medium`, `high`).
  - `search`: Case-insensitive title search (e.g. `?search=report`).
  - `page`: Page index for pagination (default `1`).
  - `limit`: Number of tasks per page (default `10`).
  - `sortBy`: Field name and ordering direction separated by a colon (e.g. `?sortBy=dueDate:asc` or `?sortBy=createdAt:desc`).
- **Success Response (Code: 200)**:
  ```json
  {
    "success": true,
    "count": 1,
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 1,
      "totalTasks": 1
    },
    "data": [
      {
        "_id": "64bc0b392a832d2f78c93421",
        "title": "Complete project setup",
        "description": "Initialize package.json, MongoDB schema, and server endpoints",
        "completed": false,
        "priority": "high",
        "dueDate": "2026-07-15T00:00:00.000Z",
        "createdAt": "2026-06-30T13:45:00.000Z",
        "updatedAt": "2026-06-30T13:45:00.000Z",
        "__v": 0
      }
    ]
  }
  ```

### 2. Get Single Task

- **URL**: `/api/tasks/:id`
- **Method**: `GET`
- **Success Response (Code: 200)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "64bc0b392a832d2f78c93421",
      "title": "Complete project setup",
      "description": "Initialize package.json, MongoDB schema, and server endpoints",
      "completed": false,
      "priority": "high",
      "dueDate": "2026-07-15T00:00:00.000Z",
      "createdAt": "2026-06-30T13:45:00.000Z",
      "updatedAt": "2026-06-30T13:45:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - **Task Not Found (Code: 404)**: If task is missing.
  - **Invalid ID Format (Code: 400)**: If path parameter isn't a valid MongoDB ObjectId.

### 3. Create Task

- **URL**: `/api/tasks`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body Fields**:
  - `title` (String, required, min 3 chars, max 100 chars)
  - `description` (String, optional, max 500 chars)
  - `completed` (Boolean, optional, default `false`)
  - `priority` (String, optional, enum: `low`/`medium`/`high`, default `medium`)
  - `dueDate` (Date, optional, cannot be in the past)
- **Request Body Example**:
  ```json
  {
    "title": "Complete project setup",
    "description": "Initialize package.json, MongoDB schema, and server endpoints",
    "priority": "high",
    "dueDate": "2026-07-15"
  }
  ```
- **Success Response (Code: 201)**: Returns the newly created task model.

### 4. Update Task

- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **Headers**: `Content-Type: application/json`
- **Request Body Fields**: Same as Create Task (all fields optional; Mongoose validation runs on updated fields).
- **Success Response (Code: 200)**: Returns the modified task document.

### 5. Delete Task

- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Success Response (Code: 200)**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {
      "id": "64bc0b392a832d2f78c93421"
    }
  }
  ```

---

## Unified Error Responses

If an error is thrown, the API returns a standardized response layout:

### Example validation error:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "title",
      "message": "Task title is required"
    },
    {
      "field": "dueDate",
      "message": "Due date cannot be in the past"
    }
  ]
}
```

---

## Testing via Postman Collection

The file `tasks_api.postman_collection.json` is located in the root of the project.

### How to use:
1. Open **Postman**.
2. Click **Import** in the top left.
3. Drag & drop the file `tasks_api.postman_collection.json` or select it from your file browser.
4. The collection defines a collection variable named `baseUrl` which defaults to `http://localhost:5000`. You can configure it inside the Collection details under **Variables** if you use a different port.
5. In the Create Task request, after a successful POST request, the script automatically parses the created task's `_id` and saves it in a collection variable named `taskId`. All subsequent requests (GET single, PUT, and DELETE) automatically reference this `taskId` dynamic variable (`{{taskId}}`).
# InternSpark_task1
