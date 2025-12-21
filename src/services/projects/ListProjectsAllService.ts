import { prisma } from "../../prisma.js";

class ListProjectsAllService {
  async execute() {
    const projetos = await prisma.projeto.findMany({
      include: {
        ImagemProjeto: true,
        usuario: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { projetos };
  }
}

export { ListProjectsAllService };
