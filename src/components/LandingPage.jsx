'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Upload,
  UserPlus,
  ArrowRight,
  FileText,
  Lock,
  Sparkles,
  Database,
  Layers,
  HelpCircle,
  CheckCircle,
  BookOpen
} from 'lucide-react';

export default function LandingPage({
  onLoginWithJson,
  onRegisterUser,
  onQuickStartBenchmark,
  onOpenTheory
}) {
  const [activeAuthTab, setActiveAuthTab] = useState('login'); // 'login' | 'register' | 'quick'
  const [jsonFileInfo, setJsonFileInfo] = useState(null);
  const [jsonParsedData, setJsonParsedData] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [regForm, setRegForm] = useState({
    name: '',
    institution: 'Centro de Informática (CIn) — UFPE',
    email: '',
    initialProjectName: 'Pesquisa em Sistemas Sensíveis ao Contexto',
    template: 'benchmark' // 'benchmark' | 'empty'
  });

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      processFile(file);
    } else {
      alert('Por favor, selecione um arquivo válido no formato .json.');
    }
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonFileInfo({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          scenariosCount: Array.isArray(parsed.scenarios)
            ? parsed.scenarios.length
            : Array.isArray(parsed.projects)
            ? parsed.projects.reduce((acc, p) => acc + (p.scenarios?.length || 0), 0)
            : Array.isArray(parsed)
            ? parsed.length
            : 0,
          researcher: parsed.user?.name || 'Pesquisador'
        });
        setJsonParsedData(parsed);
      } catch (err) {
        alert('Erro ao interpretar o arquivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmLogin = () => {
    if (!jsonParsedData) return;
    onLoginWithJson(jsonParsedData);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regForm.name.trim() || !regForm.email.trim()) {
      alert('Nome e E-mail são obrigatórios para registrar o cofre de pesquisa.');
      return;
    }
    onRegisterUser(regForm);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Simple Landing Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
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

          <div className="flex items-center space-x-3">
            <Link
              href="/ajuda"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>Guia de Ajuda</span>
            </Link>

            <button
              onClick={onOpenTheory}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1"
            >
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Os 3 Paradoxos</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span>Pesquisa Científica • Centro de Informática (CIn) — UFPE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-tight">
          Negociação entre Sistemas Sensíveis ao Contexto e a LGPD
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-4 leading-relaxed">
          Ambiente de Engenharia de Requisitos para especificação formal de cenários contextuais, diagnóstico de
          paradoxos de privacidade e reescrita autônoma sob princípios de <i>Privacy by Design</i>.
        </p>

        {/* Authentication Box (Login / Cadastro via JSON) */}
        <div className="w-full max-w-xl mt-10 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-left">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveAuthTab('login')}
              className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center space-x-1.5 ${
                activeAuthTab === 'login'
                  ? 'border-blue-600 text-blue-600 font-bold bg-white'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Entrar com JSON (Login)</span>
            </button>

            <button
              onClick={() => setActiveAuthTab('register')}
              className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center space-x-1.5 ${
                activeAuthTab === 'register'
                  ? 'border-blue-600 text-blue-600 font-bold bg-white'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Novo Workspace</span>
            </button>

            <button
              onClick={() => setActiveAuthTab('quick')}
              className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center space-x-1.5 ${
                activeAuthTab === 'quick'
                  ? 'border-blue-600 text-blue-600 font-bold bg-white'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Acesso Rápido</span>
            </button>
          </div>

          <div className="p-6">
            {/* TAB 1: LOGIN COM JSON */}
            {activeAuthTab === 'login' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                    dragOver
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                  }`}
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">
                    Arraste ou clique para selecionar seu arquivo de backup (.json)
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Seus cenários, projetos e histórico de negociações serão restaurados instantaneamente.
                  </p>
                </div>

                {jsonFileInfo && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-fade-in">
                    <div>
                      <p className="font-bold text-emerald-900 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Arquivo Carregado: {jsonFileInfo.name}</span>
                      </p>
                      <p className="text-emerald-700 mt-0.5">
                        Pesquisador: <b>{jsonFileInfo.researcher}</b> • {jsonFileInfo.scenariosCount} cenário(s) detectado(s) ({jsonFileInfo.size})
                      </p>
                    </div>
                    <button
                      onClick={handleConfirmLogin}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow-xs flex items-center space-x-1"
                    >
                      <span>Acessar Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CADASTRO DE NOVO PESQUISADOR / PROJETO */}
            {activeAuthTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome Completo do Pesquisador</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Ex: Prof. Samuel Celso dos Anjos Neto"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Instituição / Laboratório</label>
                    <input
                      type="text"
                      required
                      value={regForm.institution}
                      onChange={(e) => setRegForm({ ...regForm, institution: e.target.value })}
                      placeholder="Ex: CIn - UFPE"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">E-mail Acadêmico</label>
                    <input
                      type="email"
                      required
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      placeholder="Ex: pesquisador@cin.ufpe.br"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome do Projeto Inicial</label>
                  <input
                    type="text"
                    required
                    value={regForm.initialProjectName}
                    onChange={(e) => setRegForm({ ...regForm, initialProjectName: e.target.value })}
                    placeholder="Ex: Sistemas Sensíveis ao Contexto e Mobilidade"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cenários de Inicialização</label>
                  <div className="space-y-1.5">
                    <label className="flex items-center space-x-2 p-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="template"
                        value="benchmark"
                        checked={regForm.template === 'benchmark'}
                        onChange={() => setRegForm({ ...regForm, template: 'benchmark' })}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">Carregar os 4 Cenários Clássicos (CIn-UFPE)</p>
                        <p className="text-[10px] text-slate-500">Inicia com os cenários de mobilidade e saúde como base</p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-2 p-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="template"
                        value="empty"
                        checked={regForm.template === 'empty'}
                        onChange={() => setRegForm({ ...regForm, template: 'empty' })}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">Workspace em Branco (Zero Cenários)</p>
                        <p className="text-[10px] text-slate-500">Começar com workspace limpo para criar cenários do zero</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5 text-sm"
                  >
                    <span>Criar Meu Cofre de Pesquisa & Entrar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: ACESSO RÁPIDO */}
            {activeAuthTab === 'quick' && (
              <div className="space-y-4 text-center py-2">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs space-y-1">
                  <h4 className="font-bold text-blue-900">Acesso Rápido de Demonstração (CIn-UFPE)</h4>
                  <p className="text-blue-800">
                    Acesse imediatamente o ambiente carregando a pré-configuração oficial do artigo acadêmico
                    com os 4 cenários clássicos de benchmark (CEN-01 a CEN-04) e matriz regulatória.
                  </p>
                </div>

                <button
                  onClick={onQuickStartBenchmark}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition shadow-xs flex items-center justify-center space-x-2 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Acessar com Benchmark do Artigo CIn-UFPE</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-16 text-left">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
            <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Notação Formal de Cenários</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integração das dimensões de contexto (Dey 2001), métricas de QoC (Buchholz 2003) e critérios de aceitação BDD (Rawson & Reddivari 2025).
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
            <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Mitigação dos 3 Paradoxos</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diagnóstico autônomo dos conflitos entre inferência contínua e a LGPD (Minimização, Adequação e Transferência Internacional).
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Zero-Config & Offline-First</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Armazenamento seguro 100% no cliente com cópias de backup JSON automáticas para nunca depender de bancos externos nem perder seu progresso.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE) • Recife – PE, Brasil
      </footer>
    </div>
  );
}
