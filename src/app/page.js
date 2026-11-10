'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  FolderKanban,
  Bot,
  Sliders,
  BookOpen,
  Plus,
  Download,
  Upload,
  Sparkles,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  FileCheck2,
  MessageSquare,
  Send,
  Check,
  Copy,
  Plug,
  Save,
  Lock,
  Database,
  User,
  RefreshCw,
  AlertTriangle,
  HardDrive,
  Search,
  ChevronRight,
  MapPin,
  Clock,
  Activity,
  Layers,
  ArrowRight,
  FileText
} from 'lucide-react';
import { INITIAL_SCENARIOS } from '@/lib/constants';

export default function Home() {
  // Authentication & Persona
  const [user] = useState({
    name: 'Prof. Samuel Celso (CIn-UFPE)',
    email: 'pesquisador@cin.ufpe.br'
  });

  // AI & Model Settings
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [apiKey, setApiKey] = useState('');
  const [savedMaskedKey, setSavedMaskedKey] = useState('');
  const [keyStatusMessage, setKeyStatusMessage] = useState(null);

  // Scenarios State
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState(INITIAL_SCENARIOS[0].id);
  const [activeTab, setActiveTab] = useState('notation'); // 'notation' | 'diagnostics' | 'negotiated' | 'accountability' | 'chat'
  const [isNegotiating, setIsNegotiating] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'conflict' | 'negotiated'

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('api');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState(null);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  // Form State for Scenario
  const [formScenario, setFormScenario] = useState({
    code: '',
    title: '',
    actor: '',
    user_story: '',
    pre_conditions: '',
    context_where: '',
    context_who: '',
    context_when: '',
    context_what: '',
    sensors: '',
    qoc_desired: '',
    trigger_event: '',
    main_flow: '',
    alternative_flows: '',
    raw_requirement: '',
    external_llm_flag: true
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Load state on mount
  useEffect(() => {
    try {
      const savedScenarios = localStorage.getItem('context_lgpd_scenarios');
      if (savedScenarios) {
        const parsed = JSON.parse(savedScenarios);
        setScenarios(parsed);
        if (parsed.length > 0) setActiveScenarioId(parsed[0].id);
      }
      const savedKey = localStorage.getItem('context_lgpd_api_key');
      if (savedKey) {
        setApiKey(savedKey);
        setSavedMaskedKey(savedKey.slice(0, 6) + '...' + savedKey.slice(-4));
      }
      const savedProvider = localStorage.getItem('context_lgpd_provider');
      if (savedProvider) setProvider(savedProvider);
      const savedModel = localStorage.getItem('context_lgpd_model');
      if (savedModel) setModel(savedModel);
      const savedChat = localStorage.getItem('context_lgpd_chats');
      if (savedChat) setChatMessages(JSON.parse(savedChat));
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }, []);

  const persistScenarios = (newScenarios) => {
    setScenarios(newScenarios);
    try {
      localStorage.setItem('context_lgpd_scenarios', JSON.stringify(newScenarios));
    } catch (e) {
      console.error('Error saving scenarios:', e);
    }
  };

  const persistChat = (newChats) => {
    setChatMessages(newChats);
    try {
      localStorage.setItem('context_lgpd_chats', JSON.stringify(newChats));
    } catch (e) {
      console.error('Error saving chats:', e);
    }
  };

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  // Filtering
  const filteredScenarios = scenarios.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.actor.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === 'conflict') return matchesSearch && s.status !== 'negotiated';
    if (statusFilter === 'negotiated') return matchesSearch && s.status === 'negotiated';
    return matchesSearch;
  });

  // ----------------------------------------------------
  // Scenario Creation & Editing
  // ----------------------------------------------------
  const handleOpenCreateScenario = () => {
    setEditingScenarioId(null);
    setFormScenario({
      code: `CEN-0${scenarios.length + 1}`,
      title: '',
      actor: '',
      user_story: 'Como [Ator], quero [Funcionalidade], para que [Benefício].',
      pre_conditions: 'Usuário conectado; permissões concedidas; rede ativa.',
      context_where: '',
      context_who: '',
      context_when: '',
      context_what: '',
      sensors: '',
      qoc_desired: '',
      trigger_event: '',
      main_flow: '1. O usuário inicia a atividade.\n2. O subsistema verifica o gatilho.\n3. Dados são filtrados na borda.\n4. Inferência contextual entregue.',
      alternative_flows: 'Fluxo 1: Caso não haja sinal, atuar localmente sem envio à nuvem.',
      raw_requirement: '',
      external_llm_flag: true
    });
    setIsScenarioModalOpen(true);
  };

  const handleOpenEditScenario = (scn) => {
    setEditingScenarioId(scn.id);
    setFormScenario({
      code: scn.code,
      title: scn.title,
      actor: scn.actor,
      user_story: scn.user_story || '',
      pre_conditions: scn.pre_conditions || '',
      context_where: scn.context_dimensions?.where || scn.context_where || '',
      context_who: scn.context_dimensions?.who || scn.context_who || '',
      context_when: scn.context_dimensions?.when || scn.context_when || '',
      context_what: scn.context_dimensions?.what || scn.context_what || '',
      sensors: scn.sensors_and_qoc?.sensors || scn.sensors || '',
      qoc_desired: scn.sensors_and_qoc?.qoc_desired || scn.qoc_desired || '',
      trigger_event: scn.trigger_event || scn.trigger_condition || '',
      main_flow: Array.isArray(scn.main_flow) ? scn.main_flow.join('\n') : scn.main_flow || '',
      alternative_flows: Array.isArray(scn.alternative_flows) ? scn.alternative_flows.join('\n') : scn.alternative_flows || '',
      raw_requirement: scn.raw_requirement || '',
      external_llm_flag: scn.external_llm_flag !== false
    });
    setIsScenarioModalOpen(true);
  };

  const handleSaveScenario = (e) => {
    e.preventDefault();
    if (!formScenario.title || !formScenario.raw_requirement) {
      alert('Título e Requisito Bruto são obrigatórios.');
      return;
    }

    const payload = {
      code: formScenario.code,
      title: formScenario.title,
      actor: formScenario.actor,
      user_story: formScenario.user_story,
      pre_conditions: formScenario.pre_conditions,
      context_dimensions: {
        where: formScenario.context_where,
        who: formScenario.context_who,
        when: formScenario.context_when,
        what: formScenario.context_what
      },
      sensors_and_qoc: {
        sensors: formScenario.sensors,
        qoc_desired: formScenario.qoc_desired
      },
      trigger_event: formScenario.trigger_event,
      main_flow: formScenario.main_flow.split('\n').filter((x) => x.trim()),
      alternative_flows: formScenario.alternative_flows.split('\n').filter((x) => x.trim()),
      raw_requirement: formScenario.raw_requirement,
      external_llm_flag: formScenario.external_llm_flag
    };

    if (editingScenarioId) {
      const updated = scenarios.map((s) => (s.id === editingScenarioId ? { ...s, ...payload } : s));
      persistScenarios(updated);
    } else {
      const newScn = {
        ...payload,
        id: 'scn_' + Date.now(),
        status: 'conflict_detected',
        negotiated_requirement: null,
        lgpd_diagnostics: null,
        accountability_matrix: null,
        acceptance_criteria: [
          {
            title: 'Critério 1: Minimização e Ativação Estrita (Art. 6º, III)',
            given: 'Dado que a condição de contexto não foi atingida',
            when: 'Quando o sistema verificar os sensores',
            then: 'Então nenhum dado bruto deve ser amostrado ou retido.'
          }
        ]
      };
      const newList = [...scenarios, newScn];
      persistScenarios(newList);
      setActiveScenarioId(newScn.id);
    }
    setIsScenarioModalOpen(false);
  };

  const handleDeleteScenario = (id) => {
    if (!confirm('Deseja excluir este cenário de requisitos?')) return;
    const filtered = scenarios.filter((s) => s.id !== id);
    persistScenarios(filtered);
    if (activeScenarioId === id && filtered.length > 0) {
      setActiveScenarioId(filtered[0].id);
    }
  };

  const handleRestoreDefaultScenarios = () => {
    if (confirm('Restaurar os 4 cenários clássicos do pré-artigo científico (CIn-UFPE)?')) {
      persistScenarios(INITIAL_SCENARIOS);
      setActiveScenarioId(INITIAL_SCENARIOS[0].id);
    }
  };

  // ----------------------------------------------------
  // Negotiation Action
  // ----------------------------------------------------
  const handleNegotiateScenario = async (scn) => {
    setIsNegotiating(true);
    try {
      const res = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: {
            ...scn,
            sensors: scn.sensors_and_qoc?.sensors || scn.sensors,
            qoc_desired: scn.sensors_and_qoc?.qoc_desired || scn.qoc_desired,
            trigger_condition: scn.trigger_event || scn.trigger_condition,
            expected_inference: scn.title
          },
          apiKey,
          provider,
          model
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na negociação');

      const result = data.result;
      const updated = {
        ...scn,
        status: 'negotiated',
        negotiated_requirement: result.negotiatedRequirement?.text || scn.raw_requirement,
        lgpd_diagnostics: { paradoxes: result.paradoxesDiagnosed || [] },
        accountability_matrix: result.accountabilityMatrix || []
      };

      const newScenarios = scenarios.map((s) => (s.id === scn.id ? updated : s));
      persistScenarios(newScenarios);
      setActiveTab('negotiated');
    } catch (err) {
      alert('Erro na negociação: ' + err.message);
    } finally {
      setIsNegotiating(false);
    }
  };

  // ----------------------------------------------------
  // Chat Actions
  // ----------------------------------------------------
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!activeScenario || !chatInput.trim()) return;

    const currentMsg = chatInput.trim();
    setChatInput('');

    const scnId = activeScenario.id;
    const currentThread = chatMessages[scnId] || [];
    const newThreadWithUser = [...currentThread, { role: 'user', content: currentMsg }];

    const updatedChats = { ...chatMessages, [scnId]: newThreadWithUser };
    persistChat(updatedChats);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: {
            ...activeScenario,
            sensors: activeScenario.sensors_and_qoc?.sensors || activeScenario.sensors,
            trigger_condition: activeScenario.trigger_event || activeScenario.trigger_condition,
            expected_inference: activeScenario.title
          },
          message: currentMsg,
          apiKey,
          provider,
          model
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha na resposta do assistente');

      const finalChats = {
        ...updatedChats,
        [scnId]: [...newThreadWithUser, { role: 'assistant', content: data.reply }]
      };
      persistChat(finalChats);
    } catch (err) {
      alert('Erro ao enviar mensagem: ' + err.message);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleApplySuggestedRequirement = (text) => {
    if (!activeScenario) return;
    const updated = {
      ...activeScenario,
      status: 'negotiated',
      negotiated_requirement: text
    };
    const newScenarios = scenarios.map((s) => (s.id === activeScenario.id ? updated : s));
    persistScenarios(newScenarios);
    setActiveTab('negotiated');
    alert('Requisito negociado atualizado com sucesso na notação!');
  };

  // ----------------------------------------------------
  // Backup & Export Actions
  // ----------------------------------------------------
  const handleExportJsonBackup = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user,
      provider,
      model,
      scenarios,
      chatMessages
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_requisitos_contexto_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.scenarios)) {
          persistScenarios(parsed.scenarios);
          if (parsed.chatMessages) persistChat(parsed.chatMessages);
          if (parsed.scenarios.length > 0) setActiveScenarioId(parsed.scenarios[0].id);
          alert('Cenários restaurados com sucesso! ' + parsed.scenarios.length + ' carregados.');
        } else if (Array.isArray(parsed)) {
          persistScenarios(parsed);
          if (parsed.length > 0) setActiveScenarioId(parsed[0].id);
          alert('Cenários carregados com sucesso!');
        }
      } catch (err) {
        alert('Erro ao processar JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportMarkdown = () => {
    let md = `# RELATÓRIO DE ENGENHARIA DE REQUISITOS SENSÍVEIS AO CONTEXTO & LGPD\n\n`;
    md += `**Instituição:** Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE)\n`;
    md += `**Pesquisador:** ${user.name}\n`;
    md += `**Data:** ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n`;
    md += `**Metodologia:** Notação Formal de Cenários de Usuário & Privacy by Design (Art. 6º e 33 da LGPD)\n\n`;
    md += `---\n\n`;

    for (const s of scenarios) {
      md += `## Cenário ${s.code}: ${s.title}\n\n`;
      md += `- **Ator Primário:** ${s.actor}\n`;
      if (s.user_story) md += `- **História de Usuário:** ${s.user_story}\n`;
      if (s.pre_conditions) md += `- **Pré-condições:** ${s.pre_conditions}\n`;
      md += `- **Gatilho de Ativação (Trigger):** ${s.trigger_event || s.trigger_condition || 'N/A'}\n`;
      md += `- **Sensores e QoC:** ${s.sensors_and_qoc?.sensors || s.sensors || 'N/A'} (QoC: ${s.sensors_and_qoc?.qoc_desired || s.qoc_desired || 'N/A'})\n\n`;

      md += `### Fluxo Principal de Eventos:\n`;
      const flow = Array.isArray(s.main_flow) ? s.main_flow : (s.main_flow ? s.main_flow.split('\n') : []);
      flow.forEach((step) => {
        md += `- ${step}\n`;
      });
      md += `\n`;

      md += `### Especificação Tradicional (Requisito Bruto):\n`;
      md += `> ${s.raw_requirement}\n\n`;

      if (s.negotiated_requirement) {
        md += `### Especificação Negociada (Privacy by Design - Art. 6º e 33):\n`;
        md += `> **${s.negotiated_requirement}**\n\n`;
      }

      const paradoxes = s.lgpd_diagnostics?.paradoxes || [];
      if (paradoxes.length > 0) {
        md += `### Diagnóstico dos Paradoxos de Privacidade:\n`;
        paradoxes.forEach((p) => {
          md += `- **${p.name}** (*${p.article}*): ${p.explanation || p.desc}\n`;
        });
        md += `\n`;
      }

      const matrix = s.accountability_matrix || [];
      if (matrix.length > 0) {
        md += `### Matriz de Comprovação Regulatória (Accountability - Art. 6º, X):\n\n`;
        md += `| Variável de Contexto | Tratamento Técnico Aplicado | Base Legal / Justificativa LGPD |\n`;
        md += `| :--- | :--- | :--- |\n`;
        matrix.forEach((row) => {
          md += `| ${row.variable} | ${row.treatment} | ${row.justification} |\n`;
        });
        md += `\n`;
      }

      md += `---\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_Requisitos_LGPD_CIn_UFPE_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ----------------------------------------------------
  // Settings Actions
  // ----------------------------------------------------
  const handleSaveApiSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('context_lgpd_provider', provider);
    localStorage.setItem('context_lgpd_model', model);
    if (apiKey.trim()) {
      localStorage.setItem('context_lgpd_api_key', apiKey.trim());
      setSavedMaskedKey(apiKey.slice(0, 6) + '...' + apiKey.slice(-4));
    }
    setKeyStatusMessage({ type: 'success', text: 'Configurações salvas localmente com sucesso!' });
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setKeyStatusMessage({ type: 'error', text: 'Informe a chave de API para testar.' });
      return;
    }
    setKeyStatusMessage({ type: 'info', text: 'Conectando ao modelo de IA...' });
    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, provider, model })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no teste');
      setKeyStatusMessage({ type: 'success', text: data.message });
    } catch (err) {
      setKeyStatusMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <input type="file" ref={fileInputRef} onChange={handleImportJsonBackup} accept=".json" className="hidden" />

      {/* ============================================================== */}
      {/* 1. TOP NAVBAR (Clean, Editorial, Academic)                     */}
      {/* ============================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">ContextLGPD-Negotiator</span>
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  CIn-UFPE
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Engenharia de Requisitos Sensíveis ao Contexto & Privacidade (Lei 13.709/2018)
              </p>
            </div>
          </div>

          {/* Quick Badges & Controls */}
          <div className="flex items-center space-x-2.5">
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Banco Integrado (Offline-First)</span>
            </div>

            <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>{model}</span>
            </div>

            <button
              onClick={() => setIsTheoryOpen(true)}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Os 3 Paradoxos</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Configurações</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs"
              title="Baixar relatório de impacto regulatório RIPD"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Exportar RIPD</span>
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MASTER-DETAIL WORKSPACE (Clean, Structured, Legible)        */}
      {/* ============================================================== */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: SCENARIOS SIDEBAR (Organized Cards)             */}
        {/* ------------------------------------------------------------ */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col space-y-4">
          {/* Header & New Scenario Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Cenários de Uso</h2>
              <p className="text-xs text-slate-500">{scenarios.length} cenário(s) cadastrado(s)</p>
            </div>
            <button
              onClick={handleOpenCreateScenario}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar código, título ou persona..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex text-xs space-x-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 py-1 rounded text-center transition ${
                  statusFilter === 'all'
                    ? 'bg-slate-200 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Todos ({scenarios.length})
              </button>
              <button
                onClick={() => setStatusFilter('conflict')}
                className={`flex-1 py-1 rounded text-center transition ${
                  statusFilter === 'conflict'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Conflitos ({scenarios.filter((s) => s.status !== 'negotiated').length})
              </button>
              <button
                onClick={() => setStatusFilter('negotiated')}
                className={`flex-1 py-1 rounded text-center transition ${
                  statusFilter === 'negotiated'
                    ? 'bg-emerald-100 text-emerald-900 font-semibold'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                Negociados ({scenarios.filter((s) => s.status === 'negotiated').length})
              </button>
            </div>
          </div>

          {/* Scenario Cards List */}
          <div className="space-y-2 overflow-y-auto max-h-[580px] pr-1">
            {filteredScenarios.map((s) => {
              const isSelected = s.id === activeScenario?.id;
              const isNegotiated = s.status === 'negotiated';

              return (
                <div
                  key={s.id}
                  onClick={() => setActiveScenarioId(s.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      {s.code}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isNegotiated
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isNegotiated ? 'Negociado' : 'Conflito LGPD'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs text-slate-900 leading-snug line-clamp-1">{s.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{s.actor}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Database & Data Utilities */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span className="flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                <span>Gerenciamento de Dados</span>
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Salvo</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={handleExportJsonBackup}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium text-[11px] flex items-center justify-center space-x-1"
                title="Salvar backup completo em arquivo JSON"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Backup JSON</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium text-[11px] flex items-center justify-center space-x-1"
                title="Carregar cenários de arquivo JSON"
              >
                <Upload className="w-3 h-3 text-slate-500" />
                <span>Importar JSON</span>
              </button>
            </div>
            <button
              onClick={handleRestoreDefaultScenarios}
              className="w-full text-center text-[11px] text-amber-700 hover:text-amber-800 pt-1 hover:underline"
            >
              ⚡ Restaurar os 4 cenários clássicos do artigo
            </button>
          </div>
        </aside>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: DETAILED USER SCENARIO WORKSPACE               */}
        {/* ------------------------------------------------------------ */}
        {activeScenario && (
          <section className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden">
            {/* Scenario Header Banner */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {activeScenario.code}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      activeScenario.status === 'negotiated'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {activeScenario.status === 'negotiated' ? '✅ Privacy by Design Negociado' : '⚠️ Conflito com LGPD Detectado'}
                  </span>
                </div>
                <h1 className="text-lg font-bold text-slate-900">{activeScenario.title}</h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  <b>Ator Primário:</b> {activeScenario.actor}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleNegotiateScenario(activeScenario)}
                  disabled={isNegotiating}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isNegotiating ? 'animate-spin' : ''}`} />
                  <span>{isNegotiating ? 'Analisando e Negociando...' : 'Negociar com IA'}</span>
                </button>

                <button
                  onClick={() => handleOpenEditScenario(activeScenario)}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1"
                  title="Editar notação do cenário"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => handleDeleteScenario(activeScenario.id)}
                  className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 p-2 rounded-xl transition"
                  title="Excluir cenário"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Structured Tabs Bar */}
            <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-medium space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('notation')}
                className={`py-3 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'notation'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Notação do Cenário de Uso</span>
              </button>

              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`py-3 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'diagnostics'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>2. Análise dos Paradoxos LGPD</span>
              </button>

              <button
                onClick={() => setActiveTab('negotiated')}
                className={`py-3 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'negotiated'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>3. Requisito Negociado (Privacy by Design)</span>
              </button>

              <button
                onClick={() => setActiveTab('accountability')}
                className={`py-3 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'accountability'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>4. Matriz de Accountability (Art. 6º, X)</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`py-3 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'chat'
                    ? 'border-blue-600 text-blue-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>5. Refinamento Interativo</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* ======================================================== */}
              {/* TAB 1: FORMAL USER SCENARIO NOTATION                     */}
              {/* ======================================================== */}
              {activeTab === 'notation' && (
                <div className="space-y-5 text-xs text-slate-800">
                  {/* Card: User Story */}
                  {activeScenario.user_story && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        História de Usuário Relacionada (User Story)
                      </div>
                      <p className="text-sm font-medium text-slate-900 leading-relaxed italic">
                        "{activeScenario.user_story}"
                      </p>
                    </div>
                  )}

                  {/* Grid: Context Dimensions (Abowd/Dey) */}
                  <div>
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>Dimensões Primárias do Contexto Computacional (Abowd et al., 1999)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <span className="font-semibold text-slate-700 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span>Onde (Where / Espacial):</span>
                        </span>
                        <p className="text-slate-600">
                          {activeScenario.context_dimensions?.where || activeScenario.context_where || 'Não especificado'}
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <span className="font-semibold text-slate-700 flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Quem (Who / Identidade):</span>
                        </span>
                        <p className="text-slate-600">
                          {activeScenario.context_dimensions?.who || activeScenario.context_who || 'Não especificado'}
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <span className="font-semibold text-slate-700 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Quando (When / Temporal):</span>
                        </span>
                        <p className="text-slate-600">
                          {activeScenario.context_dimensions?.when || activeScenario.context_when || 'Não especificado'}
                        </p>
                      </div>

                      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <span className="font-semibold text-slate-700 flex items-center space-x-1">
                          <Activity className="w-3.5 h-3.5 text-purple-600" />
                          <span>O Quê (What / Atividade):</span>
                        </span>
                        <p className="text-slate-600">
                          {activeScenario.context_dimensions?.what || activeScenario.context_what || 'Não especificado'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trigger & Sensors / QoC */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                      <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">
                        Gatilho de Ativação (Trigger Event)
                      </span>
                      <p className="font-mono text-slate-900 font-semibold text-xs">
                        {activeScenario.trigger_event || activeScenario.trigger_condition || 'Nenhum gatilho formal delimitado.'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                      <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider block">
                        Sensores & Qualidade de Contexto (QoC Desejada)
                      </span>
                      <p className="text-slate-800">
                        <b>Sensores:</b> {activeScenario.sensors_and_qoc?.sensors || activeScenario.sensors || 'N/A'}
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        <b>Resolução QoC:</b> {activeScenario.sensors_and_qoc?.qoc_desired || activeScenario.qoc_desired || 'Não calibrada'}
                      </p>
                    </div>
                  </div>

                  {/* Main Flow: Step-by-Step */}
                  {activeScenario.main_flow && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                      <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        Fluxo Principal de Eventos (Sequência Interativa)
                      </h3>
                      <ol className="space-y-1.5 pl-1">
                        {(Array.isArray(activeScenario.main_flow)
                          ? activeScenario.main_flow
                          : activeScenario.main_flow.split('\n')
                        ).map((step, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-slate-700 leading-relaxed">
                            <span className="font-mono font-bold text-blue-600 shrink-0">{idx + 1}.</span>
                            <span>{step.replace(/^\d+\.\s*/, '')}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Context-Aware Acceptance Criteria (Given-When-Then) */}
                  {activeScenario.acceptance_criteria && activeScenario.acceptance_criteria.length > 0 && (
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                      <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                        Critérios de Aceitação Contextuais (Given-When-Then / Dado-Quando-Então)
                      </h3>
                      <div className="space-y-2.5">
                        {activeScenario.acceptance_criteria.map((crit, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                            <span className="font-bold text-slate-800 text-xs block">{crit.title}</span>
                            <div className="text-slate-600 text-[11px] space-y-0.5">
                              <div><b className="text-slate-800">Dado que:</b> {crit.given.replace(/^Dado que\s*/i, '')}</div>
                              <div><b className="text-slate-800">Quando:</b> {crit.when.replace(/^Quando\s*/i, '')}</div>
                              <div><b className="text-slate-800">Então:</b> {crit.then.replace(/^Então\s*/i, '')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Traditional Requirement */}
                  <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Requisito Bruto Tradicional (Entrada antes da Negociação)
                    </div>
                    <p className="font-mono text-xs text-slate-800 italic">
                      "{activeScenario.raw_requirement}"
                    </p>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: LGPD CONFLICTS & THE 3 PARADOXES                  */}
              {/* ======================================================== */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                    <h3 className="font-bold text-sm mb-1 flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Diagnóstico pelo Componente PrivacyGuard (ADL ACME)</span>
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Sistemas sensíveis ao contexto com janelas extensas de dados entram em atrito direto com os princípios de
                      minimização e transferência internacional da LGPD se não forem mediados na fase de requisitos.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(activeScenario.lgpd_diagnostics?.paradoxes || []).map((p, idx) => (
                      <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span>{p.name}</span>
                          </span>
                          <span className="text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                            {p.article}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">{p.explanation || p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: NEGOTIATED REQUIREMENT (Privacy by Design)        */}
              {/* ======================================================== */}
              {activeTab === 'negotiated' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Before: Traditional */}
                    <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-xs uppercase">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Especificação Tradicional (Violadora)</span>
                      </div>
                      <p className="text-xs text-rose-950 font-mono leading-relaxed bg-white/70 p-3 rounded-lg border border-rose-200">
                        {activeScenario.raw_requirement}
                      </p>
                      <ul className="text-[11px] text-rose-800 list-disc list-inside space-y-0.5 pt-1">
                        <li>Coleta ininterrupta sem critério de fusão delimitado.</li>
                        <li>Drena bateria e transfere dados brutos identificáveis (PII).</li>
                        <li>Viola Art. 6º, III (Minimização) e Art. 33 (Transferência Internacional).</li>
                      </ul>
                    </div>

                    {/* After: Negotiated */}
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                      <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs uppercase">
                        <CheckCircle className="w-4 h-4" />
                        <span>Especificação Negociada (A 'Cola' Contexto + LGPD)</span>
                      </div>
                      <p className="text-xs text-emerald-950 font-mono leading-relaxed bg-white/90 p-3 rounded-lg border border-emerald-200 font-medium">
                        {activeScenario.negotiated_requirement ||
                          'Clique no botão "Negociar com IA" acima para gerar a especificação corrigida.'}
                      </p>
                      {activeScenario.negotiated_requirement && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeScenario.negotiated_requirement);
                              alert('Requisito copiado!');
                            }}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-xs transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Requisito</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: ACCOUNTABILITY MATRIX (Art. 6º, X)                */}
              {/* ======================================================== */}
              {activeTab === 'accountability' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                        Documentação de Comprovação Regulatória (Art. 6º, X - Accountability)
                      </h3>
                      <p className="text-xs text-slate-500">Pronta para auditoria pela ANPD e documentação de software.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                        <tr>
                          <th className="p-3 border-b border-slate-200 min-w-[160px]">Variável de Contexto</th>
                          <th className="p-3 border-b border-slate-200 min-w-[220px]">Tratamento Técnico Aplicado</th>
                          <th className="p-3 border-b border-slate-200 min-w-[200px]">Base Legal / Justificativa LGPD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        {(activeScenario.accountability_matrix || []).map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">{m.variable}</td>
                            <td className="p-3">{m.treatment}</td>
                            <td className="p-3 font-mono text-blue-700 font-medium">{m.justification}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: INTERACTIVE CHAT REFINEMENT                       */}
              {/* ======================================================== */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-[420px]">
                  <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {(chatMessages[activeScenario.id] || []).length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                        <Bot className="w-8 h-8 text-blue-600 mx-auto" />
                        <p className="font-semibold text-slate-900 text-sm">Canal de Refinamento ContextLGPD</p>
                        <p className="max-w-md mx-auto text-slate-500">
                          Interaja com o assistente para calibrar a taxa de amostragem de sensores, adicionar filtros na borda ou
                          ajustar a justificativa jurídica do cenário.
                        </p>
                      </div>
                    ) : (
                      (chatMessages[activeScenario.id] || []).map((msg, i) => {
                        const isUser = msg.role === 'user';
                        const hasSuggested = !isUser && msg.content.includes('[NOVO_REQUISITO_SUGERIDO]');
                        let suggestedText = '';
                        if (hasSuggested) {
                          const match = msg.content.match(/\[NOVO_REQUISITO_SUGERIDO\]([\s\S]*?)\[\/NOVO_REQUISITO_SUGERIDO\]/);
                          if (match) suggestedText = match[1].trim();
                        }

                        return (
                          <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] text-xs p-3.5 shadow-xs ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
                              <div className={`flex items-center space-x-1.5 mb-1 text-[10px] font-bold ${isUser ? 'text-blue-100' : 'text-slate-500'}`}>
                                {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-blue-600" />}
                                <span>{isUser ? 'Engenheiro de Requisitos' : 'ContextLGPD-Negotiator'}</span>
                              </div>
                              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                              {hasSuggested && suggestedText && (
                                <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-end">
                                  <button
                                    onClick={() => handleApplySuggestedRequirement(suggestedText)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-1 rounded-lg flex items-center space-x-1 shadow-xs transition"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Aplicar esta versão na Notação</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="pt-3 flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Peça ajustes ao assistente (ex: aumente a degradação do GPS para 200m, aplique hash aos dados)..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0 shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: CRIAR / EDITAR CENÁRIO NA NOTAÇÃO FORMAL               */}
      {/* ============================================================== */}
      {isScenarioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-xl relative my-8">
            <button
              onClick={() => setIsScenarioModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {editingScenarioId ? `Editar Notação: ${formScenario.code}` : 'Cadastrar Cenário de Usuário Formal'}
                </h3>
                <p className="text-xs text-slate-500">
                  Estruturado conforme os padrões de Engenharia de Requisitos Sensíveis ao Contexto
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveScenario} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código</label>
                  <input
                    type="text"
                    value={formScenario.code}
                    onChange={(e) => setFormScenario({ ...formScenario, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Título do Cenário</label>
                  <input
                    type="text"
                    value={formScenario.title}
                    onChange={(e) => setFormScenario({ ...formScenario, title: e.target.value })}
                    required
                    placeholder="Ex: Alerta Proativo de Trânsito no Deslocamento"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ator Primário / Persona</label>
                <input
                  type="text"
                  value={formScenario.actor}
                  onChange={(e) => setFormScenario({ ...formScenario, actor: e.target.value })}
                  required
                  placeholder="Ex: Motorista em Trânsito / Paciente em Home-Office"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">História de Usuário (User Story)</label>
                <input
                  type="text"
                  value={formScenario.user_story}
                  onChange={(e) => setFormScenario({ ...formScenario, user_story: e.target.value })}
                  placeholder="Como [Ator], quero [Funcionalidade], para que [Objetivo]."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>

              {/* 4 Context Dimensions */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Dimensões Primárias do Contexto (Abowd et al., 1999)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 font-medium">Onde (Where / Espacial):</span>
                    <input
                      type="text"
                      value={formScenario.context_where}
                      onChange={(e) => setFormScenario({ ...formScenario, context_where: e.target.value })}
                      placeholder="Ex: GPS urbano, Geofencing"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Quem (Who / Identidade):</span>
                    <input
                      type="text"
                      value={formScenario.context_who}
                      onChange={(e) => setFormScenario({ ...formScenario, context_who: e.target.value })}
                      placeholder="Ex: Identificador do aparelho, biometria"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Quando (When / Temporal):</span>
                    <input
                      type="text"
                      value={formScenario.context_when}
                      onChange={(e) => setFormScenario({ ...formScenario, context_when: e.target.value })}
                      placeholder="Ex: 24/7 contínuo ou horário comercial"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">O Quê (What / Atividade):</span>
                    <input
                      type="text"
                      value={formScenario.context_what}
                      onChange={(e) => setFormScenario({ ...formScenario, context_what: e.target.value })}
                      placeholder="Ex: Em trânsito, dormindo, reunião"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 mt-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* Gatilho e Sensores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Gatilho de Ativação (Trigger Event)</label>
                  <input
                    type="text"
                    value={formScenario.trigger_event}
                    onChange={(e) => setFormScenario({ ...formScenario, trigger_event: e.target.value })}
                    placeholder="Ex: Velocidade linear sustentada > 15 km/h"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">QoC Desejada</label>
                  <input
                    type="text"
                    value={formScenario.qoc_desired}
                    onChange={(e) => setFormScenario({ ...formScenario, qoc_desired: e.target.value })}
                    placeholder="Ex: Resolução < 10m"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Fluxo Principal */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fluxo Principal de Eventos (Passo a Passo)</label>
                <textarea
                  rows={3}
                  value={formScenario.main_flow}
                  onChange={(e) => setFormScenario({ ...formScenario, main_flow: e.target.value })}
                  placeholder="1. Usuário entra no veículo.&#10;2. Acelerômetro amostrado localmente.&#10;3. Gatilho confirma deslocamento."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>

              {/* Requisito Bruto Tradicional */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requisito Bruto em Linguagem Natural</label>
                <textarea
                  rows={2}
                  value={formScenario.raw_requirement}
                  onChange={(e) => setFormScenario({ ...formScenario, raw_requirement: e.target.value })}
                  required
                  placeholder="Ex: REQ-01: O sistema deve monitorar continuamente o GPS e o acelerômetro..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsScenarioModalOpen(false)}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-xs"
                >
                  Salvar Cenário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CONFIGURAÇÕES DE API & MODELOS                           */}
      {/* ============================================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative text-xs">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Configurações de IA e Chave de API</h3>
                <p className="text-slate-500">Defina o modelo LLM e sua chave de acesso</p>
              </div>
            </div>

            <form onSubmit={handleSaveApiSettings} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provedor</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                >
                  <option value="gemini">Google Gemini (Oficial Google AI)</option>
                  <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="groq">Groq (Llama 3.3 70B Ultra Rápido)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Modelo LLM</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                >
                  <option value="gemini-2.0-flash">gemini-2.0-flash (Recomendado)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Janela Long-Context de 2M tokens)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">Chave de API</label>
                  {savedMaskedKey && (
                    <span className="text-[11px] text-emerald-700 font-mono">Ativa: {savedMaskedKey}</span>
                  )}
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Cole sua chave de API aqui..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 placeholder-slate-400"
                />
                <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Sem chave configurada, o motor especialista em regras do artigo CIn-UFPE opera offline.</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleTestApiKey}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition"
                >
                  <Plug className="w-3.5 h-3.5 text-amber-600" />
                  <span>Testar Conexão</span>
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-xs transition"
                >
                  Salvar
                </button>
              </div>

              {keyStatusMessage && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    keyStatusMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : keyStatusMessage.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  {keyStatusMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: OS 3 PARADOXOS DA LGPD VS. CONTEXTO                    */}
      {/* ============================================================== */}
      {isTheoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative my-8 max-h-[85vh] overflow-y-auto text-xs">
            <button
              onClick={() => setIsTheoryOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Fundamentação: Os Três Paradoxos</h3>
                <p className="text-slate-500">Computação Sensível ao Contexto vs. LGPD (CIn-UFPE)</p>
              </div>
            </div>

            <div className="space-y-3.5 text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>1. O Paradoxo da Inferência (Fusão de Sensores vs. Art. 6º, III - Minimização)</span>
                </h4>
                <p>
                  Para inferir uma situação de alto nível (ex: <i>"Usuário Dirigindo"</i>), o motor precisa fundir múltiplos
                  sensores simultaneamente. Contudo, a LGPD impõe a limitação ao mínimo indispensável, vedando a coleta
                  abundante sem justificativa técnica estrita para cada sensor.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>2. O Paradoxo da Proatividade (Monitoramento 24/7 vs. Art. 6º, I e II - Finalidade)</span>
                </h4>
                <p>
                  Para atuar de forma proativa (ex: Geofencing), o sistema precisa monitorar em segundo plano. Sob a LGPD,
                  coletar telemetria 24 horas por dia para atuar apenas por minutos específicos fere o princípio da adequação
                  se os dados brutos forem retidos.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>3. O Paradoxo do Largo Contexto e Nuvem Externa (LLMs vs. Art. 33 - Transf. Internacional)</span>
                </h4>
                <p>
                  Janelas extensas com dados implícitos do usuário são enviadas para LLMs no exterior. Sem mecanismos na borda
                  (Edge) e conversão para rótulos semânticos abstratos, essa prática viola a transferência internacional e o dever
                  de segurança (Art. 46).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
