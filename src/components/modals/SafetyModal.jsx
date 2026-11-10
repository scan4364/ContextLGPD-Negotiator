'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, Download } from 'lucide-react';

export default function SafetyModal({ modalState, onClose }) {
  if (!modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
        <div className="flex items-center space-x-3 mb-3">
          <div
            className={`p-2.5 rounded-xl ${
              modalState.warningType === 'danger'
                ? 'bg-rose-50 text-rose-600'
                : 'bg-amber-50 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                modalState.warningType === 'danger'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {modalState.badge || 'Salvaguarda de Segurança'}
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-0.5">{modalState.title}</h3>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed mb-4">{modalState.description}</p>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-[11px] text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Mecanismo de Proteção Antifalhas:</span>
          </p>
          <p>
            O sistema salva uma cópia de segurança na memória de recuperação e permite reverter a ação pelo botão{' '}
            <b>"Desfazer"</b>. Você também pode efetuar o download preventivo do backup JSON agora mesmo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-xl transition"
          >
            Cancelar
          </button>

          {modalState.requireBackupButton && modalState.onBackupAndProceed && (
            <button
              type="button"
              onClick={modalState.onBackupAndProceed}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-xs flex items-center justify-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Backup & Continuar</span>
            </button>
          )}

          {modalState.onProceed && (
            <button
              type="button"
              onClick={modalState.onProceed}
              className={`w-full sm:w-auto px-4 py-2 text-white font-semibold rounded-xl transition shadow-xs ${
                modalState.warningType === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {modalState.confirmText || 'Confirmar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
