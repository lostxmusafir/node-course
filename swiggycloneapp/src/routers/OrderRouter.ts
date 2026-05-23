import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

class OrderRouter {
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
      OrderController.placeOrder
    );
  }

  getRoutes() {
    this.router.get(
      '/',
      AuthMiddleware.verifyToken,
      OrderController.getUserOrders
    );
  }
}

export default new OrderRouter().router;
