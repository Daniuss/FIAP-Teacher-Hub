from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, avisos, chamados, dashboard, mensagens, solicitacoes, turmas

app = FastAPI(title="FIAP Teacher Hub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(turmas.router)
app.include_router(chamados.router)
app.include_router(mensagens.router)
app.include_router(avisos.router)
app.include_router(solicitacoes.router)


@app.get("/health")
def health():
    return {"status": "ok"}
