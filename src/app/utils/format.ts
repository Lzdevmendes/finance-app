// Formatação monetária pt-BR compartilhada (antes era inline em cada tela).
// O símbolo acompanha a moeda das preferências; o agrupamento segue pt-BR.

const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
};

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? 'R$';
}

/** Valor com 2 casas (ex.: "1.234,56"). Sem símbolo. */
export function formatAmount(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Valor arredondado sem casas (ex.: "1.234"). Sem símbolo. Para resumos compactos. */
export function formatAmount0(value: number): string {
  return Math.round(value).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

/** Valor com símbolo da moeda (ex.: "R$ 1.234,56"). */
export function formatMoney(value: number, currency = 'BRL'): string {
  return `${currencySymbol(currency)} ${formatAmount(value)}`;
}

/** Percentual inteiro com sinal (ex.: "+8%", "-12%"). */
export function formatPercentDelta(pct: number): string {
  const rounded = Math.round(pct);
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
}
