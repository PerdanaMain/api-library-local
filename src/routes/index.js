import express from "express";

// controllers
import { Login, Logout } from "../controller/AuthController.js";
import { getBooks, getBook } from "../controller/BookController.js";
import { VerifyToken } from "../middleware/VerifyToken.js";
import { borrowBook, returnBook } from "../controller/BorrowController.js";
import { getMembers, getMember } from "../controller/MemberController.js";

const routes = express.Router();
const prefix = "/api/v1";

// index
routes.get(prefix + "/", (req, res) => {
  res.json({
    status: true,
    message: "Welcome to the API",
  });
});

// auth
routes.post(prefix + "/login", Login);
routes.delete(prefix + "/logout", VerifyToken, Logout);

// books
routes.get(prefix + "/books", VerifyToken, getBooks);
routes.get(prefix + "/books/:id", VerifyToken, getBook);
routes.post(prefix + "/books/borrow", VerifyToken, borrowBook);
routes.put(prefix + "/books/return/:borrowed_id", VerifyToken, returnBook);

// members
routes.get(prefix + "/members", VerifyToken, getMembers);
routes.get(prefix + "/member", VerifyToken, getMember);

// swagger docs

/**
 * @swagger
 * tags:
 *   name: Authentifications
 *   description: Authentifications API
 */

/**
 * @swagger
 * /login:
 *    post:
 *    summary: Login to the application
 *    tags: [Authentifications]
 *    requestBody:
 *        required: true
 *          content:
 *          application/json:
 *                      schema:
 *                      type: object
 *                      properties:
 *                        user_email:
 *                              type: string
 *          response:
 *              200:
 *        description: Login success
 */

export default routes;
