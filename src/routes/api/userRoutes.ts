import express, { Router } from "express";

import userController from "../../controllers/user.controller";

const router: Router = express.Router();
console.log("flow is coming here");
router.post("/register", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getSpecificUser);
router.post("/login", userController.authUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);
router.put("/change-password/:id", userController.changePassword);
export default router;
