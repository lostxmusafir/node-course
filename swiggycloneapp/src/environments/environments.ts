import { DevEnvironment } from './environment.dev';
import { ProdEnvironment } from './environment.prod';

export interface Environment {
  db_url: string;
  mail_smtp_host: string;
  mail_smtp_port: number;
  mail_smtp_secure: boolean;
  mail_smtp_user: string;
  mail_smtp_password: string;
  mail_from_email: string;
  mail_from_name: string;
  jwt_secret: string;
}

export function getEnvironmentVariables(): Environment {
  if (process.env.NODE_ENV === 'production') {
    return ProdEnvironment;
  }

  return DevEnvironment;
}
