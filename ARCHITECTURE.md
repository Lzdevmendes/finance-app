# Arquitetura — finance-app

App financeiro pessoal, mobile-first. **React 18 + TypeScript + Vite 6 + Tailwind 4**,
backend **Firebase** (Auth + Firestore + Storage), deploy na **Vercel**.

Este documento descreve a arquitetura após a refatoração estrutural (Fases 0–6),
as decisões tomadas e como rodar/testar/publicar o projeto.

---

## Estrutura de pastas

```
src/
  main.tsx                      # entrypoint
  app/
    App.tsx                     # só monta os providers (Auth > Finance > Theme)
    config/firebase.ts          # init do Firebase (lê import.meta.env)
    contexts/                   # estado global (React Context)
      AuthContext.tsx           # usuário + ações de auth (retornam Result)
      FinanceContext.tsx        # transações, metas, preferências (via services)
      ThemeContext.tsx          # tema/dark mode aplicados ao DOM
    services/                   # ÚNICA camada que fala com Firebase
      auth.service.ts
      transactions.service.ts
      goals.service.ts
      preferences.service.ts
    hooks/
      useTransactionStats.ts    # cálculos do dashboard (memoizados)
    screens/                    # uma tela por pasta, < 300 linhas cada
      auth/AuthScreen.tsx
      dashboard/Dashboard.tsx + components/  (gráficos)
      transactions/TransactionsScreen.tsx + components/
      goals/GoalsScreen.tsx
      settings/SettingsScreen.tsx + components/ + useSettingsActions.ts
      MainApp.tsx               # shell autenticado (header, tabs, FAB)
    components/
      modals/                   # TransactionModal/Form, GoalModal
      CategoryIcon.tsx, TagInput.tsx
    constants/                  # ui.ts (tema/categorias), index.ts
    types/                      # tipos de domínio (Transaction, Goal, ...)
    utils/                      # logger, result, exportData
    test/setup.ts               # setup do Vitest
```

### Regras de arquitetura (invariantes)
1. **A UI nunca importa `firebase/*`.** Todo acesso a dados passa por `services/`,
   consumidos pelos contexts. (Verificável: `grep -r "firebase/" src/app/screens src/app/components` → vazio.)
2. **Nenhuma tela com mais de ~300 linhas.** Telas grandes são quebradas em subcomponentes
   na pasta `components/` ao lado da tela.
3. **Sem `any` em código vivo.** Dados financeiros/usuário são tipados.
4. **Erros padronizados com `Result<T>`** (`utils/result.ts`) na fronteira de auth.
5. **Validação de valor monetário no client E nas Firestore Rules** (defesa em profundidade).

---

## Decisões

### Firebase vs Supabase → **Firebase (único backend)**
O Supabase estava nas dependências e em `supabase/functions` + `utils/supabase`, mas
**não era usado em nenhum fluxo** (0 referências em `src/`). Foi **removido por completo**
(pastas, dep `@supabase/supabase-js`, e o arquivo com a anon key commitada). Manter duas
integrações "por garantia" é dívida técnica, não resiliência.

> ⚠️ A anon key do Supabase continua no histórico do git. Ação recomendada: revogar/rotacionar
> no painel do Supabase e pausar/deletar o projeto, já que não é mais usado.

### Limpeza de dependências
`package.json` saiu de **58 → 8** dependências de produção. Foram removidos todos os pacotes
importados apenas pelos 48 componentes `components/ui/` (que eram **código morto**, 0 imports):
todo `@radix-ui/*`, MUI/emotion, `cmdk`, `vaul`, `embla`, `input-otp`, `react-day-picker`,
`react-hook-form`, `react-resizable-panels`, `sonner`, `next-themes`, `class-variance-authority`,
`clsx`, `tailwind-merge`, além de `react-dnd`, `react-slick`, `react-router`, `react-popper`,
`@popperjs/core`, `react-responsive-masonry`, `date-fns` (0 imports em qualquer lugar).

Corrigida uma *phantom dependency*: o código importava `framer-motion`, mas o `package.json`
declarava `motion` (que só o trazia transitivamente) → `framer-motion` virou dependência explícita.

**Deps de produção atuais:** `firebase`, `framer-motion`, `lucide-react`, `react`, `react-dom`,
`react-currency-input-field`, `recharts`, `tw-animate-css`.

### Logging e erros
- `utils/logger.ts`: `logError/logWarn/logInfo` só emitem em **DEV** (no-op em produção).
- `utils/result.ts`: `Result<T>` (`ok`/`err`) — usado por `AuthContext` e seus call sites.

### Firestore Rules
A regra catch-all `match /users/{userId}/{document=**}` com `write` foi **removida**: ela
anulava (regras no Firestore são OR) as validações de campo. Agora `create/update` são validados
(tipo/valor/tamanho), `read/delete` são permissões separadas, e há limite de `tags` (≤ 20) e
teto de valor (`< 1e9`) em transações e metas.

---

## Como rodar

```bash
npm install
cp .env.example .env      # preencher as VITE_FIREBASE_*
npm run dev               # desenvolvimento
npm run build             # tsc --noEmit && vite build
npm run preview           # servir o build
```

## Testes (Vitest + Testing Library)

```bash
npm test                  # roda todos uma vez
npm run test:watch        # modo watch
```

Cobertura mínima viável: lógica financeira (`useTransactionStats`), utilitário `Result`,
validação de formulário (`TransactionForm`) e fluxo de auth mockado (`AuthScreen`).

## Lint / Typecheck

```bash
npm run typecheck         # tsc --noEmit
npm run lint              # eslint .
```

---

## CI/CD

### GitHub Actions (gate de qualidade)
`.github/workflows/ci.yml` roda em todo **push e pull request para `main`**:
`install → typecheck → lint → test → build`. É o portão de qualidade do código.

### Vercel (deploy)
A Vercel escuta a branch `main` pela **integração nativa do GitHub** e faz o deploy de
produção automaticamente a cada push. O GitHub Actions **não substitui** esse deploy — ele
roda em paralelo como verificação de qualidade.

**Fluxo:** push na `main` → CI (Actions) roda os checks **e** Vercel faz o build/deploy.

**Se o auto-deploy não estiver disparando**, verificar no dashboard da Vercel:
1. Settings → Git → "Production Branch" = `main`;
2. a integração GitHub está conectada e com permissão no repositório `Lzdevmendes/finance-app`;
3. não há "Ignored Build Step" barrando o build;
4. o projeto Vercel está ligado a este repo (e não a um fork/duplicado).

**Bloquear deploy quando o CI falhar (opcional):** a Vercel não espera o GitHub Actions por
padrão. Para acoplar, há duas opções (decisão de produto):
- **Branch protection** no GitHub: exigir o check `CI` para permitir merge na `main` (protege via PRs);
- **Vercel "Ignored Build Step"**: um comando que cancela o build se uma condição não for satisfeita.

---

## Changelog da refatoração (fase a fase)

- **Fase 0 — Auditoria.** Mapeamento de deps reais, código morto, `console.*`, `any`, build/tsc.
- **Fase 1 — Arquitetura.** Gate de `tsc` no build; camada `services/`; `ThemeContext`;
  `user` tipado; `App.tsx` 2423→37 linhas; telas quebradas (<300) em subcomponentes.
- **Fase 2 — Supabase.** Removido por completo (código morto).
- **Fase 3 — Dependências.** 58→8 deps de produção; 5.137 linhas de dead code removidas;
  `node_modules` 673MB→415MB; vulnerabilidades 20→1; `framer-motion` explícito.
- **Fase 4 — Segurança/Qualidade.** Logger condicional; padrão `Result`; Firestore Rules reforçadas.
- **Fase 5 — Testes.** Vitest + Testing Library (10 testes).
- **Fase 6 — CI/CD.** ESLint (flat config); workflow de CI; esta documentação.
