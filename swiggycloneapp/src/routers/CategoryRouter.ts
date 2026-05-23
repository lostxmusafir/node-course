import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Utils } from '../utils/Utils';
import multer from 'multer';

class CategoryRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.postRoutes();
    this.getRoutes();
  }

  postRoutes() {
    this.router.post(
      '/create',
      AuthMiddleware.verifyToken,
      AuthMiddleware.adminRole,
      multer({ storage: Utils.storage, fileFilter: Utils.fileFilter }).single(
        'image'
      ),
      CategoryController.addCategory
    );
  }

  getRoutes() {
    this.router.get(
      '/',
      CategoryController.getCategories
    );
  }
}

export default new CategoryRouter().router;
