import { motion } from 'framer-motion';
import { Home, List, Plus, PieChart, MoreHorizontal, type LucideIcon } from 'lucide-react';
import { useNavigation, MORE_HUB_SCREENS, type AppScreen } from '../contexts/NavigationContext';

interface NavItem {
  screen: AppScreen;
  label: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { screen: 'dashboard', label: 'Início', icon: Home },
  { screen: 'transactions', label: 'Transações', icon: List },
  { screen: 'budgets', label: 'Orçamentos', icon: PieChart },
  { screen: 'more', label: 'Mais', icon: MoreHorizontal },
];

interface BottomNavProps {
  /** Abre o bottom-sheet de novo lançamento (FAB central). */
  onFabPress: () => void;
}

/**
 * Barra inferior do redesign: Início · Transações · [ + ] · Orçamentos · Mais.
 * O FAB central sobe -20px e abre o sheet de novo lançamento de qualquer tela.
 */
export function BottomNav({ onFabPress }: BottomNavProps) {
  const { screen, navigate } = useNavigation();

  // "Mais" fica ativo em qualquer tela do hub (Metas/Relatórios/Contas/etc.).
  const isActive = (item: NavItem) =>
    item.screen === 'more' ? MORE_HUB_SCREENS.includes(screen) : screen === item.screen;

  const [left, right] = [ITEMS.slice(0, 2), ITEMS.slice(2)];

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-20 flex items-start border-t backdrop-blur-[20px]"
      style={{
        height: 'calc(88px + env(safe-area-inset-bottom, 0px))',
        paddingTop: '11px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'var(--nav-bg)',
        borderColor: 'var(--line)',
      }}
    >
      {left.map((item) => (
        <NavButton key={item.screen} item={item} active={isActive(item)} onPress={() => navigate(item.screen)} />
      ))}

      <div className="flex-1 flex justify-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onFabPress}
          aria-label="Novo lançamento"
          className="-mt-5 w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-on)',
            boxShadow: '0 12px 26px -8px var(--accent)',
          }}
        >
          <Plus size={26} strokeWidth={2.4} />
        </motion.button>
      </div>

      {right.map((item) => (
        <NavButton key={item.screen} item={item} active={isActive(item)} onPress={() => navigate(item.screen)} />
      ))}
    </nav>
  );
}

function NavButton({ item, active, onPress }: { item: NavItem; active: boolean; onPress: () => void }) {
  const Icon = item.icon;
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onPress}
      className="flex-1 flex flex-col items-center gap-[5px]"
      style={{ color: active ? 'var(--accent)' : 'var(--faint)' }}
    >
      <Icon size={23} strokeWidth={1.9} />
      <span className="text-[10.5px] font-semibold">{item.label}</span>
    </motion.button>
  );
}
