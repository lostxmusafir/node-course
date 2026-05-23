import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Utils } from '../utils/Utils';
import multer from 'multer';

class ItemRouter {
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
      ItemController.addItem
    );
  }

  getRoutes() {
    this.router.get(
      '/restaurant/:restaurant_id',
      ItemController.getMenuItemsByRestaurant
    );
    this.router.get(
      '/',
      ItemController.getItems
    );
  }
}

export default new ItemRouter().router;
