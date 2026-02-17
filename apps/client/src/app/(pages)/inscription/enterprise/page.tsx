import EnterpriseInscriptionForm from '@components/templates/enterprise-inscription-form'
import Footer from '@components/templates/footer'
import Header from '@components/templates/header'

export default function InscriptionEnterprisePage() {
  return (
    <div>
      <Header displayMenu={false} />
      <div className="min-h-[70vh]">
        <EnterpriseInscriptionForm className="w-1/2 mx-auto mt-20 mb-10" />
      </div>
      <Footer />
    </div>
  )
}
