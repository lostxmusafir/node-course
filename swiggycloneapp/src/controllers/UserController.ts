import { Request, Response, NextFunction } from 'express';
import { HydratedDocument } from 'mongoose';
import { User, UserModel } from '../models/User';
import { validationResult } from 'express-validator';
import { Utils } from '../utils/Utils';
import { NodeMailer } from '../utils/NodeMailer';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariables } from '../environments/environments';

export class UserController {
  private static sanitizeUser(user: HydratedDocument<User>) {
    const userObj = user.toObject() as any;

    delete userObj.password;
    delete userObj.verification_token;
    delete userObj.verification_token_time;
    delete userObj.reset_password_token;
    delete userObj.reset_password_token_time;

    return userObj;
  }

  private static generateAuthToken(user: any): string {
    const env = getEnvironmentVariables();

    return jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        type: user.type,
      },
      env.jwt_secret,
      {
        expiresIn: '7d',
      }
    );
  }

  static async login(req: Request, res: Response) {
    const password = req.body.password || req.query.password;
    const email = req.body.email || req.query.email;

    try {
      if (!email || !password) {
        return res.status(422).json({
          message: 'Email and password are required',
        });
      }

      const user = await UserModel.findOne({ email }).select('+password');

      if (!user) {
        return res.status(404).json({
          message: 'Invalid Email',
        });
      }

      const isMatch = await bcrypt.compare(
        password as string,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid Password',
        });
      }

      const token = UserController.generateAuthToken(user);

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: UserController.sanitizeUser(user),
      });
    } catch (error: unknown) {
      return res.status(500).json({
        message: 'Unable to login',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async profile(req: Request, res: Response) {
    try {
      const user = await UserModel.findById((req as any).user.user_id);

      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      return res.status(200).send(UserController.sanitizeUser(user));
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to get profile',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async signup(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        message: errors.array()[0].msg,
        status_code: 422,
      });
    }

    try {
      const { email, phone, name, type, status } = req.body;
      
      // Handle potential duplicate keys (arrays) by taking the first value
      const password = Array.isArray(req.body.password) ? req.body.password[0] : req.body.password;

      const userExists = await UserModel.findOne({ email });

      if (userExists) {
        return res.status(409).send({
          statusCode: 409,
          message: 'User with same email already exists',
        });
      }

      const verification_token = Utils.generateVerificationToken();

      const user = new UserModel({
        email,
        phone,
        password,
        name,
        type,
        status,
        verification_token,
        verification_token_time: Utils.getVerificationTokenExpiryDate(),
        email_verified: false,
      });

      await NodeMailer.sendMail({
        to: [user.email],
        subject: 'Verify your email address',
        html: `
          <h2>Hello ${user.name}</h2>
          <p>Your verification OTP is: ${verification_token}</p>
          <h1>${verification_token}</h1>
        `,
      });

      const result = await user.save() as any;
      const token = UserController.generateAuthToken(result);

      return res.status(200).json({
        token,
        user: UserController.sanitizeUser(result),
      });
    } catch (error: unknown) {
      return res.status(500).send({
        statusCode: 500,
        message: 'Unable to create user',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async verifyUserEmail(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array()[0].msg,
      });
    }

    try {
      const { email, verification_token } = req.body;

      const user = await UserModel.findOne({
        email,
        verification_token,
        verification_token_time: { $gt: new Date() },
      });

      if (!user) {
        return res.status(404).json({
          message: 'Invalid or expired verification token',
        });
      }

      user.email_verified = true;
      user.verification_token = undefined as any;
      user.verification_token_time = undefined as any;

      await user.save();

      return res.status(200).json({
        message: 'Email verified successfully',
      });
    } catch (error: unknown) {
      return res.status(500).json({
        message: 'Unable to verify email',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async sendVerificationEmail(req: Request, res: Response) {
    try {
      const email = (req as any).user?.email || req.query.email;

      if (!email) {
        return res.status(422).json({
          success: false,
          message: 'Email is required',
        });
      }

      const user = await UserModel.findOne({ email }) as HydratedDocument<User> | null;

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      if (user.email_verified) {
        return res.status(200).send({
          success: true,
        });
      }

      const verification_token = Utils.generateVerificationToken();

      user.verification_token = verification_token;
      user.verification_token_time = Utils.getVerificationTokenExpiryDate();

      await user.save();

      await NodeMailer.sendMail({
        to: [user.email],
        subject: 'Verify your email address',
        html: `
          <h2>Hello ${user.name}</h2>
          <p>Your verification OTP is: ${verification_token}</p>
          <h1>${verification_token}</h1>
        `,
      });

      return res.status(200).send({
        success: true,
      });
    } catch (error: unknown) {
      return res.status(500).send({
        success: false,
        message: 'Unable to send verification email',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async sendResetPasswordEmail(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    try {
      const email = req.query.email as string;

      const user = await UserModel.findOne({ email }) as HydratedDocument<User> | null;

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      const reset_password_token = Utils.generateResetPasswordToken();

      user.reset_password_token = reset_password_token;
      user.reset_password_token_time = Utils.getResetPasswordTokenExpiryDate();

      await user.save();

      await NodeMailer.sendMail({
        to: [user.email],
        subject: 'Reset your password',
        html: `
          <h2>Hello ${user.name}</h2>
          <p>Your reset password OTP is: ${reset_password_token}</p>
          <h1>${reset_password_token}</h1>
        `,
      });

      return res.status(200).send({
        success: true,
      });
    } catch (error: unknown) {
      return res.status(500).send({
        success: false,
        message: 'Unable to send reset password email',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    try {
      const email = req.body.email;
      const reset_password_token = req.body.reset_password_token;
      const password = req.body.password;

      const user = await UserModel.findOne({ email }) as HydratedDocument<User> | null;

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      if (
        !user.reset_password_token ||
        user.reset_password_token !== reset_password_token
      ) {
        return res.status(400).send({
          success: false,
          message: 'Invalid reset password token',
        });
      }

      if (
        !user.reset_password_token_time ||
        user.reset_password_token_time.getTime() < Date.now()
      ) {
        return res.status(400).send({
          success: false,
          message: 'Reset password token has expired',
        });
      }

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      user.password = hashedPassword;
      user.reset_password_token = undefined;
      user.reset_password_token_time = undefined;

      await user.save();

      return res.status(200).send({
        success: true,
      });
    } catch (error: unknown) {
      return res.status(500).send({
        success: false,
        message: 'Unable to reset password',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async resetPasswordWithOtp(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        message: errors.array()[0].msg,
      });
    }

    try {
      const email = req.body.email;
      const otp = req.body.otp;
      const new_password = req.body.new_password;

      const user = await UserModel.findOne({ email }) as HydratedDocument<User> | null;

      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      if (
        !user.reset_password_token ||
        user.reset_password_token !== otp
      ) {
        return res.status(400).send({
          message: 'Invalid OTP',
        });
      }

      if (
        !user.reset_password_token_time ||
        user.reset_password_token_time.getTime() < Date.now()
      ) {
        return res.status(400).send({
          message: 'OTP has expired',
        });
      }

      const hashedPassword = await bcrypt.hash(
        new_password,
        10
      );

      user.password = hashedPassword;
      user.reset_password_token = undefined;
      user.reset_password_token_time = undefined;

      const result = await user.save() as any;

      return res.status(200).send(result);
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to reset password',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async verifyResetPasswordToken(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    try {
      const email = req.query.email as string;
      const reset_password_token = req.query.reset_password_token as string;

      const user = await UserModel.findOne({ email }) as HydratedDocument<User> | null;

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      if (
        !user.reset_password_token ||
        user.reset_password_token !== reset_password_token
      ) {
        return res.status(400).send({
          success: false,
          message: 'Invalid reset password token',
        });
      }

      if (
        !user.reset_password_token_time ||
        user.reset_password_token_time.getTime() < Date.now()
      ) {
        return res.status(400).send({
          success: false,
          message: 'Reset password token has expired',
        });
      }

      return res.status(200).send({
        success: true,
      });
    } catch (error: unknown) {
      return res.status(500).send({
        success: false,
        message: 'Unable to verify reset password token',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        message: errors.array()[0].msg,
      });
    }

    try {
      const forbiddenFields = [
        'password',
        'type',
        'verification_token',
        'verification_token_time',
        'email_verified',
        'reset_password_token',
        'reset_password_token_time',
        '_id',
        'email',
      ];

      const attemptedForbidden = forbiddenFields.filter((field) =>
        Object.prototype.hasOwnProperty.call(req.body, field)
      );

      if (attemptedForbidden.length > 0) {
        return res.status(400).send({
          message: `Updating fields is not allowed: ${attemptedForbidden.join(', ')}`,
        });
      }

      const user = await UserModel.findById((req as any).user.user_id) as HydratedDocument<User> | null;

      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      if (req.body.name) {
        user.name = req.body.name;
      }

      if (req.body.phone) {
        user.phone = req.body.phone;
      }

      if (req.body.status) {
        user.status = req.body.status;
      }

      const result = await user.save();

      return res.status(200).send(UserController.sanitizeUser(result));
    } catch (error: unknown) {
      return res.status(500).send({
        message: 'Unable to update profile',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  static getUsers(req: Request, res: Response) {
    UserModel.find()
      .then((users) => {
        res.status(200).send(users);
      })
      .catch((error: unknown) => {
        res.status(500).send({
          message: 'Unable to get users',
          error,
        });
      });
  }

  static getUserById(req: Request, res: Response) {
    UserModel.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found',
          });
        }

        res.status(200).send(user);
      })
      .catch((error: unknown) => {
        res.status(500).send({
          message: 'Unable to get user',
          error,
        });
      });
  }

  static async updateUser(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(
        req.body.password,
        10
      );
    }

    UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send({
            message: 'User not found',
          });
        }

        res.status(200).send(updatedUser);
      })
      .catch((error: unknown) => {
        res.status(500).send({
          message: 'Unable to update user',
          error,
        });
      });
  }

  static deleteUser(req: Request, res: Response) {
    UserModel.findByIdAndDelete(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found',
          });
        }

        res.status(200).send({
          message: 'User deleted successfully',
        });
      })
      .catch((error: unknown) => {
        res.status(500).send({
          message: 'Unable to delete user',
          error,
        });
      });
  }
}
