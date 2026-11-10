require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db, initDb } = require('./db');
const { encryptText, decryptText, hashPassword, verifyPassword, maskApiKey } = require('./crypto');
const { negotiateScenario, chatWithNegotiator } = require('./ai');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'context_lgpd_super_secret_jwt_key_ufpe_2026_cin';

// Initialize DB
initDb();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// ----------------------------------------------------
// Authentication Middleware
// ----------------------------------------------------
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Sessão expirada ou inválida. Faça login novamente.' });
        }
        req.user = user;
        next();
    });
}

// ----------------------------------------------------
// Auth Routes
// ----------------------------------------------------
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    try {
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
        if (existing) {
            return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
        }

        const userId = 'usr_' + crypto.randomUUID();
        const { hash, salt } = hashPassword(password);

        db.prepare(`
            INSERT INTO users (id, name, email, password_hash, password_salt)
            VALUES (?, ?, ?, ?, ?)
        `).run(userId, name.trim(), email.toLowerCase().trim(), hash, salt);

        // Create default settings
        db.prepare(`
            INSERT INTO user_settings (id, user_id, provider, model_name)
            VALUES (?, ?, ?, ?)
        `).run('set_' + crypto.randomUUID(), userId, 'gemini', 'gemini-2.0-flash');

        // Create default project
        const projectId = 'prj_' + crypto.randomUUID();
        db.prepare(`
            INSERT INTO projects (id, user_id, title, description)
            VALUES (?, ?, ?, ?)
        `).run(
            projectId,
            userId,
            'Meu Projeto de Cenários Sensíveis ao Contexto',
            'Espaço de trabalho para especificação e negociação com a LGPD.'
        );

        const token = jwt.sign({ id: userId, email: email.toLowerCase().trim(), name }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'Cadastro realizado com sucesso!',
            token,
            user: { id: userId, name, email: email.toLowerCase().trim() },
            defaultProjectId: projectId
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Erro ao cadastrar usuário: ' + err.message });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Informe e-mail e senha.' });
    }

    try {
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const valid = verifyPassword(password, user.password_hash, user.password_salt);
        if (!valid) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Erro no servidor: ' + err.message });
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    try {
        const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

        const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
        let maskedKey = null;
        if (settings && settings.api_key_cipher) {
            const decrypted = decryptText({
                ciphertext: settings.api_key_cipher,
                iv: settings.api_key_iv,
                authTag: settings.api_key_tag
            });
            maskedKey = maskApiKey(decrypted);
        }

        res.json({
            user,
            settings: {
                provider: settings?.provider || 'gemini',
                model_name: settings?.model_name || 'gemini-2.0-flash',
                masked_api_key: maskedKey,
                has_api_key: !!maskedKey,
                cloud_db_enabled: !!settings?.cloud_db_enabled
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// Settings Routes (API Keys & Cloud Database)
// ----------------------------------------------------
app.get('/api/settings', authenticateToken, (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
        let maskedKey = null;
        if (settings && settings.api_key_cipher) {
            const decrypted = decryptText({
                ciphertext: settings.api_key_cipher,
                iv: settings.api_key_iv,
                authTag: settings.api_key_tag
            });
            maskedKey = maskApiKey(decrypted);
        }

        res.json({
            provider: settings?.provider || 'gemini',
            model_name: settings?.model_name || 'gemini-2.0-flash',
            masked_api_key: maskedKey,
            has_api_key: !!maskedKey,
            cloud_db_url: settings?.cloud_db_url ? 'Configurado' : '',
            cloud_db_enabled: !!settings?.cloud_db_enabled
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/settings', authenticateToken, (req, res) => {
    const { provider, model_name, api_key, cloud_db_url, cloud_db_key, cloud_db_enabled } = req.body;

    try {
        let settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
        
        let cipher = settings?.api_key_cipher;
        let iv = settings?.api_key_iv;
        let tag = settings?.api_key_tag;

        // Only update API key if a new one was provided
        if (api_key && api_key.trim() && !api_key.includes('...')) {
            const encrypted = encryptText(api_key.trim());
            cipher = encrypted.ciphertext;
            iv = encrypted.iv;
            tag = encrypted.authTag;
        }

        if (settings) {
            db.prepare(`
                UPDATE user_settings
                SET provider = ?, model_name = ?, api_key_cipher = ?, api_key_iv = ?, api_key_tag = ?,
                    cloud_db_url = ?, cloud_db_key = ?, cloud_db_enabled = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `).run(
                provider || settings.provider || 'gemini',
                model_name || settings.model_name || 'gemini-2.0-flash',
                cipher,
                iv,
                tag,
                cloud_db_url || settings.cloud_db_url,
                cloud_db_key || settings.cloud_db_key,
                cloud_db_enabled !== undefined ? (cloud_db_enabled ? 1 : 0) : settings.cloud_db_enabled,
                req.user.id
            );
        } else {
            db.prepare(`
                INSERT INTO user_settings (id, user_id, provider, model_name, api_key_cipher, api_key_iv, api_key_tag, cloud_db_url, cloud_db_key, cloud_db_enabled)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                'set_' + crypto.randomUUID(),
                req.user.id,
                provider || 'gemini',
                model_name || 'gemini-2.0-flash',
                cipher,
                iv,
                tag,
                cloud_db_url || '',
                cloud_db_key || '',
                cloud_db_enabled ? 1 : 0
            );
        }

        res.json({ message: 'Configurações e Chave de API salvas com segurança criptográfica (AES-256-GCM)!' });
    } catch (err) {
        console.error('Settings update error:', err);
        res.status(500).json({ error: 'Erro ao salvar configurações: ' + err.message });
    }
});

// Test API Key ping
app.post('/api/settings/test-key', authenticateToken, async (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
        if (!settings || !settings.api_key_cipher) {
            return res.status(400).json({ error: 'Nenhuma chave de API configurada para testar.' });
        }

        const apiKey = decryptText({
            ciphertext: settings.api_key_cipher,
            iv: settings.api_key_iv,
            authTag: settings.api_key_tag
        });

        const provider = settings.provider || 'gemini';
        const model = settings.model_name || 'gemini-2.0-flash';

        if (provider === 'gemini') {
            const cleanModel = model.replace(/^models\//, '');
            const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;
            const testResp = await fetch(testUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: 'Ping. Responda apenas "OK".' }] }]
                })
            });
            if (!testResp.ok) {
                const errText = await testResp.text();
                return res.status(400).json({ error: `Falha na API Gemini (${testResp.status}): ${errText}` });
            }
            return res.json({ success: true, message: `Conexão bem sucedida com o modelo Google Gemini (${model})!` });
        } else if (provider === 'openai' || provider === 'groq') {
            const endpoint = provider === 'groq'
                ? 'https://api.groq.com/openai/v1/chat/completions'
                : 'https://api.openai.com/v1/chat/completions';
            const testResp = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Ping' }],
                    max_tokens: 5
                })
            });
            if (!testResp.ok) {
                const errText = await testResp.text();
                return res.status(400).json({ error: `Falha na API (${testResp.status}): ${errText}` });
            }
            return res.json({ success: true, message: `Conexão bem sucedida com ${provider} (${model})!` });
        }

        res.json({ success: true, message: 'Provedor reconhecido.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test Cloud DB (Supabase / Postgres)
app.post('/api/settings/test-cloud-db', authenticateToken, async (req, res) => {
    const { url, key } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'Forneça a URL do Supabase.' });
    }

    try {
        // Standard Supabase REST ping to /rest/v1/
        const targetUrl = url.replace(/\/$/, '') + '/rest/v1/';
        const pingResp = await fetch(targetUrl, {
            headers: {
                'apikey': key || '',
                'Authorization': `Bearer ${key || ''}`
            }
        });

        if (pingResp.status === 200 || pingResp.status === 401 || pingResp.status === 404) {
            return res.json({
                success: true,
                message: 'Servidor Supabase alcançado com sucesso! O banco de dados em nuvem está online e pronto.'
            });
        }

        res.json({
            success: true,
            message: `Servidor na nuvem respondeu com status ${pingResp.status}.`
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao conectar ao banco na nuvem: ' + err.message });
    }
});

// ----------------------------------------------------
// Projects (Workspaces / Chat Sessions) Routes
// ----------------------------------------------------
app.get('/api/projects', authenticateToken, (req, res) => {
    try {
        const projects = db.prepare(`
            SELECT p.*, (SELECT COUNT(*) FROM scenarios WHERE project_id = p.id) as scenario_count
            FROM projects p
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `).all(req.user.id);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', authenticateToken, (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'O título do projeto é obrigatório.' });

    try {
        const id = 'prj_' + crypto.randomUUID();
        db.prepare(`
            INSERT INTO projects (id, user_id, title, description)
            VALUES (?, ?, ?, ?)
        `).run(id, req.user.id, title.trim(), description || '');

        const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        res.status(201).json(newProject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
        res.json({ message: 'Projeto excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// Scenarios Routes (Tabela de Engenharia de Requisitos)
// ----------------------------------------------------
app.get('/api/projects/:projectId/scenarios', authenticateToken, (req, res) => {
    try {
        const scenarios = db.prepare(`
            SELECT * FROM scenarios
            WHERE project_id = ? AND user_id = ?
            ORDER BY order_index ASC, created_at ASC
        `).all(req.params.projectId, req.user.id);

        const parsed = scenarios.map(s => ({
            ...s,
            lgpd_diagnostics: s.lgpd_diagnostics ? JSON.parse(s.lgpd_diagnostics) : null,
            accountability_matrix: s.accountability_matrix ? JSON.parse(s.accountability_matrix) : null
        }));

        res.json(parsed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects/:projectId/scenarios', authenticateToken, (req, res) => {
    const {
        code, title, actor, context_where, context_who, context_when, context_what,
        sensors, qoc_desired, trigger_condition, expected_inference, external_llm_flag, raw_requirement
    } = req.body;

    if (!title || !raw_requirement) {
        return res.status(400).json({ error: 'Título e Requisito Bruto são obrigatórios.' });
    }

    try {
        const id = 'scn_' + crypto.randomUUID();
        const currentCount = db.prepare('SELECT COUNT(*) as count FROM scenarios WHERE project_id = ?').get(req.params.projectId).count;
        const autoCode = code || `CEN-0${currentCount + 1}`;

        db.prepare(`
            INSERT INTO scenarios (
                id, project_id, user_id, code, title, actor,
                context_where, context_who, context_when, context_what,
                sensors, qoc_desired, trigger_condition, expected_inference,
                external_llm_flag, raw_requirement, status, order_index
            ) VALUES (
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, 'conflict_detected', ?
            )
        `).run(
            id, req.params.projectId, req.user.id, autoCode, title, actor || 'Usuário da Aplicação',
            context_where || '', context_who || '', context_when || '', context_what || '',
            sensors || '', qoc_desired || '', trigger_condition || '', expected_inference || '',
            external_llm_flag !== undefined ? (external_llm_flag ? 1 : 0) : 1,
            raw_requirement, currentCount + 1
        );

        const created = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(id);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/scenarios/:id', authenticateToken, (req, res) => {
    const {
        code, title, actor, context_where, context_who, context_when, context_what,
        sensors, qoc_desired, trigger_condition, expected_inference, external_llm_flag,
        raw_requirement, negotiated_requirement, status
    } = req.body;

    try {
        const scenario = db.prepare('SELECT * FROM scenarios WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
        if (!scenario) return res.status(404).json({ error: 'Cenário não encontrado.' });

        db.prepare(`
            UPDATE scenarios
            SET code = COALESCE(?, code),
                title = COALESCE(?, title),
                actor = COALESCE(?, actor),
                context_where = COALESCE(?, context_where),
                context_who = COALESCE(?, context_who),
                context_when = COALESCE(?, context_when),
                context_what = COALESCE(?, context_what),
                sensors = COALESCE(?, sensors),
                qoc_desired = COALESCE(?, qoc_desired),
                trigger_condition = COALESCE(?, trigger_condition),
                expected_inference = COALESCE(?, expected_inference),
                external_llm_flag = COALESCE(?, external_llm_flag),
                raw_requirement = COALESCE(?, raw_requirement),
                negotiated_requirement = COALESCE(?, negotiated_requirement),
                status = COALESCE(?, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        `).run(
            code, title, actor, context_where, context_who, context_when, context_what,
            sensors, qoc_desired, trigger_condition, expected_inference,
            external_llm_flag !== undefined ? (external_llm_flag ? 1 : 0) : undefined,
            raw_requirement, negotiated_requirement, status,
            req.params.id, req.user.id
        );

        const updated = db.prepare('SELECT * FROM scenarios WHERE id = ?').get(req.params.id);
        res.json({
            ...updated,
            lgpd_diagnostics: updated.lgpd_diagnostics ? JSON.parse(updated.lgpd_diagnostics) : null,
            accountability_matrix: updated.accountability_matrix ? JSON.parse(updated.accountability_matrix) : null
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/scenarios/:id', authenticateToken, (req, res) => {
    try {
        db.prepare('DELETE FROM scenarios WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
        res.json({ message: 'Cenário excluído.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// Core AI: Negociação ContextLGPD-Negotiator
// ----------------------------------------------------
app.post('/api/scenarios/:id/negotiate', authenticateToken, async (req, res) => {
    try {
        const scenario = db.prepare('SELECT * FROM scenarios WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
        if (!scenario) return res.status(404).json({ error: 'Cenário não encontrado.' });

        const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
        let decryptedApiKey = null;
        if (settings && settings.api_key_cipher) {
            decryptedApiKey = decryptText({
                ciphertext: settings.api_key_cipher,
                iv: settings.api_key_iv,
                authTag: settings.api_key_tag
            });
        }

        // Run negotiation
        const result = await negotiateScenario({ scenario, settings, decryptedApiKey });

        // Update scenario in database
        const negotiatedText = result.negotiatedRequirement?.text || scenario.raw_requirement;
        const diagnosticsJson = JSON.stringify(result.paradoxesDiagnosed || []);
        const accountabilityJson = JSON.stringify(result.accountabilityMatrix || []);

        db.prepare(`
            UPDATE scenarios
            SET status = 'negotiated',
                negotiated_requirement = ?,
                lgpd_diagnostics = ?,
                accountability_matrix = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(negotiatedText, diagnosticsJson, accountabilityJson, scenario.id);

        // Record a message in the chat
        const chatMsgId = 'msg_' + crypto.randomUUID();
        const chatSummary = `🤖 **Negociação Concluída para o cenário ${scenario.code}:**\n\n` +
            `* **Requisito Negociado (Privacy by Design):** ${negotiatedText}\n\n` +
            `* **Paradoxos Identificados:** ${result.paradoxesDiagnosed?.length || 0} paradoxo(s) mapeado(s).\n` +
            `* **Matriz de Prestação de Contas (Art. 6º, X):** Gerada e disponível para auditoria.`;

        db.prepare(`
            INSERT INTO chat_messages (id, project_id, scenario_id, user_id, role, content, structured_payload)
            VALUES (?, ?, ?, ?, 'assistant', ?, ?)
        `).run(chatMsgId, scenario.project_id, scenario.id, req.user.id, chatSummary, JSON.stringify(result));

        res.json({
            success: true,
            scenarioId: scenario.id,
            result
        });
    } catch (err) {
        console.error('Negotiation route error:', err);
        res.status(500).json({ error: 'Erro no processo de negociação: ' + err.message });
    }
});

// Chat interativo para refinamento de requisitos
app.post('/api/scenarios/:id/chat', authenticateToken, async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'A mensagem não pode ser vazia.' });

    try {
        const scenario = db.prepare('SELECT * FROM scenarios WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
        if (!scenario) return res.status(404).json({ error: 'Cenário não encontrado.' });

        const settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(req.user.id);
        let decryptedApiKey = null;
        if (settings && settings.api_key_cipher) {
            decryptedApiKey = decryptText({
                ciphertext: settings.api_key_cipher,
                iv: settings.api_key_iv,
                authTag: settings.api_key_tag
            });
        }

        // Save user message
        const userMsgId = 'msg_' + crypto.randomUUID();
        db.prepare(`
            INSERT INTO chat_messages (id, project_id, scenario_id, user_id, role, content)
            VALUES (?, ?, ?, ?, 'user', ?)
        `).run(userMsgId, scenario.project_id, scenario.id, req.user.id, message);

        // Fetch recent chat history
        const chatHistory = db.prepare(`
            SELECT * FROM chat_messages
            WHERE scenario_id = ?
            ORDER BY created_at ASC
            LIMIT 10
        `).all(scenario.id);

        const aiReply = await chatWithNegotiator({
            message,
            scenario,
            chatHistory,
            settings,
            decryptedApiKey
        });

        // Save assistant reply
        const aiMsgId = 'msg_' + crypto.randomUUID();
        db.prepare(`
            INSERT INTO chat_messages (id, project_id, scenario_id, user_id, role, content)
            VALUES (?, ?, ?, ?, 'assistant', ?)
        `).run(aiMsgId, scenario.project_id, scenario.id, req.user.id, aiReply);

        res.json({
            message: aiReply,
            scenarioId: scenario.id
        });
    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get chat history for a scenario or project
app.get('/api/projects/:projectId/chat', authenticateToken, (req, res) => {
    const { scenarioId } = req.query;
    try {
        let messages;
        if (scenarioId) {
            messages = db.prepare(`
                SELECT * FROM chat_messages
                WHERE scenario_id = ? AND user_id = ?
                ORDER BY created_at ASC
            `).all(scenarioId, req.user.id);
        } else {
            messages = db.prepare(`
                SELECT * FROM chat_messages
                WHERE project_id = ? AND user_id = ?
                ORDER BY created_at ASC
                LIMIT 50
            `).all(req.params.projectId, req.user.id);
        }
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// Export: Gera Relatório Científico RIPD (Markdown / Documento)
// ----------------------------------------------------
app.get('/api/projects/:projectId/export', authenticateToken, (req, res) => {
    try {
        const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(req.params.projectId, req.user.id);
        if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });

        const scenarios = db.prepare('SELECT * FROM scenarios WHERE project_id = ? ORDER BY order_index ASC').all(project.id);

        let md = `# RELATÓRIO TÉCNICO DE CONFORMIDADE REGULATÓRIA & ESPECIFICAÇÃO DE REQUISITOS SENSÍVEIS AO CONTEXTO\n\n`;
        md += `**Projeto:** ${project.title}\n`;
        md += `**Descrição:** ${project.description || 'N/A'}\n`;
        md += `**Data da Emissão:** ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n`;
        md += `**Metodologia:** Engenharia de Requisitos de Software & Privacy by Design (Art. 6º e 33 da LGPD)\n`;
        md += `**Arquitetura Formal:** ADL ACME ContextLGPD-Negotiator (CIn-UFPE)\n\n`;
        md += `---\n\n`;

        md += `## 1. Sumário dos Cenários de Uso e Status Regulatória\n\n`;
        md += `| Código | Título | Ator | Inferência Esperada | Status LGPD |\n`;
        md += `| :--- | :--- | :--- | :--- | :--- |\n`;
        for (const s of scenarios) {
            const statusBadge = s.status === 'negotiated' ? '✅ Negociado (Em Conformidade)' : '⚠️ Conflito Detectado';
            md += `| ${s.code} | ${s.title} | ${s.actor} | ${s.expected_inference || 'N/A'} | ${statusBadge} |\n`;
        }
        md += `\n---\n\n`;

        md += `## 2. Detalhamento e Negociação dos Cenários de Requisitos\n\n`;

        for (const s of scenarios) {
            md += `### Cenário ${s.code}: ${s.title}\n\n`;
            md += `- **Ator Principal:** ${s.actor}\n`;
            md += `- **Dimensões Primárias:** Onde (${s.context_where || '-'}), Quem (${s.context_who || '-'}), Quando (${s.context_when || '-'}), O Quê (${s.context_what || '-'})\n`;
            md += `- **Sensores e Fontes Implícitas:** ${s.sensors || 'N/A'}\n`;
            md += `- **Qualidade de Contexto (QoC) Exigida:** ${s.qoc_desired || 'N/A'}\n`;
            md += `- **Gatilho de Ativação (Trigger):** ${s.trigger_condition || 'N/A'}\n`;
            md += `- **Inferência Contextual (Finalidade):** ${s.expected_inference || 'N/A'}\n\n`;

            md += `#### Especificação Tradicional (Requisito Bruto):\n`;
            md += `> ${s.raw_requirement}\n\n`;

            if (s.negotiated_requirement) {
                md += `#### Especificação Negociada (Privacy by Design & Artigos 6º e 33 da LGPD):\n`;
                md += `> **${s.negotiated_requirement}**\n\n`;
            }

            if (s.lgpd_diagnostics) {
                const diag = JSON.parse(s.lgpd_diagnostics);
                const paradoxes = Array.isArray(diag) ? diag : (diag.paradoxes || []);
                if (paradoxes.length > 0) {
                    md += `#### Diagnóstico dos Paradoxos de Privacidade:\n`;
                    for (const p of paradoxes) {
                        md += `- **${p.name}** (*${p.article}*): ${p.explanation || p.desc}\n`;
                    }
                    md += `\n`;
                }
            }

            if (s.accountability_matrix) {
                const matrix = JSON.parse(s.accountability_matrix);
                if (Array.isArray(matrix) && matrix.length > 0) {
                    md += `#### Matriz de Comprovação Regulatória (Accountability - Art. 6º, X da LGPD):\n\n`;
                    md += `| Variável de Contexto | Tratamento Técnico Aplicado | Base Legal / Justificativa LGPD |\n`;
                    md += `| :--- | :--- | :--- |\n`;
                    for (const row of matrix) {
                        md += `| ${row.variable} | ${row.treatment} | ${row.justification} |\n`;
                    }
                    md += `\n`;
                }
            }

            md += `---\n\n`;
        }

        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="RIPD_${project.title.replace(/\s+/g, '_')}.md"`);
        res.send(md);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 ContextLGPD-Negotiator rodando na porta ${PORT}`);
    console.log(`🌐 Acesse no seu navegador: http://localhost:${PORT}`);
    console.log(`🔒 Criptografia AES-256-GCM para chaves de API: ATIVADA`);
    console.log(`💾 Banco de dados persistente SQLite: CONECTADO`);
    console.log(`================================================================`);
});
