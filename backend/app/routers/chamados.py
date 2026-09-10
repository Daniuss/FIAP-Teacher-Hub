from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.schemas import ChamadoCreate, ChamadoOut, TimelineItemOut
from app.supabase_client import get_supabase

router = APIRouter(tags=["chamados"])


@router.get("/professor/{professor_id}/chamados", response_model=list[ChamadoOut])
def listar_chamados(professor_id: UUID):
    db = get_supabase()
    res = (
        db.table("chamados")
        .select("*")
        .eq("professor_id", str(professor_id))
        .order("created_at", desc=True)
        .execute()
    )
    return [ChamadoOut(**c) for c in res.data]


@router.post("/chamados", response_model=ChamadoOut, status_code=201)
def abrir_chamado(payload: ChamadoCreate):
    db = get_supabase()
    professor_res = (
        db.table("professores").select("nome").eq("id", str(payload.professor_id)).limit(1).execute()
    )
    if not professor_res.data:
        raise HTTPException(status_code=404, detail="Professor não encontrado.")
    professor_nome = professor_res.data[0]["nome"]

    chamado_res = (
        db.table("chamados")
        .insert(
            {
                "professor_id": str(payload.professor_id),
                "setor": payload.setor,
                "descricao": payload.descricao,
                "sala": payload.sala,
                "status": "aberto",
            }
        )
        .execute()
    )
    chamado = chamado_res.data[0]

    db.table("chamados_timeline").insert(
        {
            "chamado_id": chamado["id"],
            "autor": professor_nome,
            "mensagem": payload.descricao,
        }
    ).execute()

    return ChamadoOut(**chamado)


@router.get("/chamado/{chamado_id}/timeline", response_model=list[TimelineItemOut])
def timeline_chamado(chamado_id: UUID):
    db = get_supabase()
    chamado_res = db.table("chamados").select("id").eq("id", str(chamado_id)).limit(1).execute()
    if not chamado_res.data:
        raise HTTPException(status_code=404, detail="Chamado não encontrado.")

    res = (
        db.table("chamados_timeline")
        .select("autor, mensagem, created_at")
        .eq("chamado_id", str(chamado_id))
        .order("created_at")
        .execute()
    )
    return [TimelineItemOut(**item) for item in res.data]
