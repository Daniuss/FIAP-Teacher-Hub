// Dados de demonstração — espelham exatamente preview/index.html (Prof. Marcos Silva).
// Usados como estado inicial das telas; nas ações de escrita (enviar chamado,
// responder chat, novo aviso, solicitação) o app tenta a API real (ver src/api/client.ts)
// e cai para atualização local otimista quando a API não está configurada.
import type { SetorKey } from '../theme/colors';

export type Unidade = 'Lins' | 'Paulista';
export type BadgeAula = 'done' | 'now' | 'next';
export type StatusChamado = 'aberto' | 'em_andamento';
export type StatusSolicitacao = 'pendente' | 'em_analise' | 'aprovada' | 'negada';
export type StatusAvaliacao = 'lancado' | 'pendente' | 'nao_iniciado';

export const professor = {
  nome: 'Prof. Marcos Silva',
  iniciais: 'MS',
  email: 'm.silva@fiap.com.br',
  matricula: 'P-00482',
  curso: 'Engenharia de Software · FIAP',
  usuario: 'pf0001',
};

export interface Aula {
  id: string;
  hora: string;
  nome: string;
  meta: string;
  cor: string;
  badge: BadgeAula;
}

export const aulasHojePorUnidade: { unidade: string; aulas: Aula[] }[] = [
  {
    unidade: 'LINS — Manhã',
    aulas: [
      { id: 'eng_lins', hora: '08:00', nome: 'Eng. de Software', meta: '1TDSB · Sala 305', cor: '#555555', badge: 'done' },
      { id: 'devops_lins', hora: '10:00', nome: 'DevOps & Cloud', meta: '2TDSA · Sala 207', cor: '#D81B60', badge: 'now' },
    ],
  },
  {
    unidade: 'PAULISTA — Noite',
    aulas: [
      { id: 'java_paulista', hora: '19:00', nome: 'Arquitetura Java', meta: '3TDSR · Sala 402', cor: '#7F77DD', badge: 'next' },
      { id: 'mobile_paulista', hora: '21:00', nome: 'Mobile Development', meta: '2TDSB · Sala 503', cor: '#1D9E75', badge: 'next' },
    ],
  },
];

export interface TurmaDetalheItem {
  label: string;
  valor: string;
}

export interface Turma {
  id: string;
  nome: string;
  codigo: string;
  unidade: Unidade;
  unidadeLabel: string;
  dias: string;
  horario: string;
  sala: string;
  andar: string;
  alunos: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  tags: { texto: string; bg: string; cor: string }[];
  detalhes: TurmaDetalheItem[];
}

export const turmas: Turma[] = [
  {
    id: 'eng_lins',
    nome: 'Eng. de Software',
    codigo: '1TDSB',
    unidade: 'Lins',
    unidadeLabel: 'LINS — Manhã',
    dias: 'Seg e Qua',
    horario: '08h–10h',
    sala: '305',
    andar: '3º andar',
    alunos: 28,
    icon: 'code-slash-outline',
    iconBg: '#111111',
    iconColor: '#D81B60',
    tags: [
      { texto: '28 alunos', bg: '#EAF3DE', cor: '#3B6D11' },
      { texto: 'CP2 pendente', bg: '#FAEEDA', cor: '#854F0B' },
    ],
    detalhes: [
      { label: 'Unidade', valor: 'FIAP Lins' },
      { label: 'Sala', valor: '305 · 3º andar' },
      { label: 'Turma', valor: '1TDSB' },
      { label: 'Horário', valor: 'Seg e Qua · 08h–10h' },
      { label: 'Alunos', valor: '28 matriculados' },
      { label: 'CP1', valor: '✅ Lançado' },
      { label: 'CP2', valor: '⏳ Pendente' },
      { label: 'GS', valor: '— Não iniciado' },
    ],
  },
  {
    id: 'devops_lins',
    nome: 'DevOps & Cloud',
    codigo: '2TDSA',
    unidade: 'Lins',
    unidadeLabel: 'LINS — Manhã',
    dias: 'Seg e Sex',
    horario: '10h–12h',
    sala: '207',
    andar: '2º andar',
    alunos: 31,
    icon: 'cloud-outline',
    iconBg: '#0F3D30',
    iconColor: '#1D9E75',
    tags: [
      { texto: '31 alunos', bg: '#EAF3DE', cor: '#3B6D11' },
      { texto: '4 em risco', bg: '#FCEBEB', cor: '#A32D2D' },
    ],
    detalhes: [
      { label: 'Unidade', valor: 'FIAP Lins' },
      { label: 'Sala', valor: '207 · 2º andar' },
      { label: 'Turma', valor: '2TDSA' },
      { label: 'Horário', valor: 'Seg e Sex · 10h–12h' },
      { label: 'Alunos', valor: '31 matriculados' },
      { label: 'CP1', valor: '✅ Lançado' },
      { label: 'CP2', valor: '✅ Lançado' },
      { label: 'GS', valor: '⏳ Pendente' },
    ],
  },
  {
    id: 'dados_lins',
    nome: 'Ciência de Dados',
    codigo: '1TDSR',
    unidade: 'Lins',
    unidadeLabel: 'LINS — Manhã',
    dias: 'Ter e Qui',
    horario: '08h–10h',
    sala: '106',
    andar: '1º andar',
    alunos: 33,
    icon: 'bar-chart-outline',
    iconBg: '#1A1A3E',
    iconColor: '#7F77DD',
    tags: [
      { texto: '33 alunos', bg: '#EAF3DE', cor: '#3B6D11' },
      { texto: 'GS pendente', bg: '#FAEEDA', cor: '#854F0B' },
    ],
    detalhes: [
      { label: 'Unidade', valor: 'FIAP Lins' },
      { label: 'Sala', valor: '106 · 1º andar' },
      { label: 'Turma', valor: '1TDSR' },
      { label: 'Horário', valor: 'Ter e Qui · 08h–10h' },
      { label: 'Alunos', valor: '33 matriculados' },
      { label: 'CP1', valor: '✅ Lançado' },
      { label: 'CP2', valor: '⏳ Pendente' },
      { label: 'GS', valor: '— Não iniciado' },
    ],
  },
  {
    id: 'java_paulista',
    nome: 'Arquitetura Java',
    codigo: '3TDSR',
    unidade: 'Paulista',
    unidadeLabel: 'PAULISTA — Noite',
    dias: 'Ter e Qui',
    horario: '19h–21h',
    sala: '402',
    andar: '4º andar',
    alunos: 25,
    icon: 'cafe-outline',
    iconBg: '#231e5e',
    iconColor: '#7F77DD',
    tags: [
      { texto: '25 alunos', bg: '#EAF3DE', cor: '#3B6D11' },
      { texto: 'CP1 lançado', bg: '#EAF3DE', cor: '#3B6D11' },
    ],
    detalhes: [
      { label: 'Unidade', valor: 'FIAP Paulista' },
      { label: 'Sala', valor: '402 · 4º andar' },
      { label: 'Turma', valor: '3TDSR' },
      { label: 'Horário', valor: 'Ter e Qui · 19h–21h' },
      { label: 'Alunos', valor: '25 matriculados' },
      { label: 'CP1', valor: '✅ Lançado' },
      { label: 'CP2', valor: '— Não iniciado' },
      { label: 'GS', valor: '— Não iniciado' },
    ],
  },
  {
    id: 'mobile_paulista',
    nome: 'Mobile Development',
    codigo: '2TDSB',
    unidade: 'Paulista',
    unidadeLabel: 'PAULISTA — Noite',
    dias: 'Qua e Sex',
    horario: '21h–23h',
    sala: '503',
    andar: '5º andar',
    alunos: 29,
    icon: 'phone-portrait-outline',
    iconBg: '#1D3A2E',
    iconColor: '#1D9E75',
    tags: [
      { texto: '29 alunos', bg: '#EAF3DE', cor: '#3B6D11' },
      { texto: 'CP1 lançado', bg: '#E6F1FB', cor: '#185FA5' },
    ],
    detalhes: [
      { label: 'Unidade', valor: 'FIAP Paulista' },
      { label: 'Sala', valor: '503 · 5º andar' },
      { label: 'Turma', valor: '2TDSB' },
      { label: 'Horário', valor: 'Qua e Sex · 21h–23h' },
      { label: 'Alunos', valor: '29 matriculados' },
      { label: 'CP1', valor: '✅ Lançado' },
      { label: 'CP2', valor: '— Não iniciado' },
      { label: 'GS', valor: '— Não iniciado' },
    ],
  },
  {
    id: 'redes_paulista',
    nome: 'Redes de Computadores',
    codigo: '1TDSS',
    unidade: 'Paulista',
    unidadeLabel: 'PAULISTA — Noite',
    dias: 'Seg e Qua',
    horario: '19h–21h',
    sala: '305',
    andar: '3º andar',
    alunos: 27,
    icon: 'git-network-outline',
    iconBg: '#1A2744',
    iconColor: '#5BA3F5',
    tags: [
      { texto: '27 alunos', bg: '#EAF3DE', cor: '#3B6D11' },
      { texto: 'CP1 lançado', bg: '#E6F1FB', cor: '#185FA5' },
    ],
    detalhes: [
      { label: 'Unidade', valor: 'FIAP Paulista' },
      { label: 'Sala', valor: '305 · 3º andar' },
      { label: 'Turma', valor: '1TDSS' },
      { label: 'Horário', valor: 'Seg e Qua · 19h–21h' },
      { label: 'Alunos', valor: '27 matriculados' },
      { label: 'CP1', valor: '✅ Lançado' },
      { label: 'CP2', valor: '⏳ Pendente' },
      { label: 'GS', valor: '— Não iniciado' },
    ],
  },
];

export interface ChamadoTimelineItem {
  who: string;
  msg: string;
  time: string;
  dot: string;
  me: boolean;
}

export interface Chamado {
  id: string;
  numero: string;
  desc: string;
  meta: string;
  status: StatusChamado;
  icon: string;
  timeline: ChamadoTimelineItem[];
}

export const chamados: Chamado[] = [
  {
    id: 'login',
    numero: '#2341',
    desc: 'Aluno não consegue logar',
    meta: 'TI · Sala 305 · 3º andar · Lins',
    status: 'em_andamento',
    icon: 'laptop-outline',
    timeline: [
      { who: 'Prof. Marcos Silva', msg: 'Aluno RM-12345 não consegue acessar o sistema.', time: '09:28', dot: '#D81B60', me: true },
      { who: 'Monitor Pedro (TI)', msg: 'Chamado recebido! Verificando o sistema.', time: '09:30', dot: '#185FA5', me: false },
      { who: 'Monitor Pedro (TI)', msg: 'Conta bloqueada por excesso de tentativas. Estou indo até a sala agora.', time: '09:35', dot: '#185FA5', me: false },
    ],
  },
  {
    id: 'projetor',
    numero: '#2342',
    desc: 'Projetor não está funcionando',
    meta: 'Audiovisual · Sala 305 · 3º andar · Lins',
    status: 'aberto',
    icon: 'tv-outline',
    timeline: [
      { who: 'Prof. Marcos Silva', msg: 'Projetor ligado mas sem imagem. Já testei o HDMI.', time: '09:30', dot: '#D81B60', me: true },
      { who: 'Sistema', msg: 'Chamado encaminhado para Audiovisual.', time: '09:31', dot: '#666666', me: false },
    ],
  },
];

export interface ChatMsg {
  me: boolean;
  txt: string;
  t: string;
}

export interface Chat {
  id: string;
  nome: string;
  turma: string;
  iniciais: string;
  bg: string;
  cor: string;
  naoLidas: number;
  ultimaHora: string;
  msgs: ChatMsg[];
}

export const chats: Chat[] = [
  {
    id: 'ana',
    nome: 'Ana Gabriela',
    turma: '1TDSB',
    iniciais: 'AG',
    bg: 'rgba(216,27,96,0.12)',
    cor: '#D81B60',
    naoLidas: 2,
    ultimaHora: '09:36',
    msgs: [
      { me: false, txt: 'Professor, tenho uma dúvida sobre a CP2. O prazo é mesmo até sexta?', t: '09:30' },
      { me: false, txt: 'Porque no AVA está escrito sexta mas a monitora disse que é quinta.', t: '09:31' },
      { me: true, txt: 'Boa observação, Ana. O prazo correto é sexta-feira às 23h59. Vou corrigir no AVA.', t: '09:40' },
    ],
  },
  {
    id: 'pedro',
    nome: 'Pedro Viana',
    turma: '2TDSA',
    iniciais: 'PV',
    bg: '#1a2744',
    cor: '#5BA3F5',
    naoLidas: 1,
    ultimaHora: '08:50',
    msgs: [
      { me: false, txt: 'Professor, posso entregar o trabalho de DevOps amanhã? Tive um problema pessoal hoje.', t: '08:48' },
      { me: false, txt: 'Já tenho 90% pronto, só falta a documentação.', t: '08:50' },
    ],
  },
  {
    id: 'larissa',
    nome: 'Larissa Ferreira',
    turma: '1TDSR',
    iniciais: 'LF',
    bg: '#1a3022',
    cor: '#6DB33F',
    naoLidas: 0,
    ultimaHora: 'Ontem',
    msgs: [
      { me: false, txt: 'Professor, já enviei o link do repositório GitHub com o projeto de Ciência de Dados!', t: 'Ontem' },
      { me: true, txt: 'Ótimo, Larissa! Vou dar uma olhada ainda hoje.', t: 'Ontem' },
    ],
  },
  {
    id: 'carlos',
    nome: 'Carlos Mendes',
    turma: '1TDSB',
    iniciais: 'CM',
    bg: '#2a1a1a',
    cor: '#F5A623',
    naoLidas: 0,
    ultimaHora: 'Ontem',
    msgs: [{ me: false, txt: 'Professor, quando sai o resultado do CP1?', t: 'Ontem' }],
  },
];

export interface Aviso {
  turma: string;
  texto: string;
  quando: string;
  alunos: number;
}

export const avisos: Aviso[] = [
  { turma: '1TDSB', texto: 'CP2 na próxima aula. Revisem módulos 4 e 5 do AVA.', quando: 'há 2h', alunos: 28 },
  { turma: 'Todas as turmas', texto: 'Entrega do Challenge: 20/06. Verifiquem os requisitos no AVA.', quando: 'há 3 dias', alunos: 173 },
];

export const turmasParaAviso = ['Todas as turmas', ...turmas.map((t) => `${t.codigo} — ${t.nome} (${t.unidade})`)];

export interface HorarioCoord {
  dia: string;
  horario: string;
  local: string;
}

export const horariosCoord: HorarioCoord[] = [
  { dia: 'Seg', horario: '09h–12h e 14h–17h', local: 'Sala Coord. · 8º andar · Lins' },
  { dia: 'Ter', horario: '09h–12h', local: 'Sala Coord. · 8º andar · Lins' },
  { dia: 'Qua', horario: '14h–18h', local: 'Sala Coord. · 3º andar · Paulista' },
  { dia: 'Qui', horario: '09h–12h e 19h–21h', local: 'Sala Coord. · 3º andar · Paulista' },
  { dia: 'Sex', horario: '10h–12h', local: 'Remoto (via app)' },
];

export const motivosCoord = [
  'Mudança de sala (estrutura inadequada)',
  'Mudança de sala (excesso de alunos)',
  'Solicitação de equipamento',
  'Problema com grade horária',
  'Dúvida sobre avaliação',
  'Outro',
];

export interface Solicitacao {
  motivo: string;
  detalhes: string;
  status: StatusSolicitacao;
  data: string;
}

export const solicitacoes: Solicitacao[] = [
  { motivo: 'Mudança de sala', detalhes: 'Sala 305 → Lab 207', status: 'aprovada', data: '28/05' },
  { motivo: 'Excesso de alunos', detalhes: 'Turma 2TDSB com 29 alunos', status: 'em_analise', data: '02/06' },
];

export const setores: SetorKey[] = ['TI', 'Audiovisual', 'Infraestrutura', 'Coordenação'];

// Aulas por dia do calendário (Agenda) — igual ao aDB do preview, ano de referência 2026.
export interface AulaAgenda {
  h: string;
  n: string;
  m: string;
  c: string;
  badge: BadgeAula;
}

export const aulasPorDia: Record<string, AulaAgenda[]> = {
  '2026-6-9': [
    { h: '08:00', n: 'Eng. de Software', m: '1TDSB · Sala 305 · Lins', c: '#555555', badge: 'done' },
    { h: '10:00', n: 'DevOps & Cloud', m: '2TDSA · Sala 207 · Lins', c: '#D81B60', badge: 'now' },
    { h: '19:00', n: 'Arquitetura Java', m: '3TDSR · Sala 402 · Paulista', c: '#7F77DD', badge: 'next' },
    { h: '21:00', n: 'Mobile Dev.', m: '2TDSB · Sala 503 · Paulista', c: '#1D9E75', badge: 'next' },
  ],
  '2026-6-10': [
    { h: '10:00', n: 'DevOps & Cloud', m: '2TDSA · Sala 207', c: '#D81B60', badge: 'next' },
    { h: '21:00', n: 'Mobile Dev.', m: '2TDSB · Sala 503', c: '#1D9E75', badge: 'next' },
  ],
  '2026-6-12': [
    { h: '08:00', n: 'Eng. de Software', m: '1TDSB · Sala 305', c: '#555555', badge: 'next' },
    { h: '19:00', n: 'Arquitetura Java', m: '3TDSR · Sala 402', c: '#7F77DD', badge: 'next' },
  ],
  '2026-6-16': [
    { h: '08:00', n: 'Eng. de Software', m: '1TDSB · Sala 305', c: '#555555', badge: 'next' },
    { h: '19:00', n: 'Arquitetura Java', m: '3TDSR · Sala 402', c: '#7F77DD', badge: 'next' },
  ],
};
