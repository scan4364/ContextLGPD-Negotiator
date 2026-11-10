/**
 * ContextLGPD-Negotiator Frontend Application
 * Interage com o backend para gerenciar cenários de requisitos sensíveis
 * ao contexto e intermediar a conformidade com a LGPD via IA.
 */

// Application State
const state = {
    token: localStorage.getItem('context_lgpd_token') || null,
    user: null,
    settings: null,
    projects: [],
    currentProject: null,
    scenarios: [],
    activeScenario: null,
    activeDrawerTab: 'diagnostics'
};

// API Base Helper
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        // Token expired or invalid
        logout();
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || `Erro na requisição: ${response.status}`);
    }

    return data;
}

// -------------------------------------------------------------------
// Initialization
// -------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    if (state.token) {
        loadInitialData();
    } else {
        showAuthView();
    }
});

function setupEventListeners() {
    // Auth Tabs
    document.getElementById('tab-btn-login')?.addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('tab-btn-register')?.addEventListener('click', () => switchAuthTab('register'));

    // Forms
    document.getElementById('form-login')?.addEventListener('submit', handleLogin);
    document.getElementById('form-register')?.addEventListener('submit', handleRegister);
    document.getElementById('btn-fill-demo')?.addEventListener('click', fillDemoCredentials);
    document.getElementById('btn-logout')?.addEventListener('click', logout);

    // Project Dropdown
    document.getElementById('btn-project-dropdown')?.addEventListener('click', toggleProjectDropdown);
    document.getElementById('btn-modal-new-project')?.addEventListener('click', promptNewProject);

    // Settings Modal
    document.getElementById('btn-open-settings')?.addEventListener('click', () => openSettingsModal('api'));
    document.getElementById('status-db-pill')?.addEventListener('click', () => openSettingsModal('db'));
    document.getElementById('status-ai-pill')?.addEventListener('click', () => openSettingsModal('api'));
    document.getElementById('btn-close-settings-modal')?.addEventListener('click', closeSettingsModal);
    document.getElementById('modal-tab-api')?.addEventListener('click', () => switchSettingsTab('api'));
    document.getElementById('modal-tab-db')?.addEventListener('click', () => switchSettingsTab('db'));
    document.getElementById('form-settings-api')?.addEventListener('submit', handleSaveApiSettings);
    document.getElementById('btn-test-api-key')?.addEventListener('click', handleTestApiKey);
    document.getElementById('btn-test-cloud-db')?.addEventListener('click', handleTestCloudDb);
    document.getElementById('btn-copy-sql-schema')?.addEventListener('click', copySqlSchema);

    // Theory Modal
    document.getElementById('btn-open-theory-modal')?.addEventListener('click', openTheoryModal);
    document.getElementById('btn-show-paradoxes-guide')?.addEventListener('click', openTheoryModal);
    document.getElementById('btn-close-theory-modal')?.addEventListener('click', closeTheoryModal);

    // Scenario Modal
    document.getElementById('btn-add-scenario')?.addEventListener('click', () => openScenarioModal());
    document.getElementById('btn-close-scenario-modal')?.addEventListener('click', closeScenarioModal);
    document.getElementById('btn-cancel-scenario-modal')?.addEventListener('click', closeScenarioModal);
    document.getElementById('form-scenario')?.addEventListener('submit', handleSaveScenario);

    // Export
    document.getElementById('btn-export-markdown')?.addEventListener('click', handleExportMarkdown);

    // Drawer Tabs & Actions
    document.getElementById('btn-close-drawer')?.addEventListener('click', closeDrawer);
    document.getElementById('btn-re-negotiate')?.addEventListener('click', () => {
        if (state.activeScenario) negotiateScenario(state.activeScenario.id);
    });
    document.getElementById('tab-drawer-diagnostics')?.addEventListener('click', () => switchDrawerTab('diagnostics'));
    document.getElementById('tab-drawer-negotiated')?.addEventListener('click', () => switchDrawerTab('negotiated'));
    document.getElementById('tab-drawer-accountability')?.addEventListener('click', () => switchDrawerTab('accountability'));
    document.getElementById('tab-drawer-chat')?.addEventListener('click', () => switchDrawerTab('chat'));
    document.getElementById('form-drawer-chat')?.addEventListener('submit', handleSendChatMessage);
    document.getElementById('btn-copy-negotiated')?.addEventListener('click', handleCopyNegotiated);

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('project-dropdown-menu');
        const btn = document.getElementById('btn-project-dropdown');
        if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

// -------------------------------------------------------------------
// Auth Handlers
// -------------------------------------------------------------------
function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const loginTabBtn = document.getElementById('tab-btn-login');
    const registerTabBtn = document.getElementById('tab-btn-register');
    const errorBox = document.getElementById('auth-error-msg');

    if (errorBox) errorBox.classList.add('hidden');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTabBtn.className = 'flex-1 pb-3 text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 transition';
        registerTabBtn.className = 'flex-1 pb-3 text-sm font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-200 transition';
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerTabBtn.className = 'flex-1 pb-3 text-sm font-semibold text-indigo-400 border-b-2 border-indigo-500 transition';
        loginTabBtn.className = 'flex-1 pb-3 text-sm font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-200 transition';
    }
}

function fillDemoCredentials() {
    document.getElementById('login-email').value = 'pesquisador@cin.ufpe.br';
    document.getElementById('login-password').value = 'senha123';
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorBox = document.getElementById('auth-error-msg');
    const errorText = document.getElementById('auth-error-text');

    try {
        errorBox.classList.add('hidden');
        const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        state.token = data.token;
        state.user = data.user;
        localStorage.setItem('context_lgpd_token', data.token);

        await loadInitialData();
    } catch (err) {
        errorText.textContent = err.message;
        errorBox.classList.remove('hidden');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorBox = document.getElementById('auth-error-msg');
    const errorText = document.getElementById('auth-error-text');

    try {
        errorBox.classList.add('hidden');
        const data = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        state.token = data.token;
        state.user = data.user;
        localStorage.setItem('context_lgpd_token', data.token);

        await loadInitialData();
    } catch (err) {
        errorText.textContent = err.message;
        errorBox.classList.remove('hidden');
    }
}

function logout() {
    state.token = null;
    state.user = null;
    state.currentProject = null;
    state.scenarios = [];
    state.activeScenario = null;
    localStorage.removeItem('context_lgpd_token');
    showAuthView();
}

function showAuthView() {
    document.getElementById('view-auth').classList.remove('hidden');
    document.getElementById('view-workspace').classList.add('hidden');
    document.getElementById('nav-workspace-area').classList.add('hidden');
    document.getElementById('btn-open-settings').classList.add('hidden');
    document.getElementById('user-profile-wrapper').classList.add('hidden');
    document.getElementById('user-profile-wrapper').classList.remove('flex');
}

function showWorkspaceView() {
    document.getElementById('view-auth').classList.add('hidden');
    document.getElementById('view-workspace').classList.remove('hidden');
    document.getElementById('nav-workspace-area').classList.remove('hidden');
    document.getElementById('btn-open-settings').classList.remove('hidden');
    document.getElementById('user-profile-wrapper').classList.remove('hidden');
    document.getElementById('user-profile-wrapper').classList.add('flex');

    if (state.user) {
        document.getElementById('user-display-name').textContent = state.user.name;
        document.getElementById('user-avatar').textContent = (state.user.name || 'U').charAt(0).toUpperCase();
    }
}

// -------------------------------------------------------------------
// Data Loading
// -------------------------------------------------------------------
async function loadInitialData() {
    try {
        // Fetch current user & settings
        const me = await apiRequest('/api/auth/me');
        state.user = me.user;
        state.settings = me.settings;

        updateSettingsUI();
        showWorkspaceView();

        // Fetch projects
        await loadProjects();
    } catch (err) {
        console.error('Failed to load initial data:', err);
        showAuthView();
    }
}

function updateSettingsUI() {
    if (!state.settings) return;

    // AI Status Pill
    const aiText = document.getElementById('status-ai-text');
    aiText.textContent = state.settings.model_name || 'Gemini 2.0 Flash';

    // DB Status Pill
    const dbPill = document.getElementById('status-db-pill');
    const dbText = document.getElementById('status-db-text');
    if (state.settings.cloud_db_enabled) {
        dbText.textContent = '☁️ Supabase Nuvem';
        dbPill.className = 'flex items-center space-x-1.5 text-xs bg-sky-500/10 border border-sky-500/30 text-sky-400 px-2.5 py-1 rounded-full cursor-pointer hover:bg-sky-500/20';
    } else {
        dbText.textContent = '🟢 SQLite Local';
        dbPill.className = 'flex items-center space-x-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full cursor-pointer hover:bg-emerald-500/20';
    }

    // Modal settings inputs
    const providerSelect = document.getElementById('setting-provider');
    const modelSelect = document.getElementById('setting-model');
    const maskedKeyLabel = document.getElementById('label-masked-key');

    if (providerSelect) providerSelect.value = state.settings.provider || 'gemini';
    if (modelSelect) modelSelect.value = state.settings.model_name || 'gemini-2.0-flash';
    if (maskedKeyLabel) {
        maskedKeyLabel.textContent = state.settings.has_api_key
            ? `Chave Atual: ${state.settings.masked_api_key}`
            : 'Nenhuma chave cadastrada (usando motor simulado)';
    }
}

async function loadProjects() {
    try {
        const projects = await apiRequest('/api/projects');
        state.projects = projects;

        if (projects.length > 0) {
            selectProject(projects[0]);
        } else {
            document.getElementById('current-project-title').textContent = 'Nenhum projeto';
        }

        renderProjectsList();
    } catch (err) {
        console.error('Error loading projects:', err);
    }
}

function renderProjectsList() {
    const list = document.getElementById('project-list-items');
    if (!list) return;

    list.innerHTML = state.projects.map(p => `
        <button class="w-full text-left text-xs text-slate-200 hover:text-white p-2 rounded-lg hover:bg-slate-700/60 transition flex items-center justify-between ${state.currentProject?.id === p.id ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : ''}" onclick="selectProjectById('${p.id}')">
            <span class="truncate">${p.title}</span>
            <span class="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">${p.scenario_count || 0}</span>
        </button>
    `).join('');
}

window.selectProjectById = function(id) {
    const p = state.projects.find(x => x.id === id);
    if (p) selectProject(p);
    document.getElementById('project-dropdown-menu').classList.add('hidden');
};

function selectProject(project) {
    state.currentProject = project;
    document.getElementById('current-project-title').textContent = project.title;
    renderProjectsList();
    closeDrawer();
    loadScenarios();
}

function toggleProjectDropdown() {
    const menu = document.getElementById('project-dropdown-menu');
    menu.classList.toggle('hidden');
}

async function promptNewProject() {
    const title = prompt('Digite o título do novo projeto de requisitos:');
    if (!title || !title.trim()) return;

    try {
        const newProj = await apiRequest('/api/projects', {
            method: 'POST',
            body: JSON.stringify({ title: title.trim() })
        });
        state.projects.unshift(newProj);
        selectProject(newProj);
    } catch (err) {
        alert('Erro ao criar projeto: ' + err.message);
    }
}

// -------------------------------------------------------------------
// Scenarios Management & Table Rendering
// -------------------------------------------------------------------
async function loadScenarios() {
    if (!state.currentProject) return;

    try {
        const scenarios = await apiRequest(`/api/projects/${state.currentProject.id}/scenarios`);
        state.scenarios = scenarios;
        renderScenariosTable();
    } catch (err) {
        console.error('Error loading scenarios:', err);
    }
}

function renderScenariosTable() {
    const tbody = document.getElementById('scenarios-table-body');
    const badge = document.getElementById('scenarios-count-badge');

    badge.textContent = `${state.scenarios.length} cenário(s) cadastrado(s)`;

    if (state.scenarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="p-8 text-center text-slate-400">
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <i data-lucide="file-question" class="w-8 h-8 text-slate-500"></i>
                        <p class="font-medium">Nenhum cenário neste projeto ainda.</p>
                        <p class="text-[11px] text-slate-500">Clique em "+ Novo Cenário" para cadastrar seu primeiro cenário sensível ao contexto.</p>
                    </div>
                </td>
            </tr>
        `;
        lucide.createIcons();
        return;
    }

    tbody.innerHTML = state.scenarios.map(s => {
        const isNegotiated = s.status === 'negotiated';
        const statusBadge = isNegotiated
            ? `<span class="inline-flex items-center space-x-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full"><i data-lucide="shield-check" class="w-3 h-3"></i><span>Negociado</span></span>`
            : `<span class="inline-flex items-center space-x-1 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full"><i data-lucide="alert-triangle" class="w-3 h-3"></i><span>Conflito</span></span>`;

        const isRowActive = state.activeScenario?.id === s.id;

        return `
            <tr class="transition hover:bg-slate-800/40 ${isRowActive ? 'bg-indigo-950/30 border-l-2 border-indigo-500' : ''}">
                <td class="p-3 text-center font-mono font-bold text-indigo-400">${s.code}</td>
                <td class="p-3">
                    <div class="font-semibold text-white">${s.title}</div>
                    <div class="text-[11px] text-slate-400">Ator: <span class="text-slate-300 font-medium">${s.actor}</span></div>
                </td>
                <td class="p-3">
                    <div class="space-y-0.5 text-[11px]">
                        <div><b class="text-slate-400">Onde:</b> ${s.context_where || '-'}</div>
                        <div><b class="text-slate-400">Quem:</b> ${s.context_who || '-'}</div>
                        <div><b class="text-slate-400">Quando:</b> ${s.context_when || '-'}</div>
                        <div><b class="text-slate-400">O Quê:</b> ${s.context_what || '-'}</div>
                    </div>
                </td>
                <td class="p-3">
                    <span class="inline-block bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] leading-tight">
                        ${s.sensors || 'Não informado'}
                    </span>
                </td>
                <td class="p-3 text-[11px] text-slate-300">${s.qoc_desired || '-'}</td>
                <td class="p-3 text-[11px] font-mono text-amber-300/90">${s.trigger_condition || '-'}</td>
                <td class="p-3 text-[11px] text-indigo-200">${s.expected_inference || '-'}</td>
                <td class="p-3 text-center">${statusBadge}</td>
                <td class="p-3 text-center">
                    <div class="flex items-center justify-center space-x-1.5">
                        <button onclick="handleNegotiateClick('${s.id}')" class="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg text-xs transition shadow-sm" title="Negociar com IA (ContextLGPD-Negotiator)">
                            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="openScenarioModal('${s.id}')" class="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-xs transition" title="Editar Cenário">
                            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="openDrawerForScenario('${s.id}')" class="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-xs transition" title="Ver Detalhes e Chat">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                        </button>
                        <button onclick="handleDeleteScenario('${s.id}')" class="bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 p-1.5 rounded-lg text-xs transition" title="Excluir">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    lucide.createIcons();
}

// -------------------------------------------------------------------
// Scenario Modal (Create & Edit)
// -------------------------------------------------------------------
window.openScenarioModal = function(id = null) {
    const modal = document.getElementById('modal-scenario-form');
    const title = document.getElementById('modal-scenario-title');
    const form = document.getElementById('form-scenario');

    form.reset();
    document.getElementById('form-scenario-id').value = id || '';

    if (id) {
        const s = state.scenarios.find(x => x.id === id);
        if (s) {
            title.textContent = `Editar Cenário: ${s.code}`;
            document.getElementById('scenario-input-code').value = s.code;
            document.getElementById('scenario-input-title').value = s.title;
            document.getElementById('scenario-input-actor').value = s.actor;
            document.getElementById('scenario-input-where').value = s.context_where || '';
            document.getElementById('scenario-input-who').value = s.context_who || '';
            document.getElementById('scenario-input-when').value = s.context_when || '';
            document.getElementById('scenario-input-what').value = s.context_what || '';
            document.getElementById('scenario-input-sensors').value = s.sensors || '';
            document.getElementById('scenario-input-qoc').value = s.qoc_desired || '';
            document.getElementById('scenario-input-trigger').value = s.trigger_condition || '';
            document.getElementById('scenario-input-inference').value = s.expected_inference || '';
            document.getElementById('scenario-input-raw').value = s.raw_requirement || '';
            document.getElementById('scenario-input-external-llm').checked = !!s.external_llm_flag;
        }
    } else {
        title.textContent = 'Cadastrar Cenário de Usuário';
        document.getElementById('scenario-input-code').value = `CEN-0${state.scenarios.length + 1}`;
        document.getElementById('scenario-input-external-llm').checked = true;
    }

    modal.classList.remove('hidden');
    lucide.createIcons();
};

function closeScenarioModal() {
    document.getElementById('modal-scenario-form').classList.add('hidden');
}

async function handleSaveScenario(e) {
    e.preventDefault();
    const id = document.getElementById('form-scenario-id').value;

    const payload = {
        code: document.getElementById('scenario-input-code').value.trim(),
        title: document.getElementById('scenario-input-title').value.trim(),
        actor: document.getElementById('scenario-input-actor').value.trim(),
        context_where: document.getElementById('scenario-input-where').value.trim(),
        context_who: document.getElementById('scenario-input-who').value.trim(),
        context_when: document.getElementById('scenario-input-when').value.trim(),
        context_what: document.getElementById('scenario-input-what').value.trim(),
        sensors: document.getElementById('scenario-input-sensors').value.trim(),
        qoc_desired: document.getElementById('scenario-input-qoc').value.trim(),
        trigger_condition: document.getElementById('scenario-input-trigger').value.trim(),
        expected_inference: document.getElementById('scenario-input-inference').value.trim(),
        raw_requirement: document.getElementById('scenario-input-raw').value.trim(),
        external_llm_flag: document.getElementById('scenario-input-external-llm').checked ? 1 : 0
    };

    try {
        if (id) {
            await apiRequest(`/api/scenarios/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
        } else {
            await apiRequest(`/api/projects/${state.currentProject.id}/scenarios`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }

        closeScenarioModal();
        await loadScenarios();
    } catch (err) {
        alert('Erro ao salvar cenário: ' + err.message);
    }
}

window.handleDeleteScenario = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este cenário?')) return;
    try {
        await apiRequest(`/api/scenarios/${id}`, { method: 'DELETE' });
        if (state.activeScenario?.id === id) closeDrawer();
        await loadScenarios();
    } catch (err) {
        alert('Erro ao excluir: ' + err.message);
    }
};

// -------------------------------------------------------------------
// AI Negotiation & Split Drawer
// -------------------------------------------------------------------
window.handleNegotiateClick = async function(id) {
    openDrawerForScenario(id);
    await negotiateScenario(id);
};

window.openDrawerForScenario = function(id) {
    const s = state.scenarios.find(x => x.id === id);
    if (!s) return;

    state.activeScenario = s;

    const drawer = document.getElementById('negotiation-drawer');
    drawer.classList.remove('hidden');

    document.getElementById('drawer-scenario-title').textContent = `${s.code}: ${s.title}`;
    document.getElementById('drawer-raw-requirement-text').textContent = `"${s.raw_requirement}"`;

    const statusBadge = document.getElementById('drawer-scenario-status-badge');
    if (s.status === 'negotiated') {
        statusBadge.textContent = 'Em Conformidade';
        statusBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    } else {
        statusBadge.textContent = 'Conflito Detectado';
        statusBadge.className = 'text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30';
    }

    renderDrawerDetails(s);
    renderScenariosTable();
    loadChatMessages(s.id);
    drawer.scrollIntoView({ behavior: 'smooth' });
};

function closeDrawer() {
    state.activeScenario = null;
    document.getElementById('negotiation-drawer').classList.add('hidden');
    renderScenariosTable();
}

async function negotiateScenario(scenarioId) {
    const reBtn = document.getElementById('btn-re-negotiate');
    const originalText = reBtn.innerHTML;
    reBtn.disabled = true;
    reBtn.innerHTML = `<i data-lucide="loader" class="w-3.5 h-3.5 animate-spin"></i><span>Negociando com IA...</span>`;
    lucide.createIcons();

    try {
        const response = await apiRequest(`/api/scenarios/${scenarioId}/negotiate`, { method: 'POST' });
        await loadScenarios();
        const updated = state.scenarios.find(x => x.id === scenarioId);
        if (updated) {
            state.activeScenario = updated;
            renderDrawerDetails(updated);
            switchDrawerTab('negotiated');
        }
    } catch (err) {
        alert('Erro no processo de negociação: ' + err.message);
    } finally {
        reBtn.disabled = false;
        reBtn.innerHTML = originalText;
        lucide.createIcons();
    }
}

function renderDrawerDetails(scenario) {
    // 1. Diagnósticos & Paradoxos
    const paradoxesList = document.getElementById('drawer-paradoxes-list');
    const diag = scenario.lgpd_diagnostics;
    const paradoxes = Array.isArray(diag) ? diag : (diag?.paradoxes || []);

    if (paradoxes.length === 0) {
        paradoxesList.innerHTML = `
            <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                Nenhum conflito diagnosticado até o momento. Clique em "Re-negociar com IA" para avaliar.
            </div>
        `;
    } else {
        paradoxesList.innerHTML = paradoxes.map(p => `
            <div class="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-amber-400 flex items-center space-x-1.5">
                        <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
                        <span>${p.name}</span>
                    </span>
                    <span class="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono">${p.article}</span>
                </div>
                <p class="text-[11px] text-slate-300 leading-relaxed">${p.explanation || p.desc}</p>
            </div>
        `).join('');
    }

    // 2. Requisito Negociado
    document.getElementById('drawer-compare-before').textContent = scenario.raw_requirement;
    document.getElementById('drawer-compare-after').textContent = scenario.negotiated_requirement || 'Aguardando negociação pelo ContextLGPD-Negotiator...';

    // 3. Matriz de Accountability
    const accTbody = document.getElementById('drawer-accountability-tbody');
    const matrix = scenario.accountability_matrix || [];

    if (!Array.isArray(matrix) || matrix.length === 0) {
        accTbody.innerHTML = `
            <tr>
                <td colspan="3" class="p-4 text-center text-slate-400 text-xs">
                    Nenhuma entrada de prestação de contas gerada ainda. Execute a negociação.
                </td>
            </tr>
        `;
    } else {
        accTbody.innerHTML = matrix.map(m => `
            <tr>
                <td class="p-3 font-semibold text-white">${m.variable}</td>
                <td class="p-3 text-slate-300">${m.treatment}</td>
                <td class="p-3 font-mono text-indigo-300">${m.justification}</td>
            </tr>
        `).join('');
    }

    lucide.createIcons();
}

function switchDrawerTab(tab) {
    state.activeDrawerTab = tab;
    const tabs = ['diagnostics', 'negotiated', 'accountability', 'chat'];

    tabs.forEach(t => {
        const btn = document.getElementById(`tab-drawer-${t}`);
        const content = document.getElementById(`content-drawer-${t}`);
        if (t === tab) {
            btn.className = 'py-2.5 px-4 font-semibold text-indigo-400 border-b-2 border-indigo-500 transition flex items-center space-x-1.5';
            content.classList.remove('hidden');
        } else {
            btn.className = 'py-2.5 px-4 font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-200 transition flex items-center space-x-1.5';
            content.classList.add('hidden');
        }
    });

    lucide.createIcons();
}

function handleCopyNegotiated() {
    const text = document.getElementById('drawer-compare-after').textContent;
    if (!text || text.includes('Aguardando')) return;
    navigator.clipboard.writeText(text);
    alert('Requisito negociado copiado para a área de transferência!');
}

// -------------------------------------------------------------------
// Interactive Chat with ContextLGPD-Negotiator
// -------------------------------------------------------------------
async function loadChatMessages(scenarioId) {
    const container = document.getElementById('drawer-chat-messages');
    container.innerHTML = `<div class="p-4 text-center text-xs text-slate-500">Carregando diálogo...</div>`;

    try {
        const messages = await apiRequest(`/api/projects/${state.currentProject.id}/chat?scenarioId=${scenarioId}`);

        if (messages.length === 0) {
            container.innerHTML = `
                <div class="p-6 text-center text-xs text-slate-400 space-y-2">
                    <i data-lucide="bot" class="w-8 h-8 text-indigo-400 mx-auto"></i>
                    <p class="font-semibold text-white">Canal de Refinamento ContextLGPD-Negotiator</p>
                    <p class="text-[11px] text-slate-400">Faça perguntas ou solicite alterações de QoC, gatilhos de borda ou conformidade jurídica para este cenário.</p>
                </div>
            `;
        } else {
            renderChatMessages(messages);
        }
    } catch (err) {
        container.innerHTML = `<div class="p-4 text-rose-400 text-xs">Erro ao carregar mensagens: ${err.message}</div>`;
    }
    lucide.createIcons();
}

function renderChatMessages(messages) {
    const container = document.getElementById('drawer-chat-messages');
    container.innerHTML = messages.map(m => {
        const isUser = m.role === 'user';
        const formattedContent = marked.parse(m.content || '');

        let applyButtonHtml = '';
        if (!isUser && m.content.includes('[NOVO_REQUISITO_SUGERIDO]')) {
            const match = m.content.match(/\[NOVO_REQUISITO_SUGERIDO\]([\s\S]*?)\[\/NOVO_REQUISITO_SUGERIDO\]/);
            if (match && match[1]) {
                const cleanSuggestion = encodeURIComponent(match[1].trim());
                applyButtonHtml = `
                    <div class="mt-2 pt-2 border-t border-slate-700/60 flex justify-end">
                        <button onclick="applySuggestedRequirement('${cleanSuggestion}')" class="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                            <i data-lucide="check" class="w-3 h-3"></i>
                            <span>Aplicar esta versão na Tabela</span>
                        </button>
                    </div>
                `;
            }
        }

        return `
            <div class="flex ${isUser ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[85%] text-xs p-3.5 ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'} shadow-md">
                    <div class="flex items-center space-x-1.5 mb-1 text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-400'} font-semibold">
                        <i data-lucide="${isUser ? 'user' : 'bot'}" class="w-3 h-3"></i>
                        <span>${isUser ? 'Engenheiro de Requisitos' : 'ContextLGPD-Negotiator'}</span>
                    </div>
                    <div class="prose-custom leading-relaxed">${formattedContent}</div>
                    ${applyButtonHtml}
                </div>
            </div>
        `;
    }).join('');

    container.scrollTop = container.scrollHeight;
    lucide.createIcons();
}

async function handleSendChatMessage(e) {
    e.preventDefault();
    if (!state.activeScenario) return;

    const input = document.getElementById('input-drawer-chat-message');
    const msg = input.value.trim();
    if (!msg) return;

    input.value = '';
    const container = document.getElementById('drawer-chat-messages');

    // Append user message immediately
    const tempUserMsg = `
        <div class="flex justify-end">
            <div class="max-w-[85%] text-xs p-3.5 chat-bubble-user shadow-md">
                <div class="flex items-center space-x-1.5 mb-1 text-[10px] text-indigo-200 font-semibold">
                    <i data-lucide="user" class="w-3 h-3"></i>
                    <span>Engenheiro de Requisitos</span>
                </div>
                <div>${msg}</div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', tempUserMsg);
    container.scrollTop = container.scrollHeight;

    try {
        await apiRequest(`/api/scenarios/${state.activeScenario.id}/chat`, {
            method: 'POST',
            body: JSON.stringify({ message: msg })
        });
        await loadChatMessages(state.activeScenario.id);
    } catch (err) {
        alert('Erro ao enviar mensagem: ' + err.message);
    }
}

window.applySuggestedRequirement = async function(encodedText) {
    const newText = decodeURIComponent(encodedText);
    if (!state.activeScenario) return;

    try {
        await apiRequest(`/api/scenarios/${state.activeScenario.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                negotiated_requirement: newText,
                status: 'negotiated'
            })
        });

        alert('Requisito negociado atualizado com sucesso na tabela!');
        await loadScenarios();
        const updated = state.scenarios.find(x => x.id === state.activeScenario.id);
        if (updated) {
            state.activeScenario = updated;
            renderDrawerDetails(updated);
            switchDrawerTab('negotiated');
        }
    } catch (err) {
        alert('Erro ao atualizar: ' + err.message);
    }
};

// -------------------------------------------------------------------
// Export RIPD Markdown
// -------------------------------------------------------------------
function handleExportMarkdown() {
    if (!state.currentProject) return;
    const url = `/api/projects/${state.currentProject.id}/export`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `RIPD_${state.currentProject.title}.md`);
    // Add token header via fetch or simple download with token query if preferred
    // For standard clean download with bearer auth:
    fetch(url, { headers: { 'Authorization': `Bearer ${state.token}` } })
        .then(r => r.blob())
        .then(blob => {
            const downloadUrl = window.URL.createObjectURL(blob);
            a.href = downloadUrl;
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}

// -------------------------------------------------------------------
// Settings Modal (API Keys & Cloud Supabase)
// -------------------------------------------------------------------
function openSettingsModal(tab = 'api') {
    document.getElementById('modal-settings').classList.remove('hidden');
    switchSettingsTab(tab);
    lucide.createIcons();
}

function closeSettingsModal() {
    document.getElementById('modal-settings').classList.add('hidden');
}

function switchSettingsTab(tab) {
    const apiBtn = document.getElementById('modal-tab-api');
    const dbBtn = document.getElementById('modal-tab-db');
    const apiForm = document.getElementById('form-settings-api');
    const dbForm = document.getElementById('form-settings-db');

    if (tab === 'api') {
        apiBtn.className = 'pb-2 px-3 text-xs font-semibold text-indigo-400 border-b-2 border-indigo-500 transition';
        dbBtn.className = 'pb-2 px-3 text-xs font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-200 transition';
        apiForm.classList.remove('hidden');
        dbForm.classList.add('hidden');
    } else {
        dbBtn.className = 'pb-2 px-3 text-xs font-semibold text-indigo-400 border-b-2 border-indigo-500 transition';
        apiBtn.className = 'pb-2 px-3 text-xs font-medium text-slate-400 border-b-2 border-transparent hover:text-slate-200 transition';
        dbForm.classList.remove('hidden');
        apiForm.classList.add('hidden');
    }
}

async function handleSaveApiSettings(e) {
    e.preventDefault();
    const provider = document.getElementById('setting-provider').value;
    const model_name = document.getElementById('setting-model').value;
    const api_key = document.getElementById('setting-api-key').value;
    const statusBox = document.getElementById('settings-status-box');

    try {
        statusBox.classList.remove('hidden');
        statusBox.className = 'p-3 rounded-xl text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20';
        statusBox.textContent = 'Salvando e criptografando chave de API...';

        await apiRequest('/api/settings', {
            method: 'POST',
            body: JSON.stringify({ provider, model_name, api_key })
        });

        statusBox.className = 'p-3 rounded-xl text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
        statusBox.textContent = 'Configurações e Chave de API salvas com segurança criptográfica (AES-256)!';

        // Refresh settings
        const me = await apiRequest('/api/auth/me');
        state.settings = me.settings;
        updateSettingsUI();
        document.getElementById('setting-api-key').value = '';
    } catch (err) {
        statusBox.className = 'p-3 rounded-xl text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20';
        statusBox.textContent = 'Erro ao salvar: ' + err.message;
    }
}

async function handleTestApiKey() {
    const statusBox = document.getElementById('settings-status-box');
    statusBox.classList.remove('hidden');
    statusBox.className = 'p-3 rounded-xl text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20';
    statusBox.textContent = 'Enviando teste para a API do modelo...';

    try {
        const res = await apiRequest('/api/settings/test-key', { method: 'POST' });
        statusBox.className = 'p-3 rounded-xl text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
        statusBox.textContent = res.message;
    } catch (err) {
        statusBox.className = 'p-3 rounded-xl text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20';
        statusBox.textContent = err.message;
    }
}

async function handleTestCloudDb() {
    const url = document.getElementById('setting-supabase-url').value.trim();
    const key = document.getElementById('setting-supabase-key').value.trim();
    const statusBox = document.getElementById('db-status-box');

    if (!url) {
        alert('Informe a URL do Supabase.');
        return;
    }

    statusBox.classList.remove('hidden');
    statusBox.className = 'p-3 rounded-xl text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20';
    statusBox.textContent = 'Verificando conectividade com o Supabase...';

    try {
        const res = await apiRequest('/api/settings/test-cloud-db', {
            method: 'POST',
            body: JSON.stringify({ url, key })
        });

        // Also save cloud settings
        await apiRequest('/api/settings', {
            method: 'POST',
            body: JSON.stringify({
                cloud_db_url: url,
                cloud_db_key: key,
                cloud_db_enabled: 1
            })
        });

        statusBox.className = 'p-3 rounded-xl text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
        statusBox.textContent = '✅ ' + res.message;

        const me = await apiRequest('/api/auth/me');
        state.settings = me.settings;
        updateSettingsUI();
    } catch (err) {
        statusBox.className = 'p-3 rounded-xl text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20';
        statusBox.textContent = 'Falha: ' + err.message;
    }
}

function copySqlSchema() {
    const sql = `-- Script para execução no Supabase SQL Editor:
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
    lgpd_diagnostics JSONB,
    accountability_matrix JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);`;
    navigator.clipboard.writeText(sql);
    alert('Código SQL copiado para a área de transferência! Cole no SQL Editor do seu projeto Supabase.');
}

// -------------------------------------------------------------------
// Theory Modal
// -------------------------------------------------------------------
function openTheoryModal() {
    document.getElementById('modal-theory').classList.remove('hidden');
    lucide.createIcons();
}

function closeTheoryModal() {
    document.getElementById('modal-theory').classList.add('hidden');
}
