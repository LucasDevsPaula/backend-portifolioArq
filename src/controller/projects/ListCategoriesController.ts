import { Request, Response } from "express";
import { ListCategoriesService } from "../../services/projects/ListCategoriesService.js";

export class ListCategoriesController {
  async handle(req: Request, res: Response) {
    const listCategoriesService = new ListCategoriesService();
    try {
      const categorias = await listCategoriesService.execute();
      return res.json(categorias);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar categorias" });
    }
  }
}
