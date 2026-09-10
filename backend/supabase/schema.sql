-- FIAP Teacher Hub — schema Supabase (PostgreSQL)
-- Rodar no SQL Editor do projeto Supabase, nesta ordem (respeita FKs).

create extension if not exists "pgcrypto";

-- =========================================================
-- PROFESSORES
-- professores.id = auth.users.id (login via Supabase Auth).
-- senha_hash fica como fallback/legado do login local (usuario pf0000 + senha),
-- não é a fonte de verdade de autenticação quando Supabase Auth está em uso.
-- =========================================================
create table professores (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text not null,
  email         text not null unique,
  matricula     text not null unique,
  usuario       text not null unique,           -- formato pf0000, usado no login mobile
  senha_hash    text,
  unidades      text[] not null default '{}',   -- ex: {"Lins","Paulista"}
  created_at    timestamptz not null default now()
);

-- =========================================================
-- TURMAS
-- =========================================================
create table turmas (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,                  -- ex: "Eng. de Software"
  codigo        text not null,                  -- ex: "1TDSB"
  unidade       text not null check (unidade in ('Lins','Paulista')),
  sala          text not null,
  andar         text,
  horario       text not null,                  -- ex: "08h–10h"
  dias_semana   text[] not null default '{}',   -- ex: {"Seg","Qua"}
  professor_id  uuid not null references professores(id) on delete cascade,
  created_at    timestamptz not null default now()
);
create index idx_turmas_professor on turmas(professor_id);

-- =========================================================
-- ALUNOS
-- =========================================================
create table alunos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  rm         text not null unique,
  turma_id   uuid not null references turmas(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index idx_alunos_turma on alunos(turma_id);

-- =========================================================
-- AULAS
-- =========================================================
create table aulas (
  id                 uuid primary key default gen_random_uuid(),
  turma_id           uuid not null references turmas(id) on delete cascade,
  data               date not null,
  horario_inicio     time not null,
  horario_fim        time not null,
  sala               text not null,
  tipo               text not null default 'normal' check (tipo in ('normal','evento')),
  descricao_evento   text,
  created_at         timestamptz not null default now()
);
create index idx_aulas_turma_data on aulas(turma_id, data);

-- =========================================================
-- AVALIAÇÕES
-- =========================================================
create table avaliacoes (
  id                uuid primary key default gen_random_uuid(),
  turma_id          uuid not null references turmas(id) on delete cascade,
  tipo              text not null check (tipo in ('CP1','CP2','GS')),
  data_lancamento   date,
  status            text not null default 'pendente' check (status in ('pendente','lancado')),
  created_at        timestamptz not null default now(),
  unique (turma_id, tipo)
);

-- =========================================================
-- NOTAS
-- =========================================================
create table notas (
  id             uuid primary key default gen_random_uuid(),
  aluno_id       uuid not null references alunos(id) on delete cascade,
  avaliacao_id   uuid not null references avaliacoes(id) on delete cascade,
  nota           numeric(4,2),
  created_at     timestamptz not null default now(),
  unique (aluno_id, avaliacao_id)
);

-- =========================================================
-- CHAMADOS
-- =========================================================
create table chamados (
  id            uuid primary key default gen_random_uuid(),
  professor_id  uuid not null references professores(id) on delete cascade,
  setor         text not null check (setor in ('TI','Audiovisual','Infraestrutura','Coordenação')),
  descricao     text not null,
  status        text not null default 'aberto' check (status in ('aberto','em_andamento','resolvido')),
  sala          text,
  created_at    timestamptz not null default now()
);
create index idx_chamados_professor on chamados(professor_id);

-- =========================================================
-- CHAMADOS_TIMELINE
-- =========================================================
create table chamados_timeline (
  id            uuid primary key default gen_random_uuid(),
  chamado_id    uuid not null references chamados(id) on delete cascade,
  autor         text not null,      -- ex: "Prof. Marcos Silva" ou "Monitor Pedro (TI)"
  mensagem      text not null,
  created_at    timestamptz not null default now()
);
create index idx_timeline_chamado on chamados_timeline(chamado_id, created_at);

-- =========================================================
-- MENSAGENS (chat professor <-> aluno)
-- remetente foi adicionado além das colunas pedidas, necessário para
-- reconstruir a conversa nos dois sentidos como no mockup.
-- =========================================================
create table mensagens (
  id            uuid primary key default gen_random_uuid(),
  professor_id  uuid not null references professores(id) on delete cascade,
  aluno_id      uuid not null references alunos(id) on delete cascade,
  remetente     text not null default 'professor' check (remetente in ('professor','aluno')),
  texto         text not null,
  lida          boolean not null default false,
  arquivo_url   text,
  created_at    timestamptz not null default now()
);
create index idx_mensagens_conversa on mensagens(professor_id, aluno_id, created_at);

-- =========================================================
-- AVISOS (broadcast por turma ou geral)
-- =========================================================
create table avisos (
  id            uuid primary key default gen_random_uuid(),
  professor_id  uuid not null references professores(id) on delete cascade,
  turma_id      uuid references turmas(id) on delete cascade, -- null = todas as turmas do professor
  texto         text not null,
  created_at    timestamptz not null default now()
);

-- =========================================================
-- SOLICITAÇÕES À COORDENAÇÃO
-- =========================================================
create table solicitacoes_coordenacao (
  id            uuid primary key default gen_random_uuid(),
  professor_id  uuid not null references professores(id) on delete cascade,
  motivo        text not null,
  detalhes      text not null,
  status        text not null default 'pendente' check (status in ('pendente','em_analise','aprovada','negada')),
  created_at    timestamptz not null default now()
);

-- =========================================================
-- RLS — cada professor só acessa seus próprios dados
-- =========================================================
alter table professores enable row level security;
alter table turmas enable row level security;
alter table alunos enable row level security;
alter table aulas enable row level security;
alter table avaliacoes enable row level security;
alter table notas enable row level security;
alter table chamados enable row level security;
alter table chamados_timeline enable row level security;
alter table mensagens enable row level security;
alter table avisos enable row level security;
alter table solicitacoes_coordenacao enable row level security;

create policy "professor vê e edita o próprio perfil"
  on professores for all
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "professor vê e gerencia suas turmas"
  on turmas for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

create policy "professor vê alunos das suas turmas"
  on alunos for select
  using (exists (select 1 from turmas t where t.id = alunos.turma_id and t.professor_id = auth.uid()));

create policy "professor vê e gerencia aulas das suas turmas"
  on aulas for all
  using (exists (select 1 from turmas t where t.id = aulas.turma_id and t.professor_id = auth.uid()))
  with check (exists (select 1 from turmas t where t.id = aulas.turma_id and t.professor_id = auth.uid()));

create policy "professor vê e gerencia avaliações das suas turmas"
  on avaliacoes for all
  using (exists (select 1 from turmas t where t.id = avaliacoes.turma_id and t.professor_id = auth.uid()))
  with check (exists (select 1 from turmas t where t.id = avaliacoes.turma_id and t.professor_id = auth.uid()));

create policy "professor vê e gerencia notas das suas turmas"
  on notas for all
  using (exists (
    select 1 from avaliacoes a
    join turmas t on t.id = a.turma_id
    where a.id = notas.avaliacao_id and t.professor_id = auth.uid()
  ))
  with check (exists (
    select 1 from avaliacoes a
    join turmas t on t.id = a.turma_id
    where a.id = notas.avaliacao_id and t.professor_id = auth.uid()
  ));

create policy "professor vê e gerencia seus chamados"
  on chamados for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

create policy "professor vê e adiciona timeline dos seus chamados"
  on chamados_timeline for all
  using (exists (select 1 from chamados c where c.id = chamados_timeline.chamado_id and c.professor_id = auth.uid()))
  with check (exists (select 1 from chamados c where c.id = chamados_timeline.chamado_id and c.professor_id = auth.uid()));

create policy "professor vê e envia suas mensagens"
  on mensagens for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

create policy "professor vê e envia seus avisos"
  on avisos for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());

create policy "professor vê e cria suas solicitações"
  on solicitacoes_coordenacao for all
  using (professor_id = auth.uid())
  with check (professor_id = auth.uid());
