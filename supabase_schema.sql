-- ====================================================================
-- ContextLGPD-Negotiator — Esquema de Banco de Dados na Nuvem (Supabase / PostgreSQL)
-- Sistema para Engenharia de Requisitos Sensíveis ao Contexto & LGPD
-- Centro de Informática (CIn) — UFPE
-- ====================================================================

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT DEFAULT 'researcher',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Tabela de Configurações do Usuário e Chaves Criptografadas
CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider TEXT DEFAULT 'gemini',
    model_name TEXT DEFAULT 'gemini-2.0-flash',
    api_key_cipher TEXT,
    api_key_iv TEXT,
    api_key_tag TEXT,
    custom_endpoint TEXT,
    cloud_db_url TEXT,
    cloud_db_key TEXT,
    cloud_db_enabled INTEGER DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Projetos / Sessões de Trabalho
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela de Cenários de Usuário (Engenharia de Requisitos)
CREATE TABLE IF NOT EXISTS scenarios (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    actor TEXT NOT NULL,
    context_where TEXT,
    context_who TEXT,
    context_when TEXT,
    context_what TEXT,
    sensors TEXT,
    qoc_desired TEXT,
    trigger_condition TEXT,
    expected_inference TEXT,
    external_llm_flag INTEGER DEFAULT 1,
    raw_requirement TEXT NOT NULL,
    status TEXT DEFAULT 'conflict_detected',
    negotiated_requirement TEXT,
    lgpd_diagnostics JSONB,
    accountability_matrix JSONB,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Tabela de Mensagens do Chat de Negociação
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    scenario_id TEXT REFERENCES scenarios(id) ON DELETE SET NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    structured_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_scenarios_project_id ON scenarios(project_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_scenario_id ON chat_messages(scenario_id);

-- Comentários Explicativos
COMMENT ON TABLE scenarios IS 'Cenários de Requisitos de Software Sensíveis ao Contexto para Negociação LGPD';
COMMENT ON COLUMN scenarios.qoc_desired IS 'Qualidade de Contexto (QoC) almejada segundo Buchholz et al.';
COMMENT ON COLUMN scenarios.trigger_condition IS 'Gatilho de ativação para mitigar o Paradoxo da Proatividade (Art. 6º, I e II)';
COMMENT ON COLUMN scenarios.accountability_matrix IS 'Matriz formal de prestação de contas conforme Art. 6º, X da LGPD';
