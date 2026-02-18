import { CustomerStatData } from '@repo/shared-types';

export default class CustomerStatDto implements CustomerStatData {
  month: string;
  customers: number;
}
