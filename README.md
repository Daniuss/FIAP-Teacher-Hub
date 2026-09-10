# FIAP Teacher Hub — Mobile

App mobile para professores da FIAP (substitui o portal do professor atual).
Referência de telas, fluxos e dados de exemplo: [`mockup/index.html`](mockup/index.html).

## Stack

- **Frontend:** React Native + Expo
- **Backend:** Python + FastAPI
- **Banco de dados:** Supabase (PostgreSQL gerenciado) + Supabase Auth
- **Versionamento:** Git + GitHub

## Estrutura do repositório

```
.
├── mockup/           # index.html original (fonte da verdade visual/funcional)
├── mobile/           # app Expo (React Native)
├── backend/          # API FastAPI
│   └── supabase/     # schema.sql e seed.sql
└── docs/
```

## Telas do app

1. **Login** — usuário no formato `pf0000` + senha
2. **Dashboard (Início)** — aulas do dia por unidade, chamados abertos, stats
3. **Agenda** — calendário mensal com aulas por dia
4. **Turmas** — busca + detalhe de turma (sala, horário, alunos, status CP1/CP2/GS)
5. **Contato** — abas Alunos (chat), Avisos (broadcast por turma), Coordenação (horários + solicitações)
6. **Chamados** — abertura por setor (TI, Audiovisual, Infraestrutura, Coordenação) + timeline

## Como rodar

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # preencha com suas credenciais Supabase
uvicorn app.main:app --reload
```

API sobe em `http://localhost:8000` (docs interativas em `/docs`).

### Banco de dados (Supabase)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor, rode `backend/supabase/schema.sql` para criar as tabelas e políticas RLS.
3. Rode `backend/supabase/seed.sql` para popular com o professor de exemplo (Prof. Marcos Silva) e suas turmas.
4. Copie a URL do projeto e as chaves (`anon` e `service_role`) para os arquivos `.env`.

### Mobile (Expo)

```bash
cd mobile
npm install
cp .env.example .env             # aponte para a URL da API e do Supabase
npx expo start
```

Escaneie o QR code com o app Expo Go (Android/iOS) ou rode em emulador (`i` para iOS, `a` para Android).

## Variáveis de ambiente

Veja `backend/.env.example` e `mobile/.env.example` para a lista completa
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `SECRET_KEY`, etc).

## Fluxo de branches

- `main` — produção
- `develop` — integração
- `feature/nome-da-feature` — desenvolvimento de cada feature, com PR para `develop`

## Usuário de teste (seed)

- Usuário: `pf0001`
- Senha: `1234`
- Professor: Marcos Silva — Engenharia de Software, FIAP (matrícula `P-00482`)
