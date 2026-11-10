'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  User,
  HardDrive,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  FileText
} from 'lucide-react';

export default function Sidebar({
  scenarios,
  activeScenarioId,
  onSelectScenario,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  filteredScenarios,
  projectName,
  onCreateScenario,
  onExportJson,
  onTriggerImport,
  onRestoreDefaults,
  onRequestClearWorkspace,
  onCollapseSidebar
}) {
  const [showDataTools, setShowDataTools] = useState(false);

  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col space-y-4 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Cenários de Uso</h2>
          <p className="text-xs text-slate-500 truncate max-w-[190px]">
            {scenarios.length} cenário(s) • <b>{projectName}</b>
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onCreateScenario}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition flex items-center space-x-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo</span>
          </button>

          <button
            onClick={onCollapseSidebar}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            title="Recolher barra lateral (Modo Foco)"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
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
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-xs"
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
          <div className="p-6 bg-white border border-slate-200 rounded-xl text-center space-y-2 shadow-xs">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">Nenhum cenário neste projeto</p>
            <p className="text-[11px] text-slate-500">
              Crie seu primeiro cenário ou carregue os cenários de benchmark do CIn-UFPE.
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <button
                onClick={onCreateScenario}
                className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition"
              >
                + Criar Cenário
              </button>
              <button
                onClick={onRestoreDefaults}
                className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition"
              >
                ⚡ Carregar 4 Cenários do Artigo
              </button>
            </div>
          </div>
        ) : (
          filteredScenarios.map((s) => {
            const isSelected = s.id === activeScenarioId;
            const isNegotiated = s.status === 'negotiated';

            return (
              <div
                key={s.id}
                onClick={() => onSelectScenario(s.id)}
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

      {/* Collapsible Data Management & Tools (Minimalist Design) */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs shadow-xs">
        <button
          onClick={() => setShowDataTools(!showDataTools)}
          className="w-full flex items-center justify-between text-slate-700 font-semibold hover:text-slate-900 transition"
        >
          <span className="flex items-center space-x-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span>Dados & Salvaguardas</span>
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Offline</span>
            {showDataTools ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </button>

        {showDataTools && (
          <div className="space-y-2 pt-1 border-t border-slate-100 animate-fade-in">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={onExportJson}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium text-[11px] flex items-center justify-center space-x-1"
                title="Salvar backup completo em arquivo JSON"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Backup JSON</span>
              </button>
              <button
                onClick={onTriggerImport}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium text-[11px] flex items-center justify-center space-x-1"
                title="Carregar cenários de arquivo JSON"
              >
                <Upload className="w-3 h-3 text-slate-500" />
                <span>Importar JSON</span>
              </button>
            </div>

            <div className="pt-1 space-y-1">
              <button
                onClick={onRestoreDefaults}
                className="w-full text-left text-[11px] text-amber-700 hover:text-amber-800 hover:underline flex items-center space-x-1"
              >
                <span>⚡ Restaurar os 4 cenários clássicos do artigo</span>
              </button>
              <button
                onClick={onRequestClearWorkspace}
                className="w-full text-left text-[11px] text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1"
              >
                <span>🧹 Zerar / Limpar cenários deste projeto...</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
