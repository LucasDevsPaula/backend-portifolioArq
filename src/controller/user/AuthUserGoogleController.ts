import { Request, Response } from "express";
import jwt from "jsonwebtoken";

class AuthUserGoogleController {
  async handle(req: Request, res: Response) {
    const user: any = req.user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    console.log(`Logado com email: ${user.email}`);
    return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
}

export { AuthUserGoogleController };
