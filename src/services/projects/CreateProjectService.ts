import { prisma } from "../../prisma.js";

interface ImageRequest {
  url: string;
}

interface ProjectRequest {
  titulo: string;
  descricao: string;
  categoria: string;
  imagemCapa: string;
  usuarioId: string;
  imagens?: ImageRequest[];
  // --- NOVOS CAMPOS NA INTERFACE ---
  cliente?: string;
  prazo?: string; // Vem como string do frontend
}

class CreateProjectService {
  async execute({
    titulo,
    descricao,
    categoria,
    imagemCapa,
    usuarioId,
    imagens = [],
    // Recebendo novos campos
    cliente,
    prazo
  }: ProjectRequest) {
    
    const projeto = await prisma.projeto.create({
      data: {
        titulo: titulo,
        descricao: descricao,
        categoria: categoria,
        imagemCapa: imagemCapa,
        usuarioId: usuarioId,
        // --- SALVANDO NO BANCO ---
        cliente,
        prazo: prazo ? new Date(prazo) : null,

        ImagemProjeto: {
          create: imagens,
        },
      },
      include: {
        ImagemProjeto: true,
      }
    });

    return { projeto };
  }
}

export { CreateProjectService };