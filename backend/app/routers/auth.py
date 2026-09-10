from fastapi import APIRouter, HTTPException

from app.schemas import LoginRequest, LoginResponse, ProfessorOut
from app.supabase_client import get_supabase, get_supabase_auth

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    db = get_supabase()
    prof_res = (
        db.table("professores").select("*").eq("usuario", payload.usuario.lower()).limit(1).execute()
    )
    if not prof_res.data:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")

    professor = prof_res.data[0]

    try:
        auth = get_supabase_auth()
        session = auth.auth.sign_in_with_password(
            {"email": professor["email"], "password": payload.senha}
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")

    if not session.session:
        raise HTTPException(status_code=401, detail="Usuário ou senha incorretos.")

    return LoginResponse(
        access_token=session.session.access_token,
        professor=ProfessorOut(**professor),
    )
