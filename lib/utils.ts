export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function generateReceiptNumber(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `ПКО-${num}`;
}

export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  cleaning:   'Уборка',
  repair:     'Ремонт',
  electrical: 'Электрика',
  security:   'Охрана',
  other:      'Прочее',
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  new:         'Новая',
  in_progress: 'В работе',
  completed:   'Выполнено',
};