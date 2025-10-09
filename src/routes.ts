import { Router, Request, Response } from "express";
import multer from "multer";
import passport from "./config/passaport.js";
import uploadconfig from "./config/multer.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import { AuthUserGoogleController } from "./controller/user/AuthUserGoogleController.js";
import { CreateUserController } from "./controller/user/CreateUserController.js";
import { AuthUserController } from "./controller/user/AuthUserController.js";
import { DetailUserController } from "./controller/user/DetailUserController.js";
import { CreateProjectController } from "./controller/projects/CreateProjectController.js";

const router = Router();

const upload = multer(uploadconfig.upload("./tmp"));

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback do Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req: Request, res: Response) => {
    return new AuthUserGoogleController().handle(req, res);
  }
);

router.post("/users", new CreateUserController().handle);

router.post("/session", new AuthUserController().handle);

router.get("/me", isAuthenticated, new DetailUserController().handle);

router.post(
  "/project",
  isAuthenticated,
  upload.fields([{ name: "capa", maxCount: 1 }, { name: "imagens" }]),
  new CreateProjectController().handle
);

export { router };
