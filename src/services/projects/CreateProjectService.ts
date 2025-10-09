import { prisma } from "../../prisma.js";

interface ImageRequest {
  url: string;
  legenda?: string;
}

interface ProjectRequest {
  titulo: string;
  descricao: string;
  data: string;
  categoria: string;
  imagemCapa: string;
  usuarioId: string;
  imagens?: ImageRequest[];
}

class CreateProjectService {
  async execute({
    titulo,
    descricao,
    data,
    categoria,
    imagemCapa,
    usuarioId,
    imagens = [],
  }: ProjectRequest) {
    const projeto = await prisma.projeto.create({
      data: {
        titulo: titulo,
        descricao: descricao,
        data: new Date(data),
        categoria: categoria,
        imagemCapa: imagemCapa,
        usuarioId: usuarioId,
        ImagemProjeto: {
          create: imagens,
        },
      },
      include: {
        ImagemProjeto: true,
      },
    });

    return { projeto };
  }
}

export { CreateProjectService };
