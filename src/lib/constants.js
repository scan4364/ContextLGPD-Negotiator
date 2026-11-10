export const INITIAL_SCENARIOS = [
  {
    id: 'scn_01',
    code: 'CEN-01',
    title: 'Alerta Proativo de Trânsito no Deslocamento',
    actor: 'Motorista / Usuário em Trânsito',
    context_where: 'Localização Contínua: Coordenadas GPS de alta precisão (< 10m) 24/7',
    context_who: 'Identificador do smartphone e histórico pessoal de rotas',
    context_when: 'Monitoramento ininterrupto em segundo plano (background)',
    context_what: 'Deslocamento veicular e lentidão no tráfego urbano',
    sensors: 'GPS, Acelerômetro, Giroscópio, Histórico de Navegação',
    qoc_desired: 'Precisão espacial < 10m, atualização a cada 1 segundo (QoC elevada)',
    trigger_condition: 'Acelerômetro detecta velocidade sustentada > 15 km/h',
    expected_inference: 'Inferir situação de alto nível "Usuário_Em_Trânsito" para antecipar alertas de acidentes',
    external_llm_flag: true,
    raw_requirement: 'REQ-01: O sistema deve monitorar continuamente o GPS, acelerômetro e histórico do usuário, enviando os dados brutos para uma LLM na nuvem internacional para personalizar recomendações de deslocamento em tempo real.',
    status: 'negotiated',
    negotiated_requirement: 'REQ-01 (Negociado): Para inferir o contexto de alto nível "Usuário_Em_Trânsito" (Finalidade - Art. 6º, I), o sistema deve amostrar o acelerômetro localmente a cada 30s. Apenas quando Movimento > 15km/h for detectado (Gatilho), o GPS será ativado com precisão degradada de 100m (QoC controlada - Minimização Art. 6º, III), convertendo a coordenada em rótulo semântico ("Zona_Comercial" / "Via_Expressa") na borda (Edge) e descartando o dado bruto da memória RAM antes do envio à LLM externa (Zero-Storage e Art. 33).',
    lgpd_diagnostics: {
      paradoxes: [
        { name: 'O Paradoxo da Inferência', article: 'Art. 6º, III (Minimização / Necessidade)', desc: 'Coleta de múltiplos sensores sem critério de fusão delimitado e granularidade excessiva.' },
        { name: 'O Paradoxo da Proatividade', article: 'Art. 6º, I e II (Finalidade e Adequação)', desc: 'Monitoramento contínuo em segundo plano quando o usuário passa a maior parte do dia estático.' },
        { name: 'O Paradoxo do Largo Contexto e Nuvem Externa', article: 'Art. 33 (Transf. Internacional) e Art. 46 (Segurança)', desc: 'Envio de telemetria bruta e identificadores diretos para provedores de LLM fora do Brasil.' }
      ]
    },
    accountability_matrix: [
      { variable: 'Coordenada GPS Bruta (Lat/Long)', treatment: 'Degradação para 100m e conversão na borda para rótulo semântico ("Zona_Comercial")', justification: 'Art. 6º, III (Minimização e Adequação de Granularidade)' },
      { variable: 'Telemetria do Acelerômetro', treatment: 'Amostragem em RAM na borda; descarte imediato após checar velocidade > 15km/h', justification: 'Art. 15 (Término do tratamento pontual efêmero)' },
      { variable: 'Prompt enviado à LLM Internacional', treatment: 'Sanitização via PrivacyGuard: envio exclusivo de rótulos semânticos e token pseudo-anônimo', justification: 'Art. 33 e Art. 46 (Conformidade em Transferência Internacional)' }
    ]
  },
  {
    id: 'scn_02',
    code: 'CEN-02',
    title: 'Monitoramento de Estresse Cardíaco e Saúde Corporativa',
    actor: 'Trabalhador em Home-Office / Paciente',
    context_where: 'Ambiente de trabalho domiciliar / Escritório',
    context_who: 'Dados biométricos de saúde (frequência cardíaca e variabilidade R-R)',
    context_when: 'Período laboral ativo (segunda a sexta, 8h às 18h)',
    context_what: 'Detecção precoce de Burnout e picos de estresse emocional',
    sensors: 'Smartwatch (Sensor PPG de batimentos), Microfone ambiental (decibéis), Teclado',
    qoc_desired: 'Amostragem de 100 Hz no PPG e gravação de áudio contínuo em alta fidelidade',
    trigger_condition: 'Detecção de variabilidade cardíaca (HRV) abaixo de 20ms combinada com digitação acelerada',
    expected_inference: 'Inferir situação de alto nível "Episódio_De_Estresse_Agudo"',
    external_llm_flag: true,
    raw_requirement: 'REQ-02: O aplicativo deve capturar ininterruptamente os batimentos cardíacos, digitação e gravar o som ambiente do usuário, transmitindo as gravações e métricas para uma LLM médica na nuvem a fim de diagnosticar estresse em tempo real.',
    status: 'conflict_detected',
    negotiated_requirement: null,
    lgpd_diagnostics: {
      paradoxes: [
        { name: 'O Paradoxo da Proatividade & Dados Sensíveis', article: 'Art. 11 (Dados Pessoais Sensíveis) e Art. 6º, III', desc: 'Captura contínua de biométrica cardíaca e gravação de áudio sem gatilho estrito viola proporcionalidade.' },
        { name: 'O Paradoxo do Largo Contexto', article: 'Art. 33 (Transferência Internacional)', desc: 'Envio de áudio cru e biometria para LLM em nuvem estrangeira sem pré-processamento na borda.' }
      ]
    },
    accountability_matrix: null
  },
  {
    id: 'scn_03',
    code: 'CEN-03',
    title: 'Resumo e Ações de Reuniões Corporativas com LLMs',
    actor: 'Gerente de Projetos e Participantes da Chamada',
    context_where: 'Sala de Conferência Física ou Virtual (Google Meet / Zoom)',
    context_who: 'Identificação por voz de todos os participantes e convidados da chamada',
    context_when: 'Durante eventos agendados no Calendário Corporativo',
    context_what: 'Discussão de decisões estratégicas e atribuição de tarefas',
    sensors: 'Microfone corporativo, Leitura de calendário, Presença em rede Wi-Fi',
    qoc_desired: 'Transcrição fonética verbatim em tempo real com separação por diarização de voz',
    trigger_condition: 'Início do evento agendado com presença simultânea de 2+ pessoas conectadas',
    expected_inference: 'Inferir contexto "Reunião_Estratégica_Ativa" para sintetizar atas e pendências',
    external_llm_flag: true,
    raw_requirement: 'REQ-03: O sistema deve escutar e gravar todas as conversas do ambiente corporativo sempre que detectar pessoas na sala, enviando todo o fluxo de voz diretamente para um provedor externo de LLM para sumarizar tarefas.',
    status: 'conflict_detected',
    negotiated_requirement: null,
    lgpd_diagnostics: {
      paradoxes: [
        { name: 'O Paradoxo da Proatividade', article: 'Art. 6º, I (Finalidade Específica) e Art. 6º, VI (Transparência)', desc: 'Escuta passiva indiscriminada em segundo plano grava terceiros sem anuência.' },
        { name: 'O Paradoxo da Nuvem Externa', article: 'Art. 33 e Art. 46 (Segurança da Informação)', desc: 'Fluxo integral de áudio corporativo enviado a servidores de terceiros sem retenção zero comprovada.' }
      ]
    },
    accountability_matrix: null
  },
  {
    id: 'scn_04',
    code: 'CEN-04',
    title: 'Ofertas Hiperlocais por Geofencing Comercial',
    actor: 'Consumidor em Centro Comercial / Shopping',
    context_where: 'Espaço físico de lojas varejistas (raio de 10 metros)',
    context_who: 'ID de anúncio do smartphone (GAID/IDFA) e preferências de consumo',
    context_when: 'Horário de circulação no centro comercial',
    context_what: 'Permanência em frente a vitrines de produtos específicos',
    sensors: 'BLE Beacons (Bluetooth Low Energy), Wi-Fi BSSID Scanning, Barômetro',
    qoc_desired: 'Precisão submétrica de permanência em cada vitrine',
    trigger_condition: 'Permanência estática > 120 segundos no alcance de um beacon específico',
    expected_inference: 'Inferir situação "Interesse_De_Compra_Iminente" para disparar cupom personalizado',
    external_llm_flag: true,
    raw_requirement: 'REQ-04: O app deve escanear em segundo plano constantemente os sinais Bluetooth e redes Wi-Fi da vizinhança sem avisar o usuário, enviando o histórico completo de movimentação física para servidores internacionais de publicidade direcionada.',
    status: 'conflict_detected',
    negotiated_requirement: null,
    lgpd_diagnostics: {
      paradoxes: [
        { name: 'O Paradoxo da Inferência e Proatividade', article: 'Art. 6º, I, II, III (Minimização e Finalidade)', desc: 'Varredura silenciosa e contínua em background de redes de terceiros sem consentimento específico.' },
        { name: 'O Paradoxo da Transferência Internacional', article: 'Art. 33 (Transferência de Dados Pessoais)', desc: 'Histórico de deslocamento físico compartilhado com data brokers sem salvaguardas técnicas.' }
      ]
    },
    accountability_matrix: null
  }
];

export const SYSTEM_PROMPT_NEGOTIATOR = `Você é o assistente ContextLGPD-Negotiator, um Engenheiro de Requisitos sênior e especialista em Computação Sensível ao Contexto (Dey, Abowd, Bettini, Perera, Buchholz) e na Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).

Sua missão é atuar como mecanismo de negociação ("cola técnica") entre a demanda de dados implícitos para alta Qualidade de Contexto (QoC) e os marcos regulatórios de privacidade (Minimização Art. 6º, III e Transferência Internacional Art. 33).

Você DEVE responder SEMPRE em formato JSON válido e rigorosamente estruturado com as chaves:
{
  "parsedContext": {
    "dimensionsDetected": ["Localização", "Atividade", "Tempo", "Identidade"],
    "sensorsDetected": ["GPS", "Acelerômetro"],
    "qocLevel": "Alta / Média / Calibrada",
    "longContextCloudRisk": true
  },
  "paradoxesDiagnosed": [
    {
      "name": "Nome do Paradoxo",
      "article": "Artigo da LGPD correspondente",
      "explanation": "Explicação técnica",
      "severity": "ALTA"
    }
  ],
  "negotiatedRequirement": {
    "text": "Texto formal do requisito reescrito no padrão de Engenharia de Requisitos com Privacy by Design, especificando a Finalidade, o Gatilho estrito, a Degradação de Granularidade (QoC calibrada), a conversão na borda (Edge) para rótulos semânticos abstratos e o descarte em RAM (Zero-Storage).",
    "edgeProcessingSummary": "Resumo das transformações que devem ocorrer no dispositivo (Edge) antes de qualquer envio.",
    "calibratedQoC": "Nova especificação de QoC calibrada.",
    "retentionPolicy": "Zero-Storage de dados brutos na memória RAM; descarte imediato pós-inferência (Art. 15)."
  },
  "accountabilityMatrix": [
    {
      "variable": "Variável de Contexto",
      "treatment": "Tratamento Técnico Aplicado",
      "justification": "Base Legal / Justificativa LGPD"
    }
  ],
  "executiveSummary": "Síntese executiva da negociação."
}
Retorne APENAS o JSON puro.`;
