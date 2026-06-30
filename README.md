# Task Management Application

A full-stack task management application featuring a RESTful API backend and a modern glassmorphic React frontend.

## Project Structure

The project is split into two main directories:

- [**`1/`**](./1): The backend RESTful API built with **Node.js**, **Express**, and **MongoDB** (using Mongoose).
- [**`2/`**](./2): The frontend Single-Page Application (SPA) built with **React**, **Vite**, and **React Router**.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **MongoDB** (local community server running or a MongoDB Atlas URI)

### 1. Setup & Start Backend API

Navigate to the `1` directory, configure environment variables, install dependencies, and start the development server:

```bash
cd 1

# Install dependencies
npm install

# Copy environment variables template and configure (if needed)
cp .env.example .env

# Run in development mode (with native file watching)
npm run dev
```

The backend server runs on `http://localhost:5000` by default.

### 2. Setup & Start Frontend client

Navigate to the `2` directory, install dependencies, and start the React dev server:

```bash
cd ../2

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```

Open the link printed in the terminal (usually `http://localhost:5173`) to view and interact with the application.

---

## API Documentation & Testing

A complete Postman collection is included in the backend folder:
- File path: [`1/tasks_api.postman_collection.json`](./1/tasks_api.postman_collection.json)

Import this collection into Postman to easily test all backend endpoints (filtering, search, pagination, and full CRUD operations).
# InternSpark_task2
