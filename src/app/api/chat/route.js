import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT_NEGOTIATOR } from '@/lib/constants';

export async function POST(request) {
  try {
    const { scenario, message, apiKey, provider = 'gemini', model = 'gemini-2.0-flash' } = await request.json();

    if (!scenario || !message) {
      return NextResponse.json({ error: 'Cenário e mensagem são obrigatórios.' }, { status: 400 });
    }

    const promptContext = `Cenário de Requisitos em Análise:
Código: ${scenario.code} - ${scenario.title}
Ator: ${scenario.actor}
Requisito Bruto Atual: ${scenario.raw_requirement}
Requisito Negociado Atual: ${scenario.negotiated_requirement || 'Ainda não negociado'}
Sensores: ${scenario.sensors || 'Não informado'}
Gatilho: ${scenario.trigger_condition || 'Não informado'}
Inferência Desejada: ${scenario.expected_inference || 'Não informado'}

Mensagem do Engenheiro de Requisitos:
"${message}"

Responda como o assistente ContextLGPD-Negotiator. Forneça explicações técnicas sobre os paradoxos da LGPD, sugestões de refinamento de QoC e ajustes de requisitos.
Caso proponha uma nova versão do requisito negociado, inclua explicitamente a tag:
[NOVO_REQUISITO_SUGERIDO]
seu texto reescrito aqui
[/NOVO_REQUISITO_SUGERIDO]`;

    if (apiKey && apiKey.trim()) {
      try {
        if (provider === 'gemini') {
          const cleanModel = model.replace(/^models\//, '');
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT_NEGOTIATOR}\n\n${promptContext}` }] }]
            })
          });
          const data = await resp.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) return NextResponse.json({ reply });
        } else if (provider === 'openai' || provider === 'groq') {
          const endpoint = provider === 'groq'
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';
          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: SYSTEM_PROMPT_NEGOTIATOR },
                { role: 'user', content: promptContext }
              ],
              temperature: 0.3
            })
          });
          const data = await resp.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply });
        }
      } catch (err) {
        console.error('Chat LLM error, falling back:', err.message);
      }
    }

    // Local smart simulation response
    const fallbackReply = `**[ContextLGPD-Negotiator]:** Analisei sua solicitação para o cenário **${scenario.code}**.

Sob a ótica da Engenharia de Requisitos de Software e da LGPD:
1. **Calibração de QoC**: Recomendamos delimitar a taxa de amostragem na borda (Edge) e ativar os sensores exclusivamente após a ocorrência do gatilho (*${scenario.trigger_condition || 'gatilho especificado'}*).
2. **Transferência Internacional (Art. 33)**: Nenhum dado pessoal identificável deve ser enviado na janela de contexto de LLMs externas. Os dados brutos devem ser substituídos por rótulos semânticos abstratos.
3. **Minimização (Art. 6º, III)**: A retenção deve ocorrer somente em memória RAM efêmera, com descarte imediato pós-inferência (Zero-Storage).

[NOVO_REQUISITO_SUGERIDO]
${scenario.code} (Refinado): Para a finalidade de "${scenario.expected_inference || 'Inferência Contextual'}", o sistema deve operar na borda (Edge) e acionar os sensores apenas após o gatilho "${scenario.trigger_condition || 'condição de ativação'}". Os dados coletados devem ter sua granularidade degradada e ser convertidos em rótulos semânticos antes de qualquer envio à LLM externa, descartando dados brutos da RAM imediatamente após a inferência (Art. 6º, III e Art. 33 da LGPD).
[/NOVO_REQUISITO_SUGERIDO]`;

    return NextResponse.json({ reply: fallbackReply });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
