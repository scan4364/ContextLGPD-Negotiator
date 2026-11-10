'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Workspace from '@/components/Workspace';
import EmptyWorkspace from '@/components/EmptyWorkspace';
import UndoBanner from '@/components/UndoBanner';
import LandingPage from '@/components/LandingPage';
import SafetyModal from '@/components/modals/SafetyModal';
import ScenarioModal from '@/components/modals/ScenarioModal';
import NewProjectModal from '@/components/modals/NewProjectModal';
import ManageProjectsModal from '@/components/modals/ManageProjectsModal';
import SettingsModal from '@/components/modals/SettingsModal';
import TheoryModal from '@/components/modals/TheoryModal';
import LogoutModal from '@/components/modals/LogoutModal';
import { INITIAL_SCENARIOS } from '@/lib/constants';

const DEFAULT_USER = {
  name: 'Samuel Anjos Neto',
  email: 'pesquisador@cin.ufpe.br',
  institution: 'Centro de Informática (CIn) — UFPE'
};

const DEFAULT_PROJECT = {
  id: 'proj_default',
  name: 'Benchmark CIn-UFPE (Mobilidade & Saúde)',
  description: 'Cenários clássicos de contextualidade e paradoxos da LGPD (Art. 6º, III e Art. 33)',
  createdAt: '2026-11-09T00:00:00.000Z',
  scenarios: INITIAL_SCENARIOS,
  chatMessages: {}
};

export default function Home() {
  // Authentication & Session
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(DEFAULT_USER);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // AI & Model Settings
  const [provider, setProvider] = useState('gemini');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [apiKey, setApiKey] = useState('');
  const [savedMaskedKey, setSavedMaskedKey] = useState('');
  const [keyStatusMessage, setKeyStatusMessage] = useState(null);

  // Projects & Multi-Workspace State
  const [projects, setProjects] = useState([DEFAULT_PROJECT]);
  const [activeProjectId, setActiveProjectId] = useState('proj_default');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isManageProjectsModalOpen, setIsManageProjectsModalOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    description: '',
    template: 'benchmark'
  });

  // Scenarios State (Active in current project)
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState(INITIAL_SCENARIOS[0].id);
  const [activeTab, setActiveTab] = useState('notation');
  const [isNegotiating, setIsNegotiating] = useState(false);

  // UI Minimalism: Sidebar Collapsible State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    warningType: 'danger',
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

  // =========================================================================
  // 1. INITIALIZATION & RECOVERY
  // =========================================================================
  useEffect(() => {
    try {
      // 1. Check Session
      const savedSession = localStorage.getItem('context_lgpd_session');
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        if (sessionData && sessionData.isLoggedIn) {
          setIsLoggedIn(true);
          if (sessionData.user) setUser(sessionData.user);
        }
      }

      // 2. Projects & Scenarios
      const savedProjects = localStorage.getItem('context_lgpd_projects');
      const savedScenarios = localStorage.getItem('context_lgpd_scenarios');
      const savedActiveProjId = localStorage.getItem('context_lgpd_active_project_id');
      const savedChats = localStorage.getItem('context_lgpd_chats');
      const savedTrash = localStorage.getItem('context_lgpd_trash_snapshot');

      let projs = [DEFAULT_PROJECT];
      if (savedProjects) {
        projs = JSON.parse(savedProjects);
      } else if (savedScenarios) {
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

      // 3. Settings & AI keys
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
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Safeguard: Prevent Unload when unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isLoggedIn && isScenarioModalOpen && isFormDirty) {
        e.preventDefault();
        e.returnValue = 'Você possui alterações não salvas no formulário. Deseja realmente sair?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoggedIn, isScenarioModalOpen, isFormDirty]);

  // =========================================================================
  // 2. AUTHENTICATION (LOGIN, REGISTER, LOGOUT)
  // =========================================================================
  const handleLoginWithJson = (parsedData) => {
    try {
      if (parsedData.user) {
        setUser(parsedData.user);
      }
      if (Array.isArray(parsedData.projects)) {
        setProjects(parsedData.projects);
        localStorage.setItem('context_lgpd_projects', JSON.stringify(parsedData.projects));
        const targetProj = parsedData.projects.find((p) => p.id === parsedData.activeProjectId) || parsedData.projects[0];
        setActiveProjectId(targetProj.id);
        setScenarios(targetProj.scenarios || []);
        setChatMessages(targetProj.chatMessages || {});
        if (targetProj.scenarios?.length > 0) setActiveScenarioId(targetProj.scenarios[0].id);
      } else if (Array.isArray(parsedData.scenarios)) {
        persistScenarios(parsedData.scenarios);
        if (parsedData.chatMessages) persistChat(parsedData.chatMessages);
        if (parsedData.scenarios.length > 0) setActiveScenarioId(parsedData.scenarios[0].id);
      } else if (Array.isArray(parsedData)) {
        persistScenarios(parsedData);
        if (parsedData.length > 0) setActiveScenarioId(parsedData[0].id);
      }

      if (parsedData.apiKey) {
        setApiKey(parsedData.apiKey);
        setSavedMaskedKey(parsedData.apiKey.slice(0, 6) + '...' + parsedData.apiKey.slice(-4));
        localStorage.setItem('context_lgpd_api_key', parsedData.apiKey);
      }
      if (parsedData.provider) {
        setProvider(parsedData.provider);
        localStorage.setItem('context_lgpd_provider', parsedData.provider);
      }
      if (parsedData.model) {
        setModel(parsedData.model);
        localStorage.setItem('context_lgpd_model', parsedData.model);
      }

      const sessionObj = {
        isLoggedIn: true,
        user: parsedData.user || user,
        loginAt: new Date().toISOString()
      };
      localStorage.setItem('context_lgpd_session', JSON.stringify(sessionObj));
      setIsLoggedIn(true);
    } catch (err) {
      alert('Erro ao carregar dados do arquivo JSON: ' + err.message);
    }
  };

  const handleRegisterUser = (regData) => {
    const newUser = {
      name: regData.name.trim(),
      email: regData.email.trim(),
      institution: regData.institution.trim()
    };
    setUser(newUser);

    const initialProj = {
      id: 'proj_' + Date.now(),
      name: regData.initialProjectName.trim(),
      description: 'Projeto registrado no cofre local do CIn-UFPE',
      createdAt: new Date().toISOString(),
      scenarios: regData.template === 'benchmark' ? JSON.parse(JSON.stringify(INITIAL_SCENARIOS)) : [],
      chatMessages: {}
    };

    setProjects([initialProj]);
    setActiveProjectId(initialProj.id);
    setScenarios(initialProj.scenarios);
    setChatMessages({});
    if (initialProj.scenarios.length > 0) {
      setActiveScenarioId(initialProj.scenarios[0].id);
    } else {
      setActiveScenarioId(null);
    }

    try {
      localStorage.setItem('context_lgpd_projects', JSON.stringify([initialProj]));
      localStorage.setItem('context_lgpd_active_project_id', initialProj.id);
      localStorage.setItem('context_lgpd_scenarios', JSON.stringify(initialProj.scenarios));
      localStorage.setItem('context_lgpd_chats', JSON.stringify({}));
      localStorage.setItem(
        'context_lgpd_session',
        JSON.stringify({ isLoggedIn: true, user: newUser, loginAt: new Date().toISOString() })
      );
    } catch (e) {
      console.error(e);
    }

    setIsLoggedIn(true);
  };

  const handleQuickStartBenchmark = () => {
    setUser(DEFAULT_USER);
    setProjects([DEFAULT_PROJECT]);
    setActiveProjectId('proj_default');
    setScenarios(INITIAL_SCENARIOS);
    setActiveScenarioId(INITIAL_SCENARIOS[0].id);
    setChatMessages({});

    try {
      localStorage.setItem('context_lgpd_projects', JSON.stringify([DEFAULT_PROJECT]));
      localStorage.setItem('context_lgpd_active_project_id', 'proj_default');
      localStorage.setItem('context_lgpd_scenarios', JSON.stringify(INITIAL_SCENARIOS));
      localStorage.setItem('context_lgpd_chats', JSON.stringify({}));
      localStorage.setItem(
        'context_lgpd_session',
        JSON.stringify({ isLoggedIn: true, user: DEFAULT_USER, loginAt: new Date().toISOString() })
      );
    } catch (e) {
      console.error(e);
    }

    setIsLoggedIn(true);
  };

  const handleLogoutWithBackup = () => {
    handleExportJsonBackup();
    performLogout();
  };

  const handleLogoutDirect = () => {
    performLogout();
  };

  const performLogout = () => {
    try {
      localStorage.removeItem('context_lgpd_session');
    } catch (e) {}
    setIsLoggedIn(false);
    setIsLogoutModalOpen(false);
  };

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
  // 4. PROJECT ACTIONS
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
      alert('Você não pode excluir o único projeto ativo.');
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
        setSafetyModal((prev) => ({ ...prev, isOpen: false }));
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
        setSafetyModal((prev) => ({ ...prev, isOpen: false }));
        triggerUndoBanner(`Projeto "${target.name}" excluído.`);
      }
    });
  };

  // =========================================================================
  // 5. WORKSPACE SAFETY ACTIONS
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
        setSafetyModal((prev) => ({ ...prev, isOpen: false }));
        triggerUndoBanner(`Workspace limpo (${scenarios.length} cenários arquivados). Se foi um engano, clique em Desfazer.`);
      },
      onProceed: () => {
        saveTrashSnapshot('clear_workspace', scenarios, chatMessages, 'Workspace limpo');
        persistScenarios([]);
        setActiveScenarioId(null);
        setSafetyModal((prev) => ({ ...prev, isOpen: false }));
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
        setSafetyModal((prev) => ({ ...prev, isOpen: false }));
        triggerUndoBanner('Cenários restaurados para o padrão do artigo CIn-UFPE.');
      },
      onProceed: () => {
        saveTrashSnapshot('restore_default', scenarios, chatMessages, 'Cenários substituídos pelo padrão');
        persistScenarios(INITIAL_SCENARIOS);
        setActiveScenarioId(INITIAL_SCENARIOS[0].id);
        setSafetyModal((prev) => ({ ...prev, isOpen: false }));
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
        setSafetyModal((prev) => ({ ...prev, isOpen: false }));
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
        handleLoginWithJson(parsed);
        alert('Cofre restaurado com sucesso!');
      } catch (err) {
        alert('Erro ao processar JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportMarkdown = () => {
    let md = `# RELATÓRIO DE ENGENHARIA DE REQUISITOS SENSÍVEIS AO CONTEXTO & LGPD\n\n`;
    md += `**Instituição:** ${user.institution || 'Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE)'}\n`;
    md += `**Desenvolvido por:** ${user.name || 'Samuel Anjos Neto'}\n`;
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

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-xs">
        Carregando cofre de requisitos...
      </div>
    );
  }

  // =========================================================================
  // RENDER: LANDING PAGE (IF NOT LOGGED IN)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <>
        <LandingPage
          onLoginWithJson={handleLoginWithJson}
          onRegisterUser={handleRegisterUser}
          onQuickStartBenchmark={handleQuickStartBenchmark}
          onOpenTheory={() => setIsTheoryOpen(true)}
        />
        <TheoryModal
          isOpen={isTheoryOpen}
          onClose={() => setIsTheoryOpen(false)}
        />
      </>
    );
  }

  // =========================================================================
  // RENDER: LOGGED-IN WORKSPACE
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <input type="file" ref={fileInputRef} onChange={handleImportJsonBackup} accept=".json" className="hidden" />

      {/* CLEAN, DECLUTTERED TOP NAVBAR */}
      <Header
        user={user}
        activeProject={activeProject}
        projects={projects}
        onSwitchProject={handleSwitchProject}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenManageProjects={() => setIsManageProjectsModalOpen(true)}
        onRequestClearWorkspace={requestClearWorkspace}
        lastSavedTime={lastSavedTime}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenTheory={() => setIsTheoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportMarkdown={handleExportMarkdown}
        onExportJson={handleExportJsonBackup}
        onRequestLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* WORKSPACE AREA */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* COLLAPSIBLE SIDEBAR */}
        {!isSidebarCollapsed && (
          <Sidebar
            scenarios={scenarios}
            activeScenarioId={activeScenario?.id}
            onSelectScenario={setActiveScenarioId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredScenarios={filteredScenarios}
            projectName={activeProject.name}
            onCreateScenario={handleOpenCreateScenario}
            onExportJson={handleExportJsonBackup}
            onTriggerImport={() => fileInputRef.current?.click()}
            onRestoreDefaults={requestRestoreDefaultScenarios}
            onRequestClearWorkspace={requestClearWorkspace}
            onCollapseSidebar={() => setIsSidebarCollapsed(true)}
          />
        )}

        {/* WORKSPACE OR EMPTY STATE */}
        {activeScenario ? (
          <Workspace
            scenario={activeScenario}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onNegotiate={handleNegotiateScenario}
            isNegotiating={isNegotiating}
            onEditScenario={handleOpenEditScenario}
            onDeleteScenario={requestDeleteScenario}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSendMessage={handleSendChatMessage}
            isChatLoading={isChatLoading}
            onApplyRequirement={handleApplySuggestedRequirement}
          />
        ) : (
          <EmptyWorkspace
            projectName={activeProject.name}
            onCreateScenario={handleOpenCreateScenario}
            onRestoreDefaults={requestRestoreDefaultScenarios}
            trashSnapshot={trashSnapshot}
            onUndo={handleUndoLastAction}
          />
        )}
      </div>

      {/* FOOTER COM CRÉDITOS DE DESENVOLVIMENTO */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-1">
          <p>
            <b>ContextLGPD-Negotiator</b> • Desenvolvido por <span className="font-bold text-slate-800">Samuel Anjos Neto</span>
          </p>
          <p className="text-slate-500">
            Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE) • Recife – PE
          </p>
        </div>
      </footer>

      {/* DISASTER RECOVERY & UNDO BANNER */}
      <UndoBanner
        visible={undoBanner.visible}
        message={undoBanner.message}
        hasTrash={!!trashSnapshot}
        onUndo={handleUndoLastAction}
        onClose={() => setUndoBanner((prev) => ({ ...prev, visible: false }))}
      />

      {/* LOGOUT SAFEGUARD MODAL */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogoutWithBackup={handleLogoutWithBackup}
        onLogoutDirect={handleLogoutDirect}
      />

      {/* MODALS */}
      <SafetyModal
        modalState={safetyModal}
        onClose={() => setSafetyModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <ScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={handleCloseScenarioModal}
        formScenario={formScenario}
        setFormScenario={setFormScenario}
        onSave={handleSaveScenario}
        isEditing={!!editingScenarioId}
        isFormDirty={isFormDirty}
        setIsFormDirty={setIsFormDirty}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        newProjectForm={newProjectForm}
        setNewProjectForm={setNewProjectForm}
        onCreateProject={handleCreateProject}
      />

      <ManageProjectsModal
        isOpen={isManageProjectsModalOpen}
        onClose={() => setIsManageProjectsModalOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSwitchProject={handleSwitchProject}
        onDeleteProject={handleDeleteProject}
        onOpenNewProject={() => {
          setIsManageProjectsModalOpen(false);
          setIsNewProjectModalOpen(true);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        provider={provider}
        setProvider={setProvider}
        model={model}
        setModel={setModel}
        apiKey={apiKey}
        setApiKey={setApiKey}
        savedMaskedKey={savedMaskedKey}
        onSaveSettings={handleSaveApiSettings}
        onTestApiKey={handleTestApiKey}
        keyStatusMessage={keyStatusMessage}
      />

      <TheoryModal
        isOpen={isTheoryOpen}
        onClose={() => setIsTheoryOpen(false)}
      />
    </div>
  );
}
