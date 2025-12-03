import { Router, Request, Response } from "express";
import multer from "multer";
import passport from "./config/passaport.js";
import uploadconfig from "./config/multer.js";
import { isAuthenticated } from "./middlewares/isAuthenticated.js";
import { AuthUserGoogleController } from "./controller/user/AuthUserGoogleController.js";
import { CreateUserController } from "./controller/user/CreateUserController.js";
import { AuthUserController } from "./controller/user/AuthUserController.js";
import { DetailUserController } from "./controller/user/DetailUserController.js";
import { CreateProjectController } from "./controller/projects/CreateProjectController.js"
import { ListProjectController } from "./controller/projects/ListProjectController.js";
import { UpdateProjectController } from "./controller/projects/UpdateProjectController.js";
import { DetailProjectController } from "./controller/projects/DetailProjectController.js";
import { ListCategoriesController } from "./controller/projects/ListCategoriesController.js";
import { SearchProjectsController } from './controller/projects/SearchProjectsController.js';
import { DeleteProjectController } from './controller/projects/DeleteProjectController.js'; 

const router = Router();

const upload = multer(uploadconfig.upload("./tmp"));

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback do Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req: Request, res: Response) => {
    return new AuthUserGoogleController().handle(req, res);
  }
);

router.post("/users", new CreateUserController().handle);//funciona
router.post("/session", new AuthUserController().handle);//funciona
router.get("/me", isAuthenticated, new DetailUserController().handle);//funciona

router.post(
  "/project",
  isAuthenticated,
  upload.fields([{ name: "capa", maxCount: 1 }, { name: "imagens" }]),
  new CreateProjectController().handle
);//funciona

router.get("/project", isAuthenticated, new ListProjectController().handle);//funciona
router.get("/project/:id", new DetailProjectController().handle);//funciona
router.get("/category", new ListCategoriesController().handle);//não sei como funciona
router.get('/project/search', new SearchProjectsController().handle);//não sei como funciona

router.put(
  "/project/:project_id",
  isAuthenticated,
  upload.fields([{ name: "capa", maxCount: 1 }, { name: "imagens" }]),
  new UpdateProjectController().handle
);//funciona

router.delete(
  '/project/:id',
  isAuthenticated,
  new DeleteProjectController().handle
);//funciona


export { router };

