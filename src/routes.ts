import { Router, Request, Response } from "express";
import passport from "passport";

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
    res.send("Login com Google realizado! Veja o console do servidor 🚀");
  }
);


export { router };
