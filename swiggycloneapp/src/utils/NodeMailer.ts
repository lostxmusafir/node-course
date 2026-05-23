import * as nodeMailer from 'nodemailer';
import { getEnvironmentVariables } from '../environments/environments';

export class NodeMailer {
  private static initializeTransport() {
    const env = getEnvironmentVariables();

    return nodeMailer.createTransport({
      host: env.mail_smtp_host,
      port: env.mail_smtp_port,
      secure: env.mail_smtp_secure,
      requireTLS: true,
      auth: {
        user: env.mail_smtp_user,
        pass: env.mail_smtp_password,
      },
      authMethod: 'LOGIN',
    });
  }

  static sendMail(data: { to: string[]; subject: string; html: string }) {
    const env = getEnvironmentVariables();

    return NodeMailer.initializeTransport().sendMail({
      from: `"${env.mail_from_name}" <${env.mail_from_email || env.mail_smtp_user}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  }
}
