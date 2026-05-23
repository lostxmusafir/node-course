import { Router } from 'express';
import { RestaurantController } from '../controllers/RestaurantController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { Utils } from '../utils/Utils';
import multer from 'multer';

class RestaurantRouter {
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
      RestaurantController.addRestaurant
    );
  }

  getRoutes() {
    this.router.get(
      '/nearby',
      RestaurantController.getNearbyRestaurants
    );
    this.router.get(
      '/search',
      RestaurantController.searchRestaurants
    );
    this.router.get(
      '/',
      RestaurantController.getRestaurants
    );
  }
}

export default new RestaurantRouter().router;
