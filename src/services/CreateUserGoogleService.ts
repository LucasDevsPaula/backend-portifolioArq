import { prisma } from "../prisma.js";

interface GoogleRequest {
  googleId: string;
  nome: string;
  email: string;
}

class CreateUserService {
  async execute({ googleId, nome, email }: GoogleRequest) {
    let user = await prisma.usuario.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.usuario.create({
        data: {
          nome,
          email,
          googleId,
        },
      });
    } else {
      throw new Error("Email já cadastrado");
    }

    return user;
  }
}

export { CreateUserService };
