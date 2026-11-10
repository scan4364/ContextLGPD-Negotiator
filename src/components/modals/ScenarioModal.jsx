'use client';

import React from 'react';
import { X, FileText } from 'lucide-react';

export default function ScenarioModal({
  isOpen,
  onClose,
  formScenario,
  setFormScenario,
  onSave,
  isEditing,
  isFormDirty,
  setIsFormDirty
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative my-8 max-h-[90vh] overflow-y-auto text-xs">
        <button
          onClick={onClose}
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
              {isEditing ? 'Editar Cenário de Requisitos' : 'Novo Cenário de Requisitos de Contexto'}
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

        <form onSubmit={onSave} className="space-y-3.5">
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
              onClick={onClose}
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
  );
}
