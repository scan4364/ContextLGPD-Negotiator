const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const { hashPassword } = require('./crypto');

// Ensure data folder exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'context_lgpd.db');
const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode for better concurrency
try {
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('PRAGMA journal_mode = WAL;');
} catch (e) {
    // ignore pragma failures if any
}

function initDb() {
    // 1. Users table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            password_salt TEXT NOT NULL,
            role TEXT DEFAULT 'researcher',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 2. User Settings & Encrypted API Keys table
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_settings (
            id TEXT PRIMARY KEY,
            user_id TEXT UNIQUE NOT NULL,
            provider TEXT DEFAULT 'gemini',
            model_name TEXT DEFAULT 'gemini-2.0-flash',
            api_key_cipher TEXT,
            api_key_iv TEXT,
            api_key_tag TEXT,
            custom_endpoint TEXT,
            cloud_db_url TEXT,
            cloud_db_key TEXT,
            cloud_db_enabled INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 3. Projects / Workspaces / Chat Sessions table
    db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 4. Scenarios Table (Engenharia de Requisitos Sensíveis ao Contexto)
    db.exec(`
        CREATE TABLE IF NOT EXISTS scenarios (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
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
            lgpd_diagnostics TEXT,
            accountability_matrix TEXT,
            order_index INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // 5. Chat History Table (Interactive Negotiation dialogue)
    db.exec(`
        CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            project_id TEXT NOT NULL,
            scenario_id TEXT,
            user_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            structured_payload TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    seedInitialData();
}

function seedInitialData() {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    if (userCount > 0) return;

    console.log('🌱 Seeding initial database with demo user and scientific scenarios...');

    const demoUserId = 'usr_cin_ufpe_01';
    const { hash, salt } = hashPassword('senha123');

    // Create demo user
    db.prepare(`
        INSERT INTO users (id, name, email, password_hash, password_salt, role)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(demoUserId, 'Prof. Samuel Celso (CIn-UFPE)', 'pesquisador@cin.ufpe.br', hash, salt, 'researcher');

    // Create user settings
    db.prepare(`
        INSERT INTO user_settings (id, user_id, provider, model_name)
        VALUES (?, ?, ?, ?)
    `).run('set_01', demoUserId, 'gemini', 'gemini-2.0-flash');

    // Create default Project
    const demoProjectId = 'prj_context_negotiator_cin';
    db.prepare(`
        INSERT INTO projects (id, user_id, title, description)
        VALUES (?, ?, ?, ?)
    `).run(
        demoProjectId,
        demoUserId,
        'Negociação Contexto & LGPD (Artigo CIn-UFPE)',
        'Cenários de teste para avaliação da mediação via Engenharia de Requisitos de Software segundo a arquitetura ADL ACME ContextLGPD-Negotiator.'
    );

    // Initial Scenarios based on the pre-paper
    const initialScenarios = [
        {
            id: 'scn_01',
            code: 'CEN-01',
            title: 'Alerta Proativo de Trânsito no Deslocamento',
            actor: 'Motorista / Usuário em Trânsito',
            context_where: 'Localização Contínua: Coordenadas GPS de alta precisão (< 10m) 24/7',
            context_who: 'Identificador do dispositivo móvel e histórico pessoal de rotas',
            context_when: 'Monitoramento contínuo em background (24 horas por dia)',
            context_what: 'Deslocamento veicular e congestionamento nas vias urbanas',
            sensors: 'GPS, Acelerômetro, Giroscópio, Histórico de Navegação',
            qoc_desired: 'Precisão espacial < 10m, atualização a cada 1 segundo (QoC elevada)',
            trigger_condition: 'Acelerômetro detecta velocidade sustentada > 15 km/h',
            expected_inference: 'Inferir situação de alto nível "Usuário_Em_Trânsito" para antecipar alertas de acidentes',
            external_llm_flag: 1,
            raw_requirement: 'REQ-01: O sistema deve monitorar continuamente o GPS, acelerômetro e histórico do usuário, enviando os dados brutos para uma LLM na nuvem internacional para personalizar recomendações de deslocamento em tempo real.',
            status: 'negotiated',
            negotiated_requirement: 'REQ-01 (Negociado): Para inferir o contexto de alto nível "Usuário_Em_Trânsito" (Finalidade - Art. 6º, I), o sistema deve amostrar o acelerômetro localmente a cada 30s. Apenas quando Movimento > 15km/h for detectado (Gatilho), o GPS será ativado com precisão degradada de 100m (QoC controlada - Minimização Art. 6º, III), convertendo a coordenada em rótulo semântico ("Zona_Comercial" / "Via_Expressa") na borda (Edge) e descartando o dado bruto da memória RAM antes do envio à LLM externa (Zero-Storage e Art. 33).',
            lgpd_diagnostics: JSON.stringify({
                paradoxes: [
                    { name: 'Paradoxo da Inferência', article: 'Art. 6º, III (Necessidade/Minimização)', desc: 'Coleta de múltiplos sensores sem justificativa de fusão técnica estrita e granularidade excessiva.' },
                    { name: 'Paradoxo da Proatividade', article: 'Art. 6º, I e II (Finalidade e Adequação)', desc: 'Monitoramento contínuo em segundo plano quando o usuário passa a maior parte do dia parado.' },
                    { name: 'Paradoxo do Largo Contexto e Nuvem Externa', article: 'Art. 33 (Transf. Internacional) e Art. 46 (Segurança)', desc: 'Envio de janelas de telemetria contendo PII e coordenadas exatas a data centers estrangeiros.' }
                ],
                severity: 'ALTA'
            }),
            accountability_matrix: JSON.stringify([
                { variable: 'Coordenada GPS Bruta (Lat/Long)', treatment: 'Degradação para 100m e conversão na borda para rótulo semântico ("Zona_Comercial")', justification: 'Art. 6º, III (Minimização e Adequação de Granularidade)' },
                { variable: 'Telemetria do Acelerômetro', treatment: 'Amostragem em RAM na borda; descarte imediato após checar velocidade > 15km/h', justification: 'Art. 15 (Término do tratamento pontual efêmero)' },
                { variable: 'Prompt enviado à LLM Internacional', treatment: 'Sanitização via PrivacyGuard: envio exclusivo de rótulos semânticos e identificador pseudo-anônimo', justification: 'Art. 33 e Art. 46 (Conformidade em Transferência Internacional)' }
            ]),
            order_index: 1
        },
        {
            id: 'scn_02',
            code: 'CEN-02',
            title: 'Monitoramento de Estresse Cardíaco e Saúde Corporativa',
            actor: 'Trabalhador em Home-Office / Paciente',
            context_where: 'Ambiente de trabalho domiciliar / Escritório',
            context_who: 'Dados biométricos de saúde (frequência cardíaca e variabilidade R-R)',
            context_when: 'Período laboral ativo (segunda a sexta, 8h às 18h)',
            context_what: 'Detecção precoce de Burnout e picos de estresse emocional',
            sensors: 'Smartwatch (Sensor PPG de batimentos), Microfone ambiental (decibéis), Teclado (frequência de digitação)',
            qoc_desired: 'Amostragem de 100 Hz no PPG e gravação de áudio contínuo em alta fidelidade',
            trigger_condition: 'Detecção de variabilidade cardíaca (HRV) abaixo de 20ms combinada com digitação rápida',
            expected_inference: 'Inferir situação de alto nível "Episódio_De_Estresse_Agudo"',
            external_llm_flag: 1,
            raw_requirement: 'REQ-02: O aplicativo deve capturar ininterruptamente os batimentos cardíacos, digitação e gravar o som ambiente do usuário, transmitindo as gravações e métricas para uma LLM médica na nuvem a fim de diagnosticar estresse em tempo real.',
            status: 'conflict_detected',
            negotiated_requirement: null,
            lgpd_diagnostics: JSON.stringify({
                paradoxes: [
                    { name: 'Paradoxo da Proatividade & Dados Sensíveis', article: 'Art. 11 (Dados Pessoais Sensíveis) e Art. 6º, III', desc: 'Captura ininterrupta de dados biométricos de saúde e gravação de áudio ambiente viola frontalmente o consentimento específico e a proporcionalidade.' },
                    { name: 'Paradoxo do Largo Contexto', article: 'Art. 33 (Transferência Internacional)', desc: 'Streaming de áudio e biometria para LLM em nuvem externa expõe conversas confidenciais de terceiros sem base legal.' }
                ],
                severity: 'CRÍTICA'
            }),
            accountability_matrix: null,
            order_index: 2
        },
        {
            id: 'scn_03',
            code: 'CEN-03',
            title: 'Resumo e Ações de Reuniões Corporativas com LLMs',
            actor: 'Gerente de Projetos e Participantes da Reunião',
            context_where: 'Sala de Conferência Física ou Virtual (Google Meet / Zoom)',
            context_who: 'Identificação por voz de todos os participantes e convidados da chamada',
            context_when: 'Durante eventos agendados no Calendário Corporativo',
            context_what: 'Discussão de decisões estratégicas e atribuição de tarefas',
            sensors: 'Microfone corporativo, Leitura de calendário, Logs de presença em rede Wi-Fi',
            qoc_desired: 'Transcrição fonética verbatim em tempo real com separação por diarização de voz',
            trigger_condition: 'Início do evento com status "Em Andamento" na agenda e presença de 2+ pessoas',
            expected_inference: 'Inferir contexto "Reunião_Estratégica_Ativa" para sintetizar atas e pendências',
            external_llm_flag: 1,
            raw_requirement: 'REQ-03: O sistema deve escutar e gravar todas as conversas do ambiente corporativo sempre que detectar pessoas na sala, enviando todo o fluxo de voz diretamente para um provedor externo de LLM para sumarizar tarefas.',
            status: 'conflict_detected',
            negotiated_requirement: null,
            lgpd_diagnostics: JSON.stringify({
                paradoxes: [
                    { name: 'Paradoxo da Proatividade', article: 'Art. 6º, I (Finalidade Específica) e Art. 6º, VI (Transparência)', desc: 'Escuta passiva indiscriminada em segundo plano grava terceiros que não consentiram.' },
                    { name: 'Paradoxo da Nuvem Externa', article: 'Art. 33 e Art. 46 (Segurança e Segredo de Negócio)', desc: 'Dados corporativos e nomes de clientes enviados a servidores sem retenção zero.' }
                ],
                severity: 'ALTA'
            }),
            accountability_matrix: null,
            order_index: 3
        },
        {
            id: 'scn_04',
            code: 'CEN-04',
            title: 'Ofertas Hiperlocais por Geofencing Comercial',
            actor: 'Consumidor em Centro Comercial / Shopping',
            context_where: 'Espaço físico de lojas varejistas (raio de 10 metros)',
            context_who: 'ID de anúncio do smartphone (GAID/IDFA) e preferências de consumo',
            context_when: 'Horário de circulação no centro comercial',
            context_what: 'Permanência em frente a vitrines de produtos específicos',
            sensors: 'BLE Beacons (Bluetooth Low Energy), Wi-Fi BSSID Scanning, Barômetro',
            qoc_desired: 'Precisão submétrica de permanência em cada vitrine',
            trigger_condition: 'Permanência estática > 120 segundos no alcance de um beacon específico',
            expected_inference: 'Inferir situação "Interesse_De_Compra_Iminente" para disparar cupom personalizado',
            external_llm_flag: 1,
            raw_requirement: 'REQ-04: O app deve escanear em segundo plano constantemente os sinais Bluetooth e redes Wi-Fi da vizinhança sem avisar o usuário, enviando o histórico completo de movimentação física para servidores internacionais de publicidade direcionada.',
            status: 'conflict_detected',
            negotiated_requirement: null,
            lgpd_diagnostics: JSON.stringify({
                paradoxes: [
                    { name: 'Paradoxo da Inferência e Proatividade', article: 'Art. 6º, I, II, III (Minimização e Não-Discriminação)', desc: 'Varredura silenciosa e contínua em background de redes de terceiros sem opt-in explícito.' },
                    { name: 'Paradoxo da Transferência Internacional', article: 'Art. 33 (Transferência de Dados Pessoais de Geolocalização)', desc: 'Série histórica de deslocamento físico compartilhada com corretores de dados (data brokers).' }
                ],
                severity: 'CRÍTICA'
            }),
            accountability_matrix: null,
            order_index: 4
        }
    ];

    const insertScenario = db.prepare(`
        INSERT INTO scenarios (
            id, project_id, user_id, code, title, actor,
            context_where, context_who, context_when, context_what,
            sensors, qoc_desired, trigger_condition, expected_inference,
            external_llm_flag, raw_requirement, status,
            negotiated_requirement, lgpd_diagnostics, accountability_matrix, order_index
        ) VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?
        )
    `);

    for (const scn of initialScenarios) {
        insertScenario.run(
            scn.id, demoProjectId, demoUserId, scn.code, scn.title, scn.actor,
            scn.context_where, scn.context_who, scn.context_when, scn.context_what,
            scn.sensors, scn.qoc_desired, scn.trigger_condition, scn.expected_inference,
            scn.external_llm_flag, scn.raw_requirement, scn.status,
            scn.negotiated_requirement, scn.lgpd_diagnostics, scn.accountability_matrix, scn.order_index
        );
    }

    console.log('✅ Demo database seeded successfully!');
}

module.exports = {
    db,
    initDb
};
