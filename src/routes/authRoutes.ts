// src/routes/authRoutes.ts

import 'dotenv/config';

import { Router, Request, Response } from 'express';
import passport from 'passport'; // Importa a biblioteca "crua"
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { AuthUserGoogleController } from '../controller/user/AuthUserGoogleController.js';
import { CreateUserService } from '../services/user/CreateUserGoogleService.js';

const authRouter = Router();

// --- CONFIGURAÇÃO DO PASSPORT (acontece aqui dentro) ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3333/auth/google/callback",
    },
    async (
      acessToken: string,
      refreshToken: string,
      profile: Profile,
      done
    ) => {
      const { id, displayName, emails } = profile;
      const createUserGoogleService = new CreateUserService();
      try {
        const user = await createUserGoogleService.execute({
          googleId: id,
          nome: displayName,
          email: emails?.[0]?.value!,
        });
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// --- ROTAS DE AUTENTICAÇÃO (usam o passport configurado logo acima) ---
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req: Request, res: Response) => {
    return new AuthUserGoogleController().handle(req, res);
  }
);

export { authRouter };