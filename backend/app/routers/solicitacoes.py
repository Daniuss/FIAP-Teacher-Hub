from uuid import UUID

from fastapi import APIRouter

from app.schemas import SolicitacaoCreate, SolicitacaoOut
from app.supabase_client import get_supabase

router = APIRouter(tags=["solicitacoes"])


@router.get("/professor/{professor_id}/solicitacoes", response_model=list[SolicitacaoOut])
def listar_solicitacoes(professor_id: UUID):
    db = get_supabase()
    res = (
        db.table("solicitacoes_coordenacao")
        .select("*")
        .eq("professor_id", str(professor_id))
        .order("created_at", desc=True)
        .execute()
    )
    return [SolicitacaoOut(**s) for s in res.data]


@router.post("/solicitacoes", response_model=SolicitacaoOut, status_code=201)
def criar_solicitacao(payload: SolicitacaoCreate):
    db = get_supabase()
    res = (
        db.table("solicitacoes_coordenacao")
        .insert(
            {
                "professor_id": str(payload.professor_id),
                "motivo": payload.motivo,
                "detalhes": payload.detalhes,
                "status": "pendente",
            }
        )
        .execute()
    )
    return SolicitacaoOut(**res.data[0])
