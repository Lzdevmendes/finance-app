// Constantes locais do Dashboard. A lista de categorias aqui é propositalmente
// a mesma (reduzida) que o App original usava nos gráficos — mantida para não
// alterar o comportamento de rótulos/cores durante o split da Fase 1.
export const CHART_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444'];

export const dashboardCategories = [
  { value: 'alimentacao', label: 'Alimentação', icon: '🍽️' },
  { value: 'transporte', label: 'Transporte', icon: '🚗' },
  { value: 'lazer', label: 'Lazer', icon: '🎮' },
  { value: 'saude', label: 'Saúde', icon: '🏥' },
  { value: 'educacao', label: 'Educação', icon: '📚' },
  { value: 'outros', label: 'Outros', icon: '📦' },
];
