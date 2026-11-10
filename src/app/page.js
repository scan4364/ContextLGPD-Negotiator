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
  Info,
  Sparkles,
  Edit3,
  Eye,
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
  Code,
  Lock,
  Database,
  User,
  LogOut,
  RefreshCw,
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { INITIAL_SCENARIOS } from '@/lib/constants';

export default function Home() {
  // Authentication & User State
  const [user, setUser] = useState({
    name: 'Prof. Samuel Celso (CIn-UFPE)',
    email: 'pesquisador@cin.ufpe.br'
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // AI & Model Settings
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [apiKey, setApiKey] = useState('');
  const [savedMaskedKey, setSavedMaskedKey] = useState('');
  const [keyStatusMessage, setKeyStatusMessage] = useState(null);

  // Scenarios State (Integrated Database via LocalStorage / Memory Vault)
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState(null);
  const [drawerTab, setDrawerTab] = useState('diagnostics');
  const [isNegotiating, setIsNegotiating] = useState(false);

  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('api');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState(null);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  // Scenario Form State
  const [formScenario, setFormScenario] = useState({
    code: '',
    title: '',
    actor: '',
    context_where: '',
    context_who: '',
    context_when: '',
    context_what: '',
    sensors: '',
    qoc_desired: '',
    trigger_condition: '',
    expected_inference: '',
    raw_requirement: '',
    external_llm_flag: true
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Load state from local storage on mount
  useEffect(() => {
    try {
      const savedScenarios = localStorage.getItem('context_lgpd_scenarios');
      if (savedScenarios) {
        setScenarios(JSON.parse(savedScenarios));
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

  // Persist scenarios to storage
  const persistScenarios = (newScenarios) => {
    setScenarios(newScenarios);
    try {
      localStorage.setItem('context_lgpd_scenarios', JSON.stringify(newScenarios));
    } catch (e) {
      console.error('Error saving scenarios:', e);
    }
  };

  // Persist chat to storage
  const persistChat = (newChats) => {
    setChatMessages(newChats);
    try {
      localStorage.setItem('context_lgpd_chats', JSON.stringify(newChats));
    } catch (e) {
      console.error('Error saving chats:', e);
    }
  };

  // ----------------------------------------------------
  // Scenario Management
  // ----------------------------------------------------
  const handleOpenCreateScenario = () => {
    setEditingScenarioId(null);
    setFormScenario({
      code: `CEN-0${scenarios.length + 1}`,
      title: '',
      actor: '',
      context_where: '',
      context_who: '',
      context_when: '',
      context_what: '',
      sensors: '',
      qoc_desired: '',
      trigger_condition: '',
      expected_inference: '',
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
      context_where: scn.context_where || '',
      context_who: scn.context_who || '',
      context_when: scn.context_when || '',
      context_what: scn.context_what || '',
      sensors: scn.sensors || '',
      qoc_desired: scn.qoc_desired || '',
      trigger_condition: scn.trigger_condition || '',
      expected_inference: scn.expected_inference || '',
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

    if (editingScenarioId) {
      const updated = scenarios.map((s) =>
        s.id === editingScenarioId ? { ...s, ...formScenario } : s
      );
      persistScenarios(updated);
      if (activeScenario && activeScenario.id === editingScenarioId) {
        setActiveScenario({ ...activeScenario, ...formScenario });
      }
    } else {
      const newScn = {
        ...formScenario,
        id: 'scn_' + Date.now(),
        status: 'conflict_detected',
        negotiated_requirement: null,
        lgpd_diagnostics: null,
        accountability_matrix: null
      };
      persistScenarios([...scenarios, newScn]);
    }
    setIsScenarioModalOpen(false);
  };

  const handleDeleteScenario = (id) => {
    if (!confirm('Deseja excluir este cenário?')) return;
    const filtered = scenarios.filter((s) => s.id !== id);
    persistScenarios(filtered);
    if (activeScenario?.id === id) {
      setActiveScenario(null);
    }
  };

  const handleRestoreDefaultScenarios = () => {
    if (confirm('Restaurar os 4 cenários originais do pré-artigo científico?')) {
      persistScenarios(INITIAL_SCENARIOS);
    }
  };

  // ----------------------------------------------------
  // Negotiation Action
  // ----------------------------------------------------
  const handleNegotiateScenario = async (scn) => {
    setActiveScenario(scn);
    setIsNegotiating(true);

    try {
      const res = await fetch('/api/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scn,
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
      setActiveScenario(updated);
      setDrawerTab('negotiated');
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
          scenario: activeScenario,
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
    setActiveScenario(updated);
    setDrawerTab('negotiated');
    alert('Requisito negociado atualizado com sucesso na tabela!');
  };

  // ----------------------------------------------------
  // Backup & Restore Actions (Zero-Config DB Management)
  // ----------------------------------------------------
  const handleExportJsonBackup = () => {
    const backupData = {
      version: '1.0',
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
    a.download = `backup_context_lgpd_${Date.now()}.json`;
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
          if (parsed.model) setModel(parsed.model);
          if (parsed.provider) setProvider(parsed.provider);
          alert('Backup restaurado com sucesso! ' + parsed.scenarios.length + ' cenários carregados.');
        } else if (Array.isArray(parsed)) {
          persistScenarios(parsed);
          alert('Cenários restaurados com sucesso! ' + parsed.length + ' cenários carregados.');
        } else {
          alert('Formato de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao processar arquivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // ----------------------------------------------------
  // Export RIPD Markdown
  // ----------------------------------------------------
  const handleExportMarkdown = () => {
    let md = `# RELATÓRIO TÉCNICO DE CONFORMIDADE REGULATÓRIA & ESPECIFICAÇÃO DE REQUISITOS SENSÍVEIS AO CONTEXTO\n\n`;
    md += `**Instituição:** Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE)\n`;
    md += `**Pesquisador:** ${user.name}\n`;
    md += `**Data da Emissão:** ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}\n`;
    md += `**Metodologia:** Engenharia de Requisitos de Software & Privacy by Design (Art. 6º e 33 da LGPD)\n`;
    md += `**Arquitetura Formal:** ADL ACME ContextLGPD-Negotiator\n\n`;
    md += `---\n\n`;

    md += `## 1. Sumário dos Cenários de Requisitos Sensíveis ao Contexto\n\n`;
    md += `| Código | Título | Ator | Inferência Esperada | Status LGPD |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    for (const s of scenarios) {
      const statusBadge = s.status === 'negotiated' ? '✅ Negociado (Privacy by Design)' : '⚠️ Conflito Detectado';
      md += `| ${s.code} | ${s.title} | ${s.actor} | ${s.expected_inference || 'N/A'} | ${statusBadge} |\n`;
    }
    md += `\n---\n\n`;

    md += `## 2. Detalhamento e Negociação dos Cenários\n\n`;
    for (const s of scenarios) {
      md += `### Cenário ${s.code}: ${s.title}\n\n`;
      md += `- **Ator:** ${s.actor}\n`;
      md += `- **Dimensões do Contexto:** Onde (${s.context_where || '-'}), Quem (${s.context_who || '-'}), Quando (${s.context_when || '-'}), O Quê (${s.context_what || '-'})\n`;
      md += `- **Sensores e Fontes Implícitas:** ${s.sensors || 'N/A'}\n`;
      md += `- **Qualidade de Contexto (QoC) Desejada:** ${s.qoc_desired || 'N/A'}\n`;
      md += `- **Gatilho de Ativação (Trigger):** ${s.trigger_condition || 'N/A'}\n`;
      md += `- **Inferência Contextual (Finalidade):** ${s.expected_inference || 'N/A'}\n\n`;

      md += `#### Especificação Tradicional (Requisito Bruto):\n`;
      md += `> ${s.raw_requirement}\n\n`;

      if (s.negotiated_requirement) {
        md += `#### Especificação Negociada (Privacy by Design & Artigos 6º e 33 da LGPD):\n`;
        md += `> **${s.negotiated_requirement}**\n\n`;
      }

      const paradoxes = s.lgpd_diagnostics?.paradoxes || [];
      if (paradoxes.length > 0) {
        md += `#### Diagnóstico dos Paradoxos de Privacidade:\n`;
        for (const p of paradoxes) {
          md += `- **${p.name}** (*${p.article}*): ${p.explanation || p.desc}\n`;
        }
        md += `\n`;
      }

      const matrix = s.accountability_matrix || [];
      if (matrix.length > 0) {
        md += `#### Matriz de Comprovação Regulatória (Accountability - Art. 6º, X da LGPD):\n\n`;
        md += `| Variável de Contexto | Tratamento Técnico Aplicado | Base Legal / Justificativa LGPD |\n`;
        md += `| :--- | :--- | :--- |\n`;
        for (const row of matrix) {
          md += `| ${row.variable} | ${row.treatment} | ${row.justification} |\n`;
        }
        md += `\n`;
      }
      md += `---\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RIPD_ContextLGPD_CIn_UFPE_${Date.now()}.md`;
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
    setKeyStatusMessage({ type: 'success', text: 'Configurações de modelo e chave salvas com segurança no navegador!' });
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setKeyStatusMessage({ type: 'error', text: 'Informe a chave de API para testar.' });
      return;
    }
    setKeyStatusMessage({ type: 'info', text: 'Testando conexão com o modelo de IA...' });
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
    <div className="min-h-screen flex flex-col bg-darkbg text-slate-100">
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportJsonBackup}
        accept=".json"
        className="hidden"
      />

      {/* ============================================================== */}
      {/* TOP NAVBAR                                                     */}
      {/* ============================================================== */}
      <header className="border-b border-borderbg bg-cardbg/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  ContextLGPD
                </span>
                <span className="text-xs bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
                  CIn-UFPE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Mediação entre Computação Sensível ao Contexto e a LGPD via Requisitos
              </p>
            </div>
          </div>

          {/* Status Pills */}
          <div className="hidden md:flex items-center space-x-3">
            <div
              onClick={() => {
                setSettingsTab('db');
                setIsSettingsOpen(true);
              }}
              className="flex items-center space-x-1.5 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full cursor-pointer hover:bg-emerald-500/20 transition"
              title="Banco de dados integrado. Sem limites, sem cadastros externos e sem GitHub Actions."
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>🟢 Banco Integrado (Zero-Config)</span>
            </div>

            <div
              onClick={() => {
                setSettingsTab('api');
                setIsSettingsOpen(true);
              }}
              className="flex items-center space-x-1.5 text-xs bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full cursor-pointer hover:bg-indigo-500/20 transition"
              title="Clique para alterar modelo ou chave de API"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>{model}</span>
            </div>
          </div>

          {/* User Menu & Actions */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setIsTheoryOpen(true)}
              className="hidden sm:flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded-lg transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Os 3 Paradoxos</span>
            </button>

            <button
              onClick={() => {
                setSettingsTab('api');
                setIsSettingsOpen(true);
              }}
              className="flex items-center space-x-1.5 text-xs bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded-lg transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Configurações (API & Dados)</span>
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-300">
                {user.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-slate-300 hidden lg:inline-block max-w-[120px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN WORKSPACE                                                 */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col space-y-6">
        {/* Banner de Ações */}
        <div className="bg-cardbg border border-borderbg rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Tabela de Cenários de Usuário (Engenharia de Requisitos)</span>
              <span className="text-xs bg-slate-800 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded-full font-normal">
                Sommerville / Robertson
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Especifique as variáveis de contexto implícito e deixe o assistente negociar a calibração de QoC e a conformidade com a LGPD.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleOpenCreateScenario}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cenário</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center space-x-1.5"
              title="Restaurar cenários a partir de arquivo JSON"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Importar JSON</span>
            </button>

            <button
              onClick={handleExportJsonBackup}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center space-x-1.5"
              title="Salvar backup completo em arquivo JSON"
            >
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span>Backup JSON</span>
            </button>

            <button
              onClick={handleExportMarkdown}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center space-x-1.5"
              title="Baixar relatório de impacto RIPD em Markdown"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar RIPD (Art. 6º, X)</span>
            </button>
          </div>
        </div>

        {/* TABELA DE CENÁRIOS DE USO */}
        <div className="bg-cardbg border border-borderbg rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-borderbg flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Especificação Formal de Cenários Sensíveis ao Contexto
              </span>
            </div>
            <span className="text-xs text-slate-400">{scenarios.length} cenário(s) cadastrado(s)</span>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900/80 text-slate-300 uppercase tracking-wider sticky top-0 z-10 border-b border-borderbg backdrop-blur">
                <tr>
                  <th className="p-3 w-16 text-center">Código</th>
                  <th className="p-3 min-w-[180px]">Título & Ator</th>
                  <th className="p-3 min-w-[200px]">Dimensões do Contexto (Abowd/Dey)</th>
                  <th className="p-3 min-w-[160px]">Sensores / Entradas Implícitas</th>
                  <th className="p-3 min-w-[140px]">QoC Desejada</th>
                  <th className="p-3 min-w-[150px]">Gatilho (Trigger)</th>
                  <th className="p-3 min-w-[160px]">Inferência Esperada</th>
                  <th className="p-3 w-32 text-center">Status LGPD</th>
                  <th className="p-3 w-40 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderbg text-slate-300">
                {scenarios.map((s) => {
                  const isNegotiated = s.status === 'negotiated';
                  const isRowActive = activeScenario?.id === s.id;

                  return (
                    <tr
                      key={s.id}
                      className={`transition hover:bg-slate-800/40 ${
                        isRowActive ? 'bg-indigo-950/30 border-l-2 border-indigo-500' : ''
                      }`}
                    >
                      <td className="p-3 text-center font-mono font-bold text-indigo-400">{s.code}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{s.title}</div>
                        <div className="text-[11px] text-slate-400">
                          Ator: <span className="text-slate-300 font-medium">{s.actor}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5 text-[11px]">
                          <div>
                            <b className="text-slate-400">Onde:</b> {s.context_where || '-'}
                          </div>
                          <div>
                            <b className="text-slate-400">Quem:</b> {s.context_who || '-'}
                          </div>
                          <div>
                            <b className="text-slate-400">Quando:</b> {s.context_when || '-'}
                          </div>
                          <div>
                            <b className="text-slate-400">O Quê:</b> {s.context_what || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-block bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded text-[11px] leading-tight">
                          {s.sensors || 'Não informado'}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-300">{s.qoc_desired || '-'}</td>
                      <td className="p-3 text-[11px] font-mono text-amber-300/90">{s.trigger_condition || '-'}</td>
                      <td className="p-3 text-[11px] text-indigo-200">{s.expected_inference || '-'}</td>
                      <td className="p-3 text-center">
                        {isNegotiated ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Negociado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Conflito</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleNegotiateScenario(s)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-lg text-xs transition shadow-sm"
                            title="Negociar com IA (ContextLGPD-Negotiator)"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditScenario(s)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-xs transition"
                            title="Editar Cenário"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveScenario(s);
                              setDrawerTab('diagnostics');
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg text-xs transition"
                            title="Ver Detalhes e Chat"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteScenario(s.id)}
                            className="bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 p-1.5 rounded-lg text-xs transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PAINEL DE NEGOCIAÇÃO & CHAT INTELIGENTE (DRAWER)               */}
        {/* ============================================================== */}
        {activeScenario && (
          <div className="bg-cardbg border border-borderbg rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-borderbg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-sm text-white">
                      Negociação: {activeScenario.code} - {activeScenario.title}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        activeScenario.status === 'negotiated'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {activeScenario.status === 'negotiated' ? 'Em Conformidade' : 'Conflito Detectado'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Motor de Mediação ContextLGPD-Negotiator (ADL ACME & BPMN)</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNegotiateScenario(activeScenario)}
                  disabled={isNegotiating}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isNegotiating ? 'animate-spin' : ''}`} />
                  <span>{isNegotiating ? 'Negociando...' : 'Re-negociar com IA'}</span>
                </button>
                <button
                  onClick={() => setActiveScenario(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-borderbg bg-slate-900/50 text-xs px-4">
              <button
                onClick={() => setDrawerTab('diagnostics')}
                className={`py-2.5 px-4 font-semibold transition flex items-center space-x-1.5 border-b-2 ${
                  drawerTab === 'diagnostics'
                    ? 'text-indigo-400 border-indigo-500'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>1. Diagnóstico & Paradoxos</span>
              </button>

              <button
                onClick={() => setDrawerTab('negotiated')}
                className={`py-2.5 px-4 font-semibold transition flex items-center space-x-1.5 border-b-2 ${
                  drawerTab === 'negotiated'
                    ? 'text-indigo-400 border-indigo-500'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>2. Requisito Negociado (Privacy by Design)</span>
              </button>

              <button
                onClick={() => setDrawerTab('accountability')}
                className={`py-2.5 px-4 font-semibold transition flex items-center space-x-1.5 border-b-2 ${
                  drawerTab === 'accountability'
                    ? 'text-indigo-400 border-indigo-500'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>3. Matriz de Accountability (Art. 6º, X)</span>
              </button>

              <button
                onClick={() => setDrawerTab('chat')}
                className={`py-2.5 px-4 font-semibold transition flex items-center space-x-1.5 border-b-2 ${
                  drawerTab === 'chat'
                    ? 'text-indigo-400 border-indigo-500'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>4. Chat de Refinamento</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 min-h-[300px]">
              {/* Tab 1: Diagnóstico */}
              {drawerTab === 'diagnostics' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Requisito Bruto Tradicional (Entrada)
                    </div>
                    <p className="text-xs text-slate-200 italic font-mono bg-black/30 p-2.5 rounded-lg border border-slate-800">
                      "{activeScenario.raw_requirement}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Atritos Regulatórios Identificados pelo PrivacyGuard:</span>
                    </h4>

                    {(activeScenario.lgpd_diagnostics?.paradoxes || []).map((p, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-amber-400 flex items-center space-x-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{p.name}</span>
                          </span>
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-mono">
                            {p.article}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{p.explanation || p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Requisito Negociado */}
              {drawerTab === 'negotiated' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Especificação Tradicional (Violadora)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {activeScenario.raw_requirement}
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Especificação Negociada (A 'Cola' Contexto + LGPD)</span>
                    </div>
                    <p className="text-xs text-emerald-200 font-medium leading-relaxed font-mono">
                      {activeScenario.negotiated_requirement ||
                        'Aguardando negociação pelo ContextLGPD-Negotiator...'}
                    </p>
                    {activeScenario.negotiated_requirement && (
                      <div className="mt-3 pt-3 border-t border-emerald-500/20 flex justify-end">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeScenario.negotiated_requirement);
                            alert('Requisito copiado!');
                          }}
                          className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center space-x-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Requisito</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Matriz de Accountability */}
              {drawerTab === 'accountability' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Documentação de Comprovação Regulatória (Art. 6º, X - Accountability)
                    </h4>
                    <span className="text-[11px] text-slate-400">Pronta para auditoria ANPD</span>
                  </div>
                  <div className="overflow-x-auto border border-borderbg rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-300 uppercase">
                        <tr>
                          <th className="p-3 min-w-[150px]">Variável de Contexto</th>
                          <th className="p-3 min-w-[200px]">Tratamento Técnico Aplicado</th>
                          <th className="p-3 min-w-[200px]">Base Legal / Justificativa LGPD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-borderbg text-slate-300">
                        {(activeScenario.accountability_matrix || []).map((m, idx) => (
                          <tr key={idx}>
                            <td className="p-3 font-semibold text-white">{m.variable}</td>
                            <td className="p-3 text-slate-300">{m.treatment}</td>
                            <td className="p-3 font-mono text-indigo-300">{m.justification}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Chat de Refinamento */}
              {drawerTab === 'chat' && (
                <div className="flex flex-col h-[380px]">
                  <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                    {(chatMessages[activeScenario.id] || []).length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                        <Bot className="w-8 h-8 text-indigo-400 mx-auto" />
                        <p className="font-semibold text-white">Canal de Refinamento ContextLGPD-Negotiator</p>
                        <p className="text-[11px] text-slate-400">
                          Faça perguntas ou solicite alterações de granularidade, gatilhos de borda ou conformidade jurídica para este cenário.
                        </p>
                      </div>
                    ) : (
                      (chatMessages[activeScenario.id] || []).map((msg, i) => {
                        const isUser = msg.role === 'user';
                        const hasSuggested =
                          !isUser && msg.content.includes('[NOVO_REQUISITO_SUGERIDO]');
                        let suggestedText = '';
                        if (hasSuggested) {
                          const match = msg.content.match(
                            /\[NOVO_REQUISITO_SUGERIDO\]([\s\S]*?)\[\/NOVO_REQUISITO_SUGERIDO\]/
                          );
                          if (match) suggestedText = match[1].trim();
                        }

                        return (
                          <div
                            key={i}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] text-xs p-3.5 shadow-md ${
                                isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'
                              }`}
                            >
                              <div
                                className={`flex items-center space-x-1.5 mb-1 text-[10px] font-semibold ${
                                  isUser ? 'text-indigo-200' : 'text-slate-400'
                                }`}
                              >
                                {isUser ? (
                                  <User className="w-3 h-3" />
                                ) : (
                                  <Bot className="w-3 h-3" />
                                )}
                                <span>
                                  {isUser ? 'Engenheiro de Requisitos' : 'ContextLGPD-Negotiator'}
                                </span>
                              </div>
                              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                              {hasSuggested && suggestedText && (
                                <div className="mt-2 pt-2 border-t border-slate-700/60 flex justify-end">
                                  <button
                                    onClick={() => handleApplySuggestedRequirement(suggestedText)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Aplicar esta versão na Tabela</span>
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
                      placeholder="Peça ajustes ao ContextLGPD-Negotiator (ex: aumente a degradação do GPS, justifique Art. 33)..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL: CONFIGURAÇÕES DE API & GERENCIAMENTO DE DADOS          */}
      {/* ============================================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-cardbg border border-borderbg rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Configurações do Sistema</h3>
                <p className="text-xs text-slate-400">Modelo LLM e Gerenciamento de Dados Integrado</p>
              </div>
            </div>

            <div className="flex border-b border-slate-800 mb-5">
              <button
                onClick={() => setSettingsTab('api')}
                className={`pb-2 px-3 text-xs font-semibold transition ${
                  settingsTab === 'api'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                Modelo & Chave API
              </button>
              <button
                onClick={() => setSettingsTab('db')}
                className={`pb-2 px-3 text-xs font-semibold transition ${
                  settingsTab === 'db'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                Banco Integrado & Backup
              </button>
            </div>

            {settingsTab === 'api' ? (
              <form onSubmit={handleSaveApiSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Provedor de Inteligência Artificial
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="gemini">Google Gemini (DeepMind / Google AI)</option>
                    <option value="openai">OpenAI (GPT-4o)</option>
                    <option value="groq">Groq (Llama 3.3 70B Ultra Rápido)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Modelo de Linguagem (LLM)
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Recomendado)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Long-Context 2M)</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Chave de API
                    </label>
                    {savedMaskedKey && (
                      <span className="text-[11px] text-emerald-400 font-mono">
                        Ativa: {savedMaskedKey}
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Cole sua chave de API aqui..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-1 flex items-center space-x-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Se não informar uma chave, o sistema opera com o motor de regras local do artigo.</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleTestApiKey}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1.5"
                  >
                    <Plug className="w-3.5 h-3.5 text-amber-400" />
                    <span>Testar Conexão</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Configurações</span>
                  </button>
                </div>

                {keyStatusMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs ${
                      keyStatusMessage.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : keyStatusMessage.type === 'error'
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    }`}
                  >
                    {keyStatusMessage.text}
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-slate-300">
                  <div className="flex items-center space-x-2 font-semibold text-emerald-300 mb-1">
                    <Database className="w-4 h-4" />
                    <span>Sistema de Gerenciamento de Dados Integrado (Zero-Config)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    O sistema utiliza armazenamento persistente integrado diretamente no seu navegador. É a solução mais simples possível:
                    <b> não possui limites de cota</b>, <b>não requer serviços externos</b> e <b>não precisa de GitHub Actions</b>.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Cenários Atuais Salvos:</span>
                    <b className="text-white">{scenarios.length}</b>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status de Armazenamento:</span>
                    <b className="text-emerald-400">100% Operacional & Persistente</b>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleExportJsonBackup}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Backup Completo (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5"
                  >
                    <Upload className="w-4 h-4 text-sky-400" />
                    <span>Restaurar Backup (JSON)</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleRestoreDefaultScenarios}
                    className="w-full text-center text-xs text-amber-400 hover:text-amber-300 py-1"
                  >
                    ⚡ Restaurar os 4 cenários clássicos do pré-artigo científico
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CRIAR / EDITAR CENÁRIO                                  */}
      {/* ============================================================== */}
      {isScenarioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-cardbg border border-borderbg rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsScenarioModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {editingScenarioId ? `Editar ${formScenario.code}` : 'Cadastrar Cenário de Usuário'}
                </h3>
                <p className="text-xs text-slate-400">
                  Estruturação segundo o padrão de Engenharia de Requisitos Sensíveis ao Contexto
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveScenario} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Código
                  </label>
                  <input
                    type="text"
                    value={formScenario.code}
                    onChange={(e) => setFormScenario({ ...formScenario, code: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Título do Cenário
                  </label>
                  <input
                    type="text"
                    value={formScenario.title}
                    onChange={(e) => setFormScenario({ ...formScenario, title: e.target.value })}
                    placeholder="Ex: Assistente de Rota Inteligente no Trânsito"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Ator Principal / Entidade
                </label>
                <input
                  type="text"
                  value={formScenario.actor}
                  onChange={(e) => setFormScenario({ ...formScenario, actor: e.target.value })}
                  placeholder="Ex: Motorista em Deslocamento / Paciente / Consumidor"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Dimensões Primárias */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Dimensões Primárias de Contexto (Abowd et al., 1999)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Onde (Where / Localização):</span>
                    <input
                      type="text"
                      value={formScenario.context_where}
                      onChange={(e) => setFormScenario({ ...formScenario, context_where: e.target.value })}
                      placeholder="Ex: GPS contínuo, Geofencing"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 mt-1 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400">Quem (Who / Identidade):</span>
                    <input
                      type="text"
                      value={formScenario.context_who}
                      onChange={(e) => setFormScenario({ ...formScenario, context_who: e.target.value })}
                      placeholder="Ex: Perfil de usuário, biometria"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 mt-1 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400">Quando (When / Tempo):</span>
                    <input
                      type="text"
                      value={formScenario.context_when}
                      onChange={(e) => setFormScenario({ ...formScenario, context_when: e.target.value })}
                      placeholder="Ex: 24/7 contínuo ou horário comercial"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 mt-1 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400">O Quê (What / Atividade):</span>
                    <input
                      type="text"
                      value={formScenario.context_what}
                      onChange={(e) => setFormScenario({ ...formScenario, context_what: e.target.value })}
                      placeholder="Ex: Em deslocamento, dormindo"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 mt-1 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Sensores / Entradas Implícitas
                  </label>
                  <input
                    type="text"
                    value={formScenario.sensors}
                    onChange={(e) => setFormScenario({ ...formScenario, sensors: e.target.value })}
                    placeholder="Ex: GPS, Acelerômetro, Microfone"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Qualidade de Contexto (QoC)
                  </label>
                  <input
                    type="text"
                    value={formScenario.qoc_desired}
                    onChange={(e) => setFormScenario({ ...formScenario, qoc_desired: e.target.value })}
                    placeholder="Ex: Precisão < 10m, taxa 1s"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Gatilho de Ativação (Trigger)
                  </label>
                  <input
                    type="text"
                    value={formScenario.trigger_condition}
                    onChange={(e) => setFormScenario({ ...formScenario, trigger_condition: e.target.value })}
                    placeholder="Ex: Velocidade > 15 km/h detectada"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Inferência Esperada (Finalidade)
                  </label>
                  <input
                    type="text"
                    value={formScenario.expected_inference}
                    onChange={(e) => setFormScenario({ ...formScenario, expected_inference: e.target.value })}
                    placeholder="Ex: Situação 'Usuário_Em_Trânsito'"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Requisito Bruto em Linguagem Natural
                </label>
                <textarea
                  rows={3}
                  value={formScenario.raw_requirement}
                  onChange={(e) => setFormScenario({ ...formScenario, raw_requirement: e.target.value })}
                  placeholder="Ex: REQ-01: O sistema deve monitorar continuamente o GPS e o acelerômetro..."
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="external-llm-chk"
                  checked={formScenario.external_llm_flag}
                  onChange={(e) => setFormScenario({ ...formScenario, external_llm_flag: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="external-llm-chk" className="text-xs text-slate-300">
                  Envia contexto implícito para <b>LLM Externa / Nuvem Internacional</b> (Gera risco Art. 33 LGPD)
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsScenarioModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Cenário</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: TEORIA, PARADOXOS LGPD & ACME                           */}
      {/* ============================================================== */}
      {isTheoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-cardbg border border-borderbg rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsTheoryOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Fundamentação Científica: Os Três Paradoxos</h3>
                <p className="text-xs text-slate-400">Computação Sensível ao Contexto vs. LGPD (CIn-UFPE)</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-indigo-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>1. O Paradoxo da Inferência (Fusão de Sensores vs. Art. 6º, III - Minimização)</span>
                </h4>
                <p>
                  Para deduzir situações de alto nível (ex: <i>"Usuário Dirigindo"</i>), o motor precisa fundir múltiplos sensores (GPS, acelerômetro, calendário, giroscópio). Contudo, a LGPD impõe a limitação do tratamento ao mínimo indispensável, vedando a coleta indiscriminada sem comprovação de vínculo estrito.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-amber-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>2. O Paradoxo da Proatividade (Monitoramento 24/7 vs. Art. 6º, I e II - Finalidade)</span>
                </h4>
                <p>
                  Para agir de forma proativa (ex: Geofencing), o sistema precisa monitorar continuamente em background. Sob a ótica da LGPD, reter telemetria o dia todo para atuar apenas por minutos fere o princípio da proporcionalidade.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-rose-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>3. O Paradoxo do Largo Contexto e Nuvem Externa (LLMs vs. Art. 33 - Transferência Internacional)</span>
                </h4>
                <p>
                  Aplicações modernas enviam janelas massivas com dados brutos para servidores de LLM no exterior. Sem sanitização na borda (Edge Computing) e conversão em rótulos semânticos abstratos, configura-se violação à transferência internacional e ao dever de segurança técnica (Art. 46).
                </p>
              </div>

              <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl space-y-2">
                <h4 className="font-bold text-white flex items-center space-x-1.5">
                  <Code className="w-4 h-4 text-indigo-400" />
                  <span>A Arquitetura Formal ADL ACME: ContextLGPD-Negotiator</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
                  <li><code>ReqInputInterface</code>: Interface cliente com o engenheiro de requisitos.</li>
                  <li><code>ContextParserEngine</code>: Extrai dimensões (Where, Who, When, What) e parâmetros de QoC.</li>
                  <li><code>PrivacyGuardSanitizer</code>: Avalia artigos da LGPD e impõe sanitização na borda.</li>
                  <li><code>ExternalLLMReasoning</code>: Motor de inferência agêntico em nuvem internacional com Zero-Storage.</li>
                  <li><code>RegulatoryDocGenerator</code>: Emite a Matriz de Accountability (Art. 6º, X).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
