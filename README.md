# Smart Task Manager

A clean, modern, and dependency-aware task management web application designed to help teams organize, track, and complete work efficiently. Built with a Next.js (TypeScript & Tailwind CSS) frontend and an Express.js backend using an in-memory Map data store.

---

## Project Description

Smart Task Manager is a full-stack web application developed for college-level task management. In addition to standard task management features (title, description, priority, status, assignees), it enforces a core business rule: **a task cannot be marked "Done" until all of its dependency tasks are completed**. If any dependency is pending, the dependent task is clearly flagged as **BLOCKED**, preventing premature completion and illustrating real-world workflow constraints.

---

## Features

- **User Authentication**:
  - Simple user registration with full name, email, password, and confirmation validation.
  - Seamless login with session persistence via `localStorage` and React `AuthContext`.
  - Secure logout and protected route guards.

- **Task Management**:
  - Create tasks with Title, Description, Priority (`Low`, `Medium`, `High`), Status (`To Do`, `In Progress`, `Done`), Assignee, and Dependencies.
  - Edit existing tasks via an intuitive modal dialog.
  - Delete tasks with confirmation dialog and dependency protection.

- **Task Dependencies & Blocked Enforcement**:
  - Enforces dependency completion: A task cannot be marked "Done" if its dependencies are still incomplete.
  - Automatic circular dependency detection preventing invalid chains.
  - Deletion protection: Tasks cannot be deleted if other tasks depend on them.
  - Clear **BLOCKED** badge and reason displayed across the app: *"Waiting for dependency completion."*

- **Dashboard**:
  - 5 real-time statistic cards: Total Tasks, To Do, In Progress, Completed, and Blocked.
  - Recent tasks overview with instant "+ Create Task" action modal.

- **Filtered Views**:
  - **All Tasks**: Title search, Priority filtering (`All`, `Low`, `Medium`, `High`), and Status filtering (`All`, `To Do`, `In Progress`, `Done`).
  - **My Tasks**: Filtered list displaying only tasks assigned to the currently logged-in user.
  - **Blocked Tasks**: Dedicated view displaying all blocked tasks with detailed lists of unresolved dependencies.
  - **Users Directory**: Clean table displaying registered team members and IDs.

---

## Technology Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API (`AuthContext`, `TaskContext`)
- **Testing**: Jest, React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Store**: In-Memory JavaScript `Map` (`users`, `tasks`)
- **Security & Utilities**: CORS, `dotenv`

---

## Project Structure

```text
smart-task-manager/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── store.js         # In-memory Map store for users and tasks
│   │   ├── middleware/          # Custom Express middleware
│   │   ├── routes/
│   │   │   ├── users.js         # User registration, login, and listing routes
│   │   │   └── tasks.js         # Task CRUD, dependencies, and blocked task routes
│   │   └── server.js            # Express server initialization
│   ├── .env                     # Backend environment configuration (PORT=5000)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root layout wrapping Auth & Task providers
│   │   │   ├── page.tsx         # Root redirect to /dashboard or /login
│   │   │   ├── globals.css      # Tailwind styling
│   │   │   ├── login/           # User login page
│   │   │   ├── register/        # User registration page
│   │   │   ├── dashboard/       # Metric cards & recent tasks
│   │   │   ├── tasks/           # All tasks with search & filters
│   │   │   ├── my-tasks/        # Tasks assigned to logged-in user
│   │   │   ├── blocked-tasks/   # Blocked tasks view
│   │   │   └── users/           # Registered users directory
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Responsive navigation bar
│   │   │   ├── TaskCard.tsx     # Reusable task card with dependency alerts
│   │   │   ├── TaskForm.tsx     # Task creation & editing form
│   │   │   ├── EditTaskModal.tsx# Edit modal dialog
│   │   │   ├── StatusBadge.tsx  # Status and blocked indicator badge
│   │   │   ├── PriorityBadge.tsx# Low/Medium/High priority badge
│   │   │   ├── StatsCard.tsx    # Metric display card
│   │   │   ├── Loading.tsx      # Clean loading indicator
│   │   │   ├── ConfirmDialog.tsx# Delete confirmation dialog
│   │   │   └── ProtectedRoute.tsx # Route guard
│   │   ├── context/
│   │   │   ├── AuthContext.tsx  # Authentication and session state
│   │   │   └── TaskContext.tsx  # Task state and CRUD operations
│   │   ├── services/
│   │   │   └── api.ts           # Centralized API service with error handling
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript definitions
│   │   └── utils/
│   │       └── helpers.ts       # Dependency checks, user helpers, and date formatting
│   ├── __tests__/               # Jest test suites
│   ├── jest.config.js           # Jest configuration with next/jest
│   ├── jest.setup.js            # Testing library setup
│   ├── .env.local               # Frontend environment (NEXT_PUBLIC_API_URL)
│   └── package.json
│
└── README.md
```

---

## Backend Setup

1. Open terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure `.env` is configured (default: `PORT=5000`):
   ```env
   PORT=5000
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

---

## Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify `.env.local` contains the backend URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Start the frontend Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend application will be accessible at `http://localhost:3000`.

---

## API Endpoints

### Health Check
- `GET /api/health` - Verify server status

### Users
- `POST /api/users/register` - Register a new user (`name`, `email`, `password`)
- `POST /api/users/login` - Authenticate user (`email`, `password`)
- `GET /api/users` - Retrieve all registered users

### Tasks
- `POST /api/tasks` - Create a new task (`title`, `description`, `priority`, `status`, `assignedTo`, `dependencies`)
- `GET /api/tasks` - Retrieve all tasks
- `GET /api/tasks/my/:userId` - Retrieve tasks assigned to a specific user
- `GET /api/tasks/blocked` - Retrieve all tasks currently blocked by incomplete dependencies
- `GET /api/tasks/:id` - Retrieve single task by ID
- `PUT /api/tasks/:id` - Update task details, status, or dependencies
- `DELETE /api/tasks/:id` - Delete a task (blocked if other tasks depend on it)

---

## How to Run

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```
2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

### Recommended Test Flow
1. Register a new user (e.g. Mohit Charde, `mohit@example.com`).
2. Log in and arrive at the Dashboard.
3. Create **Task 1** ("Design System Architecture", Status: `To Do`).
4. Create **Task 2** ("Implement API Integration", Status: `To Do`, Dependency: Select `Task 1`).
5. Notice **Task 2** is marked as **BLOCKED** with reason *"Waiting for dependency completion."*
6. Attempt to mark **Task 2** as `Done` — verify the validation error prevents completion.
7. Mark **Task 1** as `Done` — observe that **Task 2** automatically unblocks.
8. Mark **Task 2** as `Done`.
9. Test editing tasks, assigning team members, and filtering tasks in **My Tasks** and **All Tasks**.

---

## Testing

The frontend includes comprehensive unit and integration tests using Jest and React Testing Library:

- **Login form** (`LoginForm.test.tsx`)
- **Registration validation** (`RegisterValidation.test.tsx`)
- **Task form rendering and validation** (`TaskForm.test.tsx`)
- **Task card display and blocked badge** (`TaskCard.test.tsx`)
- **Priority and Status badges** (`Badges.test.tsx`)
- **Task filtering logic** (`TaskFilter.test.ts`)
- **Dashboard statistics and dynamic calculations** (`DashboardStats.test.ts`)

Run the test suite:
```bash
cd frontend
npm test
```

---

## Deployment

### 1. Deploy Frontend on Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New" > "Project"**.
2. Import the `Mohitcharde/smart-task-manager` repository from GitHub.
3. In the **Configure Project** screen:
   - **Root Directory**: Click **Edit** and select `frontend` (crucial since the Next.js app lives in the `frontend` folder).
   - **Framework Preset**: Next.js (automatically detected).
   - **Environment Variables**:
     - Name: `NEXT_PUBLIC_API_URL`
     - Value: URL of your deployed backend (e.g. `https://your-backend.onrender.com`).
4. Click **Deploy**. Vercel will build and provide your live application URL (e.g., `https://smart-task-manager-xxx.vercel.app`).

### 2. Deploy Backend (e.g. Render / Railway / Koyeb)
1. Go to [Render](https://render.com) and select **New > Web Service**.
2. Connect your repository: `Mohitcharde/smart-task-manager`.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Environment Variable**: `PORT=5000`
4. Deploy the service and copy the public HTTPS URL to your Vercel `NEXT_PUBLIC_API_URL` variable.

---

## Future Improvements

- Persistent database integration (e.g., PostgreSQL / SQLite with Prisma ORM).
- User profile avatars and settings.
- Due dates and calendar timeline view.
- Activity audit logs tracking who completed or updated tasks.
- Email notifications when a blocking dependency is completed.

---

## Author

**Mohit Charde**
