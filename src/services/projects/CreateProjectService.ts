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
  // --- NOVOS CAMPOS NA INTERFACE ---
  cliente?: string;
  responsavel?: string;
  prazo?: string; // Vem como string do frontend
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
    // Recebendo novos campos
    cliente,
    responsavel,
    prazo
  }: ProjectRequest) {
    
    const projeto = await prisma.projeto.create({
      data: {
        titulo: titulo,
        descricao: descricao,
        // Se 'data' for usada como data de criação, ok. 
        // Se não, pode remover se preferir usar created_at automático.
        data: data ? new Date(data) : null, 
        
        categoria: categoria,
        imagemCapa: imagemCapa,
        usuarioId: usuarioId,
        
        // --- SALVANDO NO BANCO ---
        cliente: cliente,
        responsavel: responsavel,
        // Converte string "2023-12-01" para Objeto Date válido do Postgres
        prazo: prazo ? new Date(prazo) : null,

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