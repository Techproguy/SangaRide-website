/** Whole-unit currency for a market, e.g. ₦6,000 or $42. */
export function moneyFormatter(locale: string, currency: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
