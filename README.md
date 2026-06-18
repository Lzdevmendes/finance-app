
# Finanças Pro

Aplicação completa de organização financeira pessoal, 100% mobile-first, inspirada no Mobills mas sem anúncios e sem custos.

## Funcionalidades

- ✅ **Dashboard**: Saldo total, gráficos de pizza, últimas transações
- ✅ **Lançamentos**: CRUD completo com receitas/despesas, tags e categorias
- ✅ **Extrato**: Lista completa com filtros e busca
- ✅ **Metas**: Acompanhamento visual com progresso
- ✅ **Configurações**: 4 temas, dark mode, export de dados
- ✅ **PWA**: Instala no celular, funciona offline
- ✅ **Responsivo**: Perfeito em mobile e desktop

## Tecnologias

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Gráficos**: Recharts
- **Animações**: Framer Motion
- **PWA**: Service Worker + Manifest
- **Build**: Vite
- **Deploy**: Vercel
- **Testes**: Vitest + Testing Library
- **Lint**: ESLint (flat config)

## 🧪 Desenvolvimento e Qualidade

```bash
npm run dev          # servidor de desenvolvimento
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm test             # testes (Vitest)
npm run build        # tsc + vite build
```

**CI/CD:** todo push e PR para `main` dispara o GitHub Actions
(`.github/workflows/ci.yml`): install → typecheck → lint → test → build.
A Vercel faz o deploy de produção da `main` automaticamente, em paralelo ao CI.
Detalhes de arquitetura, decisões e fluxo em [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## 🚀 Configuração para Produção

### 1. Firebase Setup

#### Criar Projeto
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique "Criar um projeto" ou "Add project"
3. Nome: `financas-pro-prod` (ou similar)
4. Ative Google Analytics (opcional)

#### Ativar Serviços
1. **Authentication**:
   - Vá para Authentication > Sign-in method
   - Ative "Email/Password"

2. **Firestore Database**:
   - Vá para Firestore Database
   - Clique "Criar banco de dados"
   - Escolha "Iniciar no modo de produção"
   - Selecione região (ex: `us-central1` ou `southamerica-east1`)

#### Configurações de Segurança
1. **Regras do Firestore** (já configuradas em `firestore.rules`):
   ```javascript
   // Cada usuário vê apenas seus dados
   allow read, write: if request.auth != null && request.auth.uid == userId;
   ```

2. **Regras de Storage** (se usar):
   - Vá para Storage > Regras
   - Configure regras similares

### 2. Configurar Ambiente

#### Copiar Variáveis
```bash
cp .env.example .env
```

#### Preencher com dados reais do Firebase
```env
VITE_FIREBASE_API_KEY=AIzaSyD...seu-api-key
VITE_FIREBASE_AUTH_DOMAIN=financas-pro-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=financas-pro-prod
VITE_FIREBASE_STORAGE_BUCKET=financas-pro-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

### 3. Deploy das Regras

```bash
# Deploy regras do Firestore
firebase deploy --only firestore:rules

# Deploy regras do Storage (se usar)
firebase deploy --only storage
```

### 4. Build e Teste Local

```bash
# Instalar dependências
npm install

# Testar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📦 Deploy no Vercel

### Método 1: Deploy Automático (Recomendado)

1. **Push para GitHub**:
   ```bash
   git add .
   git commit -m "Versão produção com Firebase configurado"
   git push origin main
   ```

2. **Conectar no Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique "Import Project"
   - Conecte seu repositório GitHub
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `./` (raiz)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Adicionar Variáveis de Ambiente**:
   - No Vercel Dashboard, vá para Project Settings > Environment Variables
   - Adicione todas as variáveis do `.env`:
     ```
     VITE_FIREBASE_API_KEY=...
     VITE_FIREBASE_AUTH_DOMAIN=...
     VITE_FIREBASE_PROJECT_ID=...
     VITE_FIREBASE_STORAGE_BUCKET=...
     VITE_FIREBASE_MESSAGING_SENDER_ID=...
     VITE_FIREBASE_APP_ID=...
     ```

4. **Deploy**: Clique "Deploy"

### Método 2: Deploy Manual

```bash
# Build local
npm run build

# Instalar Vercel CLI
npm install -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod

# Adicionar variáveis de ambiente
vercel env add VITE_FIREBASE_API_KEY
# Repita para todas as variáveis
```

## 🔧 Configurações Adicionais para Produção

### Otimização de Performance

1. **Code Splitting**:
   - Já configurado no Vite
   - Componentes são carregados sob demanda

2. **Compressão**:
   - Vercel comprime automaticamente (Gzip/Brotli)

3. **Cache**:
   - Service Worker cacheia recursos
   - Firebase cacheia dados localmente

### Monitoramento

1. **Firebase Analytics** (opcional):
   - Vá para Analytics no Firebase Console
   - Configure eventos personalizados

2. **Error Tracking**:
   - Adicione Sentry ou similar para produção

### Backup e Segurança

1. **Backup Automático**:
   - Firestore faz backup automático
   - Configure exportações regulares se necessário

2. **Rate Limiting**:
   - Configure no Firebase Console se necessário

## 🧪 Testes

```bash
# Testes unitários (se implementar)
npm run test

# Build de produção
npm run build

# Teste do PWA
npm run preview
# Acesse http://localhost:4173
# Abra DevTools > Application > Service Workers
```

## 📱 PWA Features

- **Instalável**: Aparece prompt de instalação
- **Offline**: Funciona sem internet
- **Fast**: Carregamento instantâneo
- **Native-like**: Animações e gestos nativos

## 🔐 Segurança

- **Autenticação**: Firebase Auth com persistência
- **Autorização**: Regras do Firestore por usuário
- **Validação**: Dados validados no frontend e backend
- **HTTPS**: Forçado pelo Vercel

## 📊 Analytics e Métricas

- **Performance**: Core Web Vitals monitorados
- **Uso**: Firebase Analytics (opcional)
- **Erros**: Console do Firebase

## 🚀 Próximas Features (Roadmap)

- [ ] Notificações push
- [ ] Sincronização com bancos
- [ ] Relatórios avançados
- [ ] Backup/Export JSON
- [ ] Modo offline avançado
- [ ] Compartilhamento de dados

## 📞 Suporte

Para issues ou dúvidas:
1. Verifique os logs do Firebase Console
2. Teste em modo incógnito
3. Verifique as variáveis de ambiente

---

**🎉 Sua aplicação está pronta para produção!**

Feito com ❤️ para controle financeiro pessoal.
  