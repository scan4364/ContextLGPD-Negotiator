'use client';

import React from 'react';
import { FolderPlus, Plus, RotateCcw, Undo2 } from 'lucide-react';

export default function EmptyWorkspace({
  projectName,
  onCreateScenario,
  onRestoreDefaults,
  trashSnapshot,
  onUndo
}) {
  return (
    <section className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
        <FolderPlus className="w-8 h-8 text-slate-400" />
      </div>
      <div className="max-w-md">
        <h2 className="text-base font-bold text-slate-900">Workspace Vazio: Nenhum Cenário Ativo</h2>
        <p className="text-xs text-slate-500 mt-1">
          O projeto <b>"{projectName}"</b> não possui cenários cadastrados no momento. Você pode criar um
          novo cenário do zero ou restaurar os cenários de benchmark do CIn-UFPE.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          onClick={onCreateScenario}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Criar Novo Cenário</span>
        </button>
        <button
          onClick={onRestoreDefaults}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>Restaurar os 4 Cenários Benchmark</span>
        </button>
        {trashSnapshot && (
          <button
            onClick={onUndo}
            className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-medium text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5"
          >
            <Undo2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Desfazer última limpeza ({trashSnapshot.scenarios.length} cenários)</span>
          </button>
        )}
      </div>
    </section>
  );
}
