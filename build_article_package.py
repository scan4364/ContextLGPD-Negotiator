# -*- coding: utf-8 -*-
"""
Script de Geração do Pacote Arquitetural para o Artigo Científico:
Autor: Samuel Anjos Neto
Instituição: Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE)
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Configuração de Margens A4 (2.5 cm em todas as bordas)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Estilos Base
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # =========================================================================
    # CAPA / CABEÇALHO ACADÊMICO
    # =========================================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_inst = p_inst.add_run("UNIVERSIDADE FEDERAL DE PERNAMBUCO (UFPE)\nCENTRO DE INFORMÁTICA (CIn)\nPÓS-GRADUAÇÃO EM CIÊNCIA DA COMPUTAÇÃO / ENGENHARIA DE SOFTWARE")
    r_inst.bold = True
    r_inst.font.size = Pt(10)
    r_inst.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph().paragraph_format.space_after = Pt(18)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("ESPECIFICAÇÃO ARQUITETURAL FORMAL (ADL ACME) E MODELAGEM DE PROCESSOS (BPMN) PARA MEDIAÇÃO ENTRE SISTEMAS SENSÍVEIS AO CONTEXTO E A LGPD")
    r_title.bold = True
    r_title.font.size = Pt(16)
    r_title.font.color.rgb = RGBColor(15, 23, 42) # Slate 900

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Fundamentação Teórica, Módulos Arquiteturais, Especificação em Linguagem ACME, Diagramas de Processos BPMN e Matriz de Rastreabilidade Regulatória")
    r_sub.italic = True
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    p_author = doc.add_paragraph()
    p_author.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_author = p_author.add_run("Desenvolvedor e Autor: Samuel Anjos Neto\n")
    r_author.bold = True
    r_author.font.size = Pt(12)
    r_author.font.color.rgb = RGBColor(15, 23, 42)
    r_cin = p_author.add_run("Centro de Informática — Universidade Federal de Pernambuco (CIn-UFPE)\nE-mail: pesquisador@cin.ufpe.br | Recife – PE, Brasil\nNovembro de 2026")
    r_cin.font.size = Pt(10)
    r_cin.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph().paragraph_format.space_after = Pt(24)

    # Linha divisória
    p_hr = doc.add_paragraph()
    p_hr.paragraph_format.space_after = Pt(18)
    r_hr = p_hr.add_run("—" * 55)
    r_hr.font.color.rgb = RGBColor(203, 213, 225)
    p_hr.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # =========================================================================
    # RESUMO EXECUTIVO
    # =========================================================================
    p_abs_title = doc.add_paragraph()
    r_abs_title = p_abs_title.add_run("Resumo Executivo")
    r_abs_title.bold = True
    r_abs_title.font.size = Pt(13)
    r_abs_title.font.color.rgb = RGBColor(15, 23, 42)

    p_abs = doc.add_paragraph()
    p_abs.paragraph_format.line_spacing = 1.15
    p_abs.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs.add_run(
        "Este documento técnico-acadêmico consolida a arquitetura completa e a modelagem formal de processos do sistema "
        "ContextLGPD-Negotiator, concebido e desenvolvido por Samuel Anjos Neto no Centro de Informática da Universidade "
        "Federal de Pernambuco (CIn-UFPE). A pesquisa endereça o conflito basilar existente entre sistemas sensíveis ao contexto "
        "(Dey, 2001; Abowd et al., 1999) — que demandam monitoramento ininterrupto e inferência probabilística sobre variáveis do "
        "usuário — e os postulados restritivos da Lei Geral de Proteção de Dados Pessoais (LGPD, Lei nº 13.709/2018), em particular "
        "os princípios da Minimização (Art. 6º, III), Finalidade/Adequação (Art. 6º, I e II), Transferência Internacional de Dados (Art. 33) "
        "e Responsabilização e Prestação de Contas (Art. 6º, X). Apresenta-se a descrição arquitetural em linguagem formal ADL ACME, "
        "o mapeamento dos processos de engenharia de requisitos em notação BPMN (3 raias), a taxonomia de mitigação dos Três Paradoxos e o "
        "aparato bibliográfico completo para fundamentação e citação no artigo científico."
    )

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # =========================================================================
    # SEÇÃO 1: VISÃO GERAL E OS TRÊS PARADOXOS
    # =========================================================================
    h1 = doc.add_paragraph()
    r_h1 = h1.add_run("1. Fundamentação Teórica e os Três Paradoxos Regulatórios")
    r_h1.bold = True
    r_h1.font.size = Pt(14)
    r_h1.font.color.rgb = RGBColor(30, 58, 138) # Blue 900

    p_p1 = doc.add_paragraph()
    p_p1.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_p1.add_run(
        "A literatura clássica de Computação Ubíqua e Sistemas Conscientes de Contexto define 'contexto' como qualquer "
        "informação utilizada para caracterizar a situação de uma entidade (Dey, 2001). Conforme formalizado por Abowd et al. (1999), "
        "esse contexto primário desdobra-se em quatro dimensões fundamentais (4W): Onde (Where / Espacial), Quem (Who / Identidade), "
        "Quando (When / Temporal) e O Quê (What / Atividade). A qualidade das adaptações contextuais depende intrinsecamente da "
        "Qualidade de Contexto (Quality of Context — QoC), parametrizada por precisão, frescor de leitura e resolução sensorial (Buchholz et al., 2003).\n\n"
        "Entretanto, ao incorporar Large Language Models (LLMs) em nuvem para raciocínio contextual complexo (Rawson & Reddivari, 2025; Pfautz et al., 2015), "
        "a Engenharia de Requisitos depara-se com três tensões irreconciliáveis caso o design tradicional seja mantido:"
    )

    # Tabela dos 3 Paradoxos
    table_par = doc.add_table(rows=1, cols=4)
    table_par.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_par.autofit = False

    hdr_cells = table_par.rows[0].cells
    hdr_titles = ["Paradoxo Técnico-Regulatório", "Dispositivo Legal (LGPD)", "Mecanismo Tradicional (Conflito)", "Solução Arquitetural Privacy by Design"]
    col_widths = [Inches(1.8), Inches(1.5), Inches(2.0), Inches(2.0)]

    for i, title in enumerate(hdr_titles):
        hdr_cells[i].width = col_widths[i]
        set_cell_background(hdr_cells[i], "1E293B") # Slate 800
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = hdr_cells[i].paragraphs[0]
        r = p.add_run(title)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    paradox_data = [
        (
            "1. Paradoxo da Inferência\n(Fusão Sensorial vs. Minimização)",
            "Art. 6º, III\n(Necessidade e Minimização de Dados)",
            "Coleta abundante e irrestrita de múltiplos sensores contínuos (GPS bruto, acelerômetro, biometria) para tentar deduzir estados implícitos.",
            "Degradação deliberada de granularidade métrica na borda (Edge). Conversão de coordenadas em tags semânticas abstratas e amostragem controlada."
        ),
        (
            "2. Paradoxo da Proatividade\n(Monitoramento 24/7 vs. Finalidade)",
            "Art. 6º, I e II\n(Finalidade, Adequação e Proporcionalidade)",
            "Sensoriamento em segundo plano full-time (24 horas por dia) quando a real atuação do sistema ocorre apenas em momentos efêmeros.",
            "Gatilhos Estritos de Ativação (Trigger Events). Sensores primários pesados (como GPS) permanecem em repouso até que acelerômetro de baixo custo confirme deslocamento."
        ),
        (
            "3. Paradoxo do Largo Contexto\n(LLMs em Nuvem vs. Segurança)",
            "Art. 33 e Art. 46\n(Transferência Internacional e Dever de Segurança)",
            "Transmissão de janelas long-context contendo identificadores diretos, metadados sensíveis e áudio cru para data centers no exterior.",
            "Componente PrivacyGuardSanitizer na borda. Amostragem em memória volátil com descarte imediato (Zero-Storage) e envio de pseudônimos à nuvem externa."
        )
    ]

    for row_idx, data in enumerate(paradox_data):
        row_cells = table_par.add_row().cells
        bg_color = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for i, text in enumerate(data):
            row_cells[i].width = col_widths[i]
            set_cell_background(row_cells[i], bg_color)
            set_cell_margins(row_cells[i], top=100, bottom=100, left=140, right=140)
            p = row_cells[i].paragraphs[0]
            p.paragraph_format.line_spacing = 1.1
            r = p.add_run(text)
            r.font.size = Pt(9)
            if i == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # =========================================================================
    # SEÇÃO 2: ARQUITETURA CONCEITUAL E SUBSISTEMAS
    # =========================================================================
    h2 = doc.add_paragraph()
    r_h2 = h2.add_run("2. Arquitetura Estrutural do Sistema ContextLGPD-Negotiator")
    r_h2.bold = True
    r_h2.font.size = Pt(14)
    r_h2.font.color.rgb = RGBColor(30, 58, 138)

    p_arch = doc.add_paragraph()
    p_arch.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_arch.add_run(
        "A arquitetura do ContextLGPD-Negotiator foi projetada para operar sob o paradigma Offline-First e Serverless, "
        "desacoplando rigorosamente a camada de sensoriamento e sanitização de borda do processamento de raciocínio externo. "
        "Os subsistemas centrais compreendem:"
    )

    modules = [
        ("ReqInputInterface (Interface de Entrada de Requisitos):", "Permite ao engenheiro de requisitos especificar o cenário por meio de Histórias de Usuário ágeis, das 4 dimensões de contexto (Dey, 2001), dos sensores e limites de QoC desejados, gatilhos de ativação e critérios de aceitação BDD (Given-When-Then, Rawson & Reddivari, 2025)."),
        ("ContextParserEngine (Motor de Análise Contextual):", "Decompõe e vetoriza as variáveis de contexto, correlacionando os sensores especificados com os requisitos de amostragem temporal e espacial necessários para viabilizar a inferência."),
        ("PrivacyGuardSanitizer (Filtro e Sanitizador de Borda):", "Componente central de Privacy by Design (Cavoukian, 2009; Hoepman, 2014). Avalia as regras formais da LGPD, aplica degradação de QoC (ex: conversão de lat/long para raio de 100m), traduz variáveis físicas em rótulos ontológicos e descarta dados crus da memória RAM antes de qualquer propagação externa."),
        ("ExternalLLMReasoning (Módulo de Raciocínio de Nuvem Externa):", "Interface RPC assíncrona que encaminha exclusivamente o payload sanitizado e anonimizado para provedores de LLM (Google Gemini, OpenAI GPT-4o, Groq Llama 3.3) sob diretriz de retenção zero de dados."),
        ("RegulatoryDocGenerator (Gerador de Conformidade e Accountability):", "Compila a especificação reescrita e produz automaticamente a Matriz de Comprovação Regulatória exigida pelo Art. 6º, X da LGPD, além de exportar o Relatório de Impacto à Proteção de Dados (RIPD) em formato Markdown."),
        ("LocalStorageVault (Cofre Local Persistente):", "Sistema de gerenciamento de dados cliente-side com suporte a múltiplos projetos, recuperação de desastres (Undo Snapshot) e exportação/importação de cofre em formato padronizado JSON.")
    ]

    for title, desc in modules:
        p_mod = doc.add_paragraph()
        p_mod.paragraph_format.left_indent = Inches(0.25)
        p_mod.paragraph_format.space_after = Pt(4)
        r_t = p_mod.add_run(f"• {title} ")
        r_t.bold = True
        r_t.font.color.rgb = RGBColor(15, 23, 42)
        r_d = p_mod.add_run(desc)
        r_d.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # =========================================================================
    # SEÇÃO 3: ESPECIFICAÇÃO FORMAL EM ADL ACME
    # =========================================================================
    h3 = doc.add_paragraph()
    r_h3 = h3.add_run("3. Especificação Arquitetural Formal em Linguagem ADL ACME")
    r_h3.bold = True
    r_h3.font.size = Pt(14)
    r_h3.font.color.rgb = RGBColor(30, 58, 138)

    p_acme_intro = doc.add_paragraph()
    p_acme_intro.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_acme_intro.add_run(
        "A Architecture Description Language (ADL) ACME (Garlan, Monroe & Wile, 1997, 2000) provê uma base matemática e estrutural "
        "rigorosa para descrever famílias de sistemas, tipos de componentes, portas, conectores e invariantes de integridade. "
        "A seguir, apresenta-se a descrição canônica formal do sistema ContextLGPD-Negotiator, explicitando as propriedades "
        "não funcionais e as invariantes de primeira ordem que asseguram a não violação da LGPD:"
    )

    acme_code = """Family ContextAwarePrivacySystem = {
    Port Type InputPortT = { Property direction : string = "in"; };
    Port Type OutputPortT = { Property direction : string = "out"; };
    Port Type AuditPortT = { Property complianceAudited : boolean = true; };
    Port Type StoragePortT = { Property volatileOnly : boolean; };

    Role Type CallerRoleT = {};
    Role Type ReceiverRoleT = {};
    Role Type ObserverRoleT = {};

    Connector Type JSONBindingConnectorT = {
        Role caller : CallerRoleT;
        Role receiver : ReceiverRoleT;
        Property protocol : string = "HTTPS/JSON";
        Property latency : float;
    };

    Connector Type EdgeSanitizationPipeT = {
        Role rawInput : CallerRoleT;
        Role sanitizedOutput : ReceiverRoleT;
        Property memoryModel : string = "Ephemeral_RAM_Zero_Storage";
        Property encryptionLevel : string = "AES_GCM_256";
    };

    Connector Type ZeroStorageCloudRPCT = {
        Role clientRequester : CallerRoleT;
        Role cloudWorker : ReceiverRoleT;
        Property dataRetentionPolicy : string = "Zero_Retention";
        Property crossBorderTransfer : boolean = true;
    };

    Connector Type LocalVaultConnectorT = {
        Role clientStore : CallerRoleT;
        Role clientCache : ReceiverRoleT;
        Property persistenceType : string = "HTML5_LocalStorage_Encrypted";
    };
};

System ContextLGPDNegotiatorArchitecture : ContextAwarePrivacySystem = {
    // -------------------------------------------------------------
    // 1. Componentes do Sistema
    // -------------------------------------------------------------
    Component ReqInputInterface = {
        Port uiIn : InputPortT;
        Port scenarioDefOut : OutputPortT;
        Property notationStandard : string = "4W_Context_Plus_BDD_Given_When_Then";
        Property actorRole : string = "Software_Requirements_Engineer";
    };

    Component ContextParserEngine = {
        Port rawScenarioIn : InputPortT;
        Port telemetryStreamIn : InputPortT;
        Port parsedVectorsOut : OutputPortT;
        Property contextTaxonomy : string = "Dey_2001_Where_Who_When_What";
        Property qocSamplingRate : string = "Dynamic_Calibrated";
    };

    Component PrivacyGuardSanitizer = {
        Port contextVectorIn : InputPortT;
        Port edgeAuditPort : AuditPortT;
        Port sanitizedPayloadOut : OutputPortT;
        Port ramEvictionOut : StoragePortT;
        Property executionTier : string = "Edge_Device_Local";
        Property granularityDegradationActive : boolean = true;
        Property semanticMaskingEnabled : boolean = true;
        Property directPiiEliminated : boolean = true;
    };

    Component ExternalLLMReasoning = {
        Port sanitizedPromptIn : InputPortT;
        Port synthesizedRequirementOut : OutputPortT;
        Property hostedRegion : string = "International_Cloud";
        Property contractualZeroStorage : boolean = true;
        Property supportedBackends : string = "Gemini_2.0_Flash, GPT_4o, Llama_3.3_70B";
    };

    Component RegulatoryDocGenerator = {
        Port negotiatedRequirementIn : InputPortT;
        Port accountabilityMatrixOut : AuditPortT;
        Port ripdMarkdownOut : OutputPortT;
        Property standardCompliance : string = "LGPD_Art_6_X_Accountability";
    };

    Component LocalStorageVault = {
        Port persistenceIn : InputPortT;
        Port recoveryOut : OutputPortT;
        Property storageLocation : string = "Client_Side_Local_Vault";
        Property offlineFirstEnabled : boolean = true;
        Property disasterRecoverySupported : boolean = true;
    };

    // -------------------------------------------------------------
    // 2. Conectores e Barramentos Arquiteturais
    // -------------------------------------------------------------
    Connector conn_input_to_parser : JSONBindingConnectorT;
    Connector conn_parser_to_guard : EdgeSanitizationPipeT;
    Connector conn_guard_to_cloud : ZeroStorageCloudRPCT;
    Connector conn_cloud_to_doc : JSONBindingConnectorT;
    Connector conn_vault_sync : LocalVaultConnectorT;

    // -------------------------------------------------------------
    // 3. Acoplamentos e Anexos (Attachments)
    // -------------------------------------------------------------
    Attachments {
        ReqInputInterface.scenarioDefOut to conn_input_to_parser.caller;
        ContextParserEngine.rawScenarioIn to conn_input_to_parser.receiver;

        ContextParserEngine.parsedVectorsOut to conn_parser_to_guard.rawInput;
        PrivacyGuardSanitizer.contextVectorIn to conn_parser_to_guard.sanitizedOutput;

        PrivacyGuardSanitizer.sanitizedPayloadOut to conn_guard_to_cloud.clientRequester;
        ExternalLLMReasoning.sanitizedPromptIn to conn_guard_to_cloud.cloudWorker;

        ExternalLLMReasoning.synthesizedRequirementOut to conn_cloud_to_doc.caller;
        RegulatoryDocGenerator.negotiatedRequirementIn to conn_cloud_to_doc.receiver;

        RegulatoryDocGenerator.accountabilityMatrixOut to conn_vault_sync.clientStore;
        LocalStorageVault.persistenceIn to conn_vault_sync.clientCache;
    };

    // -------------------------------------------------------------
    // 4. Invariantes de Primeira Ordem (Regras Formais de Conformidade)
    // -------------------------------------------------------------
    Rule Invariant_No_Raw_Sensory_Data_Transferred_To_Cloud = {
        forall c : Component in self.Components :
            (c.hostedRegion == "International_Cloud") ->
            (c.sanitizedPromptIn.directPiiEliminated == true and
             c.sanitizedPromptIn.rawGpsCoordinatesTransferred == false)
    };

    Rule Invariant_Strict_Trigger_Condition_Before_Activation = {
        forall p : Component in self.Components :
            (p.executionTier == "Edge_Device_Local") ->
            (p.qocSamplingRate == "High_Resolution_GPS" -> p.triggerConditionValidated == true)
    };

    Rule Invariant_Accountability_Matrix_Generated_For_All_Negotiated_Reqs = {
        forall req : OutputPortT in RegulatoryDocGenerator.accountabilityMatrixOut :
            (req.complianceAudited == true and req.legalBasisIdentified == true)
    };
};"""

    # Bloco de código para o ACME
    p_code = doc.add_paragraph()
    p_code.paragraph_format.left_indent = Inches(0.2)
    p_code.paragraph_format.right_indent = Inches(0.2)
    p_code.paragraph_format.space_before = Pt(4)
    p_code.paragraph_format.space_after = Pt(10)
    
    # Criar tabela estilizada de 1 célula para o código
    code_table = doc.add_table(rows=1, cols=1)
    code_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_cell = code_table.rows[0].cells[0]
    c_cell.width = Inches(6.5)
    set_cell_background(c_cell, "F1F5F9") # Slate 100
    set_cell_margins(c_cell, top=140, bottom=140, left=180, right=180)

    p_c = c_cell.paragraphs[0]
    p_c.paragraph_format.line_spacing = 1.05
    p_c.paragraph_format.space_after = Pt(0)
    r_c = p_c.add_run(acme_code)
    r_c.font.name = 'Consolas'
    r_c.font.size = Pt(8.5)
    r_c.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # =========================================================================
    # SEÇÃO 4: MODELAGEM DE PROCESSOS EM BPMN
    # =========================================================================
    h4 = doc.add_paragraph()
    r_h4 = h4.add_run("4. Modelagem Formal de Processos em BPMN (3 Raias)")
    r_h4.bold = True
    r_h4.font.size = Pt(14)
    r_h4.font.color.rgb = RGBColor(30, 58, 138)

    p_bpmn = doc.add_paragraph()
    p_bpmn.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_bpmn.add_run(
        "A engenharia de requisitos proposta organiza o fluxo de trabalho sob uma estrutura rigorosa de processo de negócio "
        "em Business Process Model and Notation (BPMN 2.0). O modelo estrutura-se em um Pool colaborativo dividido em 3 Raias (Lanes):\n\n"
        "• Raia 1: Engenheiro de Requisitos / Desenvolvedor (Ator Humano);\n"
        "• Raia 2: ContextLGPD-Negotiator / PrivacyGuard (Borda / Edge Local);\n"
        "• Raia 3: Provedor LLM Nuvem Externa & Auditoria Regulatória (ANPD / Art. 6º, X).\n\n"
        "A tabela a seguir discrimina a sequência exata de eventos, atividades e gateways do processo:"
    )

    # Tabela BPMN
    table_bpmn = doc.add_table(rows=1, cols=4)
    table_bpmn.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_bpmn.autofit = False

    b_hdr_cells = table_bpmn.rows[0].cells
    b_hdr_titles = ["ID & Elemento BPMN", "Raia Responsável", "Descrição Operacional da Atividade", "Saída / Artefato Gerado"]
    b_col_widths = [Inches(1.5), Inches(1.5), Inches(2.3), Inches(1.9)]

    for i, title in enumerate(b_hdr_titles):
        b_hdr_cells[i].width = b_col_widths[i]
        set_cell_background(b_hdr_cells[i], "1E293B")
        set_cell_margins(b_hdr_cells[i], top=120, bottom=120, left=140, right=140)
        p = b_hdr_cells[i].paragraphs[0]
        r = p.add_run(title)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    bpmn_steps = [
        ("EV-01: Evento de Início", "Raia 1: Engenheiro", "O engenheiro cadastra o requisito bruto e especifica as 4 dimensões (Where, Who, When, What) e sensores na interface.", "Cenário de Requisito Inicial"),
        ("ACT-01: Análise Sintática de Contexto", "Raia 2: Motor Local", "O ContextParserEngine extrai as variáveis de QoC e mapeia os sensores físicos envolvidos na dedução da situação.", "Vetor de Contexto Não Tratado"),
        ("GW-01: Gateway de Decisão (XOR)", "Raia 2: Motor Local", "Verifica se há conflito com os 3 Paradoxos: Fusão massiva? Monitoramento 24/7? Envio para LLM externa?", "Diagnóstico de Paradoxos (Sim/Não)"),
        ("ACT-02: Calibração de Gatilhos Estritos", "Raia 2: Motor Local", "Aplica o princípio da Proatividade Condicionada: suspende leitura contínua de GPS e estabelece disparo por acelerômetro local.", "Regra de Gatilho (Trigger Event)"),
        ("ACT-03: Degradação de QoC & Sanitização", "Raia 2: Motor Local", "O PrivacyGuard degrada coordenadas brutas para raio semântico ('Via_Expressa') e purga dados da RAM efêmera (Zero-Storage).", "Payload Sanitizado"),
        ("ACT-04: Raciocínio Semântico Assíncrono", "Raia 3: LLM Nuvem", "O modelo externo recebe exclusivamente o contexto abstrato e sintetiza a recomendação contextual sob política de retenção zero.", "Requisito Negociado Sintetizado"),
        ("ACT-05: Geração da Matriz de Accountability", "Raia 2: Motor Local", "Mapeia cada variável de contexto com sua respectiva justificativa técnica e artigo da LGPD (Art. 6º, III e X; Art. 15).", "Matriz de Comprovação Regulatória"),
        ("ACT-06: Validação e Refinamento", "Raia 1: Engenheiro", "O engenheiro revisa o requisito reescrito, efetua calibrações interativas via chat e aprova a especificação.", "Especificação Aprovada"),
        ("EV-02: Evento de Fim", "Raia 2: Motor Local", "Persistência no cofre local offline-first e emissão do relatório RIPD em Markdown.", "RIPD Final e Backup JSON")
    ]

    for row_idx, data in enumerate(bpmn_steps):
        row_cells = table_bpmn.add_row().cells
        bg_color = "F8FAFC" if row_idx % 2 == 0 else "FFFFFF"
        for i, text in enumerate(data):
            row_cells[i].width = b_col_widths[i]
            set_cell_background(row_cells[i], bg_color)
            set_cell_margins(row_cells[i], top=100, bottom=100, left=140, right=140)
            p = row_cells[i].paragraphs[0]
            p.paragraph_format.line_spacing = 1.1
            r = p.add_run(text)
            r.font.size = Pt(9)
            if i == 0:
                r.bold = True

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # =========================================================================
    # SEÇÃO 5: VISUALIZAÇÃO NO DIAGRAMS.NET (DRAW.IO)
    # =========================================================================
    h5 = doc.add_paragraph()
    r_h5 = h5.add_run("5. Guia de Visualização e Importação no diagrams.net (draw.io)")
    r_h5.bold = True
    r_h5.font.size = Pt(14)
    r_h5.font.color.rgb = RGBColor(30, 58, 138)

    p_drawio = doc.add_paragraph()
    p_drawio.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_drawio.add_run(
        "Para possibilitar a renderização gráfica, edição visual de cores e exportação de figuras vetoriais em alta resolução (SVG, PNG 300 DPI ou PDF) "
        "para inserção direta no artigo em LaTeX ou Word, foram gerados dois arquivos complementares no formato nativo do diagrams.net (draw.io XML):\n\n"
        "1. Arquivo: 'diagrama_arquitetura_ADL_ACME.drawio' — Representação visual completa dos 6 componentes arquiteturais, suas portas, conectores e fluxos de dados direcionados;\n"
        "2. Arquivo: 'diagrama_processo_BPMN_negociacao.drawio' — Diagrama BPMN formal de 3 raias com os eventos de início/fim, tarefas de borda, gateways XOR e fluxo de mensagens assíncronas.\n\n"
        "Instruções de Importação:\n"
        "a) Acesse a ferramenta gratuita em https://app.diagrams.net (ou abra o aplicativo Desktop do draw.io);\n"
        "b) Clique em 'Open Existing Diagram' (Abrir Diagrama Existente);\n"
        "c) Selecione o respectivo arquivo '.drawio' salvo no diretório do projeto;\n"
        "d) O diagrama carregará integralmente com layout otimizado, caixas organizadas, raias alinhadas e rótulos prontos para exportar (File -> Export As -> PNG / SVG / PDF)."
    )

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # =========================================================================
    # SEÇÃO 6: REFERÊNCIAS BIBLIOGRÁFICAS COMPLETAS
    # =========================================================================
    h6 = doc.add_paragraph()
    r_h6 = h6.add_run("6. Referências Bibliográficas Científicas (Normas ABNT & IEEE)")
    r_h6.bold = True
    r_h6.font.size = Pt(14)
    r_h6.font.color.rgb = RGBColor(30, 58, 138)

    references = [
        "ABOWD, G. D.; DEY, A. K.; BROWN, P. J.; DAVIES, N.; SMITH, M.; STEGGLES, P. Towards a Better Understanding of Context and Context-Awareness. In: HUC '99: Proceedings of the 1st International Symposium on Handheld and Ubiquitous Computing. Berlin, Heidelberg: Springer-Verlag, 1999. p. 304–307. DOI: 10.1007/3-540-48157-5_29.",
        "BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Diário Oficial da União: seção 1, Brasília, DF, ano 155, n. 157, p. 59–64, 15 ago. 2018.",
        "BUCHHOLZ, W.; KÜPPER, A.; SCHIFFERS, M. Quality of Context: What It Is And Why We Need It. In: Proceedings of the 10th International Conference on Software, Telecommunications and Computer Networks (SoftCOM 2003). Split, Croatia: FESB, 2003. p. 1–6.",
        "CAVOUKIAN, A. Privacy by Design: The 7 Foundational Principles. Information and Privacy Commissioner of Ontario, Canada, Tech. Rep., 2009. Disponível em: <https://www.ipc.on.ca>.",
        "COCKBURN, A. Writing Effective Use Cases. Boston, MA: Addison-Wesley Professional, 2000. 270 p. (The Agile Software Development Series).",
        "COHN, M. User Stories Applied: For Agile Software Development. Boston, MA: Addison-Wesley, 2004. 268 p.",
        "DEY, A. K. Understanding and Using Context. Personal and Ubiquitous Computing, v. 5, n. 1, p. 4–7, 2001. DOI: 10.1007/s007790170019.",
        "GARLAN, D.; MONROE, R. T.; WILE, D. ACME: An Architecture Description Interchange Language. In: Proceedings of the 1997 Conference of the Centre for Advanced Studies on Collaborative Research (CASCON '97). Toronto, Ontario, Canada: IBM Press, 1997. p. 169–183.",
        "GARLAN, D.; MONROE, R. T.; WILE, D. Acme: Architectural Description of Component-Based Systems. In: LEAVENS, G. T.; SITARAMAN, M. (Eds.). Foundations of Component-Based Systems. Cambridge: Cambridge University Press, 2000. p. 47–68.",
        "HOEPMAN, J.-H. Privacy Design Strategies. In: CUENCA SANCHO, J. et al. (Eds.). ICT Systems Security and Privacy Protection. SEC 2014. IFIP Advances in Information and Communication Technology, v. 428. Berlin, Heidelberg: Springer, 2014. p. 446–459. DOI: 10.1007/978-3-642-55415-5_38.",
        "LEITE, J. C. S. P.; ROSSI, G.; BALAGUER, F.; MAIORANA, V. Enhancing a Requirements Baseline with Scenarios. Requirements Engineering, v. 2, n. 4, p. 184–198, 1997. DOI: 10.1007/BF02745371.",
        "LEITE, J. C. S. P.; HADAD, H.; DOORN, J.; KAPLAN, G. A Scenario Construction Process. Requirements Engineering, v. 5, n. 1, p. 38–61, 2000. DOI: 10.1007/PL00010342.",
        "NORTH, D. Introducing BDD: Better Software through Behavior-Driven Development. Better Software Magazine, v. 8, n. 3, p. 26–33, Mar. 2006.",
        "PFAUTZ, S. L.; GANBERG, G.; FOUSE, A.; SCHURR, N. A General Context-Aware Framework for Improved Human-System Interactions. AI Magazine, v. 36, n. 2, p. 42–49, 2015. DOI: 10.1609/aimag.v36i2.2582.",
        "RAWSON, J.; REDDIVARI, S. A ChatGPT-Powered Tool for Automating Context-Aware Acceptance Criteria Generation for User Stories. In: IEEE 26th International Conference on Information Reuse and Integration for Data Science (IRI 2025). San Jose, CA, USA: IEEE, 2025. p. 325–330. DOI: 10.1109/IRI60971.2025.00062.",
        "ROBERTSON, S.; ROBERTSON, J. Mastering the Requirements Process: Getting Requirements Right. 3. ed. Upper Saddle River, NJ: Addison-Wesley, 2012. 544 p.",
        "SOMMERVILLE, I. Software Engineering. 10. ed. Harlow, UK: Pearson Education, 2019. Cap. 4: Requirements Engineering, p. 101–138."
    ]

    for ref in references:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.left_indent = Inches(0.35)
        p_ref.paragraph_format.first_line_indent = Inches(-0.35)
        p_ref.paragraph_format.line_spacing = 1.15
        p_ref.paragraph_format.space_after = Pt(6)
        p_ref.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r_r = p_ref.add_run(ref)
        r_r.font.size = Pt(9.5)

    output_path = os.path.abspath("Arquitetura_Processos_BPMN_ADL_ACME_Artigo_Samuel_Anjos_Neto.docx")
    doc.save(output_path)
    print(f"Documento Word gerado com sucesso: {output_path}")

# =============================================================================
# GERAÇÃO DOS DIAGRAMAS DRAW.IO (XML)
# =============================================================================

def create_drawio_architecture():
    xml_content = """<mxfile host="app.diagrams.net" modified="2026-11-10T00:25:00.000Z" agent="Mozilla/5.0" version="24.0.0" type="device">
  <diagram id="acme_architecture_diagram" name="Arquitetura ADL ACME - ContextLGPD">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#ffffff" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- FRAME DO SISTEMA -->
        <mxCell id="sys_box" value="System: ContextLGPDNegotiatorArchitecture (ADL ACME)" style="swimlane;whiteSpace=wrap;html=1;fillColor=#F8FAFC;strokeColor=#475569;fontStyle=1;fontSize=13;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="1080" height="720" as="geometry" />
        </mxCell>

        <!-- SUB-TIER 1: CLIENTE E INTERFACE -->
        <mxCell id="tier_client" value="Camada de Cliente &amp; Interface" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#3B82F6;dashed=1;fontColor=#1E3A8A;fontStyle=1;verticalAlign=top;align=left;spacingLeft=10;" vertex="1" parent="sys_box">
          <mxGeometry x="30" y="50" width="300" height="630" as="geometry" />
        </mxCell>

        <!-- COMPONENTE: ReqInputInterface -->
        <mxCell id="cmp_input" value="&lt;b&gt;Component: ReqInputInterface&lt;/b&gt;&lt;hr&gt;&lt;div style='text-align: left; font-size: 10px;'&gt;• 4W Context (Dey 2001)&lt;br&gt;• BDD Given-When-Then&lt;br&gt;• User Story agile format&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=2;fontColor=#0F172A;align=center;" vertex="1" parent="tier_client">
          <mxGeometry x="25" y="60" width="250" height="110" as="geometry" />
        </mxCell>
        <mxCell id="port_input_out" value="out: scenarioDefOut" style="ellipse;whiteSpace=wrap;html=1;fillColor=#DBEAFE;strokeColor=#2563EB;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_input">
          <mxGeometry x="190" y="75" width="55" height="30" as="geometry" />
        </mxCell>

        <!-- COMPONENTE: LocalStorageVault -->
        <mxCell id="cmp_vault" value="&lt;b&gt;Component: LocalStorageVault&lt;/b&gt;&lt;hr&gt;&lt;div style='text-align: left; font-size: 10px;'&gt;• Offline-First Client Vault&lt;br&gt;• Multi-Project Workspace&lt;br&gt;• Disaster Recovery (Undo)&lt;br&gt;• Zero Cloud DB Dependency&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#059669;strokeWidth=2;fontColor=#0F172A;align=center;" vertex="1" parent="tier_client">
          <mxGeometry x="25" y="440" width="250" height="130" as="geometry" />
        </mxCell>
        <mxCell id="port_vault_in" value="in: persistenceIn" style="ellipse;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#059669;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_vault">
          <mxGeometry x="10" y="20" width="60" height="30" as="geometry" />
        </mxCell>

        <!-- SUB-TIER 2: BORDA / EDGE (PRIVACYGUARD) -->
        <mxCell id="tier_edge" value="Camada de Borda (Edge Computing) — Sanitização Local" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F0FDF4;strokeColor=#10B981;dashed=1;fontColor=#065F46;fontStyle=1;verticalAlign=top;align=left;spacingLeft=10;" vertex="1" parent="sys_box">
          <mxGeometry x="360" y="50" width="370" height="630" as="geometry" />
        </mxCell>

        <!-- COMPONENTE: ContextParserEngine -->
        <mxCell id="cmp_parser" value="&lt;b&gt;Component: ContextParserEngine&lt;/b&gt;&lt;hr&gt;&lt;div style='text-align: left; font-size: 10px;'&gt;• Extração e vetorização 4W&lt;br&gt;• Calibração de QoC (Buchholz)&lt;br&gt;• Avaliação de Sensores Ativos&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#10B981;strokeWidth=2;fontColor=#0F172A;align=center;" vertex="1" parent="tier_edge">
          <mxGeometry x="30" y="60" width="310" height="110" as="geometry" />
        </mxCell>
        <mxCell id="port_parser_in" value="in: rawScenarioIn" style="ellipse;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#10B981;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_parser">
          <mxGeometry x="5" y="40" width="60" height="30" as="geometry" />
        </mxCell>
        <mxCell id="port_parser_out" value="out: parsedVectorsOut" style="ellipse;whiteSpace=wrap;html=1;fillColor=#D1FAE5;strokeColor=#10B981;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_parser">
          <mxGeometry x="235" y="40" width="70" height="30" as="geometry" />
        </mxCell>

        <!-- COMPONENTE: PrivacyGuardSanitizer -->
        <mxCell id="cmp_guard" value="&lt;b&gt;Component: PrivacyGuardSanitizer&lt;/b&gt;&lt;hr&gt;&lt;div style='text-align: left; font-size: 10px;'&gt;• Mitigação dos 3 Paradoxos LGPD&lt;br&gt;• Degradação Métrica de QoC (100m)&lt;br&gt;• Conversão em Tags Semânticas&lt;br&gt;• Zero-Storage em RAM Efêmera&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#EF4444;strokeWidth=2.5;fontColor=#7F1D1D;align=center;" vertex="1" parent="tier_edge">
          <mxGeometry x="30" y="240" width="310" height="140" as="geometry" />
        </mxCell>
        <mxCell id="port_guard_in" value="in: contextVectorIn" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#EF4444;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_guard">
          <mxGeometry x="120" y="5" width="70" height="25" as="geometry" />
        </mxCell>
        <mxCell id="port_guard_out" value="out: sanitizedPayloadOut" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FEE2E2;strokeColor=#EF4444;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_guard">
          <mxGeometry x="235" y="90" width="70" height="30" as="geometry" />
        </mxCell>

        <!-- COMPONENTE: RegulatoryDocGenerator -->
        <mxCell id="cmp_doc" value="&lt;b&gt;Component: RegulatoryDocGenerator&lt;/b&gt;&lt;hr&gt;&lt;div style='text-align: left; font-size: 10px;'&gt;• Matriz de Accountability (Art. 6º, X)&lt;br&gt;• Exportador de Relatório RIPD (.md)&lt;br&gt;• Rastreabilidade de Bases Legais&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#6366F1;strokeWidth=2;fontColor=#0F172A;align=center;" vertex="1" parent="tier_edge">
          <mxGeometry x="30" y="440" width="310" height="130" as="geometry" />
        </mxCell>
        <mxCell id="port_doc_in" value="in: negotiatedReqIn" style="ellipse;whiteSpace=wrap;html=1;fillColor=#E0E7FF;strokeColor=#6366F1;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_doc">
          <mxGeometry x="235" y="20" width="70" height="30" as="geometry" />
        </mxCell>
        <mxCell id="port_doc_out" value="out: accountabilityMatrixOut" style="ellipse;whiteSpace=wrap;html=1;fillColor=#E0E7FF;strokeColor=#6366F1;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_doc">
          <mxGeometry x="5" y="60" width="80" height="30" as="geometry" />
        </mxCell>

        <!-- SUB-TIER 3: NUVEM EXTERNA / LLM -->
        <mxCell id="tier_cloud" value="Camada de Raciocínio Externo (LLM Nuvem)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFBEB;strokeColor=#F59E0B;dashed=1;fontColor=#78350F;fontStyle=1;verticalAlign=top;align=left;spacingLeft=10;" vertex="1" parent="sys_box">
          <mxGeometry x="760" y="50" width="290" height="630" as="geometry" />
        </mxCell>

        <!-- COMPONENTE: ExternalLLMReasoning -->
        <mxCell id="cmp_llm" value="&lt;b&gt;Component: ExternalLLMReasoning&lt;/b&gt;&lt;hr&gt;&lt;div style='text-align: left; font-size: 10px;'&gt;• Google Gemini 2.0 Flash / Pro&lt;br&gt;• OpenAI GPT-4o / GPT-4o-mini&lt;br&gt;• Groq Llama 3.3 70B&lt;br&gt;• Contrato: Zero Retention Policy&lt;/div&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D97706;strokeWidth=2;fontColor=#0F172A;align=center;" vertex="1" parent="tier_cloud">
          <mxGeometry x="20" y="240" width="250" height="140" as="geometry" />
        </mxCell>
        <mxCell id="port_llm_in" value="in: sanitizedPromptIn" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_llm">
          <mxGeometry x="5" y="45" width="60" height="30" as="geometry" />
        </mxCell>
        <mxCell id="port_llm_out" value="out: synthesizedReqOut" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;fontSize=9;fontStyle=1;" vertex="1" parent="cmp_llm">
          <mxGeometry x="5" y="90" width="60" height="30" as="geometry" />
        </mxCell>

        <!-- CONECTORES (ARROWS / PIPES) -->
        <!-- 1. Input -> Parser -->
        <mxCell id="conn_1" value="Connector: conn_input_to_parser&lt;br&gt;[protocol=HTTPS/JSON]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#2563EB;fontColor=#1E3A8A;fontSize=9;" edge="1" parent="sys_box" source="port_input_out" target="port_parser_in">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- 2. Parser -> Guard -->
        <mxCell id="conn_2" value="Connector: conn_parser_to_guard&lt;br&gt;[EdgeSanitizationPipe]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#10B981;fontColor=#065F46;fontSize=9;" edge="1" parent="sys_box" source="port_parser_out" target="port_guard_in">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- 3. Guard -> LLM (Cloud) -->
        <mxCell id="conn_3" value="Connector: conn_guard_to_cloud&lt;br&gt;[ZeroStorageCloudRPC]&lt;br&gt;[Payload Sanitizado - Sem PII]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2.5;strokeColor=#EF4444;fontColor=#B91C1C;fontSize=9;" edge="1" parent="sys_box" source="port_guard_out" target="port_llm_in">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- 4. LLM -> Doc Generator -->
        <mxCell id="conn_4" value="Requisito Sintetizado (Privacy by Design)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#D97706;fontColor=#78350F;fontSize=9;" edge="1" parent="sys_box" source="port_llm_out" target="port_doc_in">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="730" y="380" />
              <mxPoint x="730" y="505" />
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- 5. Doc Generator -> Local Vault -->
        <mxCell id="conn_5" value="Connector: conn_vault_sync&lt;br&gt;[Matriz de Accountability + Backup JSON]" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=2;strokeColor=#059669;fontColor=#065F46;fontSize=9;" edge="1" parent="sys_box" source="port_doc_out" target="port_vault_in">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""
    with open("diagrama_arquitetura_ADL_ACME.drawio", "w", encoding="utf-8") as f:
        f.write(xml_content)
    print("Arquivo draw.io gerado: diagrama_arquitetura_ADL_ACME.drawio")

def create_drawio_bpmn():
    xml_content = """<mxfile host="app.diagrams.net" modified="2026-11-10T00:25:00.000Z" agent="Mozilla/5.0" version="24.0.0" type="device">
  <diagram id="bpmn_context_lgpd" name="Processo BPMN - Negociacao Contexto e LGPD">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#ffffff" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- POOL DE NEGOCIAÇÃO -->
        <mxCell id="pool1" value="Processo de Mediação entre Sistemas Sensíveis ao Contexto e a LGPD (BPMN 2.0)" style="swimlane;html=1;childLayout=stackLayout;resizeParent=1;resizeParentMax=0;startSize=30;horizontal=0;horizontalFlip=1;fillColor=#F8FAFC;strokeColor=#334155;fontStyle=1;fontSize=13;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="1080" height="720" as="geometry" />
        </mxCell>

        <!-- RAIA 1: ENGENHEIRO DE REQUISITOS -->
        <mxCell id="lane1" value="Raia 1: Engenheiro de Requisitos / Desenvolvedor" style="swimlane;html=1;startSize=26;horizontal=0;fillColor=#EFF6FF;strokeColor=#3B82F6;fontColor=#1E3A8A;fontStyle=1;" vertex="1" parent="pool1">
          <mxGeometry x="30" y="0" width="1050" height="220" as="geometry" />
        </mxCell>

        <!-- EV-01: Start Event -->
        <mxCell id="ev_start" value="Início da&lt;br&gt;Modelagem" style="shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;perimeter=ellipsePerimeter;outline=standard;symbol=general;fillColor=#D1FAE5;strokeColor=#059669;" vertex="1" parent="lane1">
          <mxGeometry x="40" y="90" width="40" height="40" as="geometry" />
        </mxCell>

        <!-- ACT-01: Especificar Cenário -->
        <mxCell id="act_01" value="Especificar Cenário &amp;amp;&lt;br&gt;Requisito Bruto&lt;br&gt;&lt;i&gt;(User Story, 4W, QoC)&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane1">
          <mxGeometry x="120" y="80" width="140" height="60" as="geometry" />
        </mxCell>

        <!-- ACT-06: Validação Interativa -->
        <mxCell id="act_06" value="Revisar e Refinar&lt;br&gt;Requisito Negociado&lt;br&gt;&lt;i&gt;(Chat Interativo com IA)&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane1">
          <mxGeometry x="780" y="80" width="140" height="60" as="geometry" />
        </mxCell>

        <!-- RAIA 2: BORDA / PRIVACYGUARD -->
        <mxCell id="lane2" value="Raia 2: ContextLGPD-Negotiator / PrivacyGuard (Borda)" style="swimlane;html=1;startSize=26;horizontal=0;fillColor=#F0FDF4;strokeColor=#10B981;fontColor=#065F46;fontStyle=1;" vertex="1" parent="pool1">
          <mxGeometry x="30" y="220" width="1050" height="260" as="geometry" />
        </mxCell>

        <!-- ACT-02: Decomposição 4W -->
        <mxCell id="act_02" value="Decompor Vetor 4W &amp;amp;&lt;br&gt;Calibrar QoC Sensorial&lt;br&gt;&lt;i&gt;(ContextParserEngine)&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#059669;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane2">
          <mxGeometry x="120" y="40" width="140" height="60" as="geometry" />
        </mxCell>

        <!-- GW-01: Gateway XOR Conflito LGPD -->
        <mxCell id="gw_01" value="Conflito com&lt;br&gt;os 3 Paradoxos&lt;br&gt;Detectado?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;fontColor=#78350F;fontSize=9;fontStyle=1;" vertex="1" parent="lane2">
          <mxGeometry x="300" y="30" width="100" height="80" as="geometry" />
        </mxCell>

        <!-- ACT-03: Gatilho Estrito -->
        <mxCell id="act_03" value="Impor Gatilho Estrito&lt;br&gt;&lt;i&gt;(Desativar GPS contínuo;&lt;br&gt;Amostrar apenas em trânsito)&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#EF4444;strokeWidth=1.5;fontColor=#7F1D1D;fontSize=10;" vertex="1" parent="lane2">
          <mxGeometry x="440" y="40" width="150" height="60" as="geometry" />
        </mxCell>

        <!-- ACT-04: Degradação e Mascaramento -->
        <mxCell id="act_04" value="Degradar QoC e Mascarar&lt;br&gt;Tags Semânticas na Borda&lt;br&gt;&lt;i&gt;(Zero-Storage em RAM)&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#EF4444;strokeWidth=1.5;fontColor=#7F1D1D;fontSize=10;" vertex="1" parent="lane2">
          <mxGeometry x="620" y="40" width="150" height="60" as="geometry" />
        </mxCell>

        <!-- ACT-05: Matriz de Accountability -->
        <mxCell id="act_05" value="Gerar Matriz de&lt;br&gt;Accountability (Art. 6º, X)&lt;br&gt;&amp;amp; Relatório RIPD" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#059669;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane2">
          <mxGeometry x="780" y="160" width="140" height="60" as="geometry" />
        </mxCell>

        <!-- EV-02: End Event -->
        <mxCell id="ev_end" value="Requisito&lt;br&gt;Homologado" style="shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;perimeter=ellipsePerimeter;outline=end;symbol=general;fillColor=#FEE2E2;strokeColor=#DC2626;" vertex="1" parent="lane2">
          <mxGeometry x="970" y="170" width="40" height="40" as="geometry" />
        </mxCell>

        <!-- RAIA 3: NUVEM EXTERNA & AUDITORIA -->
        <mxCell id="lane3" value="Raia 3: Provedor LLM Nuvem / Auditoria ANPD" style="swimlane;html=1;startSize=26;horizontal=0;fillColor=#FFFBEB;strokeColor=#F59E0B;fontColor=#78350F;fontStyle=1;" vertex="1" parent="pool1">
          <mxGeometry x="30" y="480" width="1050" height="240" as="geometry" />
        </mxCell>

        <!-- ACT-LLM: Raciocínio Semântico -->
        <mxCell id="act_llm" value="Sintetizar Especificação&lt;br&gt;Privacy by Design&lt;br&gt;&lt;i&gt;(Política de Retenção Zero)&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D97706;strokeWidth=2;fontColor=#78350F;fontSize=10;" vertex="1" parent="lane3">
          <mxGeometry x="620" y="80" width="150" height="60" as="geometry" />
        </mxCell>

        <!-- AUDIT-BOX: Auditoria da ANPD -->
        <mxCell id="act_audit" value="Comprovação Técnica&lt;br&gt;perante Autoridade ANPD&lt;br&gt;&lt;i&gt;(Dever de Diligência)&lt;/i&gt;" style="shape=folder;fontStyle=1;spacingTop=10;tabWidth=40;tabHeight=14;tabPosition=left;html=1;whiteSpace=wrap;fillColor=#FEF3C7;strokeColor=#D97706;fontColor=#78350F;fontSize=9;" vertex="1" parent="lane3">
          <mxGeometry x="780" y="70" width="140" height="80" as="geometry" />
        </mxCell>

        <!-- FLUXOS DE SEQUÊNCIA (EDGES) -->
        <mxCell id="seq_1" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;" edge="1" parent="pool1" source="ev_start" target="act_01">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="seq_2" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;" edge="1" parent="pool1" source="act_01" target="act_02">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="seq_3" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#059669;" edge="1" parent="pool1" source="act_02" target="gw_01">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="seq_4" value="Sim" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#EF4444;fontColor=#B91C1C;fontSize=9;" edge="1" parent="pool1" source="gw_01" target="act_03">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="seq_5" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#EF4444;" edge="1" parent="pool1" source="act_03" target="act_04">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="seq_6" value="Payload Sanitizado" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=#EF4444;fontColor=#B91C1C;fontSize=9;" edge="1" parent="pool1" source="act_04" target="act_llm">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="seq_7" value="Requisito Reescrito" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#D97706;fontColor=#78350F;fontSize=9;" edge="1" parent="pool1" source="act_llm" target="act_05">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="740" y="420" />
              <mxPoint x="850" y="420" />
            </Array>
          </mxGeometry>
        </mxCell>

        <mxCell id="seq_8" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#059669;" edge="1" parent="pool1" source="act_05" target="act_06">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <mxCell id="seq_9" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;" edge="1" parent="pool1" source="act_06" target="ev_end">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="950" y="110" />
              <mxPoint x="950" y="410" />
            </Array>
          </mxGeometry>
        </mxCell>

        <mxCell id="seq_10" value="Auditoria e Comprovação" style="edgeStyle=orthogonalEdgeStyle;rounded=0;dashed=1;html=1;strokeWidth=1.5;strokeColor=#D97706;fontColor=#78350F;fontSize=9;" edge="1" parent="pool1" source="act_05" target="act_audit">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""
    with open("diagrama_processo_BPMN_negociacao.drawio", "w", encoding="utf-8") as f:
        f.write(xml_content)
    print("Arquivo draw.io gerado: diagrama_processo_BPMN_negociacao.drawio")

if __name__ == "__main__":
    create_document()
    create_drawio_architecture()
    create_drawio_bpmn()
    print("Todos os artefatos acadêmicos foram criados com sucesso!")
