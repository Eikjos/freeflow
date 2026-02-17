'use client'

import { Button } from '@components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import ProjectList from './project-list'

type ProjectTabProps = {
  enterpriseId: number
}

export default function ProjectTab({ enterpriseId }: ProjectTabProps) {
  const t = useTranslations()
  return (
    <div className="w-full flex flex-col items-end">
      <Button asChild className="ml-auto mb-10">
        <Link href={'/activities/projects/create'}>
          {t('common.add')} <Plus />
        </Link>
      </Button>
      <ProjectList enterpriseId={enterpriseId} />
    </div>
  )
}
