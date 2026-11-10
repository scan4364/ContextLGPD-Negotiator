/**
 * ContextLGPD-Negotiator AI Engine
 * Implements the ACME ADL Architecture and BPMN Negotiation Process
 * from the scientific paper:
 * "Negociação entre Sistemas Sensíveis a Amplo Contexto e a LGPD
 *  por meio da Engenharia de Requisitos de Software"
 * Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE)
 */

const SYSTEM_PROMPT_NEGOTIATOR = `Você é o assistente ContextLGPD-Negotiator, um Engenheiro de Requisitos sênior e especialista em Computação Sensível ao Contexto (Dey, Abowd, Bettini, Perera, Buchholz) e na Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).

Sua missão é atuar como mecanismo de negociação ("cola técnica") entre a demanda de dados implícitos para alta Qualidade de Contexto (QoC) e os marcos regulatórios de privacidade (Minimização Art. 6º, III e Transferência Internacional Art. 33).

Você receberá um cenário de usuário da Engenharia de Requisitos estruturado com:
- Código e Título do Cenário
- Ator / Entidade
- Dimensões de Contexto (Localização, Identidade, Tempo, Atividade)
- Sensores / Fontes de Dados Implícitos
- Qualidade de Contexto (QoC) desejada
- Gatilho de Ativação (Trigger)
- Inferência Contextual Esperada
- Destino do Contexto (LLM Externa / Nuvem)
- Requisito Bruto em Linguagem Natural

Você DEVE responder SEMPRE em formato JSON válido e rigorosamente estruturado com as seguintes chaves:

{
  "parsedContext": {
    "dimensionsDetected": ["Localização (Where)", "Atividade (What)", "Tempo (When)", "Identidade (Who)"],
    "sensorsDetected": ["GPS", "Acelerômetro"],
    "qocLevel": "Alta granularidade / Contínua",
    "longContextCloudRisk": true
  },
  "paradoxesDiagnosed": [
    {
      "name": "Paradoxo da Inferência",
      "article": "Art. 6º, III (Princípio da Necessidade/Minimização)",
      "explanation": "Explicação detalhada do porquê a fusão de sensores solicitada excede o estritamente necessário para a inferência.",
      "severity": "ALTA"
    },
    {
      "name": "Paradoxo da Proatividade",
      "article": "Art. 6º, I e II (Finalidade e Adequação)",
      "explanation": "Explicação sobre a coleta ininterrupta 24/7 em background em desacordo com a atuação pontual.",
      "severity": "MÉDIA"
    },
    {
      "name": "Paradoxo do Largo Contexto e Nuvem Externa",
      "article": "Art. 33 (Transferência Internacional) e Art. 46 (Segurança Técnica)",
      "explanation": "Explicação sobre o envio de telemetria ou janelas extensas com dados identificáveis brutos para LLM em data centers fora do Brasil.",
      "severity": "ALTA"
    }
  ],
  "negotiatedRequirement": {
    "text": "Texto formal do requisito reescrito no padrão de Engenharia de Requisitos (Sommerville/Robertson) com Privacy by Design, especificando a Finalidade, o Gatilho estrito, a Degradação de Granularidade (QoC calibrada), a conversão na borda (Edge) para rótulos semânticos abstratos e o descarte em RAM (Zero-Storage).",
    "edgeProcessingSummary": "Resumo das transformações que devem ocorrer no dispositivo (Edge) antes de qualquer envio.",
    "calibratedQoC": "Nova especificação de QoC calibrada (ex: precisão de 100m, amostragem a cada 30s sob gatilho de movimento).",
    "retentionPolicy": "Zero-Storage de dados brutos na memória RAM; descarte imediato pós-inferência (Art. 15)."
  },
  "accountabilityMatrix": [
    {
      "variable": "Nome da Variável de Contexto (ex: Coordenada GPS Bruta)",
      "treatment": "Tratamento Técnico Aplicado (ex: Degradação para 100m e conversão na borda em rótulo semântico)",
      "justification": "Base Legal / Justificativa LGPD (ex: Art. 6º, III - Minimização de Granularidade)"
    }
  ],
  "executiveSummary": "Síntese executiva de como a negociação equilibrou a Qualidade de Contexto com a conformidade jurídica."
}

Importante: Retorne APENAS o JSON puro, sem blocos de texto antes ou depois, para que possa ser parseado diretamente.`;

/**
 * Negotiates a requirement scenario using the configured LLM or fallback engine
 */
async function negotiateScenario({ scenario, settings, decryptedApiKey }) {
    const provider = settings?.provider || 'gemini';
    const model = settings?.model_name || 'gemini-2.0-flash';

    if (decryptedApiKey) {
        try {
            console.log(`🤖 Invoking LLM Provider: ${provider} (Model: ${model})...`);
            if (provider === 'gemini') {
                return await callGemini({ scenario, model, apiKey: decryptedApiKey });
            } else if (provider === 'openai') {
                return await callOpenAI({ scenario, model, apiKey: decryptedApiKey });
            } else if (provider === 'groq') {
                return await callGroq({ scenario, model, apiKey: decryptedApiKey });
            } else if (provider === 'anthropic') {
                return await callAnthropic({ scenario, model, apiKey: decryptedApiKey });
            }
        } catch (err) {
            console.error('LLM API call failed, falling back to local expert engine:', err.message);
            // Fall through to local engine
        }
    }

    console.log('⚡ Running Local ACME ContextLGPD Rule-Based Negotiation Engine...');
    return runLocalAcmeNegotiator(scenario);
}

/**
 * Interactive chat with the ContextLGPD-Negotiator regarding a scenario
 */
async function chatWithNegotiator({ message, scenario, chatHistory, settings, decryptedApiKey }) {
    const provider = settings?.provider || 'gemini';
    const model = settings?.model_name || 'gemini-2.0-flash';

    const promptContext = `Cenário de Requisitos em Análise:
Código: ${scenario.code} - ${scenario.title}
Ator: ${scenario.actor}
Requisito Bruto Atual: ${scenario.raw_requirement}
Requisito Negociado Atual: ${scenario.negotiated_requirement || 'Ainda não negociado'}
Sensores: ${scenario.sensors}
Gatilho: ${scenario.trigger_condition}
Inferência Desejada: ${scenario.expected_inference}

Mensagem do Engenheiro de Requisitos:
"${message}"

Responda como o assistente ContextLGPD-Negotiator. Forneça explicações técnicas baseadas nos 3 Paradoxos da LGPD, sugestões de refinamento de QoC e ajustes de requisitos.
Caso proponha uma nova versão do requisito negociado, inclua explicitamente a tag:
[NOVO_REQUISITO_SUGERIDO]
seu texto reescrito aqui
[/NOVO_REQUISITO_SUGERIDO]
e uma tabela explicativa se necessário.`;

    if (decryptedApiKey) {
        try {
            if (provider === 'gemini') {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${decryptedApiKey}`;
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: `${SYSTEM_PROMPT_NEGOTIATOR}\n\n${promptContext}` }] }
                        ]
                    })
                });
                const data = await resp.json();
                if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }
            } else if (provider === 'openai' || provider === 'groq') {
                const endpoint = provider === 'groq' 
                    ? 'https://api.groq.com/openai/v1/chat/completions'
                    : 'https://api.openai.com/v1/chat/completions';
                const resp = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${decryptedApiKey}`
                    },
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
                if (data.choices && data.choices[0]?.message?.content) {
                    return data.choices[0].message.content;
                }
            }
        } catch (err) {
            console.error('Chat LLM API error:', err.message);
        }
    }

    // Local smart simulation response
    return `**[ContextLGPD-Negotiator]:** Analisei sua solicitação para o cenário **${scenario.code}**.
    
Sob a perspectiva da Engenharia de Requisitos e da LGPD:
1. **Calibração de QoC**: Ao aplicar sua sugestão, recomendamos limitar a taxa de amostragem no dispositivo (Edge) e ativar a coleta exclusivamente após a ocorrência do gatilho estrito (*${scenario.trigger_condition}*).
2. **Mitigação de Transferência Internacional (Art. 33)**: É fundamental que nenhum dado identificável (PII) seja encaminhado para a janela de contexto da LLM externa. Os dados brutos devem ser substituídos por rótulos semânticos abstratos.
3. **Minimização (Art. 6º, III)**: A retenção deve ocorrer somente em memória RAM efêmera, com descarte imediato (Zero-Storage).

[NOVO_REQUISITO_SUGERIDO]
${scenario.code} (Refinado): Para a finalidade de "${scenario.expected_inference}", o sistema deve operar na borda (Edge) e acionar os sensores apenas após o gatilho "${scenario.trigger_condition}". Os dados coletados devem ter sua granularidade degradada e ser convertidos em rótulos semânticos antes do encaminhamento à LLM externa, descartando dados brutos da RAM imediatamente após a inferência (Art. 6º, III e Art. 33 da LGPD).
[/NOVO_REQUISITO_SUGERIDO]`;
}

/**
 * Call Google Gemini API
 */
async function callGemini({ scenario, model, apiKey }) {
    const cleanModel = model.replace(/^models\//, '');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

    const promptPayload = formatScenarioPrompt(scenario);

    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: `${SYSTEM_PROMPT_NEGOTIATOR}\n\n${promptPayload}` }]
                }
            ],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json'
            }
        })
    });

    if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Gemini API returned status ${resp.status}: ${errorText}`);
    }

    const data = await resp.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
        throw new Error('No candidate content returned by Gemini API');
    }

    return parseNegotiationJson(candidateText);
}

/**
 * Call OpenAI API
 */
async function callOpenAI({ scenario, model, apiKey }) {
    const promptPayload = formatScenarioPrompt(scenario);

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model || 'gpt-4o',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT_NEGOTIATOR },
                { role: 'user', content: promptPayload }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
        })
    });

    if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`OpenAI API error ${resp.status}: ${errText}`);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    return parseNegotiationJson(content);
}

/**
 * Call Groq API
 */
async function callGroq({ scenario, model, apiKey }) {
    const promptPayload = formatScenarioPrompt(scenario);

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model || 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT_NEGOTIATOR },
                { role: 'user', content: promptPayload }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
        })
    });

    if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Groq API error ${resp.status}: ${errText}`);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    return parseNegotiationJson(content);
}

/**
 * Format scenario fields into a structured prompt
 */
function formatScenarioPrompt(scenario) {
    return `ANALISE E NEGOCIE O SEGUINTE CENÁRIO DE REQUISITOS SENSÍVEIS AO CONTEXTO:
Código do Cenário: ${scenario.code}
Título do Cenário: ${scenario.title}
Ator / Entidade: ${scenario.actor}
Dimensões Primárias:
- Onde (Localização): ${scenario.context_where || 'Não especificado'}
- Quem (Identidade): ${scenario.context_who || 'Não especificado'}
- Quando (Tempo): ${scenario.context_when || 'Não especificado'}
- O Quê (Atividade): ${scenario.context_what || 'Não especificado'}
Sensores e Fontes Implícitas: ${scenario.sensors}
Qualidade de Contexto (QoC) Desejada: ${scenario.qoc_desired}
Gatilho de Ativação (Trigger): ${scenario.trigger_condition}
Inferência Contextual Esperada (Finalidade de Alto Nível): ${scenario.expected_inference}
Destino do Contexto: ${scenario.external_llm_flag ? 'LLM Externa / Nuvem Internacional' : 'Processamento Local'}
Requisito Bruto em Linguagem Natural:
"${scenario.raw_requirement}"`;
}

/**
 * Parse JSON safely from LLM output
 */
function parseNegotiationJson(text) {
    try {
        // Strip code fence if present
        let cleaned = text.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        return JSON.parse(cleaned);
    } catch (e) {
        console.error('Error parsing JSON from LLM:', e, 'Raw was:', text);
        throw new Error('Falha ao processar resposta JSON da IA.');
    }
}

/**
 * Local Rule-Based ACME Negotiator Engine
 * Fully grounded on the 3 Paradoxes and Section 5 of the paper
 */
function runLocalAcmeNegotiator(scenario) {
    const rawLower = (scenario.raw_requirement + ' ' + scenario.sensors).toLowerCase();

    const hasGps = rawLower.includes('gps') || rawLower.includes('localização') || rawLower.includes('onde');
    const hasAudio = rawLower.includes('áudio') || rawLower.includes('microfone') || rawLower.includes('grava');
    const hasHealth = rawLower.includes('cardíac') || rawLower.includes('batimento') || rawLower.includes('biométric') || rawLower.includes('ppg');
    const hasLlm = scenario.external_llm_flag || rawLower.includes('llm') || rawLower.includes('nuvem') || rawLower.includes('servidor');

    const dims = [];
    if (hasGps) dims.push('Espacial/Localização (Where)');
    if (hasHealth || rawLower.includes('identifica') || rawLower.includes('voz')) dims.push('Identidade/Biometria (Who)');
    if (rawLower.includes('contínu') || rawLower.includes('24/7') || rawLower.includes('tempo')) dims.push('Temporal/Frequência (When)');
    dims.push('Atividade/Comportamental (What)');
    if (hasLlm) dims.push('Janela de Largo Contexto (LLM Externa)');

    const paradoxes = [];

    // Paradox 1: Inferência vs Minimização
    paradoxes.push({
        name: 'O Paradoxo da Inferência',
        article: 'Art. 6º, III da LGPD (Princípio da Necessidade e Minimização)',
        explanation: `O requisito solicita fusão de dados brutos e contínuos (${scenario.sensors}) sem delimitar a resolução mínima indispensável para deduzir "${scenario.expected_inference}". A LGPD veda a captura de dados excedentes sem justificativa estrita.`,
        severity: 'ALTA'
    });

    // Paradox 2: Proatividade vs Finalidade
    paradoxes.push({
        name: 'O Paradoxo da Proatividade',
        article: 'Art. 6º, I e II da LGPD (Finalidade e Adequação)',
        explanation: 'A amostragem ininterrupta em segundo plano (background) monitora o usuário continuamente para agir em intervalos pontuais. Sob a ótica da LGPD, a retenção de telemetria sem eventos ativos viola a proporcionalidade.',
        severity: 'MÉDIA'
    });

    // Paradox 3: Nuvem Externa & Largo Contexto
    if (hasLlm) {
        paradoxes.push({
            name: 'O Paradoxo do Largo Contexto e Nuvem Externa',
            article: 'Art. 33 (Transferência Internacional) e Art. 46 (Segurança Técnica)',
            explanation: 'O envio de prompts com histórico de telemetria e identificadores pessoais para servidores de LLM fora do Brasil configura transferência internacional sem salvaguardas técnicas adequadas de Privacy by Design.',
            severity: hasHealth || hasAudio ? 'CRÍTICA' : 'ALTA'
        });
    }

    // Generate negotiated requirement
    let edgeProcessing = '';
    let negotiatedText = '';
    const accountability = [];

    if (hasGps) {
        edgeProcessing = 'Amostragem disparada somente após confirmação do gatilho físico; conversão de coordenadas GPS em rótulo semântico ("Zona_Comercial" / "Via_Urbana") na borda.';
        negotiatedText = `${scenario.code} (Negociado): Para inferir a situação "${scenario.expected_inference}" (Finalidade - Art. 6º, I), o sistema deve operar localmente no dispositivo (Edge). Os sensores serão ativados exclusivamente quando o gatilho "${scenario.trigger_condition}" for detectado. A localização deve ter precisão degradada para 100m (QoC calibrada) e ser convertida em rótulo semântico abstrato antes do envio à LLM externa, com descarte imediato dos dados brutos da memória RAM (Minimização Art. 6º, III e Art. 33).`;
        
        accountability.push({
            variable: 'Coordenadas de Localização GPS',
            treatment: 'Degradação de precisão para 100m e conversão na borda em rótulo semântico abstrato',
            justification: 'Art. 6º, III (Minimização) e Art. 33 (Transferência Internacional Segura)'
        });
        accountability.push({
            variable: 'Telemetria de Sensores de Movimento',
            treatment: 'Amostragem pontual em memória volátil (RAM) disparada apenas sob o gatilho especificado',
            justification: 'Art. 6º, II (Adequação) e Art. 15 (Término imediato do tratamento)'
        });
    } else if (hasHealth) {
        edgeProcessing = 'Cálculo de métricas estatísticas agregadas (média de BPM / HRV) na memória volátil do smartwatch; zero transmissão de ondas biométricas brutas.';
        negotiatedText = `${scenario.code} (Negociado): Para atender à finalidade de "${scenario.expected_inference}", o dispositivo vestível deve computar as métricas de variabilidade cardíaca localmente na borda. Apenas sob o gatilho "${scenario.trigger_condition}", índices numéricos abstratos anonimizados (sem biometria crua ou registros de voz) serão encaminhados à LLM, descartando medições anteriores da memória após a inferência (Art. 11, Art. 6º, III e Art. 46).`;
        
        accountability.push({
            variable: 'Dados Biométricos Cardíacos (PPG)',
            treatment: 'Extração de métricas agregadas na borda e pseudonimização com descarte de ondas brutas',
            justification: 'Art. 11 (Tratamento de Dados Pessoais Sensíveis) e Art. 6º, III'
        });
        accountability.push({
            variable: 'Fluxo de Áudio Ambiente',
            treatment: 'Substituição por medição unidimensional de intensidade sonora (dB) sem gravação de fala',
            justification: 'Art. 6º, III (Minimização rigorosa e proteção de privacidade)'
        });
    } else {
        edgeProcessing = 'Filtragem semântica via PrivacyGuard na borda; remoção de identificadores diretos (PII) e mascaramento de contexto antes da chamada à LLM externa.';
        negotiatedText = `${scenario.code} (Negociado): Para inferir "${scenario.expected_inference}", o sistema deve condicionar a captura ao gatilho "${scenario.trigger_condition}". O componente PrivacyGuard deve sanitizar os dados na borda, substituindo dados identificáveis por rótulos contextuais padronizados antes de qualquer consulta à LLM na nuvem, garantindo retenção zero (Zero-Storage) em servidores externos (Art. 6º, I, III e Art. 33 da LGPD).`;
        
        accountability.push({
            variable: 'Dados de Contexto Implícito',
            treatment: 'Sanitização na borda com mascaramento de PII e geração de tokens efêmeros',
            justification: 'Art. 6º, III (Minimização) e Art. 33 (Transferência Internacional)'
        });
    }

    accountability.push({
        variable: 'Janela de Histórico para a LLM',
        treatment: 'Processamento efêmero sem armazenamento persistente em nuvem externa (Zero Data Retention)',
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
            edgeProcessingSummary: edgeProcessing,
            calibratedQoC: 'Resolução mínima tecnicamente necessária para a máquina de inferência',
            retentionPolicy: 'Memória volátil RAM efêmera; eliminação imediata após transmissão de rótulos semânticos (Zero-Storage).'
        },
        accountabilityMatrix: accountability,
        executiveSummary: `O cenário ${scenario.code} foi conciliado com sucesso através da arquitetura ContextLGPD-Negotiator. Foram eliminadas as vulnerabilidades dos paradoxos identificados por meio de sanitização na borda (Edge) e calibração de QoC.`
    };
}

module.exports = {
    negotiateScenario,
    chatWithNegotiator,
    SYSTEM_PROMPT_NEGOTIATOR
};
