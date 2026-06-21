import { useState } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Wallet, Check, ChevronRight } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import type { ThemeName } from '../../types';

const ACCENTS: { value: ThemeName; label: string; hex: string }[] = [
  { value: 'emerald', label: 'Esmeralda', hex: '#3fa679' },
  { value: 'blue', label: 'Azul', hex: '#4f86e8' },
  { value: 'purple', label: 'Roxo', hex: '#9b7be0' },
  { value: 'rose', label: 'Rosa', hex: '#e0728c' },
];

const CURRENCIES: { value: string; label: string; symbol: string }[] = [
  { value: 'BRL', label: 'Real', symbol: 'R$' },
  { value: 'USD', label: 'Dólar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
];

const TOTAL_STEPS = 3;
const SWIPE_THRESHOLD = 60;

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { preferences, updatePreferences } = useFinance();
  const { theme, darkMode, currency } = preferences;
  const [[step, dir], setStep] = useState<[number, number]>([0, 1]);

  const go = (target: number) => {
    if (target < 0 || target >= TOTAL_STEPS) return;
    setStep([target, target > step ? 1 : -1]);
  };

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(step + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div
        className="flex-1 flex flex-col w-full max-w-md mx-auto px-[26px]"
        style={{
          paddingTop: 'calc(20px + env(safe-area-inset-top, 0px))',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Topo: dots (tocáveis) + pular */}
        <div className="flex items-center justify-between py-2">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Passo ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{ width: i === step ? 22 : 7, background: i === step ? 'var(--accent)' : 'var(--line)' }}
              />
            ))}
          </div>
          <button onClick={onDone} className="text-[13.5px] font-semibold" style={{ color: 'var(--faint)' }}>
            Pular
          </button>
        </div>

        {/* Conteúdo arrastável */}
        <div className="flex-1 flex flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
            >
              {step === 0 && <WelcomeStep />}
              {step === 1 && (
                <AppearanceStep
                  theme={theme}
                  darkMode={darkMode}
                  onTheme={(t) => updatePreferences({ theme: t })}
                  onDark={(d) => updatePreferences({ darkMode: d })}
                />
              )}
              {step === 2 && <CurrencyStep currency={currency} onSelect={(c) => updatePreferences({ currency: c })} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Rodapé: último passo sempre tem "Começar". Nos demais, no mobile só a
            dica de swipe; em telas maiores (web/PC) um botão "Continuar". */}
        <div className="pt-2 min-h-[56px] flex items-center justify-center">
          {step === TOTAL_STEPS - 1 ? (
            <PrimaryButton onClick={onDone}>Começar</PrimaryButton>
          ) : (
            <>
              {/* Web / telas maiores: botão (sem precisar arrastar) */}
              <div className="hidden sm:block w-full">
                <PrimaryButton onClick={() => go(step + 1)}>Continuar</PrimaryButton>
              </div>
              {/* Mobile: dica de swipe (tocar também avança) */}
              <button
                onClick={() => go(step + 1)}
                className="sm:hidden flex items-center gap-1 text-[13.5px] font-semibold"
                style={{ color: 'var(--faint)' }}
              >
                Arraste para continuar
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full py-3.5 rounded-[16px] font-bold"
      style={{ background: 'var(--theme-gradient)', color: 'var(--accent-on)', boxShadow: '0 14px 30px -12px var(--accent)' }}
    >
      {children}
    </motion.button>
  );
}

/** Linha de opção padrão usada em todos os passos (mesmo formato → consistência visual). */
function OptionRow({
  active,
  activeColor,
  leading,
  label,
  sub,
  onClick,
}: {
  active: boolean;
  activeColor: string;
  leading: React.ReactNode;
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 p-4 rounded-[16px] border transition-all"
      style={{ borderColor: active ? activeColor : 'var(--line)', background: active ? 'var(--accent-dim)' : 'var(--surface)' }}
    >
      {leading}
      <div className="flex-1 text-left min-w-0">
        <div className="text-[15px] font-bold truncate">{label}</div>
        {sub && (
          <div className="text-[12.5px] truncate" style={{ color: 'var(--faint)' }}>
            {sub}
          </div>
        )}
      </div>
      {active && <Check size={19} strokeWidth={2.6} style={{ color: activeColor }} />}
    </button>
  );
}

function WelcomeStep() {
  return (
    <div className="text-center select-none">
      <div
        className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] mb-6"
        style={{ background: 'var(--theme-gradient)', color: 'var(--accent-on)', boxShadow: '0 18px 40px -16px var(--accent)' }}
      >
        <Wallet className="w-10 h-10" />
      </div>
      <h1 className="text-[28px] font-extrabold tracking-[-0.02em] mb-2">Bem-vindo ao Finanças Pro</h1>
      <p className="text-[15px] leading-relaxed max-w-[300px] mx-auto" style={{ color: 'var(--muted)' }}>
        Registre lançamentos, defina metas e acompanhe seus gráficos — tudo num só lugar, com a sua cara.
      </p>
    </div>
  );
}

function AppearanceStep({
  theme,
  darkMode,
  onTheme,
  onDark,
}: {
  theme: ThemeName;
  darkMode: boolean;
  onTheme: (t: ThemeName) => void;
  onDark: (d: boolean) => void;
}) {
  return (
    <div className="select-none">
      <h2 className="text-[24px] font-extrabold tracking-[-0.02em] mb-1.5">Deixe com a sua cara</h2>
      <p className="text-[14px] mb-6" style={{ color: 'var(--muted)' }}>
        Escolha a cor de destaque e o modo de exibição.
      </p>

      <div className="space-y-2.5 mb-6">
        {ACCENTS.map((a) => (
          <OptionRow
            key={a.value}
            active={theme === a.value}
            activeColor={a.hex}
            leading={<span className="w-7 h-7 rounded-full flex-none" style={{ background: a.hex }} />}
            label={a.label}
            onClick={() => onTheme(a.value)}
          />
        ))}
      </div>

      <div
        className="flex items-center justify-between p-4 rounded-[16px] border"
        style={{ background: 'var(--surface)', borderColor: 'var(--line)' }}
      >
        <span className="text-[15px] font-bold">Modo escuro</span>
        <button
          onClick={() => onDark(!darkMode)}
          aria-label="Alternar modo escuro"
          className="w-14 h-8 rounded-full relative transition-colors flex-none"
          style={{ background: darkMode ? 'var(--accent)' : 'var(--surface2)' }}
        >
          <motion.div
            animate={{ x: darkMode ? 24 : 0 }}
            className="w-6 h-6 rounded-full absolute top-1 left-1"
            style={{ background: '#fff' }}
          />
        </button>
      </div>
    </div>
  );
}

function CurrencyStep({ currency, onSelect }: { currency: string; onSelect: (c: string) => void }) {
  return (
    <div className="select-none">
      <h2 className="text-[24px] font-extrabold tracking-[-0.02em] mb-1.5">Sua moeda</h2>
      <p className="text-[14px] mb-6" style={{ color: 'var(--muted)' }}>
        Usada para exibir todos os valores no app.
      </p>
      <div className="space-y-2.5">
        {CURRENCIES.map((c) => (
          <OptionRow
            key={c.value}
            active={currency === c.value}
            activeColor="var(--accent)"
            leading={
              <span
                className="w-11 h-11 rounded-[13px] flex-none flex items-center justify-center text-[17px] font-extrabold tnum"
                style={{ background: 'var(--surface2)', color: 'var(--accent)' }}
              >
                {c.symbol}
              </span>
            }
            label={c.label}
            sub={c.value}
            onClick={() => onSelect(c.value)}
          />
        ))}
      </div>
    </div>
  );
}
