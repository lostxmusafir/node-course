import { Environment } from './environments';

export const ProdEnvironment: Environment = {
  db_url:
    'mongodb+srv://rajagamer8_db_user:raj123456@cluster0.1ktnux4.mongodb.net/swiggyclone?retryWrites=true&w=majority&appName=cluster0',
  mail_smtp_host: process.env.MAILMART_SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  mail_smtp_port: Number(process.env.MAILMART_SMTP_PORT || 2525),
  mail_smtp_secure: process.env.MAILMART_SMTP_SECURE === 'true',
  mail_smtp_user: process.env.MAILMART_SMTP_USER || '',
  mail_smtp_password: process.env.MAILMART_SMTP_PASSWORD || '',
  mail_from_email: process.env.MAILMART_FROM_EMAIL || '',
  mail_from_name: process.env.MAILMART_FROM_NAME || 'Swiggy Clone App',
  jwt_secret: process.env.JWT_SECRET || 'swiggy_clone_jwt_secret',
};
