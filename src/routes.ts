import { Router, Request, Response } from "express";
import passport from "passport";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import { AuthUserGoogleController } from "./controller/user/AuthUserGoogleController.js";
import { CreateUserController } from "./controller/user/CreateUserController.js";
import { AuthUserController } from "./controller/user/AuthUserController.js";
import { DetailUserController } from "./controller/user/DetailUserController.js";

const router = Router();

router.get("/teste", (req: Request, res: Response) => {
  return res.json({ ok: true });
});

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

export { router };
