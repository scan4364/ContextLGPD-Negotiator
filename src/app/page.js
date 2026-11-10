'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  ChevronDown,
  MapPin,
  Clock,
  Activity,
  Layers,
  ArrowRight,
  FileText,
  HelpCircle,
  RotateCcw,
  Undo2,
  FolderPlus,
  History,
  Folder
} from 'lucide-react';
import { INITIAL_SCENARIOS } from '@/lib/constants';

const DEFAULT_PROJECT = {
  id: 'proj_default',
  name: 'Benchmark CIn-UFPE (Mobilidade & Saúde)',
  description: 'Cenários clássicos de contextualidade e paradoxos da LGPD (Art. 6º, III e Art. 33)',
  createdAt: '2026-11-09T00:00:00.000Z',
  scenarios: INITIAL_SCENARIOS,
  chatMessages: {}
};

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

  // Projects & Multi-Workspace State
  const [projects, setProjects] = useState([DEFAULT_PROJECT]);
  const [activeProjectId, setActiveProjectId] = useState('proj_default');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isManageProjectsModalOpen, setIsManageProjectsModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    description: '',
    template: 'benchmark' // 'benchmark' | 'empty'
  });

  // Scenarios State (Active in current project)
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState(INITIAL_SCENARIOS[0].id);
  const [activeTab, setActiveTab] = useState('notation'); // 'notation' | 'diagnostics' | 'negotiated' | 'accountability' | 'chat'
  const [isNegotiating, setIsNegotiating] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'conflict' | 'negotiated'

  // Safety & Disaster Recovery State
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [trashSnapshot, setTrashSnapshot] = useState(null);
  const [undoBanner, setUndoBanner] = useState({
    visible: false,
    message: '',
    actionName: ''
  });

  // Safety Confirmation Modal
  const [safetyModal, setSafetyModal] = useState({
    isOpen: false,
    title: '',
    description: '',
    badge: '',
    warningType: 'danger', // 'danger' | 'warning'
    confirmText: '',
    requireBackupButton: true,
    onProceed: null,
    onBackupAndProceed: null
  });

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  const projectDropdownRef = useRef(null);

  // =========================================================================
  // 1. INITIALIZATION & RECOVERY
  // =========================================================================
  useEffect(() => {
    try {
      // 1. Projects & Workspaces
      const savedProjects = localStorage.getItem('context_lgpd_projects');
      const savedScenarios = localStorage.getItem('context_lgpd_scenarios');
      const savedActiveProjId = localStorage.getItem('context_lgpd_active_project_id');
      const savedChats = localStorage.getItem('context_lgpd_chats');
      const savedTrash = localStorage.getItem('context_lgpd_trash_snapshot');

      let projs = [DEFAULT_PROJECT];
      if (savedProjects) {
        projs = JSON.parse(savedProjects);
      } else if (savedScenarios) {
        // Backward-compatibility: wrap existing standalone scenarios into default project
        projs = [
          {
            id: 'proj_default',
            name: 'Projeto Principal (CIn-UFPE)',
            description: 'Cenários carregados do armazenamento local',
            createdAt: new Date().toISOString(),
            scenarios: JSON.parse(savedScenarios),
            chatMessages: savedChats ? JSON.parse(savedChats) : {}
          }
        ];
      }
      setProjects(projs);

      const activeId = savedActiveProjId && projs.some((p) => p.id === savedActiveProjId)
        ? savedActiveProjId
        : projs[0].id;
      setActiveProjectId(activeId);

      const curProj = projs.find((p) => p.id === activeId) || projs[0];
      const curScenarios = curProj.scenarios || [];
      setScenarios(curScenarios);
      if (curScenarios.length > 0) {
        setActiveScenarioId(curScenarios[0].id);
      } else {
        setActiveScenarioId(null);
      }
      setChatMessages(curProj.chatMessages || {});

      if (savedTrash) {
        setTrashSnapshot(JSON.parse(savedTrash));
      }

      // 2. Settings & AI keys
      const savedKey = localStorage.getItem('context_lgpd_api_key');
      if (savedKey) {
        setApiKey(savedKey);
        setSavedMaskedKey(savedKey.slice(0, 6) + '...' + savedKey.slice(-4));
      }
      const savedProvider = localStorage.getItem('context_lgpd_provider');
      if (savedProvider) setProvider(savedProvider);
      const savedModel = localStorage.getItem('context_lgpd_model');
      if (savedModel) setModel(savedModel);

      const lastSaved = localStorage.getItem('context_lgpd_last_saved');
      setLastSavedTime(lastSaved || new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =========================================================================
  // 2. SAFEGUARD: PREVENT UNLOAD WHEN UNSAVED CHANGES
  // =========================================================================
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isScenarioModalOpen && isFormDirty) {
        e.preventDefault();
        e.returnValue = 'Você possui alterações não salvas no formulário. Deseja realmente sair?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isScenarioModalOpen, isFormDirty]);

  // =========================================================================
  // 3. PERSISTENCE HELPERS
  // =========================================================================
  const persistScenarios = (newScenarios) => {
    setScenarios(newScenarios);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('pt-BR');
    setLastSavedTime(timeStr);

    setProjects((prevProjects) => {
      const updated = prevProjects.map((p) =>
        p.id === activeProjectId
          ? { ...p, scenarios: newScenarios, updatedAt: now.toISOString() }
          : p
      );
      try {
        localStorage.setItem('context_lgpd_projects', JSON.stringify(updated));
        localStorage.setItem('context_lgpd_scenarios', JSON.stringify(newScenarios));
        localStorage.setItem('context_lgpd_last_saved', timeStr);
      } catch (e) {
        console.error('Error saving projects/scenarios:', e);
      }
      return updated;
    });
  };

  const persistChat = (newChats) => {
    setChatMessages(newChats);
    setProjects((prevProjects) => {
      const updated = prevProjects.map((p) =>
        p.id === activeProjectId ? { ...p, chatMessages: newChats } : p
      );
      try {
        localStorage.setItem('context_lgpd_chats', JSON.stringify(newChats));
        localStorage.setItem('context_lgpd_projects', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving chats:', e);
      }
      return updated;
    });
  };

  const saveTrashSnapshot = (actionType, prevScenarios, prevChats, label) => {
    const snapshot = {
      actionType,
      scenarios: JSON.parse(JSON.stringify(prevScenarios)),
      chatMessages: JSON.parse(JSON.stringify(prevChats)),
      activeScenarioId,
      timestamp: Date.now(),
      label
    };
    setTrashSnapshot(snapshot);
    try {
      localStorage.setItem('context_lgpd_trash_snapshot', JSON.stringify(snapshot));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUndoLastAction = () => {
    if (!trashSnapshot || !trashSnapshot.scenarios) {
      alert('Nenhuma ação recente para desfazer.');
      return;
    }
    persistScenarios(trashSnapshot.scenarios);
    if (trashSnapshot.chatMessages) {
      persistChat(trashSnapshot.chatMessages);
    }
    if (trashSnapshot.activeScenarioId && trashSnapshot.scenarios.some((s) => s.id === trashSnapshot.activeScenarioId)) {
      setActiveScenarioId(trashSnapshot.activeScenarioId);
    } else if (trashSnapshot.scenarios.length > 0) {
      setActiveScenarioId(trashSnapshot.scenarios[0].id);
    }
    setTrashSnapshot(null);
    setUndoBanner({ visible: false, message: '', actionName: '' });
    try {
      localStorage.removeItem('context_lgpd_trash_snapshot');
    } catch (e) {}
    alert('Ação desfeita com sucesso! Seus dados foram recuperados com integridade.');
  };

  const triggerUndoBanner = (message) => {
    setUndoBanner({
      visible: true,
      message,
      actionName: 'Desfazer'
    });
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECT;
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

  // =========================================================================
  // 4. PROJECT MANAGEMENT ACTIONS
  // =========================================================================
  const handleSwitchProject = (projectId) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;
    setActiveProjectId(target.id);
    const projScenarios = target.scenarios || [];
    setScenarios(projScenarios);
    setChatMessages(target.chatMessages || {});
    if (projScenarios.length > 0) {
      setActiveScenarioId(projScenarios[0].id);
    } else {
      setActiveScenarioId(null);
    }
    try {
      localStorage.setItem('context_lgpd_active_project_id', target.id);
      localStorage.setItem('context_lgpd_scenarios', JSON.stringify(projScenarios));
      localStorage.setItem('context_lgpd_chats', JSON.stringify(target.chatMessages || {}));
    } catch (e) {
      console.error(e);
    }
    setIsProjectDropdownOpen(false);
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectForm.name.trim()) {
      alert('Informe o nome do projeto.');
      return;
    }

    const newProject = {
      id: 'proj_' + Date.now(),
      name: newProjectForm.name.trim(),
      description: newProjectForm.description.trim() || 'Projeto de Engenharia de Requisitos Sensíveis ao Contexto',
      createdAt: new Date().toISOString(),
      scenarios: newProjectForm.template === 'benchmark' ? JSON.parse(JSON.stringify(INITIAL_SCENARIOS)) : [],
      chatMessages: {}
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    setActiveProjectId(newProject.id);
    setScenarios(newProject.scenarios);
    setChatMessages({});
    if (newProject.scenarios.length > 0) {
      setActiveScenarioId(newProject.scenarios[0].id);
    } else {
      setActiveScenarioId(null);
    }

    try {
      localStorage.setItem('context_lgpd_projects', JSON.stringify(updatedProjects));
      localStorage.setItem('context_lgpd_active_project_id', newProject.id);
      localStorage.setItem('context_lgpd_scenarios', JSON.stringify(newProject.scenarios));
      localStorage.setItem('context_lgpd_chats', JSON.stringify({}));
    } catch (e) {
      console.error(e);
    }

    setIsNewProjectModalOpen(false);
    setNewProjectForm({ name: '', description: '', template: 'benchmark' });
    triggerUndoBanner(`Novo projeto "${newProject.name}" criado com sucesso!`);
  };

  const handleDeleteProject = (projectId) => {
    if (projects.length <= 1) {
      alert('Você não pode excluir o único projeto ativo. Crie outro projeto antes ou limpe os cenários deste.');
      return;
    }
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    setSafetyModal({
      isOpen: true,
      title: `Excluir Projeto: ${target.name}`,
      badge: 'Exclusão Crítica',
      warningType: 'danger',
      description: `Atenção: Você está prestes a excluir permanentemente o projeto "${target.name}" contendo ${target.scenarios?.length || 0} cenário(s). Para sua segurança, recomendamos baixar o backup antes.`,
      confirmText: 'Excluir Projeto',
      requireBackupButton: true,
      onBackupAndProceed: () => {
        handleExportJsonBackup();
        const updated = projects.filter((p) => p.id !== projectId);
        setProjects(updated);
        const nextProject = updated[0];
        setActiveProjectId(nextProject.id);
        setScenarios(nextProject.scenarios || []);
        setActiveScenarioId(nextProject.scenarios?.[0]?.id || null);
        setChatMessages(nextProject.chatMessages || {});
        try {
          localStorage.setItem('context_lgpd_projects', JSON.stringify(updated));
          localStorage.setItem('context_lgpd_active_project_id', nextProject.id);
        } catch (e) {}
        setSafetyModal({ ...safetyModal, isOpen: false });
        triggerUndoBanner(`Projeto "${target.name}" excluído.`);
      },
      onProceed: () => {
        const updated = projects.filter((p) => p.id !== projectId);
        setProjects(updated);
        const nextProject = updated[0];
        setActiveProjectId(nextProject.id);
        setScenarios(nextProject.scenarios || []);
        setActiveScenarioId(nextProject.scenarios?.[0]?.id || null);
        setChatMessages(nextProject.chatMessages || {});
        try {
          localStorage.setItem('context_lgpd_projects', JSON.stringify(updated));
          localStorage.setItem('context_lgpd_active_project_id', nextProject.id);
        } catch (e) {}
        setSafetyModal({ ...safetyModal, isOpen: false });
        triggerUndoBanner(`Projeto "${target.name}" excluído.`);
      }
    });
  };

  // =========================================================================
  // 5. WORKSPACE SAFETY ACTIONS (Clear, Reset, Delete)
  // =========================================================================
  const requestClearWorkspace = () => {
    if (scenarios.length === 0) {
      alert('O workspace deste projeto já está vazio.');
      return;
    }
    setSafetyModal({
      isOpen: true,
      title: 'Limpar Workspace / Zerar Cenários',
      badge: 'Ação Destrutiva',
      warningType: 'danger',
      description: `Você está prestes a remover todos os ${scenarios.length} cenários do projeto atual "${activeProject.name}" para começar do zero. Um backup de segurança será mantido na memória de recuperação e você pode baixar um arquivo JSON imediatamente.`,
      confirmText: 'Zerar Workspace',
      requireBackupButton: true,
      onBackupAndProceed: () => {
        handleExportJsonBackup();
        saveTrashSnapshot('clear_workspace', scenarios, chatMessages, 'Workspace limpo');
        persistScenarios([]);
        setActiveScenarioId(null);
        setSafetyModal({ ...safetyModal, isOpen: false });
        triggerUndoBanner(`Workspace limpo (${scenarios.length} cenários arquivados). Se foi um engano, clique em Desfazer.`);
      },
      onProceed: () => {
        saveTrashSnapshot('clear_workspace', scenarios, chatMessages, 'Workspace limpo');
        persistScenarios([]);
        setActiveScenarioId(null);
        setSafetyModal({ ...safetyModal, isOpen: false });
        triggerUndoBanner(`Workspace limpo. Cópia mantida na lixeira temporária.`);
      }
    });
  };

  const requestRestoreDefaultScenarios = () => {
    setSafetyModal({
      isOpen: true,
      title: 'Restaurar Cenários Oficiais (CIn-UFPE)',
      badge: 'Substituição de Dados',
      warningType: 'warning',
      description: `Os cenários atuais do projeto "${activeProject.name}" serão substituídos pelos 4 cenários clássicos do artigo científico (CEN-01 a CEN-04). Suas alterações locais serão sobrescritas.`,
      confirmText: 'Restaurar Padrão',
      requireBackupButton: true,
      onBackupAndProceed: () => {
        handleExportJsonBackup();
        saveTrashSnapshot('restore_default', scenarios, chatMessages, 'Cenários substituídos pelo padrão');
        persistScenarios(INITIAL_SCENARIOS);
        setActiveScenarioId(INITIAL_SCENARIOS[0].id);
        setSafetyModal({ ...safetyModal, isOpen: false });
        triggerUndoBanner('Cenários restaurados para o padrão do artigo CIn-UFPE.');
      },
      onProceed: () => {
        saveTrashSnapshot('restore_default', scenarios, chatMessages, 'Cenários substituídos pelo padrão');
        persistScenarios(INITIAL_SCENARIOS);
        setActiveScenarioId(INITIAL_SCENARIOS[0].id);
        setSafetyModal({ ...safetyModal, isOpen: false });
        triggerUndoBanner('Cenários restaurados para o padrão do artigo CIn-UFPE.');
      }
    });
  };

  const requestDeleteScenario = (scenarioId) => {
    const scn = scenarios.find((s) => s.id === scenarioId);
    if (!scn) return;

    setSafetyModal({
      isOpen: true,
      title: `Excluir Cenário: ${scn.code}`,
      badge: 'Exclusão de Requisito',
      warningType: 'danger',
      description: `Deseja realmente excluir o cenário "${scn.code}: ${scn.title}"? O item poderá ser recuperado imediatamente pelo botão "Desfazer".`,
      confirmText: 'Excluir Cenário',
      requireBackupButton: false,
      onProceed: () => {
        saveTrashSnapshot('delete_scenario', scenarios, chatMessages, `Cenário ${scn.code} excluído`);
        const filtered = scenarios.filter((s) => s.id !== scenarioId);
        persistScenarios(filtered);
        if (activeScenarioId === scenarioId) {
          setActiveScenarioId(filtered.length > 0 ? filtered[0].id : null);
        }
        setSafetyModal({ ...safetyModal, isOpen: false });
        triggerUndoBanner(`Cenário ${scn.code} excluído.`);
      }
    });
  };

  // =========================================================================
  // 6. SCENARIO CREATION & EDITING
  // =========================================================================
  const handleOpenCreateScenario = () => {
    setEditingScenarioId(null);
    setIsFormDirty(false);
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
      main_flow: '1. [Ator]: O usuário inicia a atividade.\n2. [Contexto/Borda]: O subsistema amostra sensores locais em RAM.\n3. [Gatilho]: O algoritmo confirma o evento de contexto.\n4. [PrivacyGuard]: Dados brutos são descartados e substituídos por rótulos semânticos.\n5. [Sistema]: O assistente exibe a resposta adaptada.',
      alternative_flows: 'Fluxo Alternativo 1: Em caso de falha de conexão ou recusa, atuar localmente sem envio à nuvem externa.',
      raw_requirement: '',
      external_llm_flag: true
    });
    setIsScenarioModalOpen(true);
  };

  const handleOpenEditScenario = (scn) => {
    setEditingScenarioId(scn.id);
    setIsFormDirty(false);
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

  const handleCloseScenarioModal = () => {
    if (isFormDirty) {
      if (!confirm('Você tem alterações não salvas no formulário. Deseja realmente descartar e fechar?')) {
        return;
      }
    }
    setIsFormDirty(false);
    setIsScenarioModalOpen(false);
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
    setIsFormDirty(false);
    setIsScenarioModalOpen(false);
  };

  // =========================================================================
  // 7. NEGOTIATION & CHAT ACTIONS
  // =========================================================================
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

  // =========================================================================
  // 8. BACKUP & EXPORT
  // =========================================================================
  const handleExportJsonBackup = () => {
    const backupData = {
      version: '2.5',
      exportedAt: new Date().toISOString(),
      user,
      provider,
      model,
      projects,
      activeProjectId,
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
        if (Array.isArray(parsed.projects)) {
          setProjects(parsed.projects);
          localStorage.setItem('context_lgpd_projects', JSON.stringify(parsed.projects));
          const targetProj = parsed.projects.find((p) => p.id === parsed.activeProjectId) || parsed.projects[0];
          setActiveProjectId(targetProj.id);
          setScenarios(targetProj.scenarios || []);
          setChatMessages(targetProj.chatMessages || {});
          if (targetProj.scenarios?.length > 0) setActiveScenarioId(targetProj.scenarios[0].id);
          alert(`Backup completo restaurado com sucesso! ${parsed.projects.length} projeto(s) carregado(s).`);
        } else if (Array.isArray(parsed.scenarios)) {
          persistScenarios(parsed.scenarios);
          if (parsed.chatMessages) persistChat(parsed.chatMessages);
          if (parsed.scenarios.length > 0) setActiveScenarioId(parsed.scenarios[0].id);
          alert(`Cenários restaurados com sucesso! ${parsed.scenarios.length} carregados.`);
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
    md += `**Projeto Atual:** ${activeProject.name}\n`;
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

  // =========================================================================
  // 9. SETTINGS ACTIONS
  // =========================================================================
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

          {/* Quick Badges, Project Switcher & Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Auto-Save & Safeguard Indicator */}
            <div
              className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md"
              title="Seus dados estão protegidos e salvos offline no armazenamento seguro do seu navegador"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Salvo localmente {lastSavedTime ? `às ${lastSavedTime}` : ''}</span>
            </div>

            {/* Project Switcher Dropdown */}
            <div className="relative" ref={projectDropdownRef}>
              <button
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5"
                title="Alternar ou gerenciar projetos de requisitos"
              >
                <Folder className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[140px] truncate">{activeProject.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {isProjectDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 text-xs">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Meus Projetos de Requisitos
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 my-1">
                    {projects.map((p) => {
                      const isActive = p.id === activeProjectId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSwitchProject(p.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition ${
                            isActive
                              ? 'bg-blue-50 text-blue-800 font-bold border border-blue-200'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate font-medium">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.scenarios?.length || 0} cenário(s)</p>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-100 pt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        setIsNewProjectModalOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold flex items-center space-x-1.5"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>+ Iniciar Novo Projeto</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        setIsManageProjectsModalOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5"
                    >
                      <FolderKanban className="w-3.5 h-3.5 text-slate-500" />
                      <span>Gerenciar Projetos Salvos</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProjectDropdownOpen(false);
                        requestClearWorkspace();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center space-x-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpar Cenários deste Projeto...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/ajuda"
              className="text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Guia de Ajuda</span>
            </Link>

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
              <p className="text-xs text-slate-500">
                {scenarios.length} cenário(s) em <b>{activeProject.name}</b>
              </p>
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
          <div className="space-y-2 overflow-y-auto max-h-[520px] pr-1">
            {filteredScenarios.length === 0 ? (
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Nenhum cenário neste projeto</p>
                <p className="text-[11px] text-slate-500">
                  Crie seu primeiro cenário ou carregue os cenários de benchmark do CIn-UFPE.
                </p>
                <div className="pt-2 flex flex-col gap-1.5">
                  <button
                    onClick={handleOpenCreateScenario}
                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
                  >
                    + Criar Cenário
                  </button>
                  <button
                    onClick={requestRestoreDefaultScenarios}
                    className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition"
                  >
                    ⚡ Carregar 4 Cenários do Artigo
                  </button>
                </div>
              </div>
            ) : (
              filteredScenarios.map((s) => {
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
              })
            )}
          </div>

          {/* Database, Salvaguardas & Data Utilities */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span className="flex items-center space-x-1.5">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                <span>Gerenciamento & Salvaguardas</span>
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

            <div className="border-t border-slate-100 pt-1.5 space-y-1">
              <button
                onClick={requestRestoreDefaultScenarios}
                className="w-full text-left text-[11px] text-amber-700 hover:text-amber-800 hover:underline flex items-center space-x-1"
              >
                <span>⚡ Restaurar os 4 cenários clássicos do artigo</span>
              </button>
              <button
                onClick={requestClearWorkspace}
                className="w-full text-left text-[11px] text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1"
              >
                <span>🧹 Zerar / Limpar cenários deste projeto...</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: DETAILED USER SCENARIO WORKSPACE               */}
        {/* ------------------------------------------------------------ */}
        {activeScenario ? (
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
                    {activeScenario.status === 'negotiated'
                      ? '✅ Privacy by Design Negociado'
                      : '⚠️ Conflito com LGPD Detectado'}
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
                  onClick={() => requestDeleteScenario(activeScenario.id)}
                  className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 p-2 rounded-xl transition"
                  title="Excluir cenário com salvaguarda"
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
                      <p className="text-slate-800 font-medium">
                        {activeScenario.trigger_event || activeScenario.trigger_condition || 'Não informado'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                        Sensores & Qualidade de Contexto (QoC)
                      </span>
                      <p className="text-slate-700">
                        <b>Sensores:</b> {activeScenario.sensors_and_qoc?.sensors || activeScenario.sensors || 'N/A'}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        <b>QoC Desejada:</b> {activeScenario.sensors_and_qoc?.qoc_desired || activeScenario.qoc_desired || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Pre & Post Conditions */}
                  {(activeScenario.pre_conditions || activeScenario.post_conditions) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeScenario.pre_conditions && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <span className="font-semibold text-slate-700">Pré-condições:</span>
                          <p className="text-slate-600">{activeScenario.pre_conditions}</p>
                        </div>
                      )}
                      {activeScenario.post_conditions && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <span className="font-semibold text-slate-700">Pós-condições (Garantia):</span>
                          <p className="text-slate-600">{activeScenario.post_conditions}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Flow: Numbered Step-by-Step */}
                  <div>
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                      Fluxo Principal de Eventos Passo a Passo
                    </h3>
                    <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                      {(Array.isArray(activeScenario.main_flow)
                        ? activeScenario.main_flow
                        : (activeScenario.main_flow ? activeScenario.main_flow.split('\n') : [])
                      ).map((step, idx) => (
                        <div key={idx} className="p-3 flex items-start space-x-3 hover:bg-slate-50 transition">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-slate-700 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alternative Flows */}
                  {activeScenario.alternative_flows && (
                    <div>
                      <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                        Fluxos Alternativos & Exceções
                      </h3>
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-slate-700">
                        {(Array.isArray(activeScenario.alternative_flows)
                          ? activeScenario.alternative_flows
                          : activeScenario.alternative_flows.split('\n')
                        ).map((flow, idx) => (
                          <p key={idx} className="flex items-start space-x-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{flow}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acceptance Criteria (Given-When-Then) */}
                  {activeScenario.acceptance_criteria && activeScenario.acceptance_criteria.length > 0 && (
                    <div>
                      <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Critérios de Aceitação Contextuais (BDD / Given-When-Then)</span>
                      </h3>
                      <div className="space-y-2.5">
                        {activeScenario.acceptance_criteria.map((crit, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1">
                            <h4 className="font-bold text-slate-800">{crit.title}</h4>
                            <div className="space-y-0.5 font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                              <p>
                                <span className="text-blue-600 font-bold">DADO QUE:</span> {crit.given}
                              </p>
                              <p>
                                <span className="text-amber-600 font-bold">QUANDO:</span> {crit.when}
                              </p>
                              <p>
                                <span className="text-emerald-600 font-bold">ENTÃO:</span> {crit.then}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Requirement Box */}
                  <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Requisito Bruto em Linguagem Natural (Sem Negociação)
                    </div>
                    <p className="font-mono text-slate-800">{activeScenario.raw_requirement}</p>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: LGPD PARADOX DIAGNOSTICS                          */}
              {/* ======================================================== */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-4 text-xs text-slate-800">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900">Diagnóstico dos Conflitos Regulatórios</h4>
                      <p className="text-amber-800 mt-0.5">
                        Sistemas que fundem múltiplos sensores para inferir situações implícitas entram em tensão
                        direta com os princípios da LGPD (Art. 6º, III e Art. 33).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(activeScenario.lgpd_diagnostics?.paradoxes || [
                      {
                        name: 'O Paradoxo da Inferência',
                        article: 'Art. 6º, III (Minimização / Necessidade)',
                        desc: 'Coleta de múltiplos sensores sem delimitação da resolução mínima indispensável para deduzir o estado do usuário.'
                      },
                      {
                        name: 'O Paradoxo da Proatividade',
                        article: 'Art. 6º, I e II (Finalidade e Adequação)',
                        desc: 'Monitoramento contínuo em segundo plano quando a ativação da funcionalidade é pontual e esporádica.'
                      },
                      {
                        name: 'O Paradoxo do Largo Contexto e Nuvem Externa',
                        article: 'Art. 33 (Transf. Internacional) e Art. 46 (Segurança)',
                        desc: 'Envio de telemetria bruta e identificadores diretos para provedores de LLM fora da jurisdição nacional.'
                      }
                    ]).map((p, idx) => (
                      <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                          <span className="text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                            {p.article}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{p.desc || p.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: NEGOTIATED REQUIREMENT (Privacy by Design)        */}
              {/* ======================================================== */}
              {activeTab === 'negotiated' && (
                <div className="space-y-5 text-xs text-slate-800">
                  {activeScenario.negotiated_requirement ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider flex items-center space-x-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Especificação Negociada (Conforme Art. 6º, III e Art. 33)</span>
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeScenario.negotiated_requirement);
                              alert('Copiado para a área de transferência!');
                            }}
                            className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </button>
                        </div>
                        <p className="text-sm font-medium text-emerald-950 leading-relaxed">
                          {activeScenario.negotiated_requirement}
                        </p>
                      </div>

                      {/* Before vs After */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                            Antes: Requisito Bruto
                          </span>
                          <p className="text-slate-700 font-mono text-[11px]">{activeScenario.raw_requirement}</p>
                        </div>
                        <div className="p-3.5 bg-white border border-emerald-300 rounded-xl space-y-1 shadow-xs">
                          <span className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider">
                            Depois: Privacy by Design na Borda
                          </span>
                          <p className="text-slate-800 text-[11px]">
                            Processamento em RAM na borda, mascaramento semântico de variáveis e retenção zero.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-3">
                      <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Nenhum requisito negociado ainda</h4>
                        <p className="text-slate-500 mt-1">
                          Clique no botão "Negociar com IA" no topo para gerar a especificação reescrita sob Privacy by
                          Design.
                        </p>
                      </div>
                      <button
                        onClick={() => handleNegotiateScenario(activeScenario)}
                        disabled={isNegotiating}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50 inline-flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Iniciar Negociação</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: ACCOUNTABILITY MATRIX (Art. 6º, X)                */}
              {/* ======================================================== */}
              {activeTab === 'accountability' && (
                <div className="space-y-4 text-xs text-slate-800">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Matriz de Comprovação Regulatória (Accountability)</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Demonstração técnica de conformidade para auditoria da ANPD e prestação de contas.
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
                          <th className="p-3">Variável de Contexto</th>
                          <th className="p-3">Tratamento Técnico Aplicado</th>
                          <th className="p-3">Base Legal / Justificativa LGPD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(activeScenario.accountability_matrix || [
                          {
                            variable: 'Coordenadas GPS e Localização Bruta',
                            treatment: 'Degradação métrica na borda (Edge) e conversão para tag semântica.',
                            justification: 'Art. 6º, III (Minimização e Adequação de Granularidade)'
                          },
                          {
                            variable: 'Telemetria Contínua de Movimento',
                            treatment: 'Amostragem transitória em RAM efêmera; descarte sem persistência.',
                            justification: 'Art. 15 (Término imediato do tratamento pontual)'
                          },
                          {
                            variable: 'Payload Enviado à LLM Internacional',
                            treatment: 'Sanitização via PrivacyGuard com retenção zero contratual.',
                            justification: 'Art. 33 e Art. 46 (Conformidade em Transferência Internacional)'
                          }
                        ]).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition">
                            <td className="p-3 font-semibold text-slate-900">{row.variable}</td>
                            <td className="p-3 text-slate-700">{row.treatment}</td>
                            <td className="p-3 text-slate-600 font-mono text-[11px]">{row.justification}</td>
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
                <div className="flex flex-col h-[460px] border border-slate-200 rounded-xl bg-slate-50 overflow-hidden text-xs">
                  {/* Chat Message List */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {(!chatMessages[activeScenario.id] || chatMessages[activeScenario.id].length === 0) && (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                        <p className="font-medium text-slate-600">Refinamento Interativo do Requisito</p>
                        <p className="text-[11px] max-w-sm">
                          Converse com o agente especialista para calibrar a taxa de amostragem dos sensores, alterar
                          limiares de gatilho ou ajustar os princípios de minimização.
                        </p>
                      </div>
                    )}

                    {chatMessages[activeScenario.id]?.map((msg, idx) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                              isUser
                                ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {!isUser && msg.content.includes('REQ-') && (
                              <button
                                onClick={() => handleApplySuggestedRequirement(msg.content)}
                                className="mt-2 text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2 py-1 rounded transition flex items-center space-x-1"
                              >
                                <Sparkles className="w-3 h-3 text-teal-600" />
                                <span>Aplicar esta versão na Notação</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chat Input Box */}
                  <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ex: Como degradar a resolução do GPS para atender o Art. 6º, III sem perder a função?"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1 shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <FolderPlus className="w-8 h-8 text-slate-400" />
            </div>
            <div className="max-w-md">
              <h2 className="text-base font-bold text-slate-900">Workspace Vazio: Nenhum Cenário Ativo</h2>
              <p className="text-xs text-slate-500 mt-1">
                O projeto <b>"{activeProject.name}"</b> não possui cenários cadastrados no momento. Você pode criar um
                novo cenário do zero ou restaurar os cenários de benchmark.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleOpenCreateScenario}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Novo Cenário</span>
              </button>
              <button
                onClick={requestRestoreDefaultScenarios}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Restaurar os 4 Cenários Benchmark</span>
              </button>
              {trashSnapshot && (
                <button
                  onClick={handleUndoLastAction}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-medium text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
                >
                  <Undo2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Desfazer última limpeza ({trashSnapshot.scenarios.length} cenários)</span>
                </button>
              )}
            </div>
          </section>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. DISASTER RECOVERY & UNDO BANNER (Float Notification)        */}
      {/* ============================================================== */}
      {undoBanner.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-center space-x-3 text-xs max-w-md animate-fade-in">
          <History className="w-5 h-5 text-teal-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-slate-100">{undoBanner.message}</p>
          </div>
          {trashSnapshot && (
            <button
              onClick={handleUndoLastAction}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Desfazer</span>
            </button>
          )}
          <button
            onClick={() => setUndoBanner({ visible: false, message: '', actionName: '' })}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODAL DE SALVAGUARDA DE SEGURANÇA (Destructive Action Guard) */}
      {/* ============================================================== */}
      {safetyModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <div className="flex items-center space-x-3 mb-3">
              <div
                className={`p-2.5 rounded-xl ${
                  safetyModal.warningType === 'danger'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    safetyModal.warningType === 'danger'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {safetyModal.badge || 'Salvaguarda de Segurança'}
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{safetyModal.title}</h3>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">{safetyModal.description}</p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Mecanismo de Proteção Antifalhas:</span>
              </p>
              <p>
                O sistema guarda uma cópia na memória temporária e permite reverter pelo botão <b>"Desfazer"</b>. Se
                preferir, você pode baixar o backup JSON agora mesmo para salvar no seu computador.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSafetyModal({ ...safetyModal, isOpen: false })}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-xl transition"
              >
                Cancelar
              </button>

              {safetyModal.requireBackupButton && safetyModal.onBackupAndProceed && (
                <button
                  type="button"
                  onClick={safetyModal.onBackupAndProceed}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-xs flex items-center justify-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Backup & Continuar</span>
                </button>
              )}

              {safetyModal.onProceed && (
                <button
                  type="button"
                  onClick={safetyModal.onProceed}
                  className={`w-full sm:w-auto px-4 py-2 text-white font-semibold rounded-xl transition shadow-xs ${
                    safetyModal.warningType === 'danger'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {safetyModal.confirmText || 'Confirmar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL: NOVO PROJETO                                         */}
      {/* ============================================================== */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative text-xs">
            <button
              onClick={() => setIsNewProjectModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Iniciar Novo Projeto de Requisitos</h3>
                <p className="text-slate-500">Crie um workspace independente sem afetar seus projetos anteriores</p>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Projeto</label>
                <input
                  type="text"
                  required
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                  placeholder="Ex: Cidades Inteligentes & Trânsito 2026"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descrição / Contexto</label>
                <textarea
                  rows={2}
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  placeholder="Ex: Requisitos para assistente de deslocamento urbano com dados de localização e acelerômetro"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Modelo Inicial de Cenários</label>
                <div className="space-y-1.5">
                  <label className="flex items-center space-x-2 p-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="template"
                      value="benchmark"
                      checked={newProjectForm.template === 'benchmark'}
                      onChange={() => setNewProjectForm({ ...newProjectForm, template: 'benchmark' })}
                    />
                    <div>
                      <p className="font-semibold text-slate-800">Copiar os 4 Cenários Clássicos (CIn-UFPE)</p>
                      <p className="text-[10px] text-slate-500">Inicia com os cenários de mobilidade e saúde como base</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 p-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="template"
                      value="empty"
                      checked={newProjectForm.template === 'empty'}
                      onChange={() => setNewProjectForm({ ...newProjectForm, template: 'empty' })}
                    />
                    <div>
                      <p className="font-semibold text-slate-800">Workspace em Branco (Zero Cenários)</p>
                      <p className="text-[10px] text-slate-500">Inicia um projeto vazio para cadastrar cenários do zero</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-xs"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. MODAL: GERENCIAR PROJETOS                                   */}
      {/* ============================================================== */}
      {isManageProjectsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative text-xs">
            <button
              onClick={() => setIsManageProjectsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Gerenciar Projetos Salvos</h3>
                <p className="text-slate-500">Alterne entre projetos, exporte ou remova workspaces antigos</p>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {projects.map((p) => {
                const isActive = p.id === activeProjectId;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isActive ? 'bg-blue-50/70 border-blue-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900">{p.name}</span>
                        {isActive && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-semibold">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{p.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {p.scenarios?.length || 0} cenário(s) • Criado em{' '}
                        {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {!isActive && (
                        <button
                          onClick={() => {
                            handleSwitchProject(p.id);
                            setIsManageProjectsModalOpen(false);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold text-[11px]"
                        >
                          Ativar
                        </button>
                      )}
                      {projects.length > 1 && (
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Excluir projeto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsManageProjectsModalOpen(false);
                  setIsNewProjectModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Iniciar Novo Projeto</span>
              </button>

              <button
                onClick={() => setIsManageProjectsModalOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5 rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. MODAL: FORMULÁRIO DO CENÁRIO DE USO COM PROTEÇÃO            */}
      {/* ============================================================== */}
      {isScenarioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative my-8 max-h-[90vh] overflow-y-auto text-xs">
            <button
              onClick={handleCloseScenarioModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {editingScenarioId ? 'Editar Cenário de Requisitos' : 'Novo Cenário de Requisitos de Contexto'}
                </h3>
                <p className="text-slate-500">
                  {isFormDirty ? (
                    <span className="text-amber-600 font-medium">● Alterações não salvas no formulário</span>
                  ) : (
                    'Especificação estruturada conforme metodologia de Engenharia de Requisitos'
                  )}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveScenario} className="space-y-3.5">
              {/* Código, Título e Ator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código</label>
                  <input
                    type="text"
                    required
                    value={formScenario.code}
                    onChange={(e) => {
                      setIsFormDirty(true);
                      setFormScenario({ ...formScenario, code: e.target.value });
                    }}
                    placeholder="Ex: CEN-05"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-slate-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Título do Cenário</label>
                  <input
                    type="text"
                    required
                    value={formScenario.title}
                    onChange={(e) => {
                      setIsFormDirty(true);
                      setFormScenario({ ...formScenario, title: e.target.value });
                    }}
                    placeholder="Ex: Ajuste Adaptativo de Temperatura e Iluminação"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                  />
                </div>
              </div>

              {/* Ator e História de Usuário */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ator Primário</label>
                  <input
                    type="text"
                    required
                    value={formScenario.actor}
                    onChange={(e) => {
                      setIsFormDirty(true);
                      setFormScenario({ ...formScenario, actor: e.target.value });
                    }}
                    placeholder="Ex: Ocupante Residencial"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">História de Usuário (User Story)</label>
                  <input
                    type="text"
                    value={formScenario.user_story}
                    onChange={(e) => {
                      setIsFormDirty(true);
                      setFormScenario({ ...formScenario, user_story: e.target.value });
                    }}
                    placeholder="Como [persona], quero [ação], para que [benefício]."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                  />
                </div>
              </div>

              {/* Dimensões Primárias do Contexto */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                  Dimensões Primárias do Contexto (Abowd / Dey)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Onde (Where / Espacial):</span>
                    <input
                      type="text"
                      value={formScenario.context_where}
                      onChange={(e) => {
                        setIsFormDirty(true);
                        setFormScenario({ ...formScenario, context_where: e.target.value });
                      }}
                      placeholder="Ex: Quarto ou sala de estar"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Quem (Who / Identidade):</span>
                    <input
                      type="text"
                      value={formScenario.context_who}
                      onChange={(e) => {
                        setIsFormDirty(true);
                        setFormScenario({ ...formScenario, context_who: e.target.value });
                      }}
                      placeholder="Ex: Perfil de conforto do morador"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Quando (When / Temporal):</span>
                    <input
                      type="text"
                      value={formScenario.context_when}
                      onChange={(e) => {
                        setIsFormDirty(true);
                        setFormScenario({ ...formScenario, context_when: e.target.value });
                      }}
                      placeholder="Ex: 24/7 contínuo ou horário comercial"
                      className="w-full bg-white border border-slate-300 rounded-md px-2 py-1 mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">O Quê (What / Atividade):</span>
                    <input
                      type="text"
                      value={formScenario.context_what}
                      onChange={(e) => {
                        setIsFormDirty(true);
                        setFormScenario({ ...formScenario, context_what: e.target.value });
                      }}
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
                    onChange={(e) => {
                      setIsFormDirty(true);
                      setFormScenario({ ...formScenario, trigger_event: e.target.value });
                    }}
                    placeholder="Ex: Velocidade linear sustentada > 15 km/h"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">QoC Desejada</label>
                  <input
                    type="text"
                    value={formScenario.qoc_desired}
                    onChange={(e) => {
                      setIsFormDirty(true);
                      setFormScenario({ ...formScenario, qoc_desired: e.target.value });
                    }}
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
                  onChange={(e) => {
                    setIsFormDirty(true);
                    setFormScenario({ ...formScenario, main_flow: e.target.value });
                  }}
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
                  onChange={(e) => {
                    setIsFormDirty(true);
                    setFormScenario({ ...formScenario, raw_requirement: e.target.value });
                  }}
                  required
                  placeholder="Ex: REQ-01: O sistema deve monitorar continuamente o GPS e o acelerômetro..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseScenarioModal}
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
      {/* 8. MODAL: CONFIGURAÇÕES DE API & MODELOS                       */}
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
      {/* 9. MODAL: OS 3 PARADOXOS DA LGPD VS. CONTEXTO                  */}
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
