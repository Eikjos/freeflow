import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import AuthService from 'src/auth/auth.service';
import { CreateEnterpriseDto } from 'src/dtos/enterprises/enterprise-create.dto';
import { EnterpriseInformationDto } from 'src/dtos/enterprises/enterprise-information.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';
import {
  EtablissementResponse,
  SireneAuthentification,
} from 'src/types/sirene-api';

@Injectable()
export default class EnterpriseService {
  constructor(
    private readonly mediaService: MediaService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  // -- Methods --

  async createEnterprise(
    model: CreateEnterpriseDto,
    logo: Express.Multer.File,
    userId: number,
  ) {
    // save media
    const mediaId = await this.mediaService.upload(logo);
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
        tvaNumber: model.TVANumber,
        countryId: parseInt(model.countryId),
        mediaId: mediaId > 0 ? mediaId : null,
        sales: {
          create: {
            number: 0,
            year: new Date().getFullYear(),
          },
        },
      },
    });
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    return this.authService.generateToken(user, enterprise);
  }

  async findByid(id: number) {
    return await this.prisma.enterprise.findFirst({
      where: {
        id,
      },
    });
  }

  async getInformationBySiret(
    siret: string,
  ): Promise<Omit<EnterpriseInformationDto, 'id'>> {
    const insee = await this.getInseeInformation(siret);
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
      TVANumber:
        'FR' +
        this.getCleControleTVANumber(insee.etablissement.siren) +
        insee.etablissement.siren,
    };
  }

  // -- Tools --
  private async getInseeInformation(siret: string) {
    // Récupération du jeton d'authentification
    const header = {
      Authorization: 'Basic ' + process.env.INSEE_API_KEY,
    };
    const token = await this.httpService.axiosRef.post<SireneAuthentification>(
      'https://api.insee.fr/token',
      'grant_type=client_credentials',
      { headers: header },
    );
    // Récupération des informations de l'entreprise
    const url =
      'https://api.insee.fr/entreprises/sirene/V3.11/siret/' +
      siret.replace(/\s+/g, '');
    return await this.httpService.axiosRef
      .get<EtablissementResponse>(url, {
        headers: { Authorization: 'Bearer ' + token.data.access_token },
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new NotFoundException('enterprise.infoNotFound');
      });
  }

  private getCleControleTVANumber(siren: string) {
    // Convertir le SIREN en entier
    const sirenInt = parseInt(siren, 10);

    // Calculer la clé de contrôle
    const cleDeControle = (12 + 3 * (sirenInt % 97)) % 97;

    // Retourner la clé de contrôle sous forme de chaîne de 2 chiffres
    return cleDeControle.toString().padStart(2, '0');
  }
}
