import { client } from "@lib/client";
import { AuthResponseData } from "@repo/shared-types";

const login = async (email: string, password: string) => {
  return await client<AuthResponseData>("auth/login", {
    method: "post",
    body: { email, password },
  });
};

export { login };
