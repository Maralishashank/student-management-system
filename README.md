# Student Management System

A full-stack web application for managing students, courses, marks, and attendance — built with **Spring Boot** (backend) and **React** (frontend).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Screenshots](#screenshots)
- [Known Issues & Roadmap](#known-issues--roadmap)

---

## Overview

The Student Management System (SMS) provides two user roles — **Admin** and **Student** — each with their own dashboard and set of capabilities. Admins manage the full institution data, while students get a personalised view of their academic profile.

Authentication is handled via JWT tokens. All protected routes are secured on both the Spring Security layer and via `@PreAuthorize` annotations on individual endpoints.

---

## Tech Stack

**Backend**
- Java 17 + Spring Boot 3
- Spring Security + JWT (jjwt)
- Spring Data JPA + Hibernate
- MySQL (or any JPA-compatible RDBMS)
- Maven

**Frontend**
- React 18
- React Router v6
- Axios
- Bootstrap 5
- Chart.js + react-chartjs-2
- jwt-decode

---

## Features

### Admin
- Add, update, delete, and search students
- Create and delete courses with department assignment
- Assign marks per student per subject
- Mark daily attendance by department (present / absent)
- View attendance reports — daily summary and department-wise breakdown
- Post announcements
- Dashboard with live stats and a students-per-department bar chart

### Student
- View personal profile
- Browse available courses and enroll
- View enrolled courses
- Check own marks per subject
- Check own attendance percentage
- View announcements

---

## Project Structure

```
sms/
├── backend/                        # Spring Boot application
│   └── src/main/java/com/shashank/sms/
│       ├── config/                 # SecurityConfig, CorsConfig
│       ├── controller/             # REST controllers
│       ├── dto/                    # Request/response DTOs
│       ├── entity/                 # JPA entities
│       ├── exception/              # GlobalExceptionHandler
│       ├── repository/             # Spring Data JPA repositories
│       ├── security/               # JwtFilter, JwtUtil
│       └── service/                # Business logic
│
└── frontend/                       # React application
    └── src/
        ├── components/             # Navbar, Sidebar, StudentSidebar, DashboardCharts
        ├── pages/                  # One file per route/view
        └── services/
            └── api.js              # Axios instance with JWT interceptor
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+ and npm
- MySQL 8+ (or update `application.properties` for another DB)
- Maven 3.8+

### Backend Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   git clone https://github.com/your-username/student-management-system.git
   cd sms/backend
   ```

2. Create a MySQL database:
   ```sql
   CREATE DATABASE sms_db;
   ```

3. Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/sms_db
   spring.datasource.username=your_db_user
   spring.datasource.password=your_db_password
   spring.jpa.hibernate.ddl-auto=update
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   The API will be available at `http://localhost:8080`.

5. Register an admin user via the API (or seed directly in the DB):
   ```bash
   curl -X POST http://localhost:8080/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123","role":"ADMIN"}'
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd sms/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

---

## Environment Variables

The frontend API base URL is configured in `src/services/api.js`. To point to a different backend host, update:

```js
const API = axios.create({
  baseURL: "http://localhost:8080",  // ← change this
});
```

For production, use an environment variable:

```js
baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080"
```

And create a `.env` file in the frontend root:
```
REACT_APP_API_URL=https://your-production-api.com
```

---

## API Reference

All protected endpoints require the header:
```
Authorization: Bearer <jwt_token>
```

### Auth — `/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and receive a JWT token |
| POST | `/auth/change-password` | Authenticated | Change own password |

### Students — `/students`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/students` | Admin | All students (paginated) |
| POST | `/students` | Admin | Add a student (auto-creates login) |
| GET | `/students/{id}` | Admin | Get student by ID |
| PUT | `/students/{id}` | Admin | Update student |
| DELETE | `/students/{id}` | Admin | Delete student |
| GET | `/students/department/{dept}` | Admin | Filter by department |
| GET | `/students/department-count` | Admin | Count per department |
| GET | `/students/me` | Student | Own profile |

### Courses — `/courses`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/courses` | Authenticated | All courses |
| POST | `/courses` | Admin | Create course |
| DELETE | `/courses/{id}` | Admin | Delete course |

### Enrollment — `/enroll`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/enroll/{courseId}` | Student | Enroll in a course |
| GET | `/enroll/my` | Student | My enrollments |

### Marks — `/marks`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/marks` | Admin | All marks |
| POST | `/marks` | Admin | Add marks for a student |
| GET | `/marks/my` | Student | Own marks |

### Attendance — `/attendance`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/attendance/mark` | Admin | Mark attendance |
| GET | `/attendance/all` | Admin | All attendance records |
| GET | `/attendance/report` | Admin | Daily report (optional `?date=YYYY-MM-DD`) |
| GET | `/attendance/department-report` | Admin | Present count by department |
| GET | `/attendance/my` | Student | Own attendance summary |

### Subjects — `/subjects`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/subjects` | Authenticated | All subjects |
| POST | `/subjects` | Admin | Add subject |
| GET | `/subjects/department/{dept}` | Admin, Student | Subjects by department |

### Announcements — `/announcements`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/announcements` | Authenticated | All announcements |
| POST | `/announcements` | Admin | Create announcement |

### Dashboard — `/dashboard`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/stats` | Authenticated | Total students, courses, and marks count |

---

## Authentication

The application uses **stateless JWT authentication**.

1. On login, the server returns a signed JWT containing the `username` and `role` claims.
2. The frontend stores the token in `localStorage` and attaches it to every request via an Axios interceptor.
3. The `JwtFilter` validates the token on each request and populates the Spring Security context.
4. Role-based access is enforced via `SecurityConfig` (path-level) and `@PreAuthorize` (method-level).

**First-login flow:** Student accounts are created with `firstLogin = true` and a default password (`student123`). On first login, the backend returns a signal to prompt the student to change their password before proceeding.

---

## Known Issues & Roadmap

**Current known issues**
- `GET /attendance/my` is inaccessible to students due to a `SecurityConfig` ordering issue — the broad `/attendance/**` ADMIN rule takes precedence over the student-specific route.
- The first-login password change flow is not fully wired between the backend exception and the frontend handler.
- No frontend route guards — unauthenticated users can navigate directly to protected pages (the API calls will fail, but the UI shell still renders).
- `MyCourses` shows raw course IDs instead of course names.
- `StudentDashboard` is a placeholder with no live data.

**Roadmap**
- [ ] Fix `SecurityConfig` rule ordering for `/attendance/my`
- [ ] Add frontend route guards based on JWT role
- [ ] Wire the first-login change-password flow end-to-end
- [ ] Enrich `MyCourses` with course name and instructor details
- [ ] Add `@Transactional` to `StudentService.addStudent`
- [ ] Replace hardcoded department list (CSE / IT / ECE) with a dynamic API
- [ ] Add edit functionality for marks and students
- [ ] Pagination controls in the Students table UI
- [ ] Unit and integration tests (JUnit 5 + Mockito)

---

## License

This project is licensed under the MIT License.
