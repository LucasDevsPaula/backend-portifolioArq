interface ImageRequest{
    url: string;
    legenda?: string;
}

interface ProjectRequest{
    titulo: string;
    descricao: string;
    data: string;
    categoria: string;
    imagemCapa: string;
    imagens?: ImageRequest[];
}

class CreateProjectService {
  async execute({titulo, descricao, data, categoria, imagemCapa, imagens = []}: ProjectRequest) {
    

    return { ok: true };
  }
}

export { CreateProjectService };
