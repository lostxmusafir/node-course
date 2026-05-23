import { Router } from 'express';
import { CityController } from '../controllers/CityController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { CityValidators } from '../validators/CityValidators';

class CityRouter {
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
      CityValidators.addCity(),
      CityController.addCity
    );
  }

  getRoutes() {
    this.router.get(
      '/',
      CityController.getCities
    );
  }
}

export default new CityRouter().router;
