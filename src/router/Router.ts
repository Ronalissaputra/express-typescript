import express from "express"
import { viewUser, viewUserById } from "../controllers/userController"

const router = express.Router()

router.route("/users")
    .get(viewUser)
    .post(viewUser);
router.route("/user/:id")
    .get(viewUserById)
    .delete(viewUserById)
    .patch(viewUserById)

export default router;