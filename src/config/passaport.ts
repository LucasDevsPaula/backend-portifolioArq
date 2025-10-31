import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { CreateUserService } from "../services/user/CreateUserGoogleService.js";
import dotenv from "dotenv";

dotenv.config();

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
      console.log("ID: ", profile.id);
      console.log("NOME: ", profile.displayName);
      console.log("EMAIL: ", profile.emails?.[0]?.value);

      const { id, displayName, emails } = profile;
      const createUserGoogleService = new CreateUserService();

      const user = await createUserGoogleService.execute({
        googleId: id,
        nome: displayName,
        email: emails?.[0]?.value!,
      });

      console.log(`Login autenticado com usuário: ${user.email}`);
      return done(null, user);
    }
  )
);

export default passport;
