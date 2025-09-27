import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes.js";
import cors from "cors";
import passport from "./config/passaport.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal error server.",
  });
});

app.listen(3333, () => {
  console.log("Servidor online, na porta 3333");
});
