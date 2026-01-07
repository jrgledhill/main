import { Router } from "express";

import * as userController from "../controllers/userController";

const router = Router();

router.post("/sync", userController.syncUser);

export default router;
