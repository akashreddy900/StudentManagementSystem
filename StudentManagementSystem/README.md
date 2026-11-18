# Student Management System

A Java Full Stack CRUD application for managing student records. Built with Java 17, Spring Boot, Spring Data JPA, MySQL, HTML, CSS and JavaScript.

## Features

- View all student records
- Add a student
- Edit student details
- Delete a student record
- Search students by name or email
- Filter students by course
- Sort students by name, course or newest record
- Export the currently visible student records to CSV (Excel-compatible)
- Dashboard counts for total students, courses and matching records
- Form validation for required fields and email
- Responsive dashboard interface
- REST API backed by MySQL

## Requirements

- JDK 17 or later
- Maven 3.6+ (or use the Maven wrapper if you generate one)
- MySQL Server 8+
- IntelliJ IDEA, Eclipse or VS Code

## Setup

1. Clone or download this repository.
2. Create a MySQL database (the application can create it if the user has permission):

   ```sql
   CREATE DATABASE student_management;
   ```

3. Configure the database credentials in `src/main/resources/application.properties`, or set environment variables:

   - `DB_URL` (default: `jdbc:mysql://localhost:3306/student_management?createDatabaseIfNotExist=true`)
   - `DB_USERNAME` (default: `root`)
   - `DB_PASSWORD` (default: `change_me`)

4. Run the application from the project root:

   ```bash
   mvn spring-boot:run
   ```

5. Open http://localhost:8080 in your browser.

Spring Boot serves the frontend from `src/main/resources/static` and exposes the API under `/api/students`.

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List all students |
| GET | `/api/students?search=akash` | Search by name or email |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

### Example POST body

```json
{
  "name": "Akash",
  "email": "akash@example.com",
  "course": "M.Tech CSE",
  "phone": "9876543210"
}
```

## Push to GitHub

Create an empty repository on GitHub, then run these commands in this folder:

```bash
git init
git add .
git commit -m "Initial commit - Student Management System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own GitHub repository URL. Never commit real passwords or secrets. Change the database password to an environment variable before publishing.

## Project structure

```text
StudentManagementSystem/
├── src/main/java/com/example/studentmanagement/
│   ├── controller/StudentController.java
│   ├── entity/Student.java
│   ├── repository/StudentRepository.java
│   └── StudentManagementApplication.java
├── src/main/resources/
│   ├── static/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   └── application.properties
├── .gitignore
├── pom.xml
└── README.md
```

## Notes

- Hibernate creates or updates the `students` table automatically using `spring.jpa.hibernate.ddl-auto=update`.
- This is an academic starter project. Add proper authentication/authorization and production-grade error handling before deploying it publicly.

## Demo login and dashboard tools

The upgraded browser UI includes a demo sign-in screen, logout, refresh, print, CSV export, student search, course filtering, sorting, and student CRUD actions.

**Demo credentials**
- Username: `akash`
- Password: `123456`

The demo login is implemented in browser JavaScript and is for local demonstration only. It is not secure authentication and does not protect `/api/students` from direct API access. Do not deploy it with real student data. For production, add server-side Spring Security authentication, password hashing, authorization, and CSRF protection.

The application is configured to use port `8081`. Open `http://localhost:8081` after starting Spring Boot.

## Push this project to GitHub

1. Create a new **empty** repository on GitHub (do not add a README or `.gitignore` there).
2. Open this project folder in VS Code: `StudentManagementSystem`.
3. Open **Terminal → New Terminal** and run these commands one at a time:

```bash
git init
git add .
git commit -m "Add student management dashboard and demo login"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the final URL with the HTTPS URL of your own GitHub repository. If Git asks you to sign in, complete the browser sign-in prompt. If `git remote add origin` says the remote already exists, use `git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git` instead.

Before pushing, check `src/main/resources/application.properties` and make sure you do not commit a real database password. Prefer environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) for secrets.
