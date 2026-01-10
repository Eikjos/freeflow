import NotFoundEnterprise from "(pages)/(enterprise)/not-found";
import CustomerFormVerif from "@components/templates/customer-form-verif";
import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import Loading from "@components/ui/loading";
import { CustomerDetailModel } from "@repo/shared-types";
import { headers } from "next/headers";
import { Suspense } from "react";
import { client } from "../../../../lib/client";
import { UserInfoType } from "../../../../types/user-info-types";

export default async function RecapCustomerPage() {
  // Vérification que c'est un client qui est connecté
  const headerUser = (await headers()).get("x-user");
  if (!headerUser) {
    return <NotFoundEnterprise />
  }
  const user: UserInfoType = JSON.parse(headerUser);
  if (user.role !== 'customer') {
    return <NotFoundEnterprise />
  }

  const {ok, data} = await client<CustomerDetailModel>(`customers/${user.customerId}`);

  if (!ok && !data) {
    return (
      <p>Une erreur est survenue</p>
    )
  }
  return (
    <div>
      <Header displayMenu={false} hideLogin />
      <Suspense fallback={<div className="h-[80vh] flex flex-row justify-center items-center"><Loading /></div>}>
          <CustomerFormVerif customer={data!} />
      </Suspense>
      <Footer />
    </div>
  )
}