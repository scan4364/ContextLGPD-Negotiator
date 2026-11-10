export const INITIAL_SCENARIOS = [
  {
    id: 'scn_01',
    code: 'CEN-01',
    title: 'Alerta Proativo de Trânsito no Deslocamento Urbano',
    actor: 'Motorista em Trânsito',
    user_story: 'Como motorista em horário de pico, quero receber alertas preditivos de congestionamento e acidentes, para que eu possa desviar a rota antes de ficar preso no tráfego.',
    pre_conditions: 'Usuário autenticado no app; dispositivo móvel no veículo; permissões de acelerômetro ativas; conexão de dados móveis disponível.',
    context_dimensions: {
      where: 'Espaço geográfico urbano; malha viária; precisão de localização variável',
      who: 'Identificador do aparelho e histórico pessoal de viagens cotidianas',
      when: 'Período diurno de circulação veicular (segunda a sexta-feira)',
      what: 'Deslocamento motorizado em via pública'
    },
    sensors_and_qoc: {
      sensors: 'Acelerômetro triaxial, Giroscópio, Receptor GPS de alta resolução',
      qoc_desired: 'Precisão espacial submétrica (< 10m), taxa de amostragem contínua a cada 1s (alta latência/consumo)'
    },
    trigger_event: 'Acelerômetro detecta velocidade linear sustentada > 15 km/h por mais de 30 segundos consecutivos.',
    main_flow: [
      '1. [Ator]: Motorista entra no veículo, posiciona o smartphone no painel e inicia a viagem.',
      '2. [Contexto/Borda]: O subsistema local no dispositivo amostra o acelerômetro a cada 30 segundos em memória volátil.',
      '3. [Gatilho]: O algoritmo de inferência detecta velocidade linear > 15 km/h sustentada por 30 segundos.',
      '4. [QoC/Calibração]: O receptor GPS é ativado sob demanda com precisão degradada para raio de 100 metros.',
      '5. [PrivacyGuard]: O filtro de privacidade na borda converte as coordenadas na tag semântica "Via_Expressa_Norte" e descarta as coordenadas brutas da RAM.',
      '6. [LLM Nuvem]: A requisição sanitizada contendo apenas a situação semântica é encaminhada ao modelo em nuvem com política de retenção zero.',
      '7. [Sistema]: O assistente recebe a sugestão e exibe o alerta de rota alternativa na tela do motorista com antecedência hábil.'
    ],
    alternative_flows: [
      'Fluxo Alternativo 1 [Veículo Estático]: Se a velocidade cair abaixo de 5 km/h por mais de 5 minutos, o sistema desativa o GPS imediatamente para cumprir o princípio da minimização.',
      'Fluxo de Exceção 2 [Perda de Conexão]: Em caso de falta de sinal de rede, o sistema utiliza o catálogo local de rotas offline sem transferir dados para a nuvem externa.'
    ],
    acceptance_criteria: [
      {
        title: 'Critério 1: Ativação Estrita sob Gatilho (Art. 6º, I e III)',
        given: 'Dado que o veículo do usuário está estacionado ou parado há mais de 5 minutos',
        when: 'Quando o subsistema contextual verificar os sensores',
        then: 'Então o GPS deve permanecer desligado e nenhuma leitura de coordenadas deve ser retida.'
      },
      {
        title: 'Critério 2: Degradação de QoC e Mascaramento de Borda (Art. 33 e Art. 46)',
        given: 'Dado que o gatilho de velocidade > 15 km/h foi confirmado',
        when: 'Quando a requisição for preparada para envio à LLM externa na nuvem',
        then: 'Então a coordenada exata deve ser degradada para raio de 100m, convertida no rótulo semântico ("Via_Expressa") e o dado bruto de latitude/longitude eliminado da RAM antes da transmissão.'
      }
    ],
    post_conditions: 'Usuário orientado com rota alternativa; zero armazenamento de dados brutos de localização na nuvem externa; comprovação regulatória registrada.',
    raw_requirement: 'REQ-01: O sistema deve monitorar continuamente o GPS, acelerômetro e histórico do usuário, enviando os dados brutos para uma LLM na nuvem internacional para personalizar recomendações de deslocamento em tempo real.',
    status: 'negotiated',
    negotiated_requirement: 'REQ-01 (Negociado): Para inferir o contexto de alto nível "Usuário_Em_Trânsito" (Finalidade - Art. 6º, I), o sistema deve amostrar o acelerômetro localmente a cada 30s. Apenas quando Movimento > 15km/h for detectado (Gatilho), o GPS será ativado com precisão degradada de 100m (QoC controlada - Minimização Art. 6º, III), convertendo a coordenada em rótulo semântico ("Zona_Comercial" / "Via_Expressa") na borda (Edge) e descartando o dado bruto da memória RAM antes do envio à LLM externa (Zero-Storage e Art. 33).',
    lgpd_diagnostics: {
      paradoxes: [
        { name: 'O Paradoxo da Inferência', article: 'Art. 6º, III (Minimização / Necessidade)', desc: 'Coleta de múltiplos sensores sem delimitação da resolução mínima indispensável para deduzir o deslocamento.' },
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
    title: 'Detecção Contextual de Sobrecarga e Estresse Laboral',
    actor: 'Trabalhador em Home-Office / Paciente',
    user_story: 'Como profissional trabalhando remotamente, quero receber alertas preditivos de exaustão e estresse agudo, para que eu faça pausas preventivas antes de desenvolver esgotamento (Burnout).',
    pre_conditions: 'Smartwatch pareado via Bluetooth; permissões biométricas ativas; horário comercial em andamento.',
    context_dimensions: {
      where: 'Ambiente de trabalho domiciliar / Escritório corporativo',
      who: 'Dados biométricos de saúde física (frequência cardíaca e variabilidade R-R)',
      when: 'Jornada laboral ativa (segunda a sexta, 8h às 18h)',
      what: 'Trabalho cognitivo intenso diante do computador'
    },
    sensors_and_qoc: {
      sensors: 'Sensor PPG de batimentos cardíacos, Microfone ambiental (ruído), Cadência de digitação no teclado',
      qoc_desired: 'Amostragem ininterrupta de 100 Hz no PPG e gravação de áudio contínuo em alta fidelidade'
    },
    trigger_event: 'Variação da frequência cardíaca (HRV < 20ms) sustentada por 15 minutos em conjunto com cadência de digitação irregular.',
    main_flow: [
      '1. [Ator]: Profissional trabalha em sua estação conectado ao computador utilizando o smartwatch.',
      '2. [Contexto/Borda]: O smartwatch monitora a variabilidade R-R localmente na memória do dispositivo sem transmitir sinais brutos.',
      '3. [Gatilho]: O algoritmo de saúde detecta que a HRV permaneceu abaixo de 20ms por mais de 15 minutos.',
      '4. [QoC/Calibração]: O sensor de som realiza apenas medição escalar de decibéis (dB), sem efetuar gravação de voz.',
      '5. [PrivacyGuard]: O componente sintetiza o estado num índice abstrato ("Índice_Sobrecarga: 8.2") e pseudonimiza a identidade.',
      '6. [LLM Nuvem]: Apenas o índice contextual numérico é enviado para o modelo de saúde em nuvem externa.',
      '7. [Sistema]: O assistente sugere um intervalo de descompressão e exercícios de respiração ao usuário.'
    ],
    alternative_flows: [
      'Fluxo de Recusa: Caso o usuário desative a medição biométrica, o sistema estima o tempo de trabalho apenas pela agenda.'
    ],
    acceptance_criteria: [
      {
        title: 'Critério 1: Proibição de Streaming de Áudio Cru (Art. 6º, III e Art. 11)',
        given: 'Dado que o usuário está em ambiente doméstico com outras pessoas',
        when: 'Quando o sistema monitorar o ambiente',
        then: 'Então nenhuma gravação de áudio ou voz deve ser capturada, limitando-se ao medidor de ruído em decibéis.'
      }
    ],
    post_conditions: 'Usuário alertado preventivamente; zero retenção de dados biométricos sensíveis brutos em servidores externos.',
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
    title: 'Síntese Contextual de Atas e Ações em Reuniões Corporativas',
    actor: 'Gerente de Projetos e Participantes da Chamada',
    user_story: 'Como líder de equipe, quero que o assistente gere automaticamente atas com decisões e tarefas atribuídas a partir do áudio da reunião, para otimizar o tempo de acompanhamento de projetos.',
    pre_conditions: 'Reunião agendada no calendário corporativo; autorização expressa dos participantes ao entrar na sala.',
    context_dimensions: {
      where: 'Sala de conferência física ou virtual (Google Meet / Zoom)',
      who: 'Identificação por voz dos membros cadastrados da equipe',
      when: 'Intervalo programado da reunião na agenda corporativa',
      what: 'Discussão e deliberação sobre entregas de projetos'
    },
    sensors_and_qoc: {
      sensors: 'Microfone corporativo, API de Calendário Corporativo, Detecção de presença em rede Wi-Fi',
      qoc_desired: 'Gravação fonética verbatim contínua em tempo real com separação por diarização de voz'
    },
    trigger_event: 'Início do evento agendado com status "Em Andamento" na agenda e presença confirmada de 2 ou mais pessoas.',
    main_flow: [
      '1. [Ator]: Os participantes ingressam na sala no horário estipulado na agenda corporativa.',
      '2. [Sistema]: O assistente exibe aviso explícito de início da gravação para conformidade de transparência.',
      '3. [Contexto/Borda]: O microfone realiza transcrição fonética local na borda, anonimizando dados bancários e senhas.',
      '4. [Gatilho/Término]: Ao término do horário ou saída das pessoas, a transcrição é consolidada.',
      '5. [PrivacyGuard]: Nomes de clientes e identificadores diretos são mascarados com tokens anônimos.',
      '6. [LLM Nuvem]: O resumo estruturado de decisões é gerado pela LLM sem persistência na nuvem.',
      '7. [Sistema]: A ata é entregue aos e-mails corporativos dos presentes e o áudio da RAM é destruído.'
    ],
    alternative_flows: [
      'Fluxo de Encerramento Antecipado: Caso todos os participantes saiam antes do tempo previsto, a gravação encerra de imediato.'
    ],
    acceptance_criteria: [
      {
        title: 'Critério 1: Delimitação Temporal Estrita (Art. 6º, I)',
        given: 'Dado que a reunião agendada terminou',
        when: 'Quando o relógio atingir o término ou todos saírem',
        then: 'Então a captura de áudio deve ser imediatamente encerrada, impedindo a escuta passiva de conversas privadas.'
      }
    ],
    post_conditions: 'Ata gerada e distribuída; áudio bruto destruído da memória RAM.',
    raw_requirement: 'REQ-03: O sistema deve escutar e gravar todas as conversas do ambiente corporativo sempre que detectar pessoas na sala, enviando todo o fluxo de voz diretamente para um provedor externo de LLM para sumarizar tarefas.',
    status: 'conflict_detected',
    negotiated_requirement: null,
    lgpd_diagnostics: {
      paradoxes: [
        { name: 'O Paradoxo da Proatividade', article: 'Art. 6º, I (Finalidade Específica) e Art. 6º, VI (Transparência)', desc: 'Escuta passiva indiscriminada em segundo plano grava terceiros sem consentimento.' },
        { name: 'O Paradoxo da Nuvem Externa', article: 'Art. 33 e Art. 46 (Segurança da Informação)', desc: 'Fluxo integral de áudio corporativo enviado a servidores de terceiros sem retenção zero comprovada.' }
      ]
    },
    accountability_matrix: null
  },
  {
    id: 'scn_04',
    code: 'CEN-04',
    title: 'Ofertas Hiperlocais em Centros Comerciais por Proximidade',
    actor: 'Consumidor em Centro Comercial / Shopping',
    user_story: 'Como consumidor caminhando em um shopping, quero receber cupons de desconto relevantes para lojas próximas a mim, para economizar em compras de meu interesse.',
    pre_conditions: 'Usuário presente nas dependências do shopping; Bluetooth ativado; aplicativo de fidelidade aberto ou com permissão de geofence.',
    context_dimensions: {
      where: 'Espaço físico delimitado de centro comercial (raio de 10 metros de vitrines)',
      who: 'Identificador anônimo de fidelidade e categorias de interesse declaradas',
      when: 'Horário comercial de funcionamento das lojas',
      what: 'Caminhada e permanência em frente a estabelecimentos varejistas'
    },
    sensors_and_qoc: {
      sensors: 'BLE Beacons (Bluetooth Low Energy), Wi-Fi Scanning, Acelerômetro',
      qoc_desired: 'Precisão submétrica de permanência em cada vitrine'
    },
    trigger_event: 'Permanência física estática comprovada por mais de 120 segundos no raio de 10 metros de uma loja cadastrada.',
    main_flow: [
      '1. [Ator]: O consumidor caminha pelos corredores do shopping center.',
      '2. [Contexto/Borda]: O aplicativo detecta sinal de BLE Beacon local sem registrar a localização GPS global.',
      '3. [Gatilho]: O cronômetro de permanência atinge 120 segundos contínuos diante do estabelecimento parceiro.',
      '4. [PrivacyGuard]: O histórico de lojas visitadas permanece no aparelho e gera apenas o identificador anônimo do cupom.',
      '5. [LLM Nuvem]: O motor de recomendações recebe a solicitação sem receber a trajetória física do usuário.',
      '6. [Sistema]: O cupom de desconto personalizado é exibido na tela do consumidor.'
    ],
    alternative_flows: [
      'Fluxo de Passagem Rápida: Se o usuário apenas passar caminhando sem parar por 120s, nenhum evento de publicidade é emitido.'
    ],
    acceptance_criteria: [
      {
        title: 'Critério 1: Proteção de Trajetória e Minimização (Art. 6º, III e Art. 33)',
        given: 'Dado que o cliente circula pelo centro comercial',
        when: 'Quando o sistema registrar a aproximação de vitrines',
        then: 'Então nenhuma trilha de deslocamento contínuo deve ser transmitida para corretores de dados (data brokers) no exterior.'
      }
    ],
    post_conditions: 'Cupom contextual disponibilizado; privacidade do itinerário do consumidor resguardada.',
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
      "explanation": "Explicação técnica fundamentada",
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
