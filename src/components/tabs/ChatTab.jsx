'use client';

import React from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

export default function ChatTab({
  scenarioId,
  chatMessages,
  chatInput,
  setChatInput,
  onSendMessage,
  isChatLoading,
  onApplyRequirement
}) {
  const currentMessages = chatMessages[scenarioId] || [];

  return (
    <div className="flex flex-col h-[460px] border border-slate-200 rounded-xl bg-slate-50 overflow-hidden text-xs shadow-xs">
      {/* Chat Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {currentMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300" />
            <p className="font-medium text-slate-600">Refinamento Interativo do Requisito</p>
            <p className="text-[11px] max-w-sm">
              Converse com o agente especialista para calibrar a taxa de amostragem dos sensores, alterar
              limiares de gatilho ou ajustar os princípios de minimização.
            </p>
          </div>
        ) : (
          currentMessages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {!isUser && msg.content.includes('REQ-') && (
                    <button
                      onClick={() => onApplyRequirement(msg.content)}
                      className="mt-2 text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2 py-1 rounded transition flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Aplicar esta versão na Notação</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Input Box */}
      <form onSubmit={onSendMessage} className="p-3 bg-white border-t border-slate-200 flex space-x-2">
        <input
          type="text"
          placeholder="Ex: Como degradar a resolução do GPS para atender o Art. 6º, III sem perder a função?"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isChatLoading || !chatInput.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition flex items-center space-x-1 shadow-xs disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
