import express from "express"
import { viewUser, viewUserById } from "../controllers/userController"
import { viewAuth } from "../controllers/authController";

const router = express.Router()

// auth
router.route("/login").post(viewAuth)
router.route("/logout").delete(viewAuth)

// users
router.route("/users")
    .get(viewUser)
    .post(viewUser);
router.route("/user/:id")
    .get(viewUserById)
    .delete(viewUserById)
    .patch(viewUserById)


export default router;