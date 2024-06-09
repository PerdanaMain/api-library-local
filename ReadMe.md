### Project Title: Library API with Express and MySQL

### Description: This project is a simple library API that allows users to perform CRUD operations on a library database.

### Table of Contents:

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Usage](#usage)

### Installation:

1. Clone the repository
2. Run `npm install` to install the dependencies

### Configuration:

1. Create a `.env` file in the root directory and copy the contents of the `.env.example` file into it.
2. Update the `.env` file with your MySQL database credentials.
3. Run `npx run migrate` to create the database tables.
4. Run `npm run seed` to seed the database with sample data.
5. Run `npm start` to start the server.

### Usage:

1. Your server should now be running on `http://localhost:3000`.
2. You can acces the API documentation at `http://localhost:3000/api-docs`.
3. Default users are:
   | email | password |
   | -------------- | -------- |
   | admin@admin | 12345 |
   | putri@gmail.com | 12345 |
   | ferry@gmail.com | 12345 |
   | angga@gmail.com | 12345 |
