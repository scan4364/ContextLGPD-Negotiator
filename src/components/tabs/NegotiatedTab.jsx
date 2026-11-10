'use client';

import React, { useState } from 'react';
import { CheckCircle, Copy, Check, Sparkles } from 'lucide-react';

export default function NegotiatedTab({ scenario, onNegotiate, isNegotiating }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!scenario?.negotiated_requirement) return;
    navigator.clipboard.writeText(scenario.negotiated_requirement);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!scenario) return null;

  return (
    <div className="space-y-5 text-xs text-slate-800">
      {scenario.negotiated_requirement ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-900 uppercase text-[10px] tracking-wider flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Especificação Negociada (Conforme Art. 6º, III e Art. 33)</span>
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-sm font-medium text-emerald-950 leading-relaxed">
              {scenario.negotiated_requirement}
            </p>
          </div>

          {/* Before vs After */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                Antes: Requisito Bruto
              </span>
              <p className="text-slate-700 font-mono text-[11px]">{scenario.raw_requirement}</p>
            </div>
            <div className="p-3.5 bg-white border border-emerald-300 rounded-xl space-y-1 shadow-xs">
              <span className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider">
                Depois: Privacy by Design na Borda
              </span>
              <p className="text-slate-800 text-[11px]">
                Processamento em RAM na borda, mascaramento semântico de variáveis e retenção zero.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-400 mx-auto" />
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Nenhum requisito negociado ainda</h4>
            <p className="text-slate-500 mt-1">
              Clique no botão "Negociar com IA" no topo para gerar a especificação reescrita sob Privacy by Design.
            </p>
          </div>
          <button
            onClick={() => onNegotiate(scenario)}
            disabled={isNegotiating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50 inline-flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Iniciar Negociação</span>
          </button>
        </div>
      )}
    </div>
  );
}
