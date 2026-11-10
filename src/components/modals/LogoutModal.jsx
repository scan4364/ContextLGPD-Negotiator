'use client';

import React from 'react';
import { LogOut, ShieldCheck, Download } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onLogoutWithBackup, onLogoutDirect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-xs">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Salvaguarda de Saída
            </span>
            <h3 className="font-bold text-base text-slate-900 mt-0.5">Encerrar Sessão</h3>
          </div>
        </div>

        <p className="text-slate-600 leading-relaxed mb-4">
          Deseja realmente sair do workspace de pesquisa? Para que você nunca perca nenhum requisito, histórico ou
          configuração, o sistema oferece o download automático do seu arquivo de cofre (.json) antes de sair.
        </p>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-[11px] text-slate-600 space-y-1">
          <p className="font-semibold text-slate-800 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Como retomar depois:</span>
          </p>
          <p>
            Ao retornar à página inicial, basta fazer o login selecionando o arquivo JSON baixado para restaurar tudo
            exatamente de onde parou.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-xl transition"
          >
            Continuar Trabalhando
          </button>

          <button
            type="button"
            onClick={onLogoutDirect}
            className="w-full sm:w-auto px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition font-medium"
          >
            Sair sem Baixar
          </button>

          <button
            type="button"
            onClick={onLogoutWithBackup}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar Backup & Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
