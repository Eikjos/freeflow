import NotFoundEnterprise from "(pages)/(enterprise)/not-found";
import { headers } from "next/headers";
import { UserInfoType } from "../../../../types/user-info-types";
import CreateEnterprisePage from "./page-client";

export default async function CreateEnterprisePageServer() {
  const headerUser = (await headers()).get("x-user");
  if (!headerUser) {
    return <NotFoundEnterprise />
  }
  const user: UserInfoType = JSON.parse(headerUser);
  if (user.role !== 'enterprise') {
    return <NotFoundEnterprise />
  }

  return (
    <CreateEnterprisePage />
  )
}