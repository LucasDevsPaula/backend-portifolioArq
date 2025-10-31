import { Request, Response } from "express";
import { DeleteProjectService } from "../../services/projects/DeleteProjectService.js";

export class DeleteProjectController {
  async handle(req: Request, res: Response) {
    const { id: projetoId } = req.params;
    const { user_id } = req;

    const deleteProjectService = new DeleteProjectService();

    try {
      await deleteProjectService.execute({
        projetoId,
        usuarioId: user_id,
      });

      return res.status(204).send();
    } catch (error) {
      if (error.message === "Projeto não encontrado.") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Não autorizado.") {
        return res.status(403).json({ error: error.message });
      }

      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }
}
