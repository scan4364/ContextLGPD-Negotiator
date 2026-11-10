'use client';

import React from 'react';

export default function AccountabilityTab({ scenario }) {
  if (!scenario) return null;

  const matrix = scenario.accountability_matrix || [
    {
      variable: 'Coordenadas GPS e Localização Bruta',
      treatment: 'Degradação métrica na borda (Edge) e conversão para tag semântica.',
      justification: 'Art. 6º, III (Minimização e Adequação de Granularidade)'
    },
    {
      variable: 'Telemetria Contínua de Movimento',
      treatment: 'Amostragem transitória em RAM efêmera; descarte sem persistência.',
      justification: 'Art. 15 (Término imediato do tratamento pontual)'
    },
    {
      variable: 'Payload Enviado à LLM Internacional',
      treatment: 'Sanitização via PrivacyGuard com retenção zero contratual.',
      justification: 'Art. 33 e Art. 46 (Conformidade em Transferência Internacional)'
    }
  ];

  return (
    <div className="space-y-4 text-xs text-slate-800">
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-900">Matriz de Comprovação Regulatória (Accountability)</h4>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Demonstração técnica de conformidade para auditoria da ANPD e prestação de contas (Art. 6º, X).
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">
              <th className="p-3">Variável de Contexto</th>
              <th className="p-3">Tratamento Técnico Aplicado</th>
              <th className="p-3">Base Legal / Justificativa LGPD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 transition">
                <td className="p-3 font-semibold text-slate-900">{row.variable}</td>
                <td className="p-3 text-slate-700">{row.treatment}</td>
                <td className="p-3 text-slate-600 font-mono text-[11px]">{row.justification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
