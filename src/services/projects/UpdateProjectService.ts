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
}

interface ProjectId {
  project_id: string;
}

class UpdateProjectService {
  async execute(
    {titulo, descricao, data, categoria, capa, imagens, imagensRemoveIds }: ProjectRequest,
    { project_id }: ProjectId,
    user_id: string
  ) {
    console.log(`Titulo: ${titulo}, Descrição: ${descricao}, Data: ${data}, Categoria: ${categoria}\n Capa: ${capa}, Imagens: {${imagens}}, ImagensRemoveIds: {${imagensRemoveIds}}`);
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

    //validar e converter a data
    console.log("Valor recebido em date:", data, "Tipo:", typeof data);
    let projectDate: Date;
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
      throw new Error("Invalid date");
    }

    const updateProject = await prisma.projeto.update({
      where: { id: project_id },
      data: {
        titulo: titulo ?? project.titulo,
        descricao: descricao ?? project.descricao,
        data: projectDate ?? project.data,
        categoria: categoria ?? project.categoria,
        imagemCapa: capa ?? project.imagemCapa,
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
