import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT_NEGOTIATOR } from '@/lib/constants';

export async function POST(request) {
  try {
    const body = await request.json();
    const { scenario, apiKey, provider = 'gemini', model = 'gemini-2.0-flash' } = body;

    if (!scenario) {
      return NextResponse.json({ error: 'Dados do cenário são obrigatórios.' }, { status: 400 });
    }

    // If an API key was provided, invoke the real LLM
    if (apiKey && apiKey.trim()) {
      try {
        if (provider === 'gemini') {
          const result = await callGemini({ scenario, model, apiKey });
          return NextResponse.json({ success: true, result });
        } else if (provider === 'openai' || provider === 'groq') {
          const result = await callOpenAIOrGroq({ scenario, model, apiKey, provider });
          return NextResponse.json({ success: true, result });
        }
      } catch (err) {
        console.error('LLM API error, falling back to local ACME engine:', err.message);
        // Fall back to rule-based engine
      }
    }

    // Local ACME Negotiation Engine (grounded on Section 5 of the paper)
    const localResult = runLocalAcmeNegotiator(scenario);
    return NextResponse.json({ success: true, result: localResult });
  } catch (err) {
    console.error('Negotiate route error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function callGemini({ scenario, model, apiKey }) {
  const cleanModel = model.replace(/^models\//, '');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

  const promptText = formatPrompt(scenario);

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT_NEGOTIATOR}\n\n${promptText}` }] }],
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini error (${resp.status}): ${errText}`);
  }

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return parseJson(text);
}

async function callOpenAIOrGroq({ scenario, model, apiKey, provider }) {
  const endpoint = provider === 'groq'
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

  const promptText = formatPrompt(scenario);

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_NEGOTIATOR },
        { role: 'user', content: promptText }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`${provider} error (${resp.status}): ${errText}`);
  }

  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content;
  return parseJson(text);
}

function formatPrompt(scenario) {
  return `CENÁRIO DE REQUISITOS SENSÍVEIS AO CONTEXTO:
Código: ${scenario.code}
Título: ${scenario.title}
Ator: ${scenario.actor}
Dimensões Primárias:
- Onde (Localização): ${scenario.context_where || 'Não informado'}
- Quem (Identidade): ${scenario.context_who || 'Não informado'}
- Quando (Tempo): ${scenario.context_when || 'Não informado'}
- O Quê (Atividade): ${scenario.context_what || 'Não informado'}
Sensores e Entradas Implícitas: ${scenario.sensors || 'Não informado'}
Qualidade de Contexto (QoC) Desejada: ${scenario.qoc_desired || 'Não informado'}
Gatilho de Ativação (Trigger): ${scenario.trigger_condition || 'Não informado'}
Inferência Contextual Esperada: ${scenario.expected_inference || 'Não informado'}
Destino: ${scenario.external_llm_flag ? 'LLM Externa / Nuvem Internacional' : 'Processamento Local'}
Requisito Bruto:
"${scenario.raw_requirement}"`;
}

function parseJson(text) {
  let cleaned = (text || '').trim();
  if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  return JSON.parse(cleaned);
}

function runLocalAcmeNegotiator(scenario) {
  const rawLower = (scenario.raw_requirement + ' ' + (scenario.sensors || '')).toLowerCase();
  const hasGps = rawLower.includes('gps') || rawLower.includes('localização') || rawLower.includes('onde');
  const hasHealth = rawLower.includes('cardíac') || rawLower.includes('batimento') || rawLower.includes('biométric') || rawLower.includes('ppg');
  const hasAudio = rawLower.includes('áudio') || rawLower.includes('microfone') || rawLower.includes('grava');
  const hasLlm = scenario.external_llm_flag || rawLower.includes('llm') || rawLower.includes('nuvem');

  const dims = [];
  if (hasGps) dims.push('Espacial/Localização (Where)');
  if (hasHealth || hasAudio) dims.push('Identidade/Biometria (Who)');
  dims.push('Temporal/Frequência (When)', 'Atividade/Comportamental (What)');
  if (hasLlm) dims.push('Janela de Largo Contexto (LLM Externa)');

  const paradoxes = [
    {
      name: 'O Paradoxo da Inferência',
      article: 'Art. 6º, III da LGPD (Princípio da Necessidade e Minimização)',
      explanation: `O requisito solicita fusão de dados brutos e contínuos (${scenario.sensors || 'sensores'}) sem delimitar a resolução mínima indispensável para deduzir "${scenario.expected_inference}". A LGPD veda a captura de dados excedentes sem justificativa estrita.`,
      severity: 'ALTA'
    },
    {
      name: 'O Paradoxo da Proatividade',
      article: 'Art. 6º, I e II da LGPD (Finalidade e Adequação)',
      explanation: 'A amostragem ininterrupta em segundo plano (background) monitora o usuário continuamente para agir em intervalos pontuais. Sob a ótica da LGPD, reter telemetria sem eventos ativos viola a proporcionalidade.',
      severity: 'MÉDIA'
    }
  ];

  if (hasLlm) {
    paradoxes.push({
      name: 'O Paradoxo do Largo Contexto e Nuvem Externa',
      article: 'Art. 33 (Transferência Internacional) e Art. 46 (Segurança Técnica)',
      explanation: 'O envio de prompts com histórico de telemetria e identificadores pessoais para servidores de LLM fora do Brasil configura transferência internacional sem salvaguardas técnicas de Privacy by Design.',
      severity: hasHealth || hasAudio ? 'CRÍTICA' : 'ALTA'
    });
  }

  let negotiatedText = '';
  let edgeSummary = '';
  const accountability = [];

  if (hasGps) {
    edgeSummary = 'Amostragem disparada somente após confirmação do gatilho físico; conversão de coordenadas GPS em rótulo semântico ("Zona_Comercial" / "Via_Urbana") na borda.';
    negotiatedText = `${scenario.code} (Negociado): Para inferir a situação "${scenario.expected_inference || 'Usuário_Em_Trânsito'}" (Finalidade - Art. 6º, I), o sistema deve operar localmente no dispositivo (Edge). Os sensores serão ativados exclusivamente quando o gatilho "${scenario.trigger_condition || 'Velocidade > 15km/h'}" for detectado. A localização deve ter precisão degradada para 100m (QoC calibrada) e ser convertida em rótulo semântico abstrato antes do envio à LLM externa, com descarte imediato dos dados brutos da memória RAM (Minimização Art. 6º, III e Art. 33).`;
    accountability.push({
      variable: 'Coordenadas de Localização GPS',
      treatment: 'Degradação de precisão para 100m e conversão na borda em rótulo semântico abstrato',
      justification: 'Art. 6º, III (Minimização) e Art. 33 (Transferência Internacional Segura)'
    });
  } else if (hasHealth) {
    edgeSummary = 'Cálculo de métricas agregadas na memória volátil do smartwatch; zero transmissão de ondas biométricas brutas.';
    negotiatedText = `${scenario.code} (Negociado): Para atender à finalidade de "${scenario.expected_inference || 'Detecção de Estresse'}", o dispositivo vestível deve computar as métricas localmente na borda. Apenas sob o gatilho "${scenario.trigger_condition}", índices numéricos abstratos anonimizados (sem biometria crua ou gravações de áudio) serão encaminhados à LLM externa, descartando medições anteriores da memória RAM imediatamente após a inferência (Art. 11, Art. 6º, III e Art. 46).`;
    accountability.push({
      variable: 'Dados Biométricos Cardíacos / Som Ambiente',
      treatment: 'Extração de métricas agregadas na borda e pseudonimização com descarte de dados brutos',
      justification: 'Art. 11 (Dados Sensíveis) e Art. 6º, III (Minimização)'
    });
  } else {
    edgeSummary = 'Filtragem semântica via PrivacyGuard na borda; remoção de identificadores diretos (PII) e mascaramento de contexto antes da chamada à LLM externa.';
    negotiatedText = `${scenario.code} (Negociado): Para inferir "${scenario.expected_inference || 'Situação Contextual'}", o sistema deve condicionar a captura ao gatilho "${scenario.trigger_condition}". O componente PrivacyGuard deve sanitizar os dados na borda, substituindo dados identificáveis por rótulos contextuais padronizados antes de qualquer consulta à LLM na nuvem, garantindo retenção zero (Zero-Storage) em servidores externos (Art. 6º, I, III e Art. 33 da LGPD).`;
    accountability.push({
      variable: 'Dados de Contexto Implícito',
      treatment: 'Sanitização na borda com mascaramento de PII e geração de tokens efêmeros',
      justification: 'Art. 6º, III (Minimização) e Art. 33 (Transferência Internacional)'
    });
  }

  accountability.push({
    variable: 'Janela de Histórico para a LLM',
    treatment: 'Processamento efêmero sem retenção persistente em nuvem externa (Zero Data Retention)',
    justification: 'Art. 15 (Eliminação de Dados) e Art. 46 (Segurança da Informação)'
  });

  return {
    parsedContext: {
      dimensionsDetected: dims,
      sensorsDetected: scenario.sensors ? scenario.sensors.split(',').map(s => s.trim()) : ['Sensores gerais'],
      qocLevel: 'Calibrada via Degradação Controlada',
      longContextCloudRisk: hasLlm
    },
    paradoxesDiagnosed: paradoxes,
    negotiatedRequirement: {
      text: negotiatedText,
      edgeProcessingSummary: edgeSummary,
      calibratedQoC: 'Resolução mínima tecnicamente indispensável para a máquina de inferência',
      retentionPolicy: 'Memória volátil RAM efêmera; eliminação imediata após transmissão de rótulos semânticos (Zero-Storage).'
    },
    accountabilityMatrix: accountability,
    executiveSummary: `O cenário ${scenario.code} foi conciliado com sucesso através da arquitetura ContextLGPD-Negotiator. Foram eliminadas as vulnerabilidades dos paradoxos identificados por meio de sanitização na borda (Edge) e calibração de QoC.`
  };
}
