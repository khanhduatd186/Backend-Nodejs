import express from "express";
import apiUserController from "../controller/apiUserController";
import userController from "../controller/userController"
import roleController from "../controller/roleController"
import groupController from "../controller/groupController"
import { checkUserJWT, checkUserPermisstion } from '../middleware/jwtAction'
const router = express.Router();

const initApiRouters = (app) => {



    router.all('*', checkUserJWT, checkUserPermisstion);
    router.post("/register", apiUserController.handleRegister)
    router.post("/login", apiUserController.handleLogin)
    router.post("/logout", apiUserController.handleLogout)
    router.get("/account", userController.getUserAccount)

    router.get("/user/read", userController.readFunc);
    router.post("/user/created", userController.createFunc);
    router.put("/user/update", userController.updateFunc);
    router.delete("/user/delete", userController.deleteFunc);

    router.get("/role/read", roleController.readFunc);
    router.post("/role/created", roleController.createFunc);
    router.get("/role/by-group/:groupId", roleController.getRoleByGroup);
    router.post("/role/assign-to-group", roleController.assignRoleToGroup);


    router.get("/group/read", groupController.readFunc);


    return app.use("/api/v1", router);
}
export default initApiRouters;