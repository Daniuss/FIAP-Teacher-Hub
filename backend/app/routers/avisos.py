from uuid import UUID

from fastapi import APIRouter

from app.schemas import AvisoCreate, AvisoOut
from app.supabase_client import get_supabase

router = APIRouter(tags=["avisos"])


@router.get("/professor/{professor_id}/avisos", response_model=list[AvisoOut])
def listar_avisos(professor_id: UUID):
    db = get_supabase()
    res = (
        db.table("avisos")
        .select("*, turmas(codigo)")
        .eq("professor_id", str(professor_id))
        .order("created_at", desc=True)
        .execute()
    )
    return [
        AvisoOut(
            id=a["id"],
            turma_id=a["turma_id"],
            turma_codigo=a["turmas"]["codigo"] if a.get("turmas") else None,
            texto=a["texto"],
            created_at=a["created_at"],
        )
        for a in res.data
    ]


@router.post("/avisos", response_model=AvisoOut, status_code=201)
def enviar_aviso(payload: AvisoCreate):
    db = get_supabase()
    res = (
        db.table("avisos")
        .insert(
            {
                "professor_id": str(payload.professor_id),
                "turma_id": str(payload.turma_id) if payload.turma_id else None,
                "texto": payload.texto,
            }
        )
        .execute()
    )
    a = res.data[0]

    turma_codigo = None
    if a["turma_id"]:
        t_res = db.table("turmas").select("codigo").eq("id", a["turma_id"]).limit(1).execute()
        if t_res.data:
            turma_codigo = t_res.data[0]["codigo"]

    return AvisoOut(
        id=a["id"],
        turma_id=a["turma_id"],
        turma_codigo=turma_codigo,
        texto=a["texto"],
        created_at=a["created_at"],
    )
