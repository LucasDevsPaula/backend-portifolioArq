import { Request, Response } from "express";
import { CreateProjectService } from "../../services/projects/CreateProjectService.js";

class CreateProjectController {
  async handle(req: Request, res: Response) {
    const { titulo, descricao, categoria, cliente, prazo } =
      req.body;
    const usuarioId = req.user_id;

    if (!req.files) {
      throw new Error("error upload file");
    } else {
      const files = req.files as {
        [fildname: string]: Express.Multer.File[];
      };

      const capa = files["capa"]?.[0];
      const imagens = files["imagens"];

      const imagemCapa = capa ? capa.filename : "";

      const imagensData = imagens
        ? imagens.map((img) => ({
            url: img.filename,
          }))
        : [];

      console.log("Capa:", capa?.filename);

      const creteProjectService = new CreateProjectService();

      const project = await creteProjectService.execute({
        titulo,
        descricao,
        categoria,
        imagemCapa,
        usuarioId,
        imagens: imagensData,
        // 2. PASSAMOS OS NOVOS DADOS PARA O SERVICE
        cliente,
        prazo,
      });

      return res.json(project);
    }
  }
}

export { CreateProjectController };
