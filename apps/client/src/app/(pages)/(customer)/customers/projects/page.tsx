import NotFoundEnterprise from '(pages)/(enterprise)/not-found'
import ProjectList from '@components/templates/project-list'
import { headers } from 'next/headers'
import { CustomerInfo } from '../../../../../types/customer-info-type'

export default async function CustomerProjectPage() {
  const customerHeaders = (await headers()).get('x-customer')
  if (!customerHeaders) {
    return <NotFoundEnterprise />
  }
  const customer: CustomerInfo = JSON.parse(customerHeaders) as CustomerInfo

  return (
    <>
      <h1 className="font-amica text-4xl mb-10">Mes projets</h1>
      <ProjectList customerId={customer.id} />
    </>
  )
}
