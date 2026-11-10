'use client';

import React from 'react';
import { History, RotateCcw, X } from 'lucide-react';

export default function UndoBanner({ visible, message, hasTrash, onUndo, onClose }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-center space-x-3 text-xs max-w-md animate-fade-in">
      <History className="w-5 h-5 text-teal-400 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold text-slate-100">{message}</p>
      </div>
      {hasTrash && (
        <button
          onClick={onUndo}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Desfazer</span>
        </button>
      )}
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
