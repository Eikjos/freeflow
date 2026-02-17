import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

async function executeSqlFile(filePath: string) {
  const prisma = new PrismaClient()
  try {
    const sqlFilePath = path.join(__dirname, filePath)
    // Lire le contenu du fichier SQL
    const sql = fs.readFileSync(sqlFilePath, 'utf-8')

    // Exécuter le contenu SQL
    await prisma.$executeRawUnsafe(sql)
    console.log('SQL file executed successfully!')
  } catch (error) {
    console.error('Error executing SQL file:', error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function seedCountry() {
  const prisma = new PrismaClient()
  const country = await prisma.country.count()
  if (country === 0) {
    executeSqlFile('./scripts/countries.sql')
  }
  const juridicShapes = await prisma.juridicShape.count()
  if (juridicShapes === 0) {
    executeSqlFile('./scripts/juridic-shapes.sql')
  }
}

export async function seedExpenseCategory() {
  const prisma = new PrismaClient()
  const expenseCategory = await prisma.expenseCategory.count()
  if (expenseCategory === 0) {
    executeSqlFile('./scripts/expenseCategories.sql')
  }
}
