import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(" ");

  try {
    //validar token
    const { sub } = jwt.verify(token, process.env.JWT_SECRET) as Payload;

    req.user_id = sub;

    return next();
  } catch (err) {
    return res.status(401).end();
  }
}
/*
import { NextFunction, Request, Response } from "express";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // --- HACK PARA DESATIVAR SEGURANÇA TEMPORARIAMENTE ---

  // Aqui estamos dizendo para o backend:
  // "Finja que quem está logado é o usuário dono daquele projeto de teste"

  // PRECISEI PEGAR ESSE ID DO SEU PRINT ANTERIOR (DO JSON DE CRIAÇÃO)
  // Se esse ID não existir mais, crie um projeto novo na rota /criar-dados-teste e pegue o usuarioId dele
  req.user_id = "0395f7ef-2df1-4776-a020-bd5b3db3cc25";

  return next(); // <--- O IMPORTANTE É CHAMAR O NEXT SEM ERRO
}
*/
