import { prisma } from "../../prisma.js";

interface IDetailRequest {
  projetoId: string;
}

export class DetailProjectService {
  async execute({ projetoId }: IDetailRequest) {
    const projeto = await prisma.projeto.findUnique({
      where: {
        id: projetoId,
      },
      include: {
        ImagemProjeto: true,
        usuario: {
          select: {
            nome: true,
            email: true,
          },
        },
      },
    });

    if (!projeto) {
      throw new Error("Projeto não encontrado.");
    }

    return projeto;
  }
}
