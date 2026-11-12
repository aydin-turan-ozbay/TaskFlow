# TaskFlow

TaskFlow is a task management project designed to help users organize tasks, manage priorities, assign responsibilities, and track progress.

The project currently includes a backend REST API developed with Node.js and Express.js. A React-based frontend is planned for future development.

## Technologies

**Backend**
- Node.js
- Express.js
- JavaScript (ES Modules)
- JSON file storage

**Frontend (Planned)**
- React.js
- Vite
- Bootstrap 5

**Testing**
- Postman

## Project Structure

```text
TaskFlow/
├── backend/    # REST API implementation
├── docs/       # Project documentation and API test screenshots
└── README.md   # General project overview
```

## Current Features

- Create, retrieve, update, and delete tasks
- Assign tasks to users
- Manage task priorities and statuses
- Validate incoming API requests
- Store task data in a local JSON file
- Log incoming HTTP requests

## Getting Started

To run the backend locally:

```bash
cd backend
npm install
npm run dev
```

The API will be available at:

`http://localhost:3000`

## API Documentation

For detailed installation instructions, endpoint descriptions, task data models, and validation rules, see the [Backend README](backend/README.md).

## Project Documentation

The `docs/` directory contains the backend project introduction and Postman test screenshots.

## Project Status

The backend REST API has been implemented and tested.

Frontend development is planned as the next stage.