import express from "express"
import { Authorization } from "../middleware/authorization"
import { adminOnly } from "../middleware/adminOnly"
import { viewAdmin } from "../controllers/adminController"
import { viewUser, viewUserById } from "../controllers/userController"
import { viewAuthadmin, viewAuthuser, viewTokenadmin, viewTokenuser } from "../controllers/authController";

const router = express.Router()

// auth
router.route("/api/loginuser").post(viewAuthuser)
router.route("/api/logoutuser").delete(viewAuthuser)
router.route("/api/loginadmin").post(viewAuthadmin)
router.route("/api/logoutadmin").delete(viewAuthadmin)
router.route("/api/tokenadmin").get(viewTokenadmin)
router.route("/api/tokenuser").get(viewTokenuser)

// adminview
router.route("/api/admins")
    .get(Authorization, viewAdmin)
    .post(Authorization, viewAdmin);

// usersview
router.route("/api/users")
    .get( Authorization, adminOnly, viewUser)
    .post(Authorization, adminOnly, viewUser);
router.route("/api/user/:id")
    .get(Authorization, adminOnly, viewUserById)
    .delete(Authorization, adminOnly, viewUserById)
    .patch(Authorization, adminOnly, viewUserById)


export default router;