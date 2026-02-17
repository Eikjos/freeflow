import { Button } from '@components/ui/button'
import { ArrowRight, PlayIcon } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function HeroBanner() {
  const t = await getTranslations()
  return (
    <div className="mt-10 mb-10">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-center">
        {t('landing.title.manageEnterprise')}{' '}
        <span className="text-secondary">{t('landing.title.simple')}</span>
        <br />
        {t('landing.title.andEfficiently')}
      </h1>
      <p className="text-center w-1/2 mx-auto text-xl font-extralight">
        {t('landing.content.description')}
      </p>
      <div className="w-1/2 mx-auto flex flex-row items-center gap-6 mt-10 justify-center">
        <Button className="w-1/3">
          <Link href="/tarifs" className="flex flex-row items-center gap-2">
            {t('common.start')} <ArrowRight />
          </Link>
        </Button>

        <Button className="w-1/3" variant="outline">
          {t('landing.seeDemo')} <PlayIcon />
        </Button>
      </div>
    </div>
  )
}
