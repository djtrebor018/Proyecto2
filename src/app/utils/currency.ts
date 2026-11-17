export function formatDop(amount: number, language: string = 'es'): string {
  const locale = language === 'en' ? 'en-US' : 'es-DO';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'DOP'
  }).format(amount);
}
