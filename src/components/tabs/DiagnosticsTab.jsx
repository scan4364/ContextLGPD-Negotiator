'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DiagnosticsTab({ scenario }) {
  if (!scenario) return null;

  const paradoxes = scenario.lgpd_diagnostics?.paradoxes || [
    {
      name: 'O Paradoxo da Inferência',
      article: 'Art. 6º, III (Minimização / Necessidade)',
      desc: 'Coleta de múltiplos sensores sem delimitação da resolução mínima indispensável para deduzir o estado do usuário.'
    },
    {
      name: 'O Paradoxo da Proatividade',
      article: 'Art. 6º, I e II (Finalidade e Adequação)',
      desc: 'Monitoramento contínuo em segundo plano quando a ativação da funcionalidade é pontual e esporádica.'
    },
    {
      name: 'O Paradoxo do Largo Contexto e Nuvem Externa',
      article: 'Art. 33 (Transf. Internacional) e Art. 46 (Segurança)',
      desc: 'Envio de telemetria bruta e identificadores diretos para provedores de LLM fora da jurisdição nacional.'
    }
  ];

  return (
    <div className="space-y-4 text-xs text-slate-800">
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900">Diagnóstico dos Conflitos Regulatórios</h4>
          <p className="text-amber-800 mt-0.5">
            Sistemas que fundem múltiplos sensores para inferir situações implícitas entram em tensão
            direta com os princípios da LGPD (Art. 6º, III e Art. 33).
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {paradoxes.map((p, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
              <span className="text-[10px] font-mono font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                {p.article}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{p.desc || p.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
