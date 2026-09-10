from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from app.schemas import MensagemCreate, MensagemOut
from app.supabase_client import get_supabase

router = APIRouter(tags=["mensagens"])


@router.get("/professor/{professor_id}/mensagens", response_model=list[MensagemOut])
def listar_mensagens(professor_id: UUID, aluno_id: UUID | None = Query(default=None)):
    """Sem aluno_id, retorna todas as mensagens (para montar a lista de conversas).
    Com aluno_id, retorna a thread completa daquele aluno, em ordem cronológica."""
    db = get_supabase()
    query = db.table("mensagens").select("*, alunos(nome)").eq("professor_id", str(professor_id))
    if aluno_id:
        query = query.eq("aluno_id", str(aluno_id)).order("created_at")
    else:
        query = query.order("created_at", desc=True)
    res = query.execute()

    return [
        MensagemOut(
            id=m["id"],
            aluno_id=m["aluno_id"],
            aluno_nome=m["alunos"]["nome"] if m.get("alunos") else "",
            remetente=m["remetente"],
            texto=m["texto"],
            lida=m["lida"],
            arquivo_url=m.get("arquivo_url"),
            created_at=m["created_at"],
        )
        for m in res.data
    ]


@router.post("/mensagens", response_model=MensagemOut, status_code=201)
def enviar_mensagem(payload: MensagemCreate):
    db = get_supabase()
    aluno_res = db.table("alunos").select("nome").eq("id", str(payload.aluno_id)).limit(1).execute()
    if not aluno_res.data:
        raise HTTPException(status_code=404, detail="Aluno não encontrado.")

    res = (
        db.table("mensagens")
        .insert(
            {
                "professor_id": str(payload.professor_id),
                "aluno_id": str(payload.aluno_id),
                "texto": payload.texto,
                "arquivo_url": payload.arquivo_url,
                "remetente": "professor",
                "lida": True,
            }
        )
        .execute()
    )
    m = res.data[0]
    return MensagemOut(
        id=m["id"],
        aluno_id=m["aluno_id"],
        aluno_nome=aluno_res.data[0]["nome"],
        remetente=m["remetente"],
        texto=m["texto"],
        lida=m["lida"],
        arquivo_url=m.get("arquivo_url"),
        created_at=m["created_at"],
    )
