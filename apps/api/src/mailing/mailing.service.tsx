import { Injectable } from '@nestjs/common';
import { Invoice } from '@prisma/client';
import { render } from '@react-email/render';
import {
  CustomerInviteMail,
  InscriptionMail,
  InvoiceMail,
  QuoteMail,
  ValidateQuoteMail,
} from '@repo/email-templates';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export default class MailingService {
  private transporter: Transporter;
  private clientUrl: string;
  constructor() {
    this.transporter = createTransport({
      host: process.env['SMTP_URL'],
      port: Number(process.env['SMTP_PORT']),
      secure: false,
      auth: {
        user: process.env['SMTP_USER'],
        pass: process.env['SMTP_PASSWORD'],
      },
    });
    this.clientUrl = process.env['CLIENT_URL'];
  }

  async sendInscriptionMail(to: string) {
    const emailHtml = await render(
      <InscriptionMail clientUrl={this.clientUrl} />,
    );
    this.transporter.sendMail({
      from: 'ne-pas-repondre@freeflow.com',
      to,
      subject: 'Bienvenue sur la plateforme Freeflow',
      html: emailHtml,
    });
  }

  async sendInvoice(invoiceId: number, to: string) {
    const emailHtml = await render(<InvoiceMail clientUrl={this.clientUrl} />);
    this.transporter.sendMail({
      from: 'ne-pas-repondre@freeflow.fr',
      to,
      subject: 'Une nouvelle facture est disponible',
      html: emailHtml,
    });
  }

  async sendQuote(quoteI: number, to: string) {
    const emailHtml = await render(<QuoteMail clientUrl={this.clientUrl} />);
    this.transporter.sendMail({
      from: 'ne-pas-repondre@freeflow.fr',
      to,
      subject: 'Une nouvelle facture est disponible',
      html: emailHtml,
    });
  }

  async sendQuoteValidationMail(to: string, code: string, devis: Invoice) {
    const emailHtml = await render(
      <ValidateQuoteMail
        clientUrl={this.clientUrl}
        code={code}
        devis={devis.number}
      />,
    );
    this.transporter.sendMail({
      from: 'ne-pas-repondre@freeflow.fr',
      to,
      subject: `Code de validation pour le devis ${devis.number}`,
      html: emailHtml,
    });
  }

  async sendCustomerInvite(
    customerId: number,
    to: string,
    token: string,
    enterprise: string,
  ) {
    const emailHtml = await render(
      <CustomerInviteMail
        clientUrl={this.clientUrl}
        token={token}
        enterpriseName={enterprise}
      />,
    );
    this.transporter.sendMail({
      from: 'ne-pas-repondre@freeflow.fr',
      to,
      subject: 'Création du compte Client sur la plateforme Freeflow',
      html: emailHtml,
    });
  }
}
