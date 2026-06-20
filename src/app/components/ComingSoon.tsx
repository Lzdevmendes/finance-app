import { ScreenHeader } from './ScreenHeader';
import type { AppScreen } from '../contexts/NavigationContext';

interface ComingSoonProps {
  title: string;
  emoji: string;
  description: string;
  back?: AppScreen;
}

/**
 * Placeholder temporário das telas net-new ainda não construídas (Orçamentos,
 * Relatórios, Contas, Recorrências). Será substituído pela tela real em cada fase.
 */
export function ComingSoon({ title, emoji, description, back }: ComingSoonProps) {
  return (
    <div className="px-[22px] pb-28 pt-2">
      <ScreenHeader title={title} back={back} />
      <div className="text-center px-6 py-14">
        <div
          className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto mb-[18px] text-[30px]"
          style={{ background: 'var(--accent-dim)' }}
        >
          {emoji}
        </div>
        <div className="text-base font-bold">{title} em breve</div>
        <p className="text-[13.5px] mt-1.5 leading-relaxed max-w-[240px] mx-auto" style={{ color: 'var(--muted)' }}>
          {description}
        </p>
      </div>
    </div>
  );
}
