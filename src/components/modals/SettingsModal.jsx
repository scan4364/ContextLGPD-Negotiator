'use client';

import React from 'react';
import { X, Sliders, Lock, Plug } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  provider,
  setProvider,
  model,
  setModel,
  apiKey,
  setApiKey,
  savedMaskedKey,
  onSaveSettings,
  onTestApiKey,
  keyStatusMessage
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
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Configurações de IA e Chave de API</h3>
            <p className="text-slate-500">Defina o modelo LLM e sua chave de acesso</p>
          </div>
        </div>

        <form onSubmit={onSaveSettings} className="space-y-3.5">
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
              onClick={onTestApiKey}
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
  );
}
