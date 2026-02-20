/**
 * Supported mail provider names
 * extend when adding new providers (e.g. 'cloudflare')
 **/
export type MailProviderName = 'resend';

/**
 * Email template names
 */
export type EmailTemplate =
  | 'forgotPassword'
  | 'verifyEmail'
  | 'subscribeNewsletter'
  | 'contactMessage';

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: unknown;
}

export interface SendTemplateParams {
  to: string;
  template: EmailTemplate;
  context: Record<string, unknown>;
}

export interface SendRawEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface MailProvider {
  sendTemplate(params: SendTemplateParams): Promise<SendEmailResult>;
  sendRawEmail(params: SendRawEmailParams): Promise<SendEmailResult>;
  getProviderName(): string;
}
