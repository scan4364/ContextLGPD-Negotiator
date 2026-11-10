'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Download,
  Upload,
  HardDrive,
  FileText,
  User,
  Sliders,
  HelpCircle,
  Code,
  MapPin,
  Clock,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition flex items-center space-x-1 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos Cenários</span>
            </Link>
            <div className="h-5 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-sm text-slate-900">Guia de Uso & Metodologia</span>
              <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                CIn-UFPE
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Documentação do Sistema ContextLGPD-Negotiator
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-8">
        {/* Hero Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Como Utilizar o ContextLGPD-Negotiator
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Este guia apresenta a fundamentação teórica, a notação formal de cenários de requisitos e o passo a passo
            operacional para conciliar sistemas sensíveis ao contexto com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>
        </div>

        {/* Section 1: Fundamentação e Notação de Histórias vs Cenários */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-blue-700">
            <Layers className="w-5 h-5" />
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
              1. Notação Formal: Histórias de Usuário vs. Cenários de Uso
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Na <b>Engenharia de Requisitos de Software</b> (Sommerville; Robertson & Robertson; Cockburn), uma funcionalidade
            é descrita em múltiplos níveis de abstração para garantir clareza, testabilidade e conformidade jurídica:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase text-blue-700">
                A. História de Usuário (User Story)
              </span>
              <p className="text-slate-600 leading-relaxed">
                Descreve o objetivo de negócio em alto nível sob a perspectiva do ator final:
              </p>
              <div className="p-2.5 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-800 italic">
                "Como [Ator], quero [Funcionalidade], para que [Benefício/Finalidade]."
              </div>
              <p className="text-slate-500 text-[11px]">
                Serve para alinhar o escopo com as partes interessadas (*stakeholders*).
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-bold text-slate-900 block text-xs uppercase text-teal-700">
                B. Cenário de Uso (User Scenario / Fluxo)
              </span>
              <p className="text-slate-600 leading-relaxed">
                Decompõe a história em uma narrativa operacional com papéis explícitos de interação:
              </p>
              <ul className="text-[11px] text-slate-700 space-y-1 font-mono">
                <li><code>[Ator]</code>: Ação física do usuário</li>
                <li><code>[Contexto/Borda]</code>: Amostragem local de sensores</li>
                <li><code>[Gatilho]</code>: Condição estrita que inicia a inferência</li>
                <li><code>[PrivacyGuard]</code>: Degradação de QoC e descarte em RAM</li>
                <li><code>[LLM Nuvem]</code>: Inferência externa com Zero-Storage</li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
            <span className="font-bold block mb-1">Critérios de Aceitação Contextuais (Given-When-Then / BDD):</span>
            Cada cenário contém critérios formais de teste (*Dado que... Quando... Então...*) que comprovam se o sistema
            ativa sensores somente sob o gatilho delimitado e se degrada a granularidade antes de qualquer envio externo.
          </div>
        </section>

        {/* Section 2: Passo a Passo Operacional */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 text-teal-700">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
              2. Passo a Passo: Como Operar o Sistema
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xs">Selecione ou Crie um Cenário de Requisitos</h3>
                <p className="text-slate-600 leading-relaxed">
                  Na barra lateral esquerda, clique em um dos 4 cenários clássicos do CIn-UFPE ou no botão <b>"+ Novo"</b>.
                  Ao criar, preencha a História de Usuário, as 4 dimensões (Onde, Quem, Quando, O Quê), os sensores, a QoC almejada
                  e o <b>Gatilho de Ativação</b> (ex: velocidade &gt; 15 km/h).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xs">Execute a Negociação com IA</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clique no botão azul <b>"Negociar com IA"</b>. O assistente analisará o cenário aplicando a arquitetura formal
                  ADL ACME e o processo BPMN de 3 raias do pré-artigo. O status mudará de <i>⚠️ Conflito LGPD</i> para <i>✅ Negociado</i>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="h-6 w-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xs">Navegue pelas 5 Abas de Análise</h3>
                <ul className="text-slate-600 space-y-1 list-disc list-inside pt-0.5">
                  <li><b>1. Notação do Cenário de Uso:</b> A visão formal completa do requisito.</li>
                  <li><b>2. Análise dos Paradoxos LGPD:</b> Os artigos infringidos pelo requisito bruto.</li>
                  <li><b>3. Requisito Negociado:</b> Comparativo visual Antes vs. Depois com botão de cópia.</li>
                  <li><b>4. Matriz de Accountability:</b> Tabela de comprovação regulatória conforme o Art. 6º, X da LGPD.</li>
                  <li><b>5. Refinamento Interativo:</b> Chat com a IA para ajustes pontuais.</li>
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xs">Refine e Aplique Sugestões de Volta na Notação</h3>
                <p className="text-slate-600 leading-relaxed">
                  Na aba <i>"5. Refinamento Interativo"</i>, envie solicitações como <i>"aumente a degradação de localização para 200m"</i>.
                  A IA responderá e exibirá o botão <b>"✨ Aplicar esta versão na Notação"</b> para atualizar o requisito com 1 clique.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start space-x-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="h-6 w-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                5
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-xs">Exporte o Relatório RIPD ou Salve Backup</h3>
                <p className="text-slate-600 leading-relaxed">
                  Clique em <b>"Exportar RIPD"</b> no cabeçalho para gerar o documento completo em Markdown para entrega acadêmica ou
                  auditoria da ANPD. Use <b>"Backup JSON"</b> para guardar o arquivo completo dos seus dados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Os 3 Paradoxos da LGPD */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
              3. Os Três Paradoxos da LGPD vs. Contexto Computacional
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">1. O Paradoxo da Inferência (Fusão de Sensores vs. Art. 6º, III)</span>
                <span className="font-mono text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold">
                  Minimização
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Para inferir contextos de alto nível (ex: <i>"Usuário em Reunião"</i>), o sistema precisa fundir múltiplos sensores
                simultaneamente. A LGPD impõe que a coleta seja estritamente indispensável. A mitigação consiste em especificar
                a resolução mínima aceitável (QoC calibrada) e descarte do dado bruto.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">2. O Paradoxo da Proatividade (Monitoramento 24/7 vs. Art. 6º, I e II)</span>
                <span className="font-mono text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">
                  Finalidade & Adequação
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Para agir proativamente, a aplicação monitora continuamente o usuário em segundo plano. Sob a LGPD, coletar telemetria
                ininterrupta quando o usuário está parado fere a proporcionalidade. A solução é impor <b>Gatilhos Estritos de Ativação (Triggers)</b>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">3. O Paradoxo do Largo Contexto e Nuvem Externa (LLMs vs. Art. 33 e 46)</span>
                <span className="font-mono text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">
                  Transf. Internacional & Segurança
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Janelas de contexto contendo telemetria crua e PII são enviadas a servidores de LLMs no exterior. A mitigação é a
                <b>sanitização na borda (Edge Computing)</b>: conversão de coordenadas GPS em rótulos semânticos (ex: <i>"Zona_Comercial"</i>)
                e descarte da memória RAM (*Zero-Storage*) antes da transmissão.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Chaves de API e Gerenciamento */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-900">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold uppercase tracking-wider">
              4. Configuração de Modelos e Banco Integrado
            </h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            - <b>Sem chave configurada?</b> O sistema opera perfeitamente com o motor especialista em regras formais (Listagem 2 do artigo).<br />
            - <b>Com chave de API (Gemini, OpenAI, Groq):</b> A chave fica salva no cofre local do seu navegador, é mascarada em tela e só viaja por canal seguro HTTPS temporário durante a inferência.<br />
            - <b>Banco Integrado:</b> Não há dependência de serviços externos, limites de cota ou GitHub Actions. Seus dados pertencem a você.
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar e Começar a Negociar Cenários</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
