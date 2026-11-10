'use client';

import React from 'react';
import { X, BookOpen } from 'lucide-react';

export default function TheoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl relative my-8 max-h-[85vh] overflow-y-auto text-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Fundamentação: Os Três Paradoxos</h3>
            <p className="text-slate-500">Computação Sensível ao Contexto vs. LGPD (CIn-UFPE)</p>
          </div>
        </div>

        <div className="space-y-3.5 text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>1. O Paradoxo da Inferência (Fusão de Sensores vs. Art. 6º, III - Minimização)</span>
            </h4>
            <p>
              Para inferir uma situação de alto nível (ex: <i>"Usuário Dirigindo"</i>), o motor precisa fundir múltiplos
              sensores simultaneamente. Contudo, a LGPD impõe a limitação ao mínimo indispensável, vedando a coleta
              abundante sem justificativa técnica estrita para cada sensor.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              <span>2. O Paradoxo da Proatividade (Monitoramento 24/7 vs. Art. 6º, I e II - Finalidade)</span>
            </h4>
            <p>
              Para atuar de forma proativa (ex: Geofencing), o sistema precisa monitorar em segundo plano. Sob a LGPD,
              coletar telemetria 24 horas por dia para atuar apenas por minutos específicos fere o princípio da adequação
              se os dados brutos forem retidos.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>3. O Paradoxo do Largo Contexto e Nuvem Externa (LLMs vs. Art. 33 - Transf. Internacional)</span>
            </h4>
            <p>
              Janelas extensas com dados implícitos do usuário são enviadas para LLMs no exterior. Sem mecanismos na borda
              (Edge) e conversão para rótulos semânticos abstratos, essa prática viola a transferência internacional e o dever
              de segurança (Art. 46).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
