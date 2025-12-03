import { Request, Response } from "express";
import { CreateProjectService } from "../../services/projects/CreateProjectService.js";

class CreateProjectController {
  async handle(req: Request, res: Response) {
    // 1. Extraímos os novos campos do corpo da requisição
    const { titulo, descricao, data, categoria, cliente, responsavel, prazo } =
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

      // Se não tiver imagem de capa, usamos null ou string vazia (depende da sua regra)
      const imagemCapa = capa ? capa.filename : "";

      // Tratamento para evitar erro se não houver imagens extras
      const imagensData = imagens
        ? imagens.map((img) => ({
            url: img.filename,
          }))
        : [];

      console.log("Capa:", capa?.filename);
      // console.log("Imagens:", imagens?.map((img) => img.filename));

      const creteProjectService = new CreateProjectService();

      const project = await creteProjectService.execute({
        titulo,
        descricao,
        data,
        categoria,
        imagemCapa,
        usuarioId,
        imagens: imagensData,
        // 2. PASSAMOS OS NOVOS DADOS PARA O SERVICE
        cliente,
        responsavel,
        prazo,
      });

      return res.json(project);
    }
  }
}

export { CreateProjectController };
