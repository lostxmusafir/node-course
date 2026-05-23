import multer from 'multer';

export class Utils {
  private static readonly VERIFICATION_TOKEN_LENGTH = 6;
  private static readonly VERIFICATION_TOKEN_EXPIRY_MINUTES = 10;
  private static readonly RESET_PASSWORD_TOKEN_LENGTH = 6;
  private static readonly RESET_PASSWORD_TOKEN_EXPIRY_MINUTES = 10;

  public static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'src/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  public static sanitizePath(filePath: string): string {
    return filePath.split(/[\\/]/).pop() || '';
  }

  public static fileFilter = (req: any, file: any, cb: any) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  static generateVerificationToken(): number {
    const min = 10 ** (Utils.VERIFICATION_TOKEN_LENGTH - 1);
    const max = 10 ** Utils.VERIFICATION_TOKEN_LENGTH - 1;

    return Math.floor(min + Math.random() * (max - min + 1));
  }

  static getVerificationTokenExpiryDate(): Date {
    return new Date(
      Date.now() + Utils.VERIFICATION_TOKEN_EXPIRY_MINUTES * 60 * 1000
    );
  }

  static generateResetPasswordToken(): string {
    const min = 10 ** (Utils.RESET_PASSWORD_TOKEN_LENGTH - 1);
    const max = 10 ** Utils.RESET_PASSWORD_TOKEN_LENGTH - 1;

    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  static getResetPasswordTokenExpiryDate(): Date {
    return new Date(
      Date.now() + Utils.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES * 60 * 1000
    );
  }
}
