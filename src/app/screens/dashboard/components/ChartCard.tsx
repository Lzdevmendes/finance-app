import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  /** Cor do ícone (token). Default: accent. */
  tint?: string;
  /** Fundo do chip do ícone. Default: accent-dim. */
  tintBg?: string;
  children: ReactNode;
}

/** Card padrão dos gráficos do dashboard (shell warm-ink: superfície + título com chip). */
export function ChartCard({ title, icon: Icon, tint = 'var(--accent)', tintBg = 'var(--accent-dim)', children }: ChartCardProps) {
  return (
    <div
      className="p-5 rounded-[20px] border"
      style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
    >
      <h4 className="font-bold text-[15px] mb-4 flex items-center gap-2.5">
        <span
          className="w-[34px] h-[34px] rounded-[11px] flex items-center justify-center"
          style={{ background: tintBg, color: tint }}
        >
          <Icon size={18} strokeWidth={2} />
        </span>
        {title}
      </h4>
      {children}
    </div>
  );
}
