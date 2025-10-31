import { Request, Response } from "express";
import { DetailProjectService } from "../../services/projects/DetailProjectService.js";

export class DetailProjectController {
  async handle(req: Request, res: Response) {
    const { id: projetoId } = req.params;

    const detailProjectService = new DetailProjectService();

    try {
      const projeto = await detailProjectService.execute({ projetoId });

      return res.json(projeto);
    } catch (error) {
      if (error.message === "Projeto não encontrado.") {
        return res.status(404).json({ error: error.message });
      }

      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar detalhes do projeto" });
    }
  }
}
