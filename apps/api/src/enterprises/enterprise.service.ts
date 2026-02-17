import { HttpService } from '@nestjs/axios'
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import AuthService from 'auth/auth.service'
import EnterpriseDto from 'dtos/enterprises/enterprise.dto'
import { CreateEnterpriseDto } from 'dtos/enterprises/enterprise-create.dto'
import { EnterpriseInformationDto } from 'dtos/enterprises/enterprise-information.dto'
import EnterpriseStatDto from 'dtos/enterprises/enterprise-stat.dto'
import EnterpriseUpdateDto from 'dtos/enterprises/enterprise-update.dto'
import InvoiceInformationDto from 'dtos/invoices/invoice-information.dto'
import ExpenseService from 'expenses/expense.service'
import MailingService from 'mailing/mailing.service'
import { MediaService } from 'media/media.service'
import { PrismaService } from 'prisma.service'
import SalesService from 'sales/sales.service'
import { EtablissementResponse } from 'types/sirene-api'

@Injectable()
export default class EnterpriseService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly salesService: SalesService,
    private readonly expenseService: ExpenseService,
    private readonly httpService: HttpService,
    private readonly mailingService: MailingService,
  ) {}

  // -- Methods --

  async createEnterprise(
    model: CreateEnterpriseDto,
    logo: Express.Multer.File,
    userId: number,
  ) {
    // save enterprise
    const enterprise = await this.prisma.enterprise.create({
      data: {
        name: model.name,
        siret: model.siret,
        address: model.address,
        city: model.city,
        zipCode: model.zipCode,
        phone: model.phone,
        email: model.email,
        juridicShapeId: model.juridicShape,
        users: {
          connect: [{ id: userId }],
        },
        tvaNumber: model.tvaNumber,
        prefixeInvoice: model.prefixeInvoice ?? '',
        lastInvoiceNumber: model.lastInvoiceNumber ?? 0,
        countryId: parseInt(model.countryId),
        mediaId: null,
        sales: {
          create: {
            number: 0,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
          },
        },
      },
    })

    // if enterprise save - save image
    if (enterprise.id && logo) {
      const mediaId = await this.mediaService.upload(
        logo,
        `${enterprise.id}/images`,
      )
      await this.prisma.enterprise.update({
        where: { id: enterprise.id },
        data: { mediaId },
      })
    }
    const user = await this.prisma.user.findFirst({ where: { id: userId } })
    this.mailingService.sendInscriptionMail(user.email)
    return this.authService.generateToken(user)
  }

  async update(
    id: number,
    model: EnterpriseUpdateDto,
    enterpriseId: number,
    userId: number,
    logo?: Express.Multer.File,
  ) {
    if (enterpriseId !== id) throw new ForbiddenException()
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id },
    })
    if (!enterprise) throw new NotFoundException()
    const enterpriseUpdate = await this.prisma.enterprise.update({
      where: { id },
      data: {
        name: model.name,
        tvaNumber: model.tvaNumber,
        juridicShapeId: model.juridicShapeId,
        countryId: parseInt(model.countryId),
        address: model.address,
        zipCode: model.zipCode,
        city: model.city,
        phone: model.phone,
        email: model.email,
        lastInvoiceNumber: model.invoiceNumber,
        prefixeInvoice: model.invoicePrefixe,
      },
    })

    if (enterpriseUpdate && logo) {
      this.mediaService.delete(enterprise.mediaId)
      const mediaId = await this.mediaService.upload(logo, `${id}/images`)
      this.prisma.enterprise.update({
        where: { id },
        data: { mediaId: mediaId },
      })
    }

    const user = await this.prisma.user.findFirst({ where: { id: userId } })
    return this.authService.generateToken(user)
  }

  async findById(id: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: {
        id,
      },
    })
    if (!enterprise) throw new NotFoundException()
    return new EnterpriseDto(enterprise)
  }

  async getInformationBySiret(
    siret: string,
  ): Promise<Omit<EnterpriseInformationDto, 'id'>> {
    const insee = await this.getInseeInformation(siret)
    return {
      siret: insee.etablissement.siret,
      name: insee.etablissement.uniteLegale.denominationUniteLegale
        .split(' ')
        .map((e) => e.toLowerCase().toLocaleUpperCase())
        .join(' '),
      address: `${insee.etablissement.adresseEtablissement.numeroVoieEtablissement ?? ''} ${insee.etablissement.adresseEtablissement.typeVoieEtablissement ?? ''} ${
        insee.etablissement.adresseEtablissement
          .complementAdresseEtablissement ?? ''
      } ${insee.etablissement.adresseEtablissement.libelleVoieEtablissement ?? ''}`,
      city: insee.etablissement.adresseEtablissement
        .libelleCommuneEtablissement,
      zipCode: insee.etablissement.adresseEtablissement.codePostalEtablissement,
      juridicShape:
        insee.etablissement.uniteLegale.categorieJuridiqueUniteLegale,
      socialCapital: insee.etablissement.uniteLegale.capitalSocialUniteLegale,
      countryId: '60',
      tvaNumber:
        'FR' +
        this.getCleControleTVANumber(insee.etablissement.siren) +
        insee.etablissement.siren,
    }
  }

  async getInformationForInvoice(
    enterpriseId: number,
  ): Promise<InvoiceInformationDto> {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
      include: { juridicShape: true },
    })
    if (!enterprise) throw new NotFoundException()
    const {
      prefixeInvoice,
      lastInvoiceNumber,
      juridicShape,
      juridicShapeId,
      ...rest
    } = enterprise
    const invoiceInformation: InvoiceInformationDto = {
      prefixe: prefixeInvoice ?? '',
      lastNumber: lastInvoiceNumber + 1,
      enterprise: {
        ...rest,
        juridicShape: juridicShape.designation,
        countryId: rest.countryId.toString(),
      },
    }
    return invoiceInformation
  }

  async getInformationForDevis(
    enterpriseId: number,
  ): Promise<InvoiceInformationDto> {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
      include: { juridicShape: true },
    })
    if (!enterprise) throw new NotFoundException()
    const {
      prefixeInvoice,
      lastInvoiceNumber,
      juridicShape,
      juridicShapeId,
      ...rest
    } = enterprise
    const devisCount = await this.prisma.invoice.count({
      where: { enterpriseId, type: 'QUOTE' },
    })
    const invoiceInformation: InvoiceInformationDto = {
      prefixe: prefixeInvoice ?? '',
      lastNumber: devisCount + 1,
      enterprise: {
        ...rest,
        juridicShape: juridicShape.designation,
        countryId: rest.countryId.toString(),
      },
    }
    return invoiceInformation
  }

  async getInscriptionYear(enterpriseId: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) throw new ForbiddenException()
    return enterprise.createdAt.getFullYear()
  }

  // -- Tools --
  private async getInseeInformation(siret: string) {
    // Récupération des informations de l'entreprise
    const url =
      'https://api.insee.fr/api-sirene/3.11/siret/' + siret.replace(/\s+/g, '')
    return await this.httpService.axiosRef
      .get<EtablissementResponse>(url, {
        headers: { 'X-INSEE-Api-Key-Integration': process.env.INSEE_API_KEY },
      })
      .then((res) => {
        return res.data
      })
      .catch(() => {
        throw new NotFoundException('enterprise.infoNotFound')
      })
  }

  async getStatsByYear(enterpriseId: number, year: number) {
    const enterprise = await this.prisma.enterprise.findFirst({
      where: { id: enterpriseId },
    })
    if (!enterprise) throw new ForbiddenException()
    const sales = await this.salesService.getAmountByYear(enterpriseId, year)
    const expenses = await this.expenseService.getTotalExpenseByYear(
      enterpriseId,
      year,
    )
    return new EnterpriseStatDto(sales, expenses)
  }

  private getCleControleTVANumber(siren: string) {
    // Convertir le SIREN en entier
    const sirenInt = parseInt(siren, 10)

    // Calculer la clé de contrôle
    const cleDeControle = (12 + 3 * (sirenInt % 97)) % 97

    // Retourner la clé de contrôle sous forme de chaîne de 2 chiffres
    return cleDeControle.toString().padStart(2, '0')
  }
}
