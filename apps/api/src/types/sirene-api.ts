export type SireneAuthentification = {
  access_token: string
  scop: string
  token_type: string
  expires_in: number
}

export type PeriodeEtablissement = {
  dateFin: string
  dateDebut: string
  etatAdministratifEtablissement: string
  changementEtatAdministratifEtablissement: boolean
  enseigne1Etablissement: string
  enseigne2Etablissement: string
  enseigne3Etablissement: string
  changementEnseigneEtablissement: boolean
  denominationUsuelleEtablissement: string
  changementDenominationUsuelleEtablissement: boolean
  activitePrincipaleEtablissement: string
  nomenclatureActivitePrincipaleEtablissement: string
  changementActivitePrincipaleEtablissement: boolean
  caractereEmployeurEtablissement: string
  changementCaractereEmployeurEtablissement: boolean
}

export type AdresseEtablissement = {
  indiceRepetitionDernierNumeroVoieEtablisssement: string
  complementAdresseEtablissement: string
  numeroVoieEtablissement: string
  indiceRepetitionEtablissement: string
  dernierNumeroVoieEtablissement: string
  typeVoieEtablissement: string
  libelleVoieEtablissement: string
  codePostalEtablissement: string
  libelleCommuneEtablissement: string
  libelleCommuneEtrangerEtablissement: string
  distributionSpecialeEtablissement: string
  codeCommuneEtablissement: string
  codeCedexEtablissement: string
  libelleCedexEtablissement: string
  codePaysEtrangerEtablissement: string
  libellePaysEtrangerEtablissement: string
  identifiantAdresseEtablissement: string
  coordonneeLambertAbscisseEtablissement: string
  coordonneeLambertOrdonneeEtablissement: string
}

export type Adresse2Etablissement = {
  complementAdresse2Etablissement: string
  numeroVoie2Etablissement: string
  indiceRepetition2Etablissement: string
  typeVoie2Etablissement: string
  libelleVoie2Etablissement: string
  codePostal2Etablissement: string
  libelleCommune2Etablissement: string
  libelleCommune2EtrangerEtablissement: string
  distributionSpeciale2Etablissement: string
  codeCommune2Etablissement: string
  codeCedex2Etablissement: string
  libelleCedex2Etablissement: string
  codePaysEtranger2Etablissement: string
  libellePaysEtranger2Etablissement: string
}

export type UniteLegale = {
  statutDiffusionUniteLegale: string
  unitePurgeeUniteLegale: boolean
  dateCreationUniteLegale: string
  identifiantAssociationUniteLegale: string
  trancheEffectifsUniteLegale: string
  anneeEffectifsUniteLegale: string
  dateDernierTraitementUniteLegale: string
  categorieEntreprise: string
  anneeCategorieEntreprise: string
  sigleUniteLegale: string
  sexeUniteLegale: string
  prenom1UniteLegale: string
  prenom2UniteLegale: string
  prenom3UniteLegale: string
  prenom4UniteLegale: string
  prenomUsuelUniteLegale: string
  pseudonymeUniteLegale: string
  etatAdministratifUniteLegale: string
  nomUniteLegale: string
  denominationUniteLegale: string
  denominationUsuelle1UniteLegale: string
  denominationUsuelle2UniteLegale: string
  denominationUsuelle3UniteLegale: string
  activitePrincipaleUniteLegale: string
  categorieJuridiqueUniteLegale: string
  nicSiegeUniteLegale: string
  nomenclatureActivitePrincipaleUniteLegale: string
  nomUsageUniteLegale: string
  economieSocialeSolidaireUniteLegale: string
  societeMissionUniteLegale: string
  caractereEmployeurUniteLegale: string
  capitalSocialUniteLegale?: number
}

export type Etablissement = {
  periodes: PeriodeEtablissement[]
  score: number
  siren: string
  nic: string
  siret: string
  statutDiffusionEtablissement: string
  dateCreationEtablissement: string
  trancheEffectifsEtablissement: string
  anneeEffectifsEtablissement: string
  activitePrincipaleRegistreMetiersEtablissement: string
  dateDernierTraitementEtablissement: string
  etablissementSiege: boolean
  nombrePeriodesEtablissement: number
  uniteLegale: UniteLegale
  adresseEtablissement: AdresseEtablissement
  adresse2Etablissement: Adresse2Etablissement
  periodesEtablissement: PeriodeEtablissement[]
}

export type Header = {
  statut: number
  message: string
  total: number
  debut: number
  nombre: number
  curseur: string
  curseurSuivant: string
}

export type EtablissementResponse = {
  header: Header
  etablissement: Etablissement
}
