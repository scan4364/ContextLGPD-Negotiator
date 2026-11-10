'use client';

import React from 'react';
import { X, FolderKanban, Plus, Trash2 } from 'lucide-react';

export default function ManageProjectsModal({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSwitchProject,
  onDeleteProject,
  onOpenNewProject
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative text-xs">
        <button
          onClick={onClose}
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
                        onSwitchProject(p.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-semibold text-[11px]"
                    >
                      Ativar
                    </button>
                  )}
                  {projects.length > 1 && (
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Excluir projeto com salvaguarda"
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
              onClose();
              onOpenNewProject();
            }}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Iniciar Novo Projeto</span>
          </button>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
