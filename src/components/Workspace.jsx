'use client';

import React from 'react';
import {
  Sparkles,
  Edit3,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle,
  FileCheck2,
  MessageSquare,
  Maximize2,
  Minimize2
} from 'lucide-react';
import NotationTab from '@/components/tabs/NotationTab';
import DiagnosticsTab from '@/components/tabs/DiagnosticsTab';
import NegotiatedTab from '@/components/tabs/NegotiatedTab';
import AccountabilityTab from '@/components/tabs/AccountabilityTab';
import ChatTab from '@/components/tabs/ChatTab';

export default function Workspace({
  scenario,
  activeTab,
  setActiveTab,
  onNegotiate,
  isNegotiating,
  onEditScenario,
  onDeleteScenario,
  isSidebarCollapsed,
  onToggleSidebar,
  chatMessages,
  chatInput,
  setChatInput,
  onSendMessage,
  isChatLoading,
  onApplyRequirement
}) {
  if (!scenario) return null;

  return (
    <section className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col overflow-hidden animate-fade-in">
      {/* Scenario Header Banner */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              {scenario.code}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                scenario.status === 'negotiated'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {scenario.status === 'negotiated'
                ? '✅ Privacy by Design Negociado'
                : '⚠️ Conflito com LGPD Detectado'}
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-900">{scenario.title}</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            <b>Ator Primário:</b> {scenario.actor}
          </p>
        </div>

        {/* Action Buttons & Focus Mode Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNegotiate(scenario)}
            disabled={isNegotiating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isNegotiating ? 'animate-spin' : ''}`} />
            <span>{isNegotiating ? 'Analisando e Negociando...' : 'Negociar com IA'}</span>
          </button>

          <button
            onClick={() => onEditScenario(scenario)}
            className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl transition flex items-center space-x-1 shadow-xs"
            title="Editar notação do cenário"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Editar</span>
          </button>

          <button
            onClick={() => onDeleteScenario(scenario.id)}
            className="bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 p-2 rounded-xl transition shadow-xs"
            title="Excluir cenário com salvaguarda"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleSidebar}
            className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition shadow-xs"
            title={isSidebarCollapsed ? 'Sair do Modo Foco (Exibir Barra Lateral)' : 'Modo Foco (Ocultar Barra Lateral)'}
          >
            {isSidebarCollapsed ? (
              <Minimize2 className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Structured Tabs Bar */}
      <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-medium space-x-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notation')}
          className={`py-3 transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
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
          className={`py-3 transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
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
          className={`py-3 transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
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
          className={`py-3 transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
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
          className={`py-3 transition border-b-2 flex items-center space-x-1.5 shrink-0 ${
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
        {activeTab === 'notation' && <NotationTab scenario={scenario} />}

        {activeTab === 'diagnostics' && <DiagnosticsTab scenario={scenario} />}

        {activeTab === 'negotiated' && (
          <NegotiatedTab
            scenario={scenario}
            onNegotiate={onNegotiate}
            isNegotiating={isNegotiating}
          />
        )}

        {activeTab === 'accountability' && <AccountabilityTab scenario={scenario} />}

        {activeTab === 'chat' && (
          <ChatTab
            scenarioId={scenario.id}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            onSendMessage={onSendMessage}
            isChatLoading={isChatLoading}
            onApplyRequirement={onApplyRequirement}
          />
        )}
      </div>
    </section>
  );
}
