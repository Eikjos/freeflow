import { Injectable } from '@nestjs/common'
import { Invoice, User } from '@prisma/client'
import { renderToBuffer } from '@react-pdf/renderer'
import { DevisTemplate } from '@repo/pdf-templates'
import { CustomerDetailModel, InvoiceInformation } from '@repo/shared-types'
import { CreateInvoiceLineDto } from 'dtos/invoices/invoice-create.dto'

@Injectable()
export default class InvoiceFileService {
  async replaceQuote(
    devis: Invoice,
    lines: CreateInvoiceLineDto[],
    information: InvoiceInformation,
    customer: CustomerDetailModel,
    isLogo: boolean,
    user: User,
  ) {
    return await renderToBuffer(
      <DevisTemplate
        title={devis.name}
        date={devis.date}
        information={information}
        customer={customer}
        lines={lines}
        excludeTva={devis.excludeTva}
        maskName={!isLogo}
        apiUrl={process.env.API_URL}
        isSigned
        signedDate={devis.signedDate}
        user={user.firstName + ' ' + user.lastName}
      />,
    )
  }
}
