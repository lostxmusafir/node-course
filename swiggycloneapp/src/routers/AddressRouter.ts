import { Router } from 'express';
import { AddressController } from '../controllers/AddressController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

class AddressRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.postRoutes();
    this.getRoutes();
    this.patchRoutes();
    this.deleteRoutes();
  }

  postRoutes() {
    this.router.post(
      '/create',
      AuthMiddleware.verifyToken,
      AddressController.addAddress
    );
  }

  getRoutes() {
    this.router.get(
      '/',
      AuthMiddleware.verifyToken,
      AddressController.getUserAddresses
    );
  }

  patchRoutes() {
    this.router.patch(
      '/update/:id',
      AuthMiddleware.verifyToken,
      AddressController.updateAddress
    );
  }

  deleteRoutes() {
    this.router.delete(
      '/delete/:id',
      AuthMiddleware.verifyToken,
      AddressController.deleteAddress
    );
  }
}

export default new AddressRouter().router;
