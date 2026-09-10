from datetime import date, datetime, time
from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class LoginRequest(BaseModel):
    usuario: str  # formato pf0000
    senha: str


class LoginResponse(BaseModel):
    access_token: str
    professor: "ProfessorOut"


class ProfessorOut(BaseModel):
    id: UUID
    nome: str
    email: str
    matricula: str
    usuario: str
    unidades: list[str]


class TurmaOut(BaseModel):
    id: UUID
    nome: str
    codigo: str
    unidade: Literal["Lins", "Paulista"]
    sala: str
    andar: str | None = None
    horario: str
    dias_semana: list[str]
    total_alunos: int | None = None
    avaliacoes: list["AvaliacaoOut"] | None = None


class AvaliacaoOut(BaseModel):
    tipo: Literal["CP1", "CP2", "GS"]
    status: Literal["pendente", "lancado"]
    data_lancamento: date | None = None


class AulaOut(BaseModel):
    id: UUID
    turma_id: UUID
    turma_nome: str
    codigo: str
    unidade: str
    sala: str
    data: date
    horario_inicio: time
    horario_fim: time
    tipo: Literal["normal", "evento"]
    descricao_evento: str | None = None


class DashboardOut(BaseModel):
    professor: ProfessorOut
    aulas_hoje: list[AulaOut]
    total_aulas_hoje: int
    total_chamados_abertos: int
    total_mensagens_nao_lidas: int


class ChamadoCreate(BaseModel):
    professor_id: UUID
    setor: Literal["TI", "Audiovisual", "Infraestrutura", "Coordenação"]
    descricao: str
    sala: str | None = None


class ChamadoOut(BaseModel):
    id: UUID
    setor: str
    descricao: str
    status: Literal["aberto", "em_andamento", "resolvido"]
    sala: str | None = None
    created_at: datetime


class TimelineItemOut(BaseModel):
    autor: str
    mensagem: str
    created_at: datetime


class MensagemCreate(BaseModel):
    professor_id: UUID
    aluno_id: UUID
    texto: str
    arquivo_url: str | None = None


class MensagemOut(BaseModel):
    id: UUID
    aluno_id: UUID
    aluno_nome: str
    remetente: Literal["professor", "aluno"]
    texto: str
    lida: bool
    arquivo_url: str | None = None
    created_at: datetime


class AvisoCreate(BaseModel):
    professor_id: UUID
    turma_id: UUID | None = None  # None = todas as turmas
    texto: str


class AvisoOut(BaseModel):
    id: UUID
    turma_id: UUID | None
    turma_codigo: str | None = None
    texto: str
    created_at: datetime


class SolicitacaoCreate(BaseModel):
    professor_id: UUID
    motivo: str
    detalhes: str


class SolicitacaoOut(BaseModel):
    id: UUID
    motivo: str
    detalhes: str
    status: Literal["pendente", "em_analise", "aprovada", "negada"]
    created_at: datetime
