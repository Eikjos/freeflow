export type SaleData = {
  id: number;
  year: number;
  month: number;
  enterpriseId: number;
  amount: number;
};

export type PrevisionData = {
  month: string;
  sale: number | null;
  prevision: number | null;
};
