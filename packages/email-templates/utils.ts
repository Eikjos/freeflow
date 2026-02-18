export const formatPrice = (
  value: number,
  userLocale: string,
  currency: string,
) =>
  new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(/\u202F/g, ' ');
