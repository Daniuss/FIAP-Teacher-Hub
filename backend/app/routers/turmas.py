from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.schemas import AvaliacaoOut, TurmaOut
from app.supabase_client import get_supabase

router = APIRouter(tags=["turmas"])


def _to_turma_out(db, turma: dict) -> TurmaOut:
    alunos_res = (
        db.table("alunos").select("id", count="exact").eq("turma_id", turma["id"]).execute()
    )
    aval_res = db.table("avaliacoes").select("*").eq("turma_id", turma["id"]).execute()
    return TurmaOut(
        **turma,
        total_alunos=alunos_res.count or 0,
        avaliacoes=[AvaliacaoOut(**a) for a in aval_res.data],
    )


@router.get("/professor/{professor_id}/turmas", response_model=list[TurmaOut])
def listar_turmas(professor_id: UUID):
    db = get_supabase()
    res = db.table("turmas").select("*").eq("professor_id", str(professor_id)).order("unidade").execute()
    return [_to_turma_out(db, t) for t in res.data]


@router.get("/turma/{turma_id}", response_model=TurmaOut)
def detalhe_turma(turma_id: UUID):
    db = get_supabase()
    res = db.table("turmas").select("*").eq("id", str(turma_id)).limit(1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Turma não encontrada.")
    return _to_turma_out(db, res.data[0])
