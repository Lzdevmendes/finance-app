// Constantes locais do Dashboard. A lista de categorias aqui é propositalmente
// a mesma (reduzida) que o App original usava nos gráficos.

// Paleta dos gráficos alinhada ao sistema warm-ink (accent · info · purple · warn · expense).
// Tons médios que funcionam tanto no dark quanto no light.
export const CHART_COLORS = ['#3fa679', '#5b6bd6', '#9b7be0', '#e0a246', '#cf5b3f'];

/**
 * Cores concretas para o recharts (que não lê CSS vars em eixos/tooltips).
 * Trocadas por modo para acompanhar o tema warm-ink.
 */
export function chartTheme(darkMode: boolean) {
  return {
    axis: darkMode ? '#a89f92' : '#6e665b',
    grid: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(20,15,8,0.08)',
    income: darkMode ? '#6fd7a3' : '#1f9d63',
    expense: darkMode ? '#e8896b' : '#cf5b3f',
    balance: darkMode ? '#9aa6f0' : '#5b6bd6',
    dotStroke: darkMode ? '#1e1b17' : '#ffffff',
    tooltip: {
      backgroundColor: darkMode ? 'rgba(30,27,23,0.96)' : 'rgba(255,255,255,0.96)',
      borderRadius: '14px',
      boxShadow: '0 18px 40px -12px rgba(0,0,0,0.35)',
      fontSize: '13px',
      fontWeight: 600,
      backdropFilter: 'blur(16px)',
      border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(20,15,8,0.08)',
      color: darkMode ? '#f4efe8' : '#211c16',
    } as const,
    tooltipLabel: {
      color: darkMode ? '#f4efe8' : '#211c16',
      fontWeight: 700,
      marginBottom: '4px',
    } as const,
  };
}

export const dashboardCategories = [
  { value: 'alimentacao', label: 'Alimentação', icon: '🍽️' },
  { value: 'transporte', label: 'Transporte', icon: '🚗' },
  { value: 'lazer', label: 'Lazer', icon: '🎮' },
  { value: 'saude', label: 'Saúde', icon: '🏥' },
  { value: 'educacao', label: 'Educação', icon: '📚' },
  { value: 'outros', label: 'Outros', icon: '📦' },
];
