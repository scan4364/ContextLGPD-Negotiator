'use client';

import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  User,
  Clock,
  Activity,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';

export default function NotationTab({ scenario }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!scenario) return null;

  return (
    <div className="space-y-5 text-xs text-slate-800">
      {/* User Story Card */}
      {scenario.user_story && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              História de Usuário Relacionada (User Story)
            </span>
            <button
              onClick={() => handleCopy(scenario.user_story, 'user_story')}
              className="text-slate-400 hover:text-slate-700 transition"
              title="Copiar história de usuário"
            >
              {copiedKey === 'user_story' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <p className="text-sm font-medium text-slate-900 leading-relaxed italic">
            "{scenario.user_story}"
          </p>
        </div>
      )}

      {/* Toggle Technical Details (Minimalist Design Enhancement) */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Dimensões Primárias do Contexto & Sensores (Dey / Abowd)</span>
        </h3>
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1 py-0.5 px-2 rounded-md hover:bg-slate-100 transition"
        >
          {showTechnicalDetails ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Ocultar Detalhes</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Expandir Detalhes ({scenario.sensors_and_qoc?.sensors ? 'Sensores, QoC' : 'Dimensões'})</span>
            </>
          )}
        </button>
      </div>

      {showTechnicalDetails && (
        <div className="space-y-3 animate-fade-in">
          {/* Grid: Context Dimensions (Abowd/Dey) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Onde (Where / Espacial):</span>
              </span>
              <p className="text-slate-600">
                {scenario.context_dimensions?.where || scenario.context_where || 'Não especificado'}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quem (Who / Identidade):</span>
              </span>
              <p className="text-slate-600">
                {scenario.context_dimensions?.who || scenario.context_who || 'Não especificado'}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Quando (When / Temporal):</span>
              </span>
              <p className="text-slate-600">
                {scenario.context_dimensions?.when || scenario.context_when || 'Não especificado'}
              </p>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="font-semibold text-slate-700 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                <span>O Quê (What / Atividade):</span>
              </span>
              <p className="text-slate-600">
                {scenario.context_dimensions?.what || scenario.context_what || 'Não especificado'}
              </p>
            </div>
          </div>

          {/* Trigger & Sensors / QoC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 shadow-xs">
              <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">
                Gatilho de Ativação (Trigger Event)
              </span>
              <p className="text-slate-800 font-medium">
                {scenario.trigger_event || scenario.trigger_condition || 'Não informado'}
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 shadow-xs">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                Sensores & Qualidade de Contexto (QoC)
              </span>
              <p className="text-slate-700">
                <b>Sensores:</b> {scenario.sensors_and_qoc?.sensors || scenario.sensors || 'N/A'}
              </p>
              <p className="text-slate-500 text-[11px]">
                <b>QoC Desejada:</b> {scenario.sensors_and_qoc?.qoc_desired || scenario.qoc_desired || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pre & Post Conditions */}
      {(scenario.pre_conditions || scenario.post_conditions) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenario.pre_conditions && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-slate-700">Pré-condições:</span>
              <p className="text-slate-600">{scenario.pre_conditions}</p>
            </div>
          )}
          {scenario.post_conditions && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-semibold text-slate-700">Pós-condições (Garantia):</span>
              <p className="text-slate-600">{scenario.post_conditions}</p>
            </div>
          )}
        </div>
      )}

      {/* Main Flow: Numbered Step-by-Step */}
      <div>
        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
          Fluxo Principal de Eventos Passo a Passo
        </h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
          {(Array.isArray(scenario.main_flow)
            ? scenario.main_flow
            : (scenario.main_flow ? scenario.main_flow.split('\n') : [])
          ).map((step, idx) => (
            <div key={idx} className="p-3 flex items-start space-x-3 hover:bg-slate-50 transition">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-slate-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Flows */}
      {scenario.alternative_flows && (
        <div>
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
            Fluxos Alternativos & Exceções
          </h3>
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-slate-700">
            {(Array.isArray(scenario.alternative_flows)
              ? scenario.alternative_flows
              : scenario.alternative_flows.split('\n')
            ).map((flow, idx) => (
              <p key={idx} className="flex items-start space-x-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{flow}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Acceptance Criteria (Given-When-Then) */}
      {scenario.acceptance_criteria && scenario.acceptance_criteria.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Critérios de Aceitação Contextuais (BDD / Given-When-Then)</span>
          </h3>
          <div className="space-y-2.5">
            {scenario.acceptance_criteria.map((crit, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-1 shadow-xs">
                <h4 className="font-bold text-slate-800">{crit.title}</h4>
                <div className="space-y-0.5 font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <p>
                    <span className="text-blue-600 font-bold">DADO QUE:</span> {crit.given}
                  </p>
                  <p>
                    <span className="text-amber-600 font-bold">QUANDO:</span> {crit.when}
                  </p>
                  <p>
                    <span className="text-emerald-600 font-bold">ENTÃO:</span> {crit.then}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Requirement Box */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl space-y-1 relative group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Requisito Bruto em Linguagem Natural (Sem Negociação)
          </span>
          <button
            onClick={() => handleCopy(scenario.raw_requirement, 'raw_req')}
            className="text-slate-400 hover:text-slate-700 transition"
            title="Copiar requisito bruto"
          >
            {copiedKey === 'raw_req' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
        <p className="font-mono text-slate-800">{scenario.raw_requirement}</p>
      </div>
    </div>
  );
}
