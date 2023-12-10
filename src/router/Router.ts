import express from "express"
import { Authorization } from "../middleware/authorization"
import { adminOnly } from "../middleware/adminOnly"
import { viewUser, viewUserById } from "../controllers/userController"
import { viewAuth, viewToken } from "../controllers/authController";

const router = express.Router()

// auth
router.route("/api/login").post(viewAuth)
router.route("/api/logout").delete(viewAuth)
router.route("/api/refresh").get(viewToken)

// users
router.route("/api/users")
    .get(Authorization, adminOnly, viewUser)
    .post(viewUser);
router.route("/api/user/:id")
    .get(Authorization, viewUserById)
    .delete(Authorization, viewUserById)
    .patch(Authorization, viewUserById)


export default router;