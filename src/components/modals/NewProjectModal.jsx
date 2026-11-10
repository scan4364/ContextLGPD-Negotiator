'use client';

import React from 'react';
import { X, FolderPlus } from 'lucide-react';

export default function NewProjectModal({
  isOpen,
  onClose,
  newProjectForm,
  setNewProjectForm,
  onCreateProject
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl relative text-xs">
        <button
          onClick={onClose}
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
            <p className="text-slate-500">Crie um workspace independente sem afetar seus outros projetos</p>
          </div>
        </div>

        <form onSubmit={onCreateProject} className="space-y-3.5">
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
              onClick={onClose}
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
  );
}
