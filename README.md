
# Task Management System

A simple task management application built using Laravel 12 and React. The application allows users to manage their tasks, while admins can manage tasks created by all users.

## Technologies Used

- **Backend:** Laravel 12, PHP
- **Frontend:** React, TypeScript, Vite
- **Database:** MySQL
- **Authentication:** JWT
- **API requests:** Axios

## Features

- User registration and login
- JWT-based authentication
- Admin and User roles
- **Role-Based Dashboards:**
  - **User Dashboard:** Summary metrics for personal tasks (Total, Pending, In Progress, Completed)
  - **Admin Dashboard:** System-wide metrics, total registered users, and task breakdown per user
- Create, view, update and delete tasks
- Users can manage only their own tasks
- Admins can manage all tasks
- Task status management: Pending, In Progress and Completed
- Search tasks by title
- Filter tasks by status
- Server-side pagination
- Form validation and error handling

## Dashboard Overview

- **User View:** Quick summary cards displaying personal task counts grouped by status (Pending, In Progress, Completed, Total).
- **Admin View:** High-level metrics showing total platform tasks, total registered users, plus a user-wise task breakdown table.

## Project Setup

### 1. Clone the project

```bash
git clone YOUR_REPOSITORY_URL
cd task-management
```

If you already have the project on your computer, open the project folder in your terminal and continue with the next steps.

### 2. Set up the backend

Go to the Laravel project folder:

```bash
cd backend
```

Install the dependencies:

```bash
composer install
```

Create the `.env` file from the example file.


Generate the application key:

```bash
php artisan key:generate
```

Install JWT authentication if it is not already installed:

```bash
composer require tymon/jwt-auth
```

Publish the JWT configuration and generate the secret:

```bash
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

If JWT has already been configured, you do not need to repeat these steps.

### 3. Set up the database

Create a MySQL database named `task_management`.

Update the database details in `backend/.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=
```

Use your own MySQL username and password if they are different.

Run the migrations:

```bash
php artisan migrate
```

If the project includes an admin seeder, run the relevant seeder to create the initial admin account. For example:

```bash
php artisan db:seed --class=AdminUserSeeder
```

Check the seeder in the project to confirm the class name and any test login credentials.

### 4. Configure environment variables

Make sure the following values are set in `backend/.env`:

The application key and JWT secret should be generated using the commands above.

Do not upload your `.env` file or secret keys to GitHub.

### 5. Run the backend

From the `backend` directory, run:

```bash
php artisan config:clear
php artisan serve
```

The backend will usually run at:

`http://127.0.0.1:8000`

### 6. Set up the frontend

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```dotenv
VITE_API_URL=http://127.0.0.1:8000/api
```

Make sure this variable name matches the one used in the frontend API configuration.

Start the frontend:

```bash
npm run dev
```

Open the URL shown in the terminal. With the default Vite configuration, it is usually:

`http://localhost:5173`

Keep both the Laravel and React servers running while using the application.

## API Endpoints

The main API endpoints are:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Log in and receive JWT token |
| POST | `/api/logout` | Log out current user |
| GET | `/api/me` | Get authenticated user profile |
| GET | `/api/dashboard/summary` | Get task and user summary metrics (role-based) |
| GET | `/api/tasks` | Get paginated tasks (with search & filter) |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| GET | `/api/users` | Get user list (Admin only) |

Protected endpoints require a valid JWT access token in the `Authorization` header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Notes

- Admins have access to all tasks and full system dashboard statistics.
- Regular users can access their personalized dashboard and manage only their own tasks.
- The backend handles authentication, authorization and validation.
- Make sure MySQL is running before starting the application.
- If you encounter configuration issues, try running `php artisan config:clear` from the backend folder.

## Author

Developed as part of a task management application machine test.
