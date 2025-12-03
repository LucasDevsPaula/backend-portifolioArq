// src/server.ts

import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes.js";
import cors from "cors";
import passport from "./config/passaport.js";
import path from "path";
import { dirname, extname, resolve } from "path";
import { fileURLToPath } from "url";

import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(router);
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

// Inicializa o passport globalmente
app.use(passport.initialize());

// Middleware de erro

app.get("/criar-dados-teste", async (req, res) => {
  try {
    // Cria um usuário novo a cada vez para não dar erro de email repetido
    const timestamp = Date.now();

    const user = await prisma.usuario.create({
      data: {
        nome: `Admin Teste ${timestamp}`,
        email: `admin${timestamp}@teste.com`,
        googleId: `google${timestamp}`,
      },
    });

    const projeto = await prisma.projeto.create({
      data: {
        titulo: "Projeto Teste Automático",
        descricao:
          "Este projeto foi criado via rota temporária para testar o Front-end.",
        categoria: "Residencial", // Isso vai virar o Status no front
        imagemCapa: "https://via.placeholder.com/400x300", // Imagem cinza genérica
        usuarioId: user.id,
      },
    });

    return res.json({
      mensagem: "Sucesso! Dados criados no banco.",
      projeto_criado: projeto,
    });
  } catch (error: any) {
    return res.status(500).json({
      erro: "Falha ao criar dados",
      detalhes: error.message,
    });
  }
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res
    .status(500)
    .json({ status: "error", message: "Internal server error." });
});

app.listen(3333, () => {
  console.log("Servidor online, na porta 3333");
});
