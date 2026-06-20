import { motion } from 'framer-motion';
import {
  Target,
  LineChart,
  CreditCard,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFinance } from '../../contexts/FinanceContext';
import { useNavigation, type AppScreen } from '../../contexts/NavigationContext';
import { getUserName, getInitials } from '../../utils/user';

interface HubCard {
  screen: AppScreen;
  label: string;
  caption: string;
  icon: LucideIcon;
  tint: string; // cor do ícone (token)
  tintBg: string; // fundo do ícone
}

export function MoreScreen() {
  const { user } = useAuth();
  const { goals } = useFinance();
  const { navigate } = useNavigation();

  const name = getUserName(user);
  const initials = getInitials(name);

  const cards: HubCard[] = [
    {
      screen: 'goals',
      label: 'Metas',
      caption: `${goals.length} ${goals.length === 1 ? 'ativa' : 'ativas'}`,
      icon: Target,
      tint: 'var(--income)',
      tintBg: 'rgba(111,215,163,.13)',
    },
    {
      screen: 'reports',
      label: 'Relatórios',
      caption: 'Insights & score',
      icon: LineChart,
      tint: 'var(--info)',
      tintBg: 'rgba(154,166,240,.13)',
    },
    {
      screen: 'accounts',
      label: 'Contas & Cartões',
      caption: 'Saldos e fatura',
      icon: CreditCard,
      tint: 'var(--accent)',
      tintBg: 'var(--accent-dim)',
    },
    {
      screen: 'recurrences',
      label: 'Recorrências',
      caption: 'Contas fixas',
      icon: RefreshCw,
      tint: 'var(--warn)',
      tintBg: 'rgba(224,162,70,.13)',
    },
  ];

  return (
    <div className="px-[22px] pb-28 pt-2">
      <div className="py-3.5 pb-4">
        <h1 className="text-[25px] font-extrabold tracking-[-0.02em]">Mais</h1>
      </div>

      {/* Card de perfil → Ajustes */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('settings')}
        className="w-full flex items-center gap-[15px] rounded-[20px] border p-4 mb-[22px] text-left"
        style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
      >
        <div
          className="w-[54px] h-[54px] rounded-full flex items-center justify-center text-[18px] font-extrabold tnum"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[16.5px] font-bold truncate">{name}</div>
          <div className="text-[13px] mt-0.5 truncate" style={{ color: 'var(--faint)' }}>
            {user?.email}
          </div>
        </div>
        <ChevronRight size={20} strokeWidth={2} style={{ color: 'var(--faint)' }} />
      </motion.button>

      {/* Grid 2×2 de atalhos */}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.screen}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.screen)}
              className="rounded-[18px] border p-[18px] text-left"
              style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
            >
              <div
                className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center mb-3.5"
                style={{ background: card.tintBg, color: card.tint }}
              >
                <Icon size={21} strokeWidth={1.9} />
              </div>
              <div className="text-[15px] font-bold">{card.label}</div>
              <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--faint)' }}>
                {card.caption}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Linha Ajustes */}
      <div
        className="rounded-[18px] border overflow-hidden mt-3"
        style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('settings')}
          className="w-full flex items-center gap-[13px] px-4 py-[15px] text-left"
        >
          <div
            className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
          >
            <SlidersHorizontal size={18} strokeWidth={1.9} />
          </div>
          <span className="flex-1 text-[14.5px] font-medium">Ajustes</span>
          <ChevronRight size={19} strokeWidth={2} style={{ color: 'var(--faint)' }} />
        </motion.button>
      </div>
    </div>
  );
}
