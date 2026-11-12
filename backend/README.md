# TaskFlow – REST API

## 1. Project Overview

TaskFlow is a task management REST API developed using Node.js and Express.js.

The application allows users to create, view, update, and delete tasks through HTTP requests. It provides a simple backend structure for managing tasks, tracking their status, setting priorities, and assigning responsibilities.

The project was developed as part of a backend programming assignment.

## 2. Technologies Used

- Node.js
- Express.js
- JavaScript (ES Modules)
- JSON file storage
- Postman (API testing)

## 3. Project Structure

```text
TaskFlow/
├── backend/
│   ├── data/
│   │   └── tasks.json
│   ├── src/
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── logger.js
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   └── app.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
│
└── docs/
    ├── postman-tests/
    │   ├── create-task-1.png
    │   ├── create-task-2.png
    │   ├── create-task-3.png
    │   ├── delete-task.png
    │   ├── get-all-tasks-at-the-end.png
    │   ├── get-all-tasks-in-the-beginning.png
    │   ├── get-task-by-id.png
    │   ├── logger-test.png
    │   └── update-task.png
    └── backend-project-introduction.pdf
```

**Directory Descriptions**

- `backend/src/controllers/` – Contains the business logic for task CRUD operations.
- `backend/src/routes/` – Defines the REST API endpoints using Express Router.
- `backend/src/middleware/` – Contains the custom HTTP request logger.
- `backend/data/` – Stores task records in JSON format.
- `backend/src/app.js` – Configures the Express server, middleware, and JSON error handling.
- `docs/postman-tests/` – Contains screenshots demonstrating successful API tests.
- `docs/backend-project-introduction.pdf` – Provides an introduction to the backend project.
- `backend/README.md` – Provides project documentation, installation steps, and API usage information.

The node_modules/ directory is excluded from Git and can be recreated by running npm install.

## 4. Installation and Setup

**Prerequisites:** Node.js and npm.

1. Open the backend directory in a terminal.
2. Install dependencies:

   `npm install`

3. Start the development server:

   `npm run dev`

4. The API will be available at:

   `http://localhost:3000`

For normal execution, use:

`npm start`

## 5. API Endpoints

Base URL: `http://localhost:3000/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Retrieve all tasks |
| GET | /api/tasks/:id | Retrieve a task by ID |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update specified fields of an existing task |
| DELETE | /api/tasks/:id | Delete a specified task |

The PUT endpoint supports partial updates. Only the fields included in the request body are updated, while the remaining task properties are preserved.

### Example: Create Task

**POST** `/api/tasks`

Request Body:

```json
{
  "title": "Complete backend project",
  "description": "Implement and test REST API endpoints",
  "priority": "high",
  "assignee": "Ahmet",
  "dueDate": "2026-11-16"
}
```

The API automatically generates a unique task ID, sets the initial status to todo, and records creation and update timestamps.

### Example: Update Task

**PUT** `/api/tasks/:id`

Request Body:

```json
{
  "priority": "medium",
  "status": "in-progress"
}
```

This request updates only the priority and status of the selected task.

## 6. Task Data Model

| Field | Description |
|---|---|
| id | Automatically generated unique task identifier (UUID) |
| title | Required, non-empty task title |
| description | Optional task description; defaults to an empty string |
| priority | Required: low, medium, high |
| status | Task status: todo, in-progress, completed |
| assignee | Required, non-empty assigned person |
| dueDate | Optional deadline in YYYY-MM-DD format; defaults to null |
| createdAt | Automatically generated creation timestamp |
| updatedAt | Automatically maintained last update timestamp |

New tasks receive the default status todo.

The id, createdAt, and updatedAt fields are managed by the server and cannot be modified through the update endpoint.

### Data Validation

The API validates incoming task data before creating or updating records.

Validation rules include:

- Required task titles and assignee names must be non-empty strings.

- Priority and status values must match the supported options.

- Descriptions must be strings.

- Due dates must represent valid calendar dates in YYYY-MM-DD format.

- Empty update requests are rejected.

- Unsupported or protected fields cannot be updated.

- Request bodies must be JSON objects rather than arrays or other data types.

Invalid requests return HTTP 400 Bad Request with an explanatory JSON message.

## 7. Logger Middleware

The application includes a custom Logger Middleware that records incoming HTTP requests.

Each log contains:

- HTTP method
- Request endpoint
- Request timestamp

Example:

`[2026-11-11T12:00:00.000Z] GET /api/tasks`

The logger runs before JSON body parsing, allowing incoming requests to be recorded even when their JSON bodies are rejected.

The application also handles JSON parsing errors and returns structured JSON error responses instead of default HTML error pages.

## 8. API Testing

All five REST API operations were tested using Postman.

The tests cover task creation, listing, retrieval by ID, updating, and deletion.

Additional validation tests were performed to verify:

- Rejection of invalid description types.

- Rejection of invalid date types and calendar dates.

- Rejection of empty update requests.

- Protection of server-managed task fields.

- Rejection of invalid JSON request body structures.

- Successful creation and partial updating of valid tasks.

- JSON error responses for parsing failures.

- HTTP request logging through the Logger Middleware.

The docs/postman-tests/ directory contains screenshots demonstrating the main API operations.

## 9. Data Storage

Task records are stored locally in the `data/tasks.json` file.

The `tasks.json` file contains sample task records used to demonstrate the API's data structure and functionality. These records also support the project's testing and demonstration scenarios.

This approach keeps the project simple and does not require an external database.

The JSON file storage implementation is intended for a small-scale educational project. It does not provide the concurrency handling and transactional guarantees of a database system.

## 10. Project Scope

The current version focuses on the backend REST API, CRUD operations, routing, middleware, data validation, JSON error handling, and API testing.

Features such as user authentication, advanced reporting, and database integration are outside the scope of this version.