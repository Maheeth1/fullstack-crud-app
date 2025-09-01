# Full-Stack Customer & Address Management System 

---


A comprehensive CRUD application built with React, Node.js, Express, and SQLite. This project allows for the complete management of customer data and their associated multiple addresses through a modern, responsive, and user-friendly interface. It serves as a practical demonstration of full-stack development skills.

## Key Features 
- Full CRUD Functionality: Complete Create, Read, Update, and Delete operations for both Customers and their multiple Addresses.

- Component-Based Frontend: Built with React and structured with a clean container/presentational component architecture for maintainability and scalability.

- Advanced Backend API:

  - Robust search and multi-field filtering (by name, city, state).

  - Server-side pagination for efficient data handling.

  - Server-side validation to ensure data integrity for fields like phone numbers and pin codes.

- Modern UI/UX:

  - Professionally styled with Tailwind CSS for a responsive, mobile-first design.

  - Seamless client-side navigation handled by React Router.

  - Centralized loading spinners and a dedicated 404 "Not Found" page for a smooth user experience.

## Tech Stack 🛠️
- Frontend:

  - React.js

  - React Router

  - Tailwind CSS

  - Axios

- Backend:

  - Node.js

  - Express.js

  - CORS

- Database:

  - SQLite

---

## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You must have Node.js (version 14 or higher) installed on your system, which includes the npm package manager.

### Installation & Setup
Clone the repository:

```
git clone https://github.com/your-username/customer-management-app.git
cd customer-management-app

# Setup and run the Backend Server:
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the server (it will run on http://localhost:5000)
node index.js
```
The server will automatically create a database.db file and print a confirmation message to the console.

Setup and run the Frontend Client:

Open a new terminal window and navigate to the project's root directory.

```
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the React application
npm start
```
Your browser should automatically open to `http://localhost:3000` with the application running.

---

## API Endpoints 📋
The backend server provides the following RESTful API endpoints:

| Method | Endpoint                          | Description                                              |
|--------|-----------------------------------|----------------------------------------------------------|
| POST   | `/api/customers`                  | Creates a new customer with one or more addresses.       |
| GET    | `/api/customers`                  | Gets a paginated list of all customers. Supports search and filtering via query parameters. |
| GET    | `/api/customers/:id`              | Gets a single customer and all their associated addresses. |
| PUT    | `/api/customers/:id`              | Updates a customer's personal information.               |
| DELETE | `/api/customers/:id`              | Deletes a customer and all their addresses.              |
| POST   | `/api/customers/:id/addresses`    | Adds a new address to an existing customer.              |
| DELETE | `/api/addresses/:addressId`       | Deletes a specific address by its ID.                    |

---

## Project Structure
The project is organized into two main folders, client and server, to maintain a clear separation of concerns.

```
customer-management-app/
├── client/         # Contains the React.js frontend application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── ...
└── server/         # Contains the Node.js/Express backend API
    ├── database.db
    └── index.js
```
