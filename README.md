# Freeflow

## Présentation

**Freeflow** est une application **SaaS** développée dans le cadre d’un projet personnel, conçue pour aider les entrepreneurs à gérer efficacement leur activité au quotidien.  
L’objectif du projet est de proposer un outil centralisé combinant **gestion financière**, **suivi de projets** et **collaboration client**, tout en s’appuyant sur une architecture moderne et scalable.

## Fonctionnalités principales

- Création et gestion de **factures** et **devis**
- Suivi du **chiffre d’affaires**
- Suivi et catégorisation des **dépenses**
- **Gestion de projets** avec suivi des tâches par projet
- Espace client dédié permettant :
  - Le suivi de l’avancement des projets
  - La consultation des factures et devis

## Architecture & Stack Technique

### Monorepo

- Monorepo basé sur **Turborepo**
- **Node.js 24**
- Organisation orientée performance, partage de code et maintenabilité

### Back-end / API

- **NestJS** (API REST)
- **PostgreSQL** comme base de données
- **Prisma ORM** pour la gestion des modèles et des migrations
- Architecture modulaire et scalable

### Front-end

- **Next.js 16**
- Application orientée performance et expérience utilisateur
- Communication avec l’API via REST

