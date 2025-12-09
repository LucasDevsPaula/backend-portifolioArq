import { Request, Response } from "express";
import { UpdateProjectService } from "../../services/projects/UpdateProjectService.js";

class UpdateProjectController {
  async handle(req: Request, res: Response) {
    const { titulo, descricao, data, categoria, cliente, prazo } =
      req.body;
    const { project_id } = req.params;
    const user_id = req.user_id as string;

    const files = req.files as {
      [fildname: string]: Express.Multer.File[];
    };

    const capa = files?.capa?.[0]?.filename ?? null;

    const imagens = files?.imagens?.map((file) => ({
      url: file.filename,
    }));

    let imagensRemoveIds: string[] = [];
    if (req.body.imagensRemoveIds) {
      try {
        imagensRemoveIds = JSON.parse(req.body.imagensRemoveIds);
      } catch {
        console.warn("Erro ao parsear imagensRemoveIds");
      }
    }

    const updateProjectService = new UpdateProjectService();

    const project = await updateProjectService.execute(
      {
        titulo,
        descricao,
        data,
        categoria,
        capa,
        imagens,
        imagensRemoveIds,
        // --- ADICIONADO: Passando os novos campos para o serviço ---
        cliente,
        prazo,
      },
      { project_id },
      user_id
    );
    return res.json(project);
  }
}

export { UpdateProjectController };
