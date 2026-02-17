import ProjectForm from '@components/templates/project-form'
import { getTranslations } from 'next-intl/server'

export default async function CreateProjectPage() {
  const t = await getTranslations()
  return (
    <>
      <h1 className="font-amica text-4xl">{t('project.create')}</h1>
      <ProjectForm className="mt-10" />
    </>
  )
}
