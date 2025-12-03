import { prisma } from "../../prisma.js";

interface ImageRequest {
  url: string;
}

interface ProjectRequest {
  titulo?: string;
  descricao?: string;
  data?: string | Date | null;
  categoria?: string;
  capa?: string;
  imagens?: ImageRequest[];
  imagensRemoveIds?: string[];
  // --- ADICIONADO: Novos campos opcionais na interface ---
  cliente?: string;
  responsavel?: string;
  prazo?: string;
}

interface ProjectId {
  project_id: string;
}

class UpdateProjectService {
  async execute(
    // Recebendo os novos campos aqui também
    {
      titulo,
      descricao,
      data,
      categoria,
      capa,
      imagens,
      imagensRemoveIds,
      cliente,
      responsavel,
      prazo,
    }: ProjectRequest,
    { project_id }: ProjectId,
    user_id: string
  ) {
    // console.log(`Debug Update: Cliente: ${cliente}, Resp: ${responsavel}, Prazo: ${prazo}`);

    const project = await prisma.projeto.findUnique({
      where: {
        id: project_id,
      },
      include: {
        ImagemProjeto: true,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.usuarioId !== user_id) {
      throw new Error("Not authorized");
    }

    // --- Validação da DATA original (Mantive sua lógica) ---
    console.log("Valor recebido em date:", data, "Tipo:", typeof data);
    let projectDate: Date | null;

    if (
      data === undefined ||
      data === null ||
      (typeof data === "string" && data.trim() === "")
    ) {
      projectDate = project.data;
    } else if (typeof data === "string") {
      projectDate = new Date(data);
      if (isNaN(projectDate.getTime())) {
        throw new Error("Invalid date format");
      }
    } else if (data instanceof Date) {
      projectDate = data;
    } else {
      projectDate = project.data; // Fallback
    }

    // --- Lógica para o PRAZO (Novo) ---
    let prazoDate: Date | null = project.prazo;
    if (prazo && typeof prazo === "string" && prazo.trim() !== "") {
      prazoDate = new Date(prazo);
    }

    const updateProject = await prisma.projeto.update({
      where: { id: project_id },
      data: {
        titulo: titulo ?? project.titulo,
        descricao: descricao ?? project.descricao,
        data: projectDate, // Usa a data tratada acima
        categoria: categoria ?? project.categoria,
        imagemCapa: capa ?? project.imagemCapa,

        // --- ADICIONADO: Salvando novos campos ---
        cliente: cliente ?? project.cliente,
        responsavel: responsavel ?? project.responsavel,
        prazo: prazoDate,
        // ----------------------------------------

        ImagemProjeto: {
          ...(imagensRemoveIds?.length && {
            deleteMany: {
              id: { in: imagensRemoveIds },
            },
          }),
          ...(imagens?.length && {
            create: imagens.map((img) => ({
              url: img.url,
            })),
          }),
        },
      },
      include: { ImagemProjeto: true },
    });

    return { updateProject };
  }
}

export { UpdateProjectService };
