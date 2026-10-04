# Smart Task Manager

Task management with assignments, priorities, dependencies, and role-based access. Built with Next.js and Express using in-memory storage.

## Live Demo

**Application:** [https://smart-task-manager-lyart-five.vercel.app](https://smart-task-manager-lyart-five.vercel.app)

**Backend API:** [https://smart-task-manager-3-b0o4.onrender.com](https://smart-task-manager-3-b0o4.onrender.com)

Sign in with the seeded Admin email `admin@example.com`, or register a User account. Authentication is a demo flow using email only; do not use sensitive or real account information.

## Features

- Register new User accounts, then log in using email only
- Seeded Admin account and two demo User accounts
- Admin and User roles
- Dashboard with summary cards
- Create, edit, delete, and complete tasks
- Task assignment and filtering
- Task dependency management and blocked-task logic
- Optional task file attachments and completed-work links
- Admin-only user listing
- Responsive, beginner-friendly interface
- In-memory backend storage only

## Tech Stack

- Frontend: Next.js, React, JavaScript, CSS
- Backend: Node.js, Express.js
- Data storage: JavaScript arrays and objects in memory

## Project Structure

```text
smart_task_manger/
├── backend/
│   ├── controllers/
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── data/
│   │   └── store.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app/
│   │   ├── blocked-tasks/page.js
│   │   ├── create-task/page.js
│   │   ├── dashboard/page.js
│   │   ├── login/page.js
│   │   ├── my-tasks/page.js
│   │   ├── tasks/page.js
│   │   ├── users/page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   ├── services/
│   │   └── api.js
│   └── package.json
└── README.md
```

The frontend uses the Next.js App Router; there is no separate `pages/` directory. The old root-level static HTML/CSS/JavaScript mockup has been removed. `node_modules/` and `.next/` are generated locally by npm and Next.js and are not application source files.

## Installation

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Run App

Open the frontend in the browser at:

```text
http://localhost:3000
```

The backend runs locally at:

```text
http://localhost:5000
```

## Deploy to Vercel and Render

The frontend and Express backend are separate services. Deploy the repository's `backend/` service on Render using the root `render.yaml` blueprint, then copy its public service URL. In the Vercel project settings, add this environment variable:

```text
NEXT_PUBLIC_API_URL=https://smart-task-manager-3-b0o4.onrender.com/api
```

This URL is also the production fallback in the frontend source. Set the same value for Production (and Preview if needed) in Vercel if you'd like to control it through settings, then redeploy the frontend. Do not use `localhost` in the Vercel setting: it refers to the visitor's own computer. The backend currently stores data in memory, so its user and task data resets when its process restarts.

## Default Users

The backend creates these users automatically:

- Admin - admin@example.com
- Siddhi - siddhi@example.com
- Mohit - mohit@example.com

Newly registered accounts receive the User role. Registration does not require a password because this project uses mock authentication.

## API Endpoints

### Users

- POST /api/register
- POST /api/login
- POST /api/users
- GET /api/users
- GET /api/me

### Tasks

- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/done
- GET /api/tasks/:id/attachment
- GET /api/users/:userId/tasks
- GET /api/tasks/blocked

## Admin vs User Permissions

### Admin

- View dashboard
- Create tasks
- Edit and delete tasks
- View all tasks
- View blocked tasks
- View all users
- Create users

### User

- View dashboard
- View own tasks
- Create tasks
- Update allowed tasks
- Mark tasks as done when dependencies are complete
- View blocked tasks
- Cannot view all users

## Dependency Logic

The app uses a reusable blocked-task check:

```js
function isTaskBlocked(task, tasks) {
  if (!task || !task.dependency) {
    return false;
  }

  const dependencyTask = tasks.find((item) => item.id === task.dependency);

  if (!dependencyTask) {
    return false;
  }

  return dependencyTask.status !== 'Done';
}
```

A task is blocked until its dependency is marked Done. Task attachments are held in backend memory, limited to 2 MB, and reset when the backend restarts. Completed-work links must use HTTP or HTTPS.

## Screenshots

Add screenshots of the login page, dashboard, task page, and users page here for documentation.

## Future Improvements

- Add real authentication with JWT
- Add persistent database storage
- Add drag-and-drop task boards
- Add notifications and reminders
- Add search and sorting

## Author

Smart Task Manager Demo Project
