'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Folder,
  FolderPlus,
  FolderKanban,
  Check,
  ChevronDown,
  Trash2,
  HelpCircle,
  BookOpen,
  Sliders,
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  LogOut,
  MoreVertical,
  FileText
} from 'lucide-react';

export default function Header({
  user,
  activeProject,
  projects,
  onSwitchProject,
  onOpenNewProject,
  onOpenManageProjects,
  onRequestClearWorkspace,
  lastSavedTime,
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenTheory,
  onOpenSettings,
  onExportMarkdown,
  onExportJson,
  onRequestLogout
}) {
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const projectDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target)) {
        setIsProjectDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left Side: Sidebar Toggle, Logo & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title={isSidebarCollapsed ? 'Exibir barra lateral' : 'Ocultar barra lateral (Modo Foco)'}
            aria-label="Alternar barra lateral"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-blue-600" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                  ContextLGPD-Negotiator
                </span>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  CIn-UFPE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Project Selector, Quick RIPD, and User Profile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Project Switcher Pill */}
          <div className="relative" ref={projectDropdownRef}>
            <button
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
              className="text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5"
              title="Alternar entre projetos salvos"
            >
              <Folder className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="max-w-[120px] sm:max-w-[160px] truncate">{activeProject?.name || 'Projeto'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isProjectDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs animate-fade-in">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Projetos de Requisitos
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 my-1">
                  {projects.map((p) => {
                    const isActive = p.id === activeProject?.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSwitchProject(p.id);
                          setIsProjectDropdownOpen(false);
                        }}
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
                      onOpenNewProject();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold flex items-center space-x-1.5"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ Iniciar Novo Projeto</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProjectDropdownOpen(false);
                      onOpenManageProjects();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-slate-500" />
                    <span>Gerenciar Projetos Salvos</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProjectDropdownOpen(false);
                      onRequestClearWorkspace();
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

          {/* Quick Help Guide Link */}
          <Link
            href="/ajuda"
            className="text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition hidden md:flex items-center space-x-1"
            title="Abrir guia metodológico e de uso"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Ajuda</span>
          </Link>

          {/* Export RIPD Button */}
          <button
            onClick={onExportMarkdown}
            className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs"
            title="Baixar relatório de impacto regulatório RIPD em Markdown"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Exportar RIPD</span>
          </button>

          {/* User Profile Avatar Dropdown (Clean, Decluttered Hub) */}
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-1.5 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-xs font-medium text-slate-700"
              title="Menu do pesquisador e configurações da sessão"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="max-w-[110px] truncate hidden sm:inline">
                {user?.name ? user.name.split(' ')[0] : 'Pesquisador'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs animate-fade-in">
                {/* User Info Header */}
                <div className="p-2.5 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{user?.name || 'Pesquisador'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'pesquisador@cin.ufpe.br'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{user?.institution || 'CIn-UFPE'}</p>
                  <div className="mt-2 flex items-center space-x-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Cofre local sincronizado {lastSavedTime ? `(${lastSavedTime})` : ''}</span>
                  </div>
                </div>

                {/* Quick Menu Options */}
                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Configurações de IA & Chave</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onOpenTheory();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fundamentação: Os 3 Paradoxos</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onExportJson();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" />
                    <span>Baixar Backup JSON Completo</span>
                  </button>

                  <Link
                    href="/ajuda"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                    <span>Guia Metodológico Completo</span>
                  </Link>
                </div>

                {/* Logout Option with Safeguard */}
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      onRequestLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold flex items-center space-x-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Sessão (Logout Seguro)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
