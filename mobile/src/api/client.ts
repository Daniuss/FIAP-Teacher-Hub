// Cliente HTTP para o backend FastAPI (ver ../../backend).
// Sem EXPO_PUBLIC_API_URL configurada, isApiConfigured() é false e as telas
// operam inteiramente sobre os dados mock (src/data/mock.ts), do mesmo jeito
// que o protótipo index.html funciona sem nenhum servidor.

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function isApiConfigured(): boolean {
  return Boolean(API_URL);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_API_URL não configurada.');
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Erro ${res.status} em ${path}`);
  }
  return res.json();
}

export const api = {
  login: (usuario: string, senha: string) =>
    request<{ access_token: string; professor: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, senha }),
    }),

  getDashboard: (professorId: string) => request<any>(`/professor/${professorId}/dashboard`),

  getAulasHoje: (professorId: string) => request<any[]>(`/professor/${professorId}/aulas/hoje`),

  getTurmas: (professorId: string) => request<any[]>(`/professor/${professorId}/turmas`),

  getTurma: (turmaId: string) => request<any>(`/turma/${turmaId}`),

  getChamados: (professorId: string) => request<any[]>(`/professor/${professorId}/chamados`),

  criarChamado: (payload: { professor_id: string; setor: string; descricao: string; sala?: string }) =>
    request<any>('/chamados', { method: 'POST', body: JSON.stringify(payload) }),

  getTimelineChamado: (chamadoId: string) => request<any[]>(`/chamado/${chamadoId}/timeline`),

  getMensagens: (professorId: string, alunoId?: string) =>
    request<any[]>(`/professor/${professorId}/mensagens${alunoId ? `?aluno_id=${alunoId}` : ''}`),

  enviarMensagem: (payload: { professor_id: string; aluno_id: string; texto: string }) =>
    request<any>('/mensagens', { method: 'POST', body: JSON.stringify(payload) }),

  getAvisos: (professorId: string) => request<any[]>(`/professor/${professorId}/avisos`),

  enviarAviso: (payload: { professor_id: string; turma_id: string | null; texto: string }) =>
    request<any>('/avisos', { method: 'POST', body: JSON.stringify(payload) }),

  getSolicitacoes: (professorId: string) => request<any[]>(`/professor/${professorId}/solicitacoes`),

  enviarSolicitacao: (payload: { professor_id: string; motivo: string; detalhes: string }) =>
    request<any>('/solicitacoes', { method: 'POST', body: JSON.stringify(payload) }),
};
