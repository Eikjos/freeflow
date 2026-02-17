import Footer from '@components/templates/footer'
import Header from '@components/templates/header'
import TarifsSection from '@components/templates/tarifs-section'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function TarifsPage() {
  const t = await getTranslations()
  return (
    <div>
      <Header displayMenu={false} />
      <TarifsSection />
      <div className="w-1/2 text-center mx-auto">
        <p>
          {t('login.alreadySubscribe')}{' '}
          <Link as="span" href="/login">
            <span className="text-primary">{t('login.loginYou')}</span>
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  )
}
