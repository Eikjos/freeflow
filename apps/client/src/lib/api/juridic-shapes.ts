import { JuridicShapeData } from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";

export const getAllJuridicShapes = async () => {
  return await client<JuridicShapeData[]>(`juridic-shapes`);
};

export const getJuridicShapeByCode = async (code: string) => {
  return await client<JuridicShapeData>(`juridic-shapes/${code}`);
};

export const getAllJuridicShapesQueryOptions = () =>
  queryOptions({
    queryFn: getAllJuridicShapes,
    queryKey: ["juridic-shapes"],
    retry: false,
  });

export const getAllJuridicShapesByCodeQueryOptions = (code: string) =>
  queryOptions({
    queryFn: () => getJuridicShapeByCode(code),
    queryKey: ["juridic-shapes", code],
    retry: false,
  });
