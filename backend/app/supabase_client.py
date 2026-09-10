from functools import lru_cache

from supabase import Client, create_client

from app.config import settings


@lru_cache
def get_supabase() -> Client:
    """Cliente com a service role key — usado pelo backend, que já valida
    o acesso do professor antes de consultar (RLS não se aplica aqui)."""
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


@lru_cache
def get_supabase_auth() -> Client:
    """Cliente com a anon key — usado só para o fluxo de login (sign in)."""
    return create_client(settings.supabase_url, settings.supabase_anon_key)
