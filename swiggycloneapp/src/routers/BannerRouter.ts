import { Router } from 'express';
import { BannerController } from '../controllers/BannerController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Utils } from '../utils/Utils';
import multer from 'multer';

class BannerRouter {
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
        'banner'
      ),
      BannerController.addBanner
    );
  }

  getRoutes() {
    this.router.get(
      '/',
      BannerController.getBanners
    );
  }
}

export default new BannerRouter().router;
