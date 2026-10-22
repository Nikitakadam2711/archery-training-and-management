# Archery Training and Management System

A web-based application for managing an archery club or training academy. It provides pages to manage archers, coaches, and training sessions, along with a dashboard and informational pages about archery.

## Features

- **User registration and login pages**
- **Admin dashboard** with counts for archers, coaches, and training sessions
- **Archer management** — add and delete archers, including age, category, bow type, and coach
- **Coach management** — add and delete coaches, including experience and specialization
- **Training session management** — schedule and delete sessions with a title, date, and location
- **Contact form** — save messages submitted through the contact page
- **About page** — information about archery, bow types, scoring, and training
- Responsive styling with Bootstrap 5 and archery-themed background images

## Technologies Used

- **Node.js** — JavaScript runtime
- **Express.js** — web application framework
- **MongoDB** — database
- **Mongoose** — MongoDB object modelling
- **express-session** — session management
- **Bootstrap 5** — responsive UI styling
- **HTML, CSS, JavaScript**

## Project Structure

```text
Archery traning and management/
└── test-node/
    ├── app.js
    ├── package.json
    ├── package-lock.json
    └── public/
        ├── bg.jpg
        ├── Archery.jpg
        ├── compound.jpg
        ├── Recurve bow.jpg
        └── other archery images
```

## Prerequisites

Install the following before running the project:

1. [Node.js](https://nodejs.org/)
2. [MongoDB Community Server](https://www.mongodb.com/try/download/community)

Make sure MongoDB is running locally. The application connects to:

```text
mongodb://127.0.0.1:27017/archeryDB
```

## How to Run

1. Download or clone this repository.
2. Open a terminal in the `test-node` folder.
3. Install the required packages:

   ```bash
   npm install express express-session mongoose
   ```

4. Start the application:

   ```bash
   node app.js
   ```

5. When MongoDB connects successfully and the server starts, open:

   **http://localhost:8000**

> If the app reports a MongoDB connection error, make sure the MongoDB service is running before starting the application.

## Main Pages

| Page | Route | Purpose |
|---|---|---|
| Login | `/` | Opens the login page |
| Registration | `/register` | Registers a user |
| Dashboard | `/admin` | Displays totals for archers, coaches, and sessions |
| Archers | `/archers` | Adds and lists archers; supports deletion |
| Coaches | `/coaches` | Adds and lists coaches; supports deletion |
| Sessions | `/sessions` | Adds and lists training sessions; supports deletion |
| About | `/about` | Displays information about archery and the project |
| Contact | `/contact` | Submits a contact message |
| Logout | `/logout` | Ends the current session |

## Database Collections

Mongoose models are used for the following data:

- **Users** — username, email, password
- **Archers** — name, age, category, bow type, and coach
- **Coaches** — name, experience, and specialization
- **Sessions** — title, date, and location
- **Contacts** — name, email, phone, message, and creation date

## Team Members

- Swaranjali Shinde
- Nikita Kadam
- Mayuri Pawar
- Nisha Thopate

## Future Improvements

- Add stronger authentication and password hashing
- Add edit/update options for archers, coaches, and sessions
- Add attendance tracking and performance reports
- Improve form validation and error handling
- Use environment variables for configuration and session secrets

## Note

This is an academic project created to demonstrate basic web development, database operations, and management of archery club information. Before using it in a real organization, strengthen authentication and security—for example, the current login route should be updated to verify credentials securely.
