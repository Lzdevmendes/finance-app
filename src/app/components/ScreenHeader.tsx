import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigation, type AppScreen } from '../contexts/NavigationContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Mostra a seta de voltar (telas do hub "Mais"). Default: navega para `back`. */
  back?: AppScreen;
  /** Ação à direita (ex.: botão "Novo"). */
  action?: ReactNode;
}

/** Header padrão das telas do redesign: título grande + voltar opcional + ação. */
export function ScreenHeader({ title, subtitle, back, action }: ScreenHeaderProps) {
  const { navigate } = useNavigation();

  return (
    <div className="flex items-center gap-3 py-3.5 pb-4">
      {back && (
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate(back)}
          aria-label="Voltar"
          className="w-10 h-10 flex-none rounded-[13px] border flex items-center justify-center"
          style={{ background: 'var(--surface2)', borderColor: 'var(--line)', color: 'var(--text)' }}
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </motion.button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-[25px] font-extrabold tracking-[-0.02em] leading-tight">{title}</h1>
        {subtitle && (
          <div className="text-[13.5px] mt-0.5" style={{ color: 'var(--muted)' }}>
            {subtitle}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}
