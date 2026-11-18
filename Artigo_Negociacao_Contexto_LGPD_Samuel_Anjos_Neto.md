# Negociação entre Sistemas Sensíveis a Contexto e a LGPD por meio da Engenharia de Requisitos de Software: Arquitetura e Ferramenta

**Samuel Celso dos Anjos Neto**  
Centro de Informática (CIn), Universidade Federal de Pernambuco (UFPE), Recife, Brasil  
scan@cin.ufpe.br - 0009-0007-5141-9484  

---

## Resumo
Aplicações sensíveis ao contexto utilizam informações sobre usuários, dispositivos e seu ambiente para adaptar o comportamento do sistema. Quando combinadas com modelos de linguagem de contexto longo (LLMs), formando sistemas sensíveis a amplo contexto, essas aplicações podem processar extensos históricos de interação e atributos contextuais, criando tensões com a Lei Geral de Proteção de Dados Pessoais (LGPD). Este artigo apresenta o **ContextLGPD-Negotiator**, uma ferramenta de Engenharia de Requisitos voltada ao tempo de projeto, concebida para apoiar desenvolvedores na tradução de objetivos contextuais e restrições de privacidade em requisitos de software explícitos. Caracterizamos três tensões recorrentes, aqui chamadas paradoxos: fusão de sensores versus minimização de dados; monitoramento contínuo versus limitação de finalidade; e processamento de contexto longo por LLMs externos versus requisitos de segurança e transferência internacional. O artigo descreve a metodologia adotada, um método de negociação de requisitos, modelos BPMN complementares (percurso da pesquisa, método e interação do usuário) e uma arquitetura de software documentada por meio da linguagem de descrição arquitetural ACME. A arquitetura atualizada compreende três representações compostas: um cliente Next.js executado no navegador, um runtime servidor Next.js com rotas de API e um motor externo de raciocínio baseado em LLM. Seus elementos internos incluem a interface de requisitos e o cofre local, a mediação de prompts e o mecanismo determinístico de contingência, além de três etapas lógicas de raciocínio da LLM. O protótipo web apoia a estruturação de requisitos, a análise assistida por IA, o gerenciamento local de projetos e a preparação de documentos relacionados à prestação de contas. Não é apresentada avaliação preliminar ou empírica. Em vez disso, propomos um protocolo futuro que combina avaliação por especialistas e comparação quase-experimental entre especificação manual e assistida pela ferramenta. As contribuições são a arquitetura de software e a ferramenta implementada com base nela, complementadas por modelos BPMN que explicam o método e a interação do usuário. O artigo não reivindica certificação legal, verificação formal ou imposição de requisitos em tempo de execução.

**Palavras-chave:** Computação sensível ao contexto · Qualidade de Contexto · Engenharia de Requisitos · LGPD · Grandes Modelos de Linguagem · Privacy by Design

---

## 1 Introdução
Sistemas sensíveis ao contexto utilizam informações sobre um usuário, local, dispositivo ou atividade para adaptar o comportamento de uma aplicação [1,2]. O contexto pode ser obtido por meio de entradas do usuário, sensores físicos, serviços do sistema operacional, registros, informações de rede e históricos de interação [3,6]. As quatro dimensões primárias são localização (*where*), identidade (*who*), tempo (*when*) e atividade (*what*) [2]. Essas dimensões descrevem um cenário; elas não exigem que toda aplicação colete as quatro.

LLMs com janelas de contexto longas podem processar históricos de conversas, interações anteriores, observações ambientais e registros obtidos de serviços externos. Essa capacidade pode apoiar a personalização, mas a capacidade do modelo não justifica transmitir todos os atributos disponíveis. Engenheiros de requisitos precisam determinar quais informações são necessárias para uma inferência específica, em que granularidade, por quanto tempo e por qual caminho de processamento. Chamamos de **sistemas sensíveis a amplo contexto** aqueles que combinam múltiplas fontes de contexto e janelas de contexto longas, o que amplia tanto o potencial de personalização quanto a exposição de dados.

Esse problema é relevante no contexto da Lei Geral de Proteção de Dados Pessoais (LGPD, Lei nº 13.709/2018) [4]. Seus princípios incluem finalidade, adequação, necessidade, segurança, prevenção e responsabilização e prestação de contas. O princípio da necessidade limita o tratamento ao mínimo de dados necessário para finalidades legítimas, específicas e explícitas. O uso de provedores externos de LLM também levanta questões sobre compartilhamento e transferência internacional de dados. O Art. 33 estabelece condições para transferências; não se trata de uma proibição geral, tampouco de uma exigência satisfeita apenas pela configuração de uma opção de retenção zero [4,18].

A tensão também constitui um problema de requisitos. Declarações como “monitorar o usuário” não especificam quais atributos são necessários, a frequência de amostragem, a precisão aceitável, as condições de ativação, o local de processamento, o período de retenção ou o procedimento de descarte. Por outro lado, uma instrução genérica para minimizar dados pode ser vaga demais para orientar a implementação. A Engenharia de Requisitos pode tornar essas decisões explícitas, rastreáveis e passíveis de revisão [7–9].

Este artigo apresenta o **ContextLGPD-Negotiator**, uma ferramenta de apoio à negociação de requisitos contextuais sob as restrições da LGPD, utilizada durante o projeto do software. Ela recebe um cenário de requisito, auxilia na identificação de possíveis conflitos, apoia uma reescrita orientada por restrições e prepara documentação relacionada à prestação de contas. A ferramenta não opera sensores em uma aplicação implantada, não certifica conformidade legal e não substitui o controlador, o engenheiro ou o especialista em privacidade.

As questões de pesquisa são: 
* **QP1:** Como requisitos contextuais podem explicitar a tensão entre Qualidade de Contexto (QoC) e os princípios da LGPD? 
* **QP2:** Quais elementos arquiteturais apoiam a negociação de requisitos e a produção de artefatos relacionados à prestação de contas? 
* **QP3:** Como uma ferramenta baseada nessa arquitetura pode apoiar a produção e a revisão de requisitos contextuais orientados à privacidade?

As principais contribuições são (i) a arquitetura de software do ContextLGPD-Negotiator descrita em ACME e (ii) a ferramenta web implementada de acordo com essa arquitetura. Dois modelos BPMN complementam essas contribuições ao explicar, respectivamente, o método de negociação de requisitos e o fluxo de interação apoiado pela ferramenta. Assim, o BPMN é utilizado como instrumento de modelagem e explicação de processos, e não como a contribuição central de software. O trabalho não é apresentado como um estudo DSR concluído. A literatura de Design Science Research (DSR) fundamentou sua perspectiva orientada à construção de artefatos [16,17], mas não foi conduzido um ciclo completo de DSR nem uma avaliação empírica. A avaliação é proposta como trabalho futuro. A metodologia, isto é, como o problema, o método, a arquitetura e o protótipo foram caracterizados e produzidos, é descrita na Seção 4 e resumida por um terceiro diagrama BPMN, relativo ao percurso da pesquisa.

O restante do artigo está organizado da seguinte forma: a Seção 2 apresenta a fundamentação e o contexto regulatório; a Seção 3 discute trabalhos relacionados; a Seção 4 descreve a metodologia; a Seção 5 apresenta o método de negociação de requisitos; a Seção 6 descreve o fluxo de uso da ferramenta; a Seção 7 especifica a arquitetura; a Seção 8 apresenta o protocolo de avaliação planejado; e as Seções 9 e 10 discutem as limitações e concluem.

---

## 2 Fundamentação e Contexto Regulatório

### 2.1 Computação Sensível ao Contexto e Dimensões Contextuais
Dey define contexto como a informação que caracteriza a situação de uma entidade relevante para a interação entre um usuário e uma aplicação [1]. Abowd et al. organizam o contexto primário em quatro dimensões: onde (*where*), quem (*who*), quando (*when*) e o quê (*what*) [2]. Sistemas sensíveis ao contexto adquirem, modelam, raciocinam sobre e disseminam contexto [3,6]. Questões de privacidade podem surgir em cada etapa, pois os dados podem ser coletados, combinados, utilizados para inferências e compartilhados com outros componentes ou organizações.

As dimensões 4W fornecem um vocabulário analítico, não uma lista obrigatória de coleta. Inferir que um usuário está em deslocamento pode exigir um indicador de atividade e uma localização aproximada, mas não uma identidade persistente ou um histórico completo de localização. Os requisitos devem identificar as dimensões relevantes para a inferência pretendida e excluir atributos que não contribuam para ela.

### 2.2 Qualidade de Contexto (QoC)
Qualidade de Contexto (*Quality of Context* – QoC) descreve a qualidade da informação contextual, e não o desempenho do serviço ou a qualidade do hardware do sensor [5]. Um receptor GPS em funcionamento ainda pode fornecer informações precisas demais para uma tarefa ou imprecisas demais para outra. Um valor contextual também pode estar desatualizado, mesmo que sua medição original tenha sido correta.

Buchholz et al. discutem propriedades de QoC como precisão, probabilidade de correção, confiabilidade, resolução e atualidade [5]. Neste artigo, precisão refere-se à especificidade ou granularidade de um valor contextual; probabilidade de correção expressa a chance de o valor representar a situação real; resolução espacial indica a área geográfica representada pelo valor; resolução temporal diz respeito ao intervalo ou à frequência de amostragem com que um contexto variável pode ser distinguido; e atualidade (ou frescor) diz respeito ao quão recente é a informação no momento de seu uso. Essas dimensões são relacionadas, mas não intercambiáveis: uma coordenada muito precisa pode estar incorreta ou desatualizada, enquanto um rótulo de localização mais amplo pode ser suficientemente atual e correto para uma recomendação.

A QoC depende da aplicação. Os valores aceitáveis decorrem do objetivo da inferência e das consequências de um erro. Aumentar a frequência de amostragem pode melhorar a resolução temporal, mas também pode ampliar a coleta, o consumo de energia e a exposição. Portanto, os requisitos devem especificar a representação menos intrusiva que permaneça adequada à inferência pretendida, em vez de maximizar a precisão por padrão [4,5].

### 2.3 LLMs de Contexto Longo e Exposição Contextual
Prompts de LLM podem combinar solicitações, históricos de conversas, estado do sistema, localização, rótulos de atividade e registros recuperados de serviços externos. Uma janela de contexto ampla indica capacidade de entrada, não a necessidade de transmitir todas as informações disponíveis. Provedores externos introduzem uma fronteira organizacional e técnica; seus termos contratuais, configurações de retenção, locais de processamento e mecanismos aplicáveis à transferência devem ser examinados em cada implantação.

Substituir um nome ou uma coordenada por um rótulo semântico pode reduzir a identificação direta sem anonimizar a informação. Os rótulos podem continuar vinculáveis por meio de horários, rotinas ou registros externos. Abstração e pseudonimização são medidas de redução de risco, não isenções automáticas das obrigações de proteção de dados.

### 2.4 Princípios da LGPD e Transferências Internacionais
Entre os princípios relevantes da LGPD estão finalidade, adequação, necessidade, segurança, prevenção e responsabilização e prestação de contas [4]. Finalidade e adequação restringem por que e como os dados pessoais são tratados; necessidade limita o tratamento aos dados pertinentes, proporcionais e não excessivos; segurança e prevenção exigem medidas protetivas; e responsabilização e prestação de contas exigem evidências de que as medidas adotadas são apropriadas. Um sensor tecnicamente seguro ainda pode ser desnecessário, e dados minimizados ainda podem ser retidos por mais tempo do que o necessário.

O Art. 33 estabelece condições para transferências internacionais. A Resolução CD/ANPD nº 19/2024 aprovou o Regulamento de Transferência Internacional de Dados e as cláusulas-padrão contratuais [18]. Dependendo das circunstâncias, uma transferência pode se apoiar em decisão de adequação, cláusulas-padrão contratuais, cláusulas contratuais específicas sob as condições previstas, normas corporativas globais ou outro mecanismo previsto na LGPD. A retenção zero pode apoiar a gestão de riscos, mas não estabelece, por si só, um mecanismo válido de transferência internacional. O Art. 46 também exige medidas de segurança técnicas e administrativas [4,18].

### 2.5 Privacy by Design e Engenharia de Requisitos
Privacy by Design incorpora considerações de privacidade ao projeto do sistema e às configurações padrão [10]. Estratégias como minimizar, separar, abstrair e ocultar dados oferecem direções arquiteturais [11]. A análise regulatória pode derivar requisitos de software a partir de regras legais [9]. No contexto deste trabalho, os requisitos devem indicar a inferência pretendida, as observações necessárias, a QoC aceitável, as condições de ativação, o processamento local, o descarte, o compartilhamento externo e as evidências de prestação de contas.

**Tabela 1. Tensões estruturais entre aquisição de contexto e requisitos selecionados da LGPD.**

| Tensão | Dispositivos da LGPD | Risco de projeto | Resposta orientada à privacidade |
|---|---|---|---|
| Fusão de sensores versus minimização | Art. 6º, III | Coleta contínua de fluxos de sensores sem demonstrar que cada variável é necessária. | Justificar cada fonte; reduzir a granularidade quando viável; calibrar a amostragem. |
| Monitoramento contínuo versus finalidade e adequação | Art. 6º, I e II | Manter sensores de alto custo ativos mesmo quando a informação contextual é necessária apenas em momentos específicos. | Utilizar gatilhos explícitos de ativação e encerramento. |
| LLM de contexto longo versus regras de segurança e transferência | Arts. 33 e 46 | Enviar contexto identificável ou históricos extensos a um provedor externo. | Minimizar e abstrair antes do compartilhamento; documentar o mecanismo de transferência e as salvaguardas. |

---

## 3 Trabalhos Relacionados

### 3.1 Modelagem de Contexto, QoC e Requisitos de Privacidade
Dey e Abowd et al. estabelecem as definições e dimensões centrais utilizadas na computação sensível ao contexto [1,2]. Perera et al. apresentam uma pesquisa sobre computação sensível ao contexto para a Internet das Coisas, enquanto Bettini et al. revisam técnicas de modelagem e raciocínio sobre contexto [3,6]. Buchholz et al. discutem parâmetros de QoC como precisão, probabilidade de correção, resolução e atualidade [5]. Este artigo utiliza essas bases para explicitar restrições contextuais em requisitos que serão analisados sob a LGPD.

Breaux e Antón analisam como regras regulatórias podem ser traduzidas em requisitos de privacidade e segurança [9]. Privacy by Design e as estratégias de Hoepman fornecem princípios e táticas arquiteturais para minimizar e abstrair dados pessoais [10,11]. O ContextLGPD-Negotiator conecta essas ideias a decisões concretas de requisitos sobre finalidade, fontes de dados, ativação, local de processamento, compartilhamento e prestação de contas. A ferramenta apoia a análise humana, e não uma interpretação jurídica definitiva.

### 3.2 Apoio de LLMs às Atividades de Engenharia de Requisitos
Rawson e Reddivari apresentam uma ferramenta baseada em LLM para gerar critérios de aceitação sensíveis ao contexto a partir de histórias de usuário [12], enquanto o Behaviour-Driven Development fornece a estrutura Given-When-Then para expressar comportamentos observáveis [13]. O presente trabalho aborda um problema relacionado, porém distinto: um critério de aceitação pode descrever como uma funcionalidade deve se comportar sem determinar se os dados necessários para sustentá-la são necessários, proporcionais ou adequados ao compartilhamento externo. O ContextLGPD-Negotiator acrescenta uma perspectiva explícita de negociação de privacidade à elaboração de requisitos assistida por LLM.

### 3.3 Trabalhos Anteriores do Autor sobre Requisitos Regulatórios
Os trabalhos anteriores do autor investigaram como evidências regulatórias podem ser traduzidas em requisitos reutilizáveis no domínio da gestão de produtos perecíveis. O artigo publicado no CNEG 2025 propôs um catálogo de requisitos baseado em evidências regulatórias [19]. O SAFE_GOOD, apresentado no WER 2026, descreveu requisitos funcionais e não funcionais derivados de normas brasileiras da ANVISA e do MAPA [20]. O TCC PRODUTOS_SEGUROS organizou requisitos por meio de casos de uso, descrições no estilo Volere, modelos não funcionais e uma matriz de conformidade regulatória [21].

Esses estudos tratam de regulação de alimentos, armazenagem e logística, e não da análise da LGPD. Sua relevância para este artigo está no objetivo de Engenharia de Requisitos compartilhado: tornar obrigações regulatórias explícitas, rastreáveis e reutilizáveis. O ContextLGPD-Negotiator amplia essa linha de pesquisa para requisitos de privacidade contextual e riscos associados ao processamento por LLMs externos.

### 3.4 Posicionamento e Exemplo Ilustrativo
A literatura selecionada fornece fundamentos em modelagem de contexto, QoC, Engenharia de Requisitos regulatórios, projeto orientado à privacidade e especificação assistida por LLM. Este artigo reúne esses temas em um fluxo de trabalho, utilizado durante o projeto, para requisitos contextuais sob a LGPD. Esse posicionamento é uma síntese de trabalhos selecionados; não resulta de uma revisão sistemática ou mapeamento sistemático concluído.

**Tabela 2. Transformação ilustrativa de requisito gerada com Gemini 3.8 Flash (nível de raciocínio High); não constitui resultado de avaliação do ContextLGPD-Negotiator.**

| Aspecto | Requisito pouco especificado | Exemplo negociado |
|---|---|---|
| Requisito | REQ-01: O sistema deverá monitorar continuamente GPS, acelerômetro e histórico do usuário, enviando os dados a uma LLM em nuvem para personalizar recomendações de deslocamento. | REQ-01: Para inferir “User_In_Transit” (finalidade), o sistema deverá amostrar localmente o acelerômetro a cada 30 s. Somente quando for detectada velocidade superior a 15 km/h o GPS será ativado com precisão de 100 m, convertendo a coordenada em “Commercial_Zone” na borda e descartando o dado bruto da RAM antes de qualquer chamada à LLM externa. |
| Implicações para QoC | Não são especificados critério de fusão, resolução mínima ou justificativa para a amostragem. | A amostragem, a granularidade espacial e a abstração semântica são especificadas; os valores são hipotéticos e exigem justificativa no domínio da aplicação. |
| Implicações para a LGPD | A finalidade de cada fonte, a condição de ativação e o compartilhamento externo não são definidos. | A proposta explicita finalidade, gatilho, abstração e descarte; a base legal e os mecanismos de transferência internacional ainda exigem análise específica do caso. |

---

## 4 Metodologia

### 4.1 Caracterização da Pesquisa
Este é um estudo aplicado de Engenharia de Software, centrado na concepção e na implementação de uma ferramenta que apoia um problema definido de Engenharia de Requisitos: a negociação, em tempo de projeto, de requisitos de aplicações sensíveis ao contexto sob a LGPD. A perspectiva orientada à construção de artefatos foi fundamentada na literatura de Design Science Research (DSR) [16,17]. Os artefatos produzidos são de três tipos: construtos e modelos (as tensões, a estrutura do requisito contextual, o método de negociação e os diagramas BPMN), uma especificação arquitetural em ACME e uma instanciação, o protótipo web.

O trabalho não é apresentado como um estudo DSR concluído: não foi conduzido um ciclo completo de DSR, nem uma avaliação formal ou validação empírica. A Tabela 3 relaciona as atividades usualmente associadas à DSR ao que foi, ou não foi, realizado.

**Tabela 3. Atividades inspiradas na DSR e sua situação neste trabalho.**

| Atividade | O que foi feito neste trabalho | Situação |
|---|---|---|
| Identificação do problema | Caracterização da tensão entre aquisição de contexto, LLMs de contexto longo e LGPD como problema de requisitos (Seções 1 a 3). | Realizada |
| Objetivos da solução | Definição de que o requisito deve explicitar a inferência, os dados necessários, a QoC, os gatilhos, o processamento, a retenção, o compartilhamento e as evidências (Seção 5). | Realizada |
| Projeto e desenvolvimento | Método de negociação, modelos BPMN, especificação ACME e protótipo web (Seções 5 a 7). | Realizada; ACME ainda sem validação de sintaxe e tipos |
| Demonstração | Exemplo ilustrativo (Tabela 2) e verificação funcional das funções do protótipo (Seção 4.7). | Parcial |
| Avaliação | Protocolo em duas etapas: especialistas e, depois, comparação quase-experimental (Seção 8). | Não realizada |
| Comunicação | Este artigo. | Em andamento |

O método de negociação foi concebido conceitualmente antes da implementação e orientou o desenvolvimento; o protótipo foi construído em seguida como instanciação do método.

### 4.2 Caracterização do Problema e Seleção das Fontes
O problema originou-se de três observações: 
1. A leitura da LGPD durante trabalhos anteriores do autor sobre requisitos regulatórios [19–21]; 
2. O contato com sistemas sensíveis ao contexto em uma disciplina de Contexto Computacional de 2026.2; 
3. A dificuldade de sistemas apoiados por IA em atender integralmente à LGPD quando dependem de grandes volumes de contexto implícito. Trata-se de uma motivação prática, e não de uma lacuna demonstrada por revisão sistemática.

As fontes foram reunidas por levantamento exploratório (narrativo), e não por revisão sistemática. O ponto de partida foram os trabalhos anteriores do autor [19–21], textos de referência sobre sistemas sensíveis ao contexto, em especial o material de Vieira, Tedesco e Salgado sobre modelos e processos para o desenvolvimento desses sistemas [23], as definições clássicas de contexto e de QoC [1,2,5] e as fontes regulatórias.

### 4.3 Síntese das Tensões (Paradoxos)
As três tensões estruturais da Tabela 1, aqui também chamadas paradoxos, foram derivadas pela combinação de duas origens. A primeira é o confronto entre os conceitos de contexto e de QoC [1,2,5] e os princípios e dispositivos da LGPD [4,18]. A segunda é a formulação inicial das tensões durante a concepção do sistema, realizada com apoio do assistente Google Antigravity (modelo Gemini 3.8 Flash High), com cada tensão individualmente conferida e validada pelo autor contra o texto da lei (Art. 6º, 20, 33 e 46 da Lei nº 13.709/2018). Em seguida, as tensões foram refinadas e tipificadas em regras ao modelar cenários de requisitos contextuais na ferramenta. Usamos “paradoxo” no sentido de tensão entre exigências que não podem ser maximizadas simultaneamente (por exemplo, QoC e minimização), e não de contradição lógica.

### 4.4 Definição do Método de Negociação
O método foi definido a partir de quatro referências: a degradação controlada da QoC [5]; as salvaguardas de Privacy by Design e as estratégias de minimizar, abstrair e ocultar [10,11]; a derivação de requisitos a partir de regras regulatórias [9]; e a descrição de cenários pelas dimensões 4W [1,2] com critérios de aceitação Given-When-Then [12,13].

**Tabela 4. Correspondência entre as etapas do método (Seção 5) e as funções do protótipo.**

| Etapa do método | Função do protótipo | Observação |
|---|---|---|
| M1 Cenário, M2 Contexto e M3 QoC | Formulários de entrada (ReqInputInterface): requisito original, dimensões 4W, fontes e sensores, QoC, gatilhos e critérios BDD. | Entrada estruturada no navegador. |
| M4 Regulação | Diagnóstico das três tensões pela LLM externa ou pelo motor determinístico de contingência. | O diagnóstico é uma proposta para revisão. |
| M5 Negociação | Requisito negociado e chat de refinamento. | Edição e iteração pelo usuário. |
| M6 Aprovação | Matriz de prestação de contas, rascunho do RIPD, cofre local e exportação. | A aprovação e a revisão jurídica permanecem humanas. |

### 4.5 Modelagem dos Processos
Os processos foram modelados em BPMN [14] com a ferramenta diagrams.net. Foram elaborados três diagramas com finalidades distintas, resumidos na Tabela 5: o percurso metodológico da pesquisa (Fig. 1), o método de negociação de requisitos (Fig. 2) e o fluxo de interação com a ferramenta (Fig. 3).

**Tabela 5. Os três modelos BPMN do trabalho e suas finalidades.**

| Diagrama | Pergunta que responde | Seção |
|---|---|---|
| Percurso metodológico (Fig. 1) | Como o pesquisador caracterizou o problema, analisou as fontes, concebeu o método, modelou a arquitetura, documentou a ferramenta e consolidou o relato? | 4 |
| Método de negociação (Fig. 2) | Como o engenheiro de requisitos usa o método: informa o cenário, caracteriza o contexto e a QoC, confronta as restrições, negocia, revisa e aprova? | 5 |
| Interação com a ferramenta (Fig. 3) | Como os dados passam pelo navegador, pelas rotas de API, pelo provedor de LLM ou pela contingência local, e retornam ao usuário? | 6 |

### 4.6 Especificação Arquitetural e Implementação
A arquitetura foi especificada na linguagem de descrição arquitetural ACME [15], tomando como referência [24] e a documentação do projeto, e foi desenhada no diagrams.net. A descrição organiza o sistema em representações compostas, subcomponentes, portas, conectores e bindings (Seção 7). 

A correspondência entre os elementos ACME e os módulos do código foi estabelecida por inspeção direta do código-fonte e da documentação e está resumida na Tabela 9 (Seção 7.1). O protótipo foi implementado em Next.js, com cliente no navegador e rotas de API no servidor, persistência local no navegador e integração opcional com provedores de LLM (Gemini, OpenAI e Groq). A versão descrita neste artigo é a v1.0.0 (10 de novembro de 2026), disponível em https://context-lgpd-negotiator.vercel.app/.

### 4.7 Demonstração, Verificação Funcional e Limites
Foram implementadas e verificadas funcionalmente pelo autor: entrada estruturada do cenário; motor determinístico de contingência; rotas de API de negociação e de chat com retorno automático à contingência; chat de refinamento; cofre local com múltiplos projetos, desfazer de exclusão por snapshot e aviso de backup; importação e exportação em JSON; e geração e exportação do rascunho do RIPD com matriz de prestação de contas. Essa verificação foi realizada de forma manual e interativa sobre três cenários canônicos de teste.

---

## 5 Método de Negociação de Requisitos
O método é direcionado ao projeto de aplicações sensíveis ao contexto. Seu usuário principal é o engenheiro de requisitos ou desenvolvedor.

**Tabela 6. Campos propostos para um requisito contextual orientado à privacidade.**

| Campo | Finalidade da especificação |
|---|---|
| Identificador e declaração original | Preservar o requisito inicial e uma referência estável. |
| Objetivo contextual e dimensões 4W | Declarar o objetivo da inferência e identificar somente os atributos where/who/when/what relevantes. |
| Fontes e sensores | Listar cada fonte de dados e explicar sua contribuição. |
| Restrições de QoC | Especificar precisão, confiança na correção, resolução espacial e temporal e atualidade. |
| Gatilhos de ativação e encerramento | Definir quando a coleta começa e termina. |
| Processamento local e abstração | Descrever as transformações e indicar se valores brutos podem permanecer localmente. |
| Retenção e compartilhamento | Definir o descarte e identificar eventual compartilhamento com LLM externa ou análise de transferência. |
| Justificativa legal e evidências | Relacionar as decisões de tratamento aos princípios pertinentes da LGPD e aos registros de prestação de contas. |
| Critérios de aceitação e revisão | Definir o comportamento testável e identificar a revisão humana necessária. |

**Tabela 7. Principais atividades do método de negociação de requisitos.**

| Etapa | Papel responsável | Atividade e saída |
|---|---|---|
| M1 – Cenário | Engenheiro de requisitos | Descrever a funcionalidade e a inferência contextual pretendida; produzir o requisito inicial. |
| M2 – Contexto | Engenheiro / analista | Identificar dimensões 4W, sensores e fontes relevantes; excluir atributos irrelevantes. |
| M3 – QoC | Engenheiro / especialista de domínio | Especificar precisão mínima, confiança na correção, resolução espacial/temporal e atualidade. |
| M4 – Regulação | Revisor de privacidade | Mapear finalidade, adequação, necessidade, segurança, prestação de contas e questões de transferência. |
| M5 – Negociação | Engenheiro e revisor | Ajustar fontes, gatilhos, granularidade, processamento local, retenção e compartilhamento. |
| M6 – Aprovação | Engenheiro; revisor quando necessário | Revisar a especificação e preparar artefatos de rastreabilidade e apoio ao RIPD. |

---

## 6 ContextLGPD-Negotiator: Fluxo da Ferramenta e Interação do Usuário
O ContextLGPD-Negotiator é uma ferramenta web concebida para apoiar o método. A aplicabilidade jurídica depende de fatos da implantação. A ferramenta apoia a especificação durante o projeto; a imposição em tempo de execução deverá ser implementada e testada separadamente. O gerenciamento de projetos é local via `localStorage`, enquanto a contingência local garante funcionamento sem chaves de API externas.

**Tabela 8. Elementos BPMN que descrevem o fluxo de interação com o ContextLGPD-Negotiator.**

| ID | Participante | Atividade e saída |
|---|---|---|
| EV-01 | Engenheiro de requisitos | Registra o requisito inicial, dimensões contextuais, sensores, limites de QoC e critérios de aceitação. |
| ACT-01 | Aplicação local | Estrutura o requisito e extrai as variáveis contextuais e fontes declaradas. |
| GW-01 | Aplicação local / servidor | Verifica as três tensões: fusão excessiva de sensores, monitoramento contínuo e compartilhamento com LLM externa. |
| ACT-02 | Ferramenta + engenheiro | Define ou refina gatilhos de ativação e restrições de amostragem. |
| ACT-03 | Pipeline de raciocínio da IA | Produz um diagnóstico de privacidade e propõe regras de minimização, abstração e retenção. |
| ACT-04 | LLM externa ou contingência local | Retorna um requisito candidato ou texto de apoio pelo caminho de raciocínio selecionado. |
| ACT-05 | Aplicação local | Prepara a matriz de prestação de contas e o rascunho do RIPD com base no conteúdo retornado. |
| ACT-06 | Engenheiro de requisitos | Revisa, edita, aceita ou rejeita a proposta gerada. |
| EV-02 | Aplicação local | Armazena o projeto localmente e exporta a documentação. |

---

## 7 Especificação da Arquitetura de Software

### 7.1 Visão Arquitetural: Três Representações Compostas
A descrição ACME organiza o sistema em três componentes compostos:
1. **Browser – Next.js Client SPA:** Contém `ReqInputInterface` e `LocalStorageVault`.
2. **Next.js Server Runtime – API Routes:** Contém `PromptMediator`, `LocalAcmeFallbackEngine` e `ResponseParser & Serializer`.
3. **ExternalLLMReasoning – AI Negotiator Engine:** Contém as três etapas lógicas de raciocínio: `ContextParserEngine` (Etapa 1), `PrivacyGuardSanitizer` (Etapa 2) e `RegulatoryDocGenerator` (Etapa 3).

**Tabela 9. Representações compostas e elementos internos na arquitetura ACME atualizada.**

| Representação composta | Subcomponente interno | Implementação / responsabilidade |
|---|---|---|
| Browser – Next.js Client SPA | ReqInputInterface | Workspace.jsx, ScenarioModal.jsx, NotationTab.jsx e ChatTab.jsx; captura 4W, fontes/sensores, QoC, gatilhos, critérios BDD. |
| Browser – Next.js Client SPA | LocalStorageVault | HTML5 localStorage; armazena projetos, cenários e conversas; snapshots de desfazer, backup JSON. |
| Next.js Server Runtime – API Routes | PromptMediator | /api/negotiate e /api/chat; formata cenário por formatPrompt() e anexa SYSTEM_PROMPT_NEGOTIATOR. |
| Next.js Server Runtime – API Routes | LocalAcmeFallbackEngine | runLocalAcmeNegotiator(); contingência determinística no servidor para ausência de chave ou falha de rede. |
| Next.js Server Runtime – API Routes | ResponseParser & Serializer | parseJson() e NextResponse.json(); normaliza e valida JSON retornado. |
| ExternalLLMReasoning – AI Negotiator Engine | ContextParserEngine (Etapa 1) | Interpreta cenário e estrutura parsedContext (4W, sensores, QoC). |
| ExternalLLMReasoning – AI Negotiator Engine | PrivacyGuardSanitizer (Etapa 2) | Diagnostica as 3 tensões da LGPD e propõe regras de borda e retenção. |
| ExternalLLMReasoning – AI Negotiator Engine | RegulatoryDocGenerator (Etapa 3) | Produz o requisito negociado e accountabilityMatrix. |

### 7.5 Execução Ponta a Ponta e Restrições Arquiteturais
- **I1 – Minimização antes do compartilhamento:** Objetivo de projeto que exige atenção: como o PrivacyGuardSanitizer está dentro da LLM externa no modelo atual, um controle local pré-chamada é necessário para garantir que dados crus não saiam da máquina.
- **I2 – Especificação de gatilhos:** Sensoriamento de alta resolução condicionado a evento explícito.
- **I3 – Rastreabilidade para prestação de contas:** Requisito negociado vinculado à matriz de conformidade (Art. 6º, X).

---

## 8 Protocolo de Avaliação Planejado
A avaliação empírica futura é planejada em duas etapas:
1. **Avaliação por Especialistas (6 a 10 avaliadores):** Análise de clareza, utilidade, completude e aderência à LGPD via escala Likert e feedback qualitativo.
2. **Comparação Quase-Experimental:** Especificação manual versus especificação assistida pela ferramenta sobre cenários padronizados, mensurando completude, minimização de dados e eficiência temporal.

**Tabela 10. Dimensões de avaliação propostas e fontes de evidência.**

| Dimensão | Medida planejada | Evidência |
|---|---|---|
| Identificação de conflitos | Precisão, revocação e F1-score em relação aos rótulos dos especialistas. | Diagnósticos da ferramenta e conjunto de referência adjudicado. |
| Completude dos requisitos | Pontuação em rubrica para finalidade, contexto, fontes, QoC, gatilhos, processamento, descarte e critérios. | Especificações manuais e assistidas pela ferramenta. |
| Minimização de dados | Presença de atributos proibidos ou excessivos em solicitações de saída e logs. | Entradas sintéticas de teste e rastros de requisições. |
| Artefatos de prestação de contas | Completude e rastreabilidade da matriz e do rascunho do RIPD. | Documentos gerados e revisão especializada. |
| Eficiência e usabilidade | Tempo de conclusão, ciclos de revisão e feedback dos participantes. | Registros de tarefas e questionário de usabilidade. |

---

## 9 Discussão e 10 Conclusão
O artigo estabelece que a QoC deve ser tratada como variável negociável de engenharia de software e privacidade. A arquitetura documenta com clareza as fronteiras de processamento e a necessidade de julgamento humano sobre os requisitos gerados.

### Declarações
* **Agradecimentos:** Em conformidade com as diretrizes de integridade científica e ética em pesquisa do CNPq, o autor declara que utilizou ferramentas de inteligência artificial generativa com finalidade estritamente assistiva, voltada ao auxílio na prototipação de código, refinamento da redação técnica, exploração inicial de cenários bem como na escrita desse artefato. Todas as formulações conceituais, especificações arquiteturais, análises de conformidade com a LGPD e conclusões científicas foram concebidas, rigorosamente checadas, validadas e editadas pelo autor, que assume integral e exclusiva responsabilidade pela veracidade, exatidão técnica e integridade acadêmica de todo o conteúdo apresentado.
* **Financiamento:** O presente trabalho foi realizado com o apoio financeiro da Fundação de Amparo à Ciência e Tecnologia do Estado de Pernambuco (FACEPE), da Coordenação de Aperfeiçoamento de Pessoal de Nível Superior – Brasil (CAPES) – Código de Financiamento 001, e do Conselho Nacional de Desenvolvimento Científico e Tecnológico (CNPq).
* **Conflitos de interesse:** O autor declara não possuir conflitos de interesse relevantes.
* **Disponibilidade de dados e código:** https://context-lgpd-negotiator.vercel.app/ e https://github.com/scan4364/ContextLGPD-Negotiator.

---

## Referências
[1] Dey, A.K. (2001). Understanding and using context. *Personal and Ubiquitous Computing*.  
[2] Abowd, G.D. et al. (1999). Towards a better understanding of context and context-awareness. *HUC 1999*.  
[3] Perera, C. et al. (2014). Context aware computing for the Internet of Things: a survey. *IEEE CST*.  
[4] Brasil (2018). Lei Geral de Proteção de Dados Pessoais (LGPD), Lei nº 13.709/2018.  
[5] Buchholz, T. et al. (2003). Quality of context: what it is and why we need it. *HPOVUA*.  
[6] Bettini, C. et al. (2010). A survey of context modelling and reasoning techniques. *PMC*.  
[7] Sommerville, I. (2019). *Software Engineering*, 10th edn. Pearson.  
[8] Robertson, S., Robertson, J. (2012). *Mastering the Requirements Process*, 3rd edn.  
[9] Breaux, T.D., Antón, A.I. (2008). Analyzing regulatory rules for privacy and security requirements. *IEEE TSE*.  
[10] Cavoukian, A. (2009). *Privacy by Design: The 7 Foundational Principles*.  
[11] Hoepman, J.-H. (2014). Privacy design strategies. *IFIP AICT*.  
[12] Rawson, J., Reddivari, S. (2025). A ChatGPT-powered tool for automating context-aware acceptance criteria generation for user stories. *IEEE IRI 2025*.  
[13] North, D. (2006). Introducing BDD: Better Software through Behavior-Driven Development. *Better Software*.  
[14] OMG (2011). *Business Process Model and Notation (BPMN), Version 2.0*.  
[15] Garlan, D., Monroe, R.T., Wile, D. (2000). Acme: architectural description of component-based systems.  
[16] Hevner, A.R. et al. (2004). Design science in information systems research. *MIS Quarterly*.  
[17] Wieringa, R.J. (2014). *Design Science Methodology for Information Systems and Software Engineering*.  
[18] ANPD (2024). Resolução CD/ANPD nº 19/2024. Regulamento de Transferência Internacional de Dados.  
[19] Anjos Neto, S.C., Causil, O.M.M. (2025). Catálogo de requisitos baseado em evidências regulatórias. *CNEG 2025*.  
[20] Neto, S.A., Castro, J., Lencastre, M., Causil, O. (2026). Defining Requirements for Perishable Goods (SAFE_GOOD). *WER 2026*.  
[21] Anjos Neto, S.C. (2026). Definindo requisitos para gerenciamento de produtos perecíveis (produtos_seguros). TCC, CIn-UFPE.  
[22] Google DeepMind (2026). Gemini 3.8 Flash Model Card.  
[23] Vieira, V., Tedesco, P., Salgado, A.C. Modelos e Processos para o Desenvolvimento de Sistemas Sensíveis ao Contexto.  
[24] Castro, J., Lucena, M., Silva, C., Alencar, F., Santos, E., Pimentel, J. (2012). Changing attitudes towards the generation of architectural models. *JSS*.
