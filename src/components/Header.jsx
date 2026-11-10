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
  PanelLeftOpen
} from 'lucide-react';

export default function Header({
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
  onExportMarkdown
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Sidebar Toggle, Logo & Identity */}
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

        {/* Right: Project Switcher, Badges & Controls */}
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5"
              title="Alternar ou gerenciar projetos de requisitos"
            >
              <Folder className="w-3.5 h-3.5 text-blue-600" />
              <span className="max-w-[130px] truncate">{activeProject?.name || 'Projeto'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 text-xs animate-fade-in">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Meus Projetos de Requisitos
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 my-1">
                  {projects.map((p) => {
                    const isActive = p.id === activeProject?.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSwitchProject(p.id);
                          setIsDropdownOpen(false);
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
                      setIsDropdownOpen(false);
                      onOpenNewProject();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold flex items-center space-x-1.5"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ Iniciar Novo Projeto</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenManageProjects();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center space-x-1.5"
                  >
                    <FolderKanban className="w-3.5 h-3.5 text-slate-500" />
                    <span>Gerenciar Projetos Salvos</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
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

          <Link
            href="/ajuda"
            className="text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Guia de Ajuda</span>
          </Link>

          <button
            onClick={onOpenTheory}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Os 3 Paradoxos</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Configurações</span>
          </button>

          <button
            onClick={onExportMarkdown}
            className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs"
            title="Baixar relatório de impacto regulatório RIPD"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Exportar RIPD</span>
          </button>
        </div>
      </div>
    </header>
  );
}
