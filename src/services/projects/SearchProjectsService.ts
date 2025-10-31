import { prisma } from "../../prisma.js"; 

interface ISearchRequest {
  query: string; 
}

export class SearchProjectsService {
  async execute({ query }: ISearchRequest) {
    const projetos = await prisma.projeto.findMany({
      where: {
        OR: [
          {
            titulo: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            descricao: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        titulo: true,
        imagemCapa: true,
      },
    });

    return projetos;
  }
}