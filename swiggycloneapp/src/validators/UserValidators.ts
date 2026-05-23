import { body, query } from 'express-validator';

export class UserValidators {
  static login() {
    return [
      body('email', 'Email is required').isEmail(),
      body('password', 'Password is required').isString(),
    ];
  }

  static signup() {
    return [
      body('name', 'Name is required').isString().notEmpty(),
      body('phone', 'Phone number is required').isString().notEmpty(),
      body('email', 'Email is required').isEmail(),
      body('password', 'Password is required')
        .custom((value) => {
          // Handle arrays from duplicate keys
          const pass = Array.isArray(value) ? value[0] : value;
          return typeof pass === 'string' && pass.length >= 8 && pass.length <= 25;
        })
        .withMessage('Password must be between 8-25 characters'),
      body('type', 'User role type is required').isString().notEmpty(),
      body('status', 'User status is required').isString().notEmpty(),
    ];
  }

  static verifyUserEmail() {
    return [
      body('email', 'Email is required').isEmail(),
      body('verification_token', 'Verification token is required').isNumeric(),
    ];
  }

  static sendVerificationEmail() {
    return [
      query('email', 'Email is required').isEmail(),
    ];
  }

  static sendResetPasswordEmail() {
    return [
      query('email', 'Email is required').isEmail(),
    ];
  }

  static resetPassword() {
    return [
      body('email', 'Email is required').isEmail(),
      body('reset_password_token', 'Reset password token is required').isString(),
      body('password', 'Password is required')
        .isLength({ min: 8, max: 25 })
        .withMessage('Password must be between 8-20 characters'),
    ];
  }

  static resetPasswordWithOtp() {
    return [
      body('email', 'Email is required').isEmail(),
      body('otp', 'OTP is required').isString(),
      body('new_password', 'New password is required')
        .isAlphanumeric()
        .isLength({ min: 8, max: 25 })
        .withMessage('Password must be between 8-20 characters'),
    ];
  }

  static verifyResetPasswordToken() {
    return [
      query('email', 'Email is required').isEmail(),
      query('reset_password_token', 'Reset password token is required').isString(),
    ];
  }

  static updateProfile() {
    return [
      body('name', 'Name should be a non-empty string')
        .optional()
        .isString()
        .notEmpty(),
      body('phone', 'Phone number should be a non-empty string')
        .optional()
        .isString()
        .notEmpty(),
      body('status', 'User status should be a non-empty string')
        .optional()
        .isString()
        .notEmpty(),
    ];
  }
}
