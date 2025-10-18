import { CreateObjectiveData } from "@repo/shared-types";
import { client } from "../../lib/client";

export const createObjective = (values: CreateObjectiveData) =>
  client(`objectives`, { body: JSON.stringify(values), method: "POST" }).then(
    (res) => {
      if (res.error) {
        throw Error(res.error);
      }
    }
  );
