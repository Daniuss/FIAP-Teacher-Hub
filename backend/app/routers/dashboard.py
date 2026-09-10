from datetime import date
from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.schemas import AulaOut, DashboardOut, ProfessorOut
from app.supabase_client import get_supabase

router = APIRouter(prefix="/professor", tags=["dashboard"])


def _get_professor(db, professor_id: UUID) -> dict:
    res = db.table("professores").select("*").eq("id", str(professor_id)).limit(1).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Professor não encontrado.")
    return res.data[0]


def _aulas_do_dia(db, professor_id: UUID, dia: date) -> list[AulaOut]:
    turmas_res = db.table("turmas").select("*").eq("professor_id", str(professor_id)).execute()
    turmas_by_id = {t["id"]: t for t in turmas_res.data}
    if not turmas_by_id:
        return []

    aulas_res = (
        db.table("aulas")
        .select("*")
        .in_("turma_id", list(turmas_by_id.keys()))
        .eq("data", dia.isoformat())
        .order("horario_inicio")
        .execute()
    )

    aulas: list[AulaOut] = []
    for a in aulas_res.data:
        turma = turmas_by_id[a["turma_id"]]
        aulas.append(
            AulaOut(
                id=a["id"],
                turma_id=a["turma_id"],
                turma_nome=turma["nome"],
                codigo=turma["codigo"],
                unidade=turma["unidade"],
                sala=a["sala"],
                data=a["data"],
                horario_inicio=a["horario_inicio"],
                horario_fim=a["horario_fim"],
                tipo=a["tipo"],
                descricao_evento=a.get("descricao_evento"),
            )
        )
    return aulas


@router.get("/{professor_id}/dashboard", response_model=DashboardOut)
def get_dashboard(professor_id: UUID):
    db = get_supabase()
    professor = _get_professor(db, professor_id)
    hoje = date.today()

    aulas_hoje = _aulas_do_dia(db, professor_id, hoje)

    chamados_res = (
        db.table("chamados")
        .select("id", count="exact")
        .eq("professor_id", str(professor_id))
        .in_("status", ["aberto", "em_andamento"])
        .execute()
    )
    mensagens_res = (
        db.table("mensagens")
        .select("id", count="exact")
        .eq("professor_id", str(professor_id))
        .eq("remetente", "aluno")
        .eq("lida", False)
        .execute()
    )

    return DashboardOut(
        professor=ProfessorOut(**professor),
        aulas_hoje=aulas_hoje,
        total_aulas_hoje=len(aulas_hoje),
        total_chamados_abertos=chamados_res.count or 0,
        total_mensagens_nao_lidas=mensagens_res.count or 0,
    )


@router.get("/{professor_id}/aulas/hoje", response_model=list[AulaOut])
def get_aulas_hoje(professor_id: UUID):
    db = get_supabase()
    _get_professor(db, professor_id)
    return _aulas_do_dia(db, professor_id, date.today())
