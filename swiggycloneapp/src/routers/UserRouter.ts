import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserValidators } from '../validators/UserValidators';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.postRoutes();
    this.getRoutes();
    this.patchRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }

  postRoutes() {
    this.router.post('/signup', UserValidators.signup(), UserController.signup);
    this.router.post(
      '/login',
      UserValidators.login(),
      UserController.login
    );
    this.router.post(
      '/verify/email',
      UserValidators.verifyUserEmail(),
      UserController.verifyUserEmail
    );
    this.router.post(
      '/reset/password',
      UserValidators.resetPassword(),
      UserController.resetPassword
    );
  }

  getRoutes() {
    this.router.get('/login', UserController.login);
    this.router.get(
      '/send/verification/email',
      UserValidators.sendVerificationEmail(),
      UserController.sendVerificationEmail
    );
    this.router.get(
      '/send/reset/password/email',
      UserValidators.sendResetPasswordEmail(),
      UserController.sendResetPasswordEmail
    );
    this.router.get(
      '/verify/resetPasswordToken',
      UserValidators.verifyResetPasswordToken(),
      UserController.verifyResetPasswordToken
    );

    // Protected Routes
    this.router.get('/profile', AuthMiddleware.verifyToken, UserController.profile);
    this.router.get('/', AuthMiddleware.verifyToken, UserController.getUsers);
    this.router.get('/:id', AuthMiddleware.verifyToken, UserController.getUserById);
  }

  patchRoutes() {
    this.router.patch(
      '/profile',
      AuthMiddleware.verifyToken,
      UserValidators.updateProfile(),
      UserController.updateProfile
    );
    this.router.patch(
      '/reset/password',
      UserValidators.resetPasswordWithOtp(),
      UserController.resetPasswordWithOtp
    );
    this.router.patch('/:id', AuthMiddleware.verifyToken, UserController.updateUser);
  }

  putRoutes() {
    this.router.put(
      '/profile',
      AuthMiddleware.verifyToken,
      UserValidators.updateProfile(),
      UserController.updateProfile
    );
  }

  deleteRoutes() {
    this.router.delete('/:id', AuthMiddleware.verifyToken, UserController.deleteUser);
  }
}

export default new UserRouter().router;
