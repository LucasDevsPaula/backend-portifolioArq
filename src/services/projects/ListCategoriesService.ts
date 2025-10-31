import { prisma } from "../../prisma.js"; 


export class ListCategoriesService {
  async execute() {
    const categorias = await prisma.projeto.findMany({
      distinct: ['categoria'],
      select: { categoria: true },
      where: { categoria: { not: null } },
    });

    const listaDeCategorias = categorias
      .map((item) => item.categoria)
      .filter(Boolean) as string[];

    return listaDeCategorias;
  }
}