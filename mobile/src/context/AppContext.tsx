import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api, isApiConfigured } from '../api/client';
import {
  Chamado,
  Chat,
  ChatMsg,
  Solicitacao,
  chamados as mockChamados,
  chats as mockChats,
  professor as mockProfessor,
  solicitacoes as mockSolicitacoes,
  avisos as mockAvisos,
  Aviso,
} from '../data/mock';

const STORAGE_KEY = '@fiap-teacher-hub/session';

interface Professor {
  id: string;
  nome: string;
  iniciais: string;
  email: string;
  matricula: string;
  curso: string;
  usuario: string;
}

interface AppState {
  loggedIn: boolean;
  professor: Professor;
  accessToken: string | null;
  loading: boolean;
  chamados: Chamado[];
  chats: Chat[];
  avisos: Aviso[];
  solicitacoes: Solicitacao[];
  login: (usuario: string, senha: string) => Promise<{ ok: boolean; erro?: string }>;
  logout: () => void;
  abrirChamado: (setor: string, descricao: string, sala?: string) => void;
  responderChat: (chatId: string, texto: string) => void;
  enviarAviso: (turmaLabel: string, texto: string, alunos: number) => void;
  enviarSolicitacao: (motivo: string, detalhes: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const demoProfessor: Professor = {
  id: 'demo-professor',
  nome: mockProfessor.nome,
  iniciais: mockProfessor.iniciais,
  email: mockProfessor.email,
  matricula: mockProfessor.matricula,
  curso: mockProfessor.curso,
  usuario: mockProfessor.usuario,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [professor, setProfessor] = useState<Professor>(demoProfessor);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [chamados, setChamados] = useState<Chamado[]>(mockChamados);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [avisos, setAvisos] = useState<Aviso[]>(mockAvisos);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(mockSolicitacoes);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw);
          setProfessor(saved.professor);
          setAccessToken(saved.accessToken);
          setLoggedIn(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login: AppState['login'] = async (usuario, senha) => {
    if (isApiConfigured()) {
      try {
        const res = await api.login(usuario, senha);
        const p: Professor = {
          id: res.professor.id,
          nome: res.professor.nome,
          iniciais: res.professor.nome
            .split(' ')
            .filter((w: string) => w.length > 2)
            .slice(0, 2)
            .map((w: string) => w[0])
            .join('')
            .toUpperCase(),
          email: res.professor.email,
          matricula: res.professor.matricula,
          curso: mockProfessor.curso,
          usuario: res.professor.usuario,
        };
        setProfessor(p);
        setAccessToken(res.access_token);
        setLoggedIn(true);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ professor: p, accessToken: res.access_token }));
        return { ok: true };
      } catch (e: any) {
        return { ok: false, erro: e.message || 'Usuário ou senha incorretos.' };
      }
    }

    // Modo demo — mesma regra do mockup: usuário pf0000 + senha 1234
    if (/^pf\d{4}$/i.test(usuario) && senha === '1234') {
      setProfessor(demoProfessor);
      setAccessToken('demo-token');
      setLoggedIn(true);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ professor: demoProfessor, accessToken: 'demo-token' }));
      return { ok: true };
    }
    return { ok: false, erro: 'Usuário ou senha incorretos.' };
  };

  const logout = () => {
    setLoggedIn(false);
    setAccessToken(null);
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  const abrirChamado: AppState['abrirChamado'] = (setor, descricao, sala) => {
    const novo: Chamado = {
      id: `local-${Date.now()}`,
      numero: `#${2340 + chamados.length + 1}`,
      desc: descricao,
      meta: `${setor}${sala ? ' · ' + sala : ''} · agora`,
      status: 'aberto',
      icon: setor === 'TI' ? 'laptop-outline' : setor === 'Audiovisual' ? 'tv-outline' : setor === 'Infraestrutura' ? 'business-outline' : 'person-circle-outline',
      timeline: [
        { who: professor.nome, msg: descricao, time: 'agora', dot: '#D81B60', me: true },
      ],
    };
    setChamados((prev) => [novo, ...prev]);
    if (isApiConfigured()) {
      api.criarChamado({ professor_id: professor.id, setor, descricao, sala }).catch(() => {});
    }
  };

  const responderChat: AppState['responderChat'] = (chatId, texto) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        const nova: ChatMsg = { me: true, txt: texto, t: 'agora' };
        return { ...c, msgs: [...c.msgs, nova] };
      })
    );
    if (isApiConfigured()) {
      api.enviarMensagem({ professor_id: professor.id, aluno_id: chatId, texto }).catch(() => {});
    }
  };

  const enviarAviso: AppState['enviarAviso'] = (turmaLabel, texto, alunos) => {
    setAvisos((prev) => [{ turma: turmaLabel, texto, quando: 'agora', alunos }, ...prev]);
    if (isApiConfigured()) {
      api.enviarAviso({ professor_id: professor.id, turma_id: null, texto }).catch(() => {});
    }
  };

  const enviarSolicitacao: AppState['enviarSolicitacao'] = (motivo, detalhes) => {
    setSolicitacoes((prev) => [{ motivo, detalhes, status: 'pendente', data: 'agora' }, ...prev]);
    if (isApiConfigured()) {
      api.enviarSolicitacao({ professor_id: professor.id, motivo, detalhes }).catch(() => {});
    }
  };

  const value = useMemo(
    () => ({
      loggedIn,
      professor,
      accessToken,
      loading,
      chamados,
      chats,
      avisos,
      solicitacoes,
      login,
      logout,
      abrirChamado,
      responderChat,
      enviarAviso,
      enviarSolicitacao,
    }),
    [loggedIn, professor, accessToken, loading, chamados, chats, avisos, solicitacoes]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}
