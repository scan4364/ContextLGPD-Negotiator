# -*- coding: utf-8 -*-
"""
Script atualizado para geração dos slides PPTX:
- Fontes ampliadas para melhor legibilidade e projeção acadêmica (mínimo 13-16pt no corpo, 26-28pt títulos).
- Remoção do antigo slide 19 (Declarações) e inclusão de slide completo de REFERÊNCIAS BIBLIOGRÁFICAS.
- Menção a financiamento (FACEPE/CAPES/CNPq) consolidada na Capa e no Encerramento.
- Formato Widescreen 16:9, com caixas reservadas para inserção manual das figuras.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Paleta de Cores
    NAVY = RGBColor(15, 23, 42)          # Slate 900
    BLUE = RGBColor(29, 78, 216)         # Blue 700
    LIGHT_BG = RGBColor(248, 250, 252)   # Slate 50
    CARD_BG = RGBColor(255, 255, 255)    # White
    BORDER_CLR = RGBColor(203, 213, 225) # Slate 300
    TEXT_MAIN = RGBColor(30, 41, 59)     # Slate 800
    TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
    RED_ACCENT = RGBColor(185, 28, 28)   # Red 700
    GREEN_ACCENT = RGBColor(4, 120, 87)  # Emerald 700
    AMBER_ACCENT = RGBColor(180, 83, 9)  # Amber 700

    def add_bg(slide, color=LIGHT_BG):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.color.rgb = color
        return bg

    def add_header(slide, tag, title, subtitle=None):
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.7), Inches(0.35))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(12)
        p_tag.font.bold = True
        p_tag.font.color.rgb = BLUE

        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.65))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY

        if subtitle:
            tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(0.4))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle
            p_sub.font.size = Pt(14)
            p_sub.font.color.rgb = TEXT_MUTED

    def add_card(slide, x, y, w, h, bg_color=CARD_BG, border_color=BORDER_CLR):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        return card

    def add_image_placeholder(slide, x, y, w, h, label):
        card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor(241, 245, 249)
        card.line.color.rgb = BLUE
        card.line.width = Pt(2)
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = f"📷 [ESPAÇO RESERVADO PARA IMAGEM]\n\n{label}\n\n(Anexe a figura manualmente nesta moldura)"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = BLUE
        return card

    # =========================================================================
    # SLIDE 1: CAPA
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, NAVY)

    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.1), Inches(11), Inches(0.8))
    p = tb.text_frame.paragraphs[0]
    p.text = "UFPE | CENTRO DE INFORMÁTICA (CIn) — PÓS-GRADUAÇÃO EM CIÊNCIA DA COMPUTAÇÃO"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)

    tb_main = s1.shapes.add_textbox(Inches(1.2), Inches(1.9), Inches(11), Inches(2.8))
    tf_main = tb_main.text_frame
    tf_main.word_wrap = True
    p1 = tf_main.paragraphs[0]
    p1.text = "Negociação entre Sistemas Sensíveis a Contexto e a LGPD por meio da Engenharia de Requisitos"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)

    p2 = tf_main.add_paragraph()
    p2.text = "Arquitetura de Software Formal (ADL ACME) e Ferramenta ContextLGPD-Negotiator"
    p2.font.size = Pt(20)
    p2.font.color.rgb = RGBColor(226, 232, 240)
    p2.space_before = Pt(12)

    tb_author = s1.shapes.add_textbox(Inches(1.2), Inches(5.1), Inches(11), Inches(1.8))
    tf_author = tb_author.text_frame
    pa1 = tf_author.paragraphs[0]
    pa1.text = "Autor: Samuel Celso dos Anjos Neto  |  scan@cin.ufpe.br"
    pa1.font.size = Pt(16)
    pa1.font.bold = True
    pa1.font.color.rgb = RGBColor(255, 255, 255)

    pa2 = tf_author.add_paragraph()
    pa2.text = "Centro de Informática — Universidade Federal de Pernambuco (UFPE)\nApoio Financeiro: FACEPE | CAPES (Código 001) | CNPq"
    pa2.font.size = Pt(13)
    pa2.font.color.rgb = RGBColor(148, 163, 184)
    pa2.space_before = Pt(6)

    s1.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 00:00 - 01:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar-se e introduzir o tema central.\n"
        "- Destacar a união entre Computação Sensível ao Contexto, Modelos de Linguagem e Engenharia de Requisitos para Privacidade.\n"
        "- Agradecer aos órgãos de fomento FACEPE, CAPES e CNPq."
    )

    # =========================================================================
    # SLIDE 2: CONTEXTO E O PROBLEMA DE PESQUISA
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "1. Introdução & Motivação", "Sistemas Sensíveis a Amplo Contexto vs. LGPD", "A colisão entre personalização preditiva e princípios de privacidade")

    add_card(s2, 0.8, 1.8, 5.6, 5.2)
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🌐 Sistemas Sensíveis ao Contexto"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = BLUE

    bullets1 = [
        "Definição clássica (Dey, 2001; Abowd et al., 1999): adaptação do software baseada em Where, Who, When e What.",
        "Avanço com LLMs de Contexto Longo: processamento massivo de telemetria, conversas e rotinas.",
        "Sistemas Sensíveis a Amplo Contexto: combinam múltiplos fluxos de dados, ampliando a exposição de dados implícitos.",
        "Capacidade técnica ≠ Justificativa jurídica para coleta e transmissão indiscriminada."
    ]
    for b in bullets1:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    add_card(s2, 6.8, 1.8, 5.6, 5.2)
    tb = s2.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚖️ O Desafio sob a LGPD (Lei 13.709/2018)"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RED_ACCENT

    bullets2 = [
        "Princípios Mandatórios: Finalidade legítima, Adequação e Minimização / Necessidade estrita (Art. 6º, I, II, III).",
        "Transferência Internacional (Art. 33 e Res. CD/ANPD 19/2024): chamadas de API para nuvens de LLM no exterior.",
        "Vigência de Requisitos Ambíguos: declarações como 'monitorar usuário' não especificam frequência, precisão nem descarte.",
        "Objetivo de RE: transformar decisões regulatórias em requisitos formais, rastreáveis e verificáveis em projeto."
    ]
    for b in bullets2:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s2.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 01:00 - 02:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Explicar o conceito de 'sistemas sensíveis a amplo contexto'.\n"
        "- Enfatizar que a janela de contexto longa da LLM não é licença para transferir todos os dados.\n"
        "- A privacidade precisa ser decidida em tempo de requisitos."
    )

    # =========================================================================
    # SLIDE 3: QUESTÕES DE PESQUISA & CONTRIBUIÇÕES
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "1. Introdução", "Questões de Pesquisa e Principais Contribuições", "Problemas norteadores e artefatos gerados")

    qp_data = [
        ("QP1: Tensão QoC vs. LGPD", "Como requisitos contextuais podem explicitar a tensão entre Qualidade de Contexto (QoC) e os princípios da LGPD?", BLUE),
        ("QP2: Elementos Arquiteturais", "Quais elementos arquiteturais apoiam a negociação de requisitos e a produção de artefatos de prestação de contas (accountability)?", GREEN_ACCENT),
        ("QP3: Apoio por Ferramenta Web", "Como uma ferramenta baseada nessa arquitetura pode apoiar a produção e a revisão de requisitos contextuais orientados à privacidade?", AMBER_ACCENT)
    ]
    for i, (qp_title, qp_desc, clr) in enumerate(qp_data):
        y = 1.8 + i * 1.7
        add_card(s3, 0.8, y, 5.8, 1.5, border_color=clr)
        tb = s3.shapes.add_textbox(Inches(1.0), Inches(y + 0.12), Inches(5.4), Inches(1.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = qp_title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = qp_desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(4)

    add_card(s3, 7.0, 1.8, 5.5, 5.1)
    tb = s3.shapes.add_textbox(Inches(7.2), Inches(2.0), Inches(5.1), Inches(4.7))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🎯 Principais Contribuições"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY

    contribs = [
        "Arquitetura Formal em ADL ACME: 3 representações compostas, portas, bindings e contingência.",
        "Ferramenta ContextLGPD-Negotiator: protótipo web Next.js com cofre offline e motor de contingência.",
        "Modelos BPMN Complementares: Percurso da pesquisa, método e fluxo de interação.",
        "Taxonomia dos Três Paradoxos de Privacidade.",
        "Protocolo de Avaliação Futura: Especialistas (TAM) e Quase-Experimento comparativo."
    ]
    for c in contribs:
        p = tf.add_paragraph()
        p.text = "✔ " + c
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s3.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 02:00 - 03:00]\n"
        "NOTAS DO ORADOR:\n"
        "- As 3 QPs cobrem conceito, arquitetura e ferramenta.\n"
        "- Destacar que não se busca consultoria jurídica automática, mas apoio sistemático de projeto para engenheiros de software."
    )

    # =========================================================================
    # SLIDE 4: QUALIDADE DE CONTEXTO (QoC)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "2. Fundamentação Teórica", "Qualidade de Contexto (QoC) como Variável Negociável", "Buchholz et al. (2003): Qualidade da informação vs. Desempenho de hardware")

    qoc_items = [
        ("Resolução Espacial & Precisão", "Granularidade geográfica. Ex: GPS milimétrico contínuo (alto risco) vs. Raio zonal de 100m ou rótulo semântico 'Zona Comercial' (privacidade preservada).", BLUE),
        ("Resolução Temporal & Amostragem", "Frequência de coleta. Ex: Amostragem contínua de 100 Hz vs. Leitura a cada 30 segundos acionada exclusivamente por gatilho de velocidade.", GREEN_ACCENT),
        ("Atualidade / Frescor (Freshness)", "Idade do dado no instante do uso. Uma localização de 5 minutos atrás é suficiente para trânsito sem exigir rastreamento ininterrupto.", AMBER_ACCENT),
        ("Confiabilidade & Incerteza Aceitável", "Probabilidade de acerto da inferência. A negociação busca a representação menos intrusiva que ainda viabilize a tarefa.", RED_ACCENT)
    ]

    for i, (title, desc, clr) in enumerate(qoc_items):
        col = i % 2
        row = i // 2
        x = 0.8 + col * 6.0
        y = 1.8 + row * 2.6
        add_card(s4, x, y, 5.7, 2.4, border_color=clr)
        tb = s4.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.15), Inches(5.3), Inches(2.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(6)

    s4.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 03:00 - 04:00]\n"
        "NOTAS DO ORADOR:\n"
        "- QoC não deve ser maximizada incondicionalmente.\n"
        "- A maximização padrão gera riscos graves à LGPD.\n"
        "- A degradação controlada de QoC é a principal alavanca técnica de Privacy by Design."
    )

    # =========================================================================
    # SLIDE 5: OS TRÊS PARADOXOS DA PRIVACIDADE CONTEXTUAL
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "2. Fundamentação & Regulação", "As Três Tensões Estruturais (Paradoxos da LGPD)", "Tabela 1 do Artigo: Conflitos inerentes entre computação sensível ao contexto e a lei")

    paradoxes = [
        ("Paradoxo 1: Fusão vs. Minimização",
         "Artigo 6º, III (Necessidade)",
         "Sistemas tentam coletar todos os sensores disponíveis para enriquecer inferências.\n\n"
         "Conflito: A LGPD impõe coleta mínima indispensável à finalidade.\n\n"
         "Mitigação: Justificar cada fonte, reduzir resolução métrica e calibrar amostragem.",
         BLUE),
        ("Paradoxo 2: Monitoramento Contínuo vs. Finalidade",
         "Artigo 6º, I e II (Finalidade / Adequação)",
         "Sensores mantidos ativos 24/7 sem necessidade em tempo integral.\n\n"
         "Conflito: Vigilância desproporcional fora do instante situacional.\n\n"
         "Mitigação: Impor gatilhos estritos de ativação (trigger events) e descarte imediato.",
         AMBER_ACCENT),
        ("Paradoxo 3: LLM Nuvem vs. Transferência / Segurança",
         "Artigos 33 e 46 + Res. ANPD 19/2024",
         "Transmissão de telemetria a servidores internacionais de LLMs.\n\n"
         "Conflito: Retenção zero reduz risco, mas não substitui base legal de transferência.\n\n"
         "Mitigação: Anonimização de borda e retenção zero contratual comprovada.",
         RED_ACCENT)
    ]

    for i, (title, legal, body, clr) in enumerate(paradoxes):
        x = 0.8 + i * 4.0
        add_card(s5, x, 1.8, 3.8, 5.2, border_color=clr)
        tb = s5.shapes.add_textbox(Inches(x + 0.15), Inches(1.95), Inches(3.5), Inches(4.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = clr

        p_l = tf.add_paragraph()
        p_l.text = f"⚖️ {legal}"
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_MUTED
        p_l.space_before = Pt(4)

        for paragraph in body.split("\n\n"):
            p_b = tf.add_paragraph()
            p_b.text = paragraph
            p_b.font.size = Pt(12)
            p_b.font.color.rgb = TEXT_MAIN
            p_b.space_before = Pt(6)

    s5.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m30s | 04:00 - 05:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Detalhar cada um dos três paradoxos.\n"
        "- 'Paradoxo' aqui é usado no sentido de tensão de engenharia entre requisitos concorrentes que não podem ser maximizados simultaneamente.\n"
        "- Destacar o confronto direto com os artigos 6º, 33 e 46 da LGPD."
    )

    # =========================================================================
    # SLIDE 6: EXEMPLO ILUSTRATIVO DE TRANSFORMAÇÃO (TABELA 2)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "3. Exemplo Prático", "Transformação Ilustrativa de Requisito Bruto em Negociado", "Tabela 2 do Artigo: Aplicando degradação de QoC, sentinelas e gatilhos estritos")

    add_card(s6, 0.8, 1.8, 5.6, 5.2, border_color=RED_ACCENT)
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ ANTES: Requisito Pouco Especificado"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = RED_ACCENT

    p_raw = tf.add_paragraph()
    p_raw.text = '"REQ-01: O sistema deverá monitorar continuamente GPS, acelerômetro e histórico do usuário, enviando os dados a uma LLM em nuvem para personalizar recomendações de deslocamento."'
    p_raw.font.size = Pt(12)
    p_raw.font.italic = True
    p_raw.font.color.rgb = TEXT_MAIN
    p_raw.space_before = Pt(8)

    raw_problems = [
        "QoC ausente: GPS ininterrupto drena bateria e cria vigilância total.",
        "Finalidade vaga: sem indicação de quando a inferência é requerida.",
        "Violação da Minimização: envio direto de dados brutos para nuvem externa de LLM."
    ]
    for prob in raw_problems:
        p = tf.add_paragraph()
        p.text = "• " + prob
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    add_card(s6, 6.8, 1.8, 5.6, 5.2, border_color=GREEN_ACCENT)
    tb = s6.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "✔ DEPOIS: Requisito Negociado (Privacy by Design)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    p_neg = tf.add_paragraph()
    p_neg.text = '"REQ-01: Para inferir \'User_In_Transit\' (finalidade), o sistema amostra localmente o acelerômetro a cada 30 s. Somente se velocidade > 15 km/h o GPS é ativado com precisão de 100 m, convertendo a coordenada em \'Commercial_Zone\' na borda e descartando dados brutos da RAM antes de qualquer chamada à LLM externa."'
    p_neg.font.size = Pt(12)
    p_neg.font.italic = True
    p_neg.font.color.rgb = TEXT_MAIN
    p_neg.space_before = Pt(8)

    neg_points = [
        "Gatilho Sentinela: acelerômetro local ativa o GPS sob condição de velocidade.",
        "Degradação de QoC: precisão de 100m e conversão em rótulo semântico.",
        "Processamento de Borda: descarte em RAM antes de qualquer chamada externa."
    ]
    for pt in neg_points:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    s6.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 05:30 - 06:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar a Tabela 2 como contraste prático.\n"
        "- Mostrar que ambiguidade é mitigada com cláusulas verificáveis de QoC e privacidade.\n"
        "- Enfatizar o descarte de RAM efêmera na borda."
    )

    # =========================================================================
    # SLIDE 7: METODOLOGIA DA PESQUISA & DSR
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "4. Metodologia", "Percurso Metodológico e Perspectiva DSR", "Enquadramento metodológico e delimitação do escopo")

    add_card(s7, 0.8, 1.8, 5.4, 5.2)
    tb = s7.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.0), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔬 Enquadramento em DSR"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = BLUE

    method_bullets = [
        "Pesquisa Aplicada em Engenharia de Software fundamentada em Design Science Research (Hevner et al., 2004; Wieringa, 2014).",
        "Três categorias de artefatos gerados:",
        "  1. Construtos & Modelos: taxonomia dos 3 paradoxos, modelo 4W estendido, método e diagramas BPMN.",
        "  2. Especificação Arquitetural: descrição formal em ADL ACME.",
        "  3. Instanciação: protótipo web ContextLGPD-Negotiator.",
        "Rigor Acadêmico: não se reivindica ciclo completo de DSR concluído; a avaliação empírica formal é proposta como trabalho futuro."
    ]
    for mb in method_bullets:
        p = tf.add_paragraph()
        p.text = mb
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    add_image_placeholder(s7, 6.5, 1.8, 6.0, 5.2, "FIGURA 1 DO ARTIGO: BPMN do Percurso Metodológico da Pesquisa\n(4 raias: Problema, Método, Arquitetura, Consolidação)")

    s7.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 06:30 - 07:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Explicar as 4 raias da Figura 1.\n"
        "- Destacar a avaliação futura representada como anotação tracejada no BPMN."
    )

    # =========================================================================
    # SLIDE 8: MÉTODO DE NEGOCIAÇÃO (ETAPAS M1 A M6)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "5. Método de Negociação", "Estrutura do Método em Seis Etapas (M1 a M6)", "Da elicitação contextual à formalização de artefatos auditáveis")

    steps = [
        ("M1. Cenário", "Engenheiro descreve a funcionalidade e a inferência pretendida (User Story bruta).", BLUE),
        ("M2. Contexto", "Decomposição do vetor 4W (Where, Who, When, What); exclusão de dados irrelevantes.", BLUE),
        ("M3. QoC", "Calibração de precisão mínima, resolução espacial/temporal e frequência aceitável.", GREEN_ACCENT),
        ("M4. Regulação", "Diagnóstico dos 3 paradoxos, mapeamento de finalidade e análise de transferência.", AMBER_ACCENT),
        ("M5. Negociação", "Aplicação de heurísticas de Privacy by Design: degradação, gatilhos e retenção zero.", RED_ACCENT),
        ("M6. Aprovação", "Revisão humana obrigatória, síntese do requisito e geração da Matriz de Accountability.", GREEN_ACCENT)
    ]

    for i, (title, desc, clr) in enumerate(steps):
        col = i % 3
        row = i // 3
        x = 0.8 + col * 4.0
        y = 1.8 + row * 2.6
        add_card(s8, x, y, 3.8, 2.4, border_color=clr)
        tb = s8.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.15), Inches(3.5), Inches(2.1))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(6)

    s8.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 07:30 - 08:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Passar pelas etapas M1 a M6 mostrando a linearidade conceitual.\n"
        "- A etapa M6 exige aprovação humana final."
    )

    # =========================================================================
    # SLIDE 9: MODELO BPMN DO MÉTODO (FIGURA 2)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "5. Método de Negociação", "Modelo BPMN do Processo de Negociação", "Fluxo em três raias: Engenheiro, ContextLGPD-Negotiator e Provedor LLM / Auditoria")

    add_card(s9, 0.8, 1.8, 4.4, 5.2)
    tb = s9.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(4.0), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔄 Dinâmica das Três Raias"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY

    bpmn2_bullets = [
        "Raia 1 (Engenheiro): Elicitação 4W, limites de QoC e iteração interativa via chat.",
        "Raia 2 (ContextLGPD-Negotiator): Decomposição de contexto, gateway de detecção de conflitos, gatilho estrito e degradação na borda.",
        "Raia 3 (LLM Nuvem / Auditoria): Síntese de Privacy by Design sob retenção zero e comprovação técnica perante ANPD.",
        "Gateway de Conflito: Ponto de decisão que devolve o requisito para renegociação iterativa."
    ]
    for b in bpmn2_bullets:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    add_image_placeholder(s9, 5.5, 1.8, 7.0, 5.2, "FIGURA 2 DO ARTIGO: BPMN do Método de Negociação de Requisitos\n(Raias: Engenheiro, PrivacyGuard Borda, LLM Nuvem / Auditoria ANPD)")

    s9.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 08:30 - 09:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Apontar para o gateway de conflito e o loop de iteração.\n"
        "- A Matriz de Accountability alimenta diretamente o dever de diligência perante a ANPD."
    )

    # =========================================================================
    # SLIDE 10: FLUXO DE INTERAÇÃO COM A FERRAMENTA (FIGURA 3)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "6. A Ferramenta", "Fluxo de Interação da Ferramenta e Contingência Local", "Interação entre Cliente SPA, API Routes Next.js, LLM Externa e Fallback Determinístico")

    add_card(s10, 0.8, 1.8, 4.4, 5.2)
    tb = s10.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(4.0), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚡ Arquitetura com Fallback"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = BLUE

    flow_bullets = [
        "Entrada Estruturada: Captura de 4W, sensores, QoC, gatilhos e Given-When-Then BDD.",
        "Caminho Principal (Nuvem): Envio do payload sanitizado para Gemini, GPT-4o ou Groq via rotas de API.",
        "Caminho de Contingência (Local): Se ausente a chave ou em falha de rede, aciona o motor determinístico local.",
        "Zero Cloud Database: Persistência local no navegador (HTML5 LocalStorageVault) com desfazer por snapshot (Undo)."
    ]
    for b in flow_bullets:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    add_image_placeholder(s10, 5.5, 1.8, 7.0, 5.2, "FIGURA 3 DO ARTIGO: BPMN de Interação do Usuário com a Ferramenta\n(Cliente SPA, Rotas de API, LLM Externa e Desvio para Contingência Local)")

    s10.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 09:30 - 10:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Distinguir a Fig 2 (método abstrato) da Fig 3 (implementação concreta do software).\n"
        "- A ferramenta não quebra e funciona 100% offline se não houver internet ou chave de API."
    )

    # =========================================================================
    # SLIDE 11: ARQUITETURA FORMAL EM ADL ACME (VISÃO GERAL)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11)
    add_header(s11, "7. Especificação Arquitetural", "Visão Arquitetural em ADL ACME: Três Representações Compostas", "Alinhada ao framework STREAM (Castro et al., 2012) e ACME (Garlan et al., 2000)")

    acme_reps = [
        ("1. Browser Client SPA", "Representação: BrowserClient_Rep",
         "Executado no navegador do engenheiro (Next.js client-side).\n\n"
         "Subcomponentes:\n"
         "• ReqInputInterface (4W, QoC, BDD)\n"
         "• WorkspaceUIOrchestrator (abas, chat)\n"
         "• LocalStorageVault (persistência offline)\n"
         "• LocalDeterministicEngine (contingência local)", BLUE),
        ("2. Next.js Server Runtime", "Representação: ServerRuntime_Rep",
         "Backend mediador serverless (API Routes).\n\n"
         "Subcomponentes:\n"
         "• APIRoutesHandler (/api/negotiate e chat)\n"
         "• PrivacyGuardSanitizer (filtro de borda)\n"
         "• ContingencyGate (seletor de fallback)\n"
         "• RegulatoryDocGenerator (RIPD / Matriz)", GREEN_ACCENT),
        ("3. ExternalLLMReasoning", "Representação: ExternalLLM_Rep",
         "Motor externo de raciocínio de nuvem.\n\n"
         "Subcomponentes:\n"
         "• GeminiProvider (Google Gemini 2.0/2.5)\n"
         "• OpenAIProvider (GPT-4o)\n"
         "• GroqProvider (Llama 3.3 70B)\n"
         "• ZeroRetentionEnforcer (Contrato Art. 33)", AMBER_ACCENT)
    ]

    for i, (title, rep, desc, clr) in enumerate(acme_reps):
        x = 0.8 + i * 4.0
        add_card(s11, x, 1.8, 3.8, 5.2, border_color=clr)
        tb = s11.shapes.add_textbox(Inches(x + 0.15), Inches(1.95), Inches(3.5), Inches(4.9))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = clr

        p_r = tf.add_paragraph()
        p_r.text = rep
        p_r.font.size = Pt(11)
        p_r.font.italic = True
        p_r.font.color.rgb = TEXT_MUTED
        p_r.space_before = Pt(2)

        for paragraph in desc.split("\n\n"):
            p_d = tf.add_paragraph()
            p_d.text = paragraph
            p_d.font.size = Pt(12)
            p_d.font.color.rgb = TEXT_MAIN
            p_d.space_before = Pt(6)

    s11.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 10:30 - 11:30]\n"
        "NOTAS DO ORADOR:\n"
        "- A modelagem em Representações Compostas reflete fielmente o software implementado.\n"
        "- Não há microsserviços fictícios; os subcomponentes estão agrupados nas 3 fronteiras reais de execução."
    )

    # =========================================================================
    # SLIDE 12: DIAGRAMA ACME ATUALIZADO (FIGURA 4)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12)
    add_header(s12, "7. Especificação Arquitetural", "Diagrama ACME Completo: Portas, Bindings e Contingência", "Figura 4 do Artigo: Estrutura formal com destaque ao caminho de contingência")

    add_card(s12, 0.8, 1.8, 4.4, 5.2)
    tb = s12.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(4.0), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "📐 Notação e Conexões ACME"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY

    acme_notes = [
        "Portas Provided (sólidas) & Required (vazadas): interação externa formal nas bordas dos componentes.",
        "Mecanismo de Bindings: ligam portas dos componentes compostos às portas dos subcomponentes internos.",
        "Conectores RPC & Pipes: isolamento estrito entre cliente local e nuvem externa.",
        "Caminho de Contingência (Vermelho Tracejado): desvio automático para o LocalDeterministicEngine em caso de falha.",
        "Payload Sanitizado: o canal de nuvem transporta dados sem PII e sem coordenadas brutas."
    ]
    for n in acme_notes:
        p = tf.add_paragraph()
        p.text = "• " + n
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    add_image_placeholder(s12, 5.5, 1.8, 7.0, 5.2, "FIGURA 4 DO ARTIGO: Diagrama ACME com 3 Representações Compostas\n(Browser Client SPA, Next.js Server Runtime, ExternalLLMReasoning e Caminho de Contingência)")

    s12.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m30s | 11:30 - 13:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Guiar a atenção da banca para a Figura 4: mostrar o encaixe das portas e bindings.\n"
        "- Apontar a linha vermelha tracejada da contingência.\n"
        "- A correspondência foi estabelecida por inspeção direta do código-fonte."
    )

    # =========================================================================
    # SLIDE 13: DEMONSTRAÇÃO E TELAS DO PROTÓTIPO (FIGURA 5)
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13)
    add_header(s13, "7. Protótipo & Demonstração", "Telas do Protótipo ContextLGPD-Negotiator", "Figura 5 do Artigo: Painel de evidências funcionais em três etapas")

    screens = [
        ("(a) Entrada do Cenário 4W e QoC", "Captura de código, título, ator, User Story, Where/Who/When/What, sensores e critérios BDD."),
        ("(b) Requisito Negociado", "Visualização da reescrita Privacy by Design, mitigação dos paradoxos e comparação antes/depois."),
        ("(c) Matriz de Accountability & RIPD", "Tabela formal com papéis RACCI, ciclo de vida e bases legais da LGPD para auditoria ANPD.")
    ]

    for i, (stitle, sdesc) in enumerate(screens):
        x = 0.8 + i * 4.0
        add_image_placeholder(s13, x, 1.8, 3.8, 3.8, f"FIGURA 5{stitle[:4]}:\n{stitle[4:]}")
        tb = s13.shapes.add_textbox(Inches(x), Inches(5.8), Inches(3.8), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = stitle
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p2 = tf.add_paragraph()
        p2.text = sdesc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(4)

    s13.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 13:00 - 14:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar as 3 capturas reais da ferramenta.\n"
        "- Mostrar como o engenheiro interage na prática com as abas e modais da interface."
    )

    # =========================================================================
    # SLIDE 14: VERIFICAÇÃO FUNCIONAL IMPLEMENTADA
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14)
    add_header(s14, "4. Verificação Funcional", "Funções Efetivamente Implementadas e Verificadas", "Diferenciando verificação funcional manual de avaliação empírica formal")

    add_card(s14, 0.8, 1.8, 5.6, 5.2, border_color=GREEN_ACCENT)
    tb = s14.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "✔ Implementado & Verificado Funcionalmente"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    verified_items = [
        "Entrada Estruturada: formulários 4W, sensores, limites de QoC, gatilhos e critérios BDD.",
        "Motor Local Determinístico: regras heurísticas de contingência executadas 100% offline.",
        "Rotas de API (/api/negotiate e /api/chat): integração com Gemini, GPT-4o e Groq, com comutação graciosa.",
        "Chat Assistente de Negociação: diálogo iterativo para refinamento contínuo de requisitos.",
        "Cofre Local (LocalStorageVault): multi-projetos, snapshots de desfazer (Undo) e backup preventivo no logout.",
        "Emissão de Artefatos: Matriz de Accountability e exportação de RIPD em Markdown (.md)."
    ]
    for vi in verified_items:
        p = tf.add_paragraph()
        p.text = "• " + vi
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    add_card(s14, 6.8, 1.8, 5.6, 5.2, border_color=AMBER_ACCENT)
    tb = s14.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚠️ Delimitações e Não-Reivindicações"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = AMBER_ACCENT

    caveats = [
        "A verificação funcional foi conduzida manualmente pelo autor sobre 3 cenários canônicos de teste.",
        "Não constitui avaliação empírica: não mede a qualidade técnica ou jurídica absoluta das saídas.",
        "A ferramenta opera em tempo de projeto: não controla sensores de hardware em aplicações instaladas.",
        "Não substitui o Encarregado de Dados (DPO) ou assessoria jurídica: os artefatos gerados são propostas de engenharia sujeitas à revisão humana obrigatória."
    ]
    for c in caveats:
        p = tf.add_paragraph()
        p.text = "• " + c
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s14.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 14:00 - 15:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Demonstrar honestidade científica: deixar claro o que está testado e o que é trabalho futuro.\n"
        "- Reforçar a distinção entre teste funcional do protótipo e avaliação empírica com usuários reais."
    )

    # =========================================================================
    # SLIDE 15: PROTOCOLO DE AVALIAÇÃO FUTURA (DUAS ETAPAS)
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    add_bg(s15)
    add_header(s15, "8. Protocolo de Avaliação", "Delineamento da Avaliação Empírica Futura", "Planejamento metodológico rigoroso: Especialistas + Quase-Experimento")

    add_card(s15, 0.8, 1.8, 5.6, 5.2, border_color=BLUE)
    tb = s15.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "👥 Etapa 1: Avaliação por Especialistas"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = BLUE

    e1_points = [
        "Amostra: 6 a 10 especialistas em Engenharia de Requisitos, LGPD/Direito Digital e Computação Ubíqua.",
        "Instrumento: Questionário Likert de 5 pontos baseado no Technology Acceptance Model (TAM) + perguntas abertas.",
        "Dimensões Avaliadas: Clareza, utilidade percebida, completude dos requisitos, viabilidade e consistência regulatória.",
        "Objetivo: Revisar e calibrar as três tensões e validar a aplicabilidade prática dos artefatos gerados."
    ]
    for pt in e1_points:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    add_card(s15, 6.8, 1.8, 5.6, 5.2, border_color=GREEN_ACCENT)
    tb = s15.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🧪 Etapa 2: Comparação Quase-Experimental"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    e2_points = [
        "Delineamento: Comparação pareada entre especificação manual vs. assistida pelo ContextLGPD-Negotiator.",
        "Participantes: Desenvolvedores e pós-graduandos do Centro de Informática da UFPE (CIn/UFPE).",
        "Métricas Formais (Tabela 10):",
        "  - Identificação de Conflitos: Precisão, Revocação e F1-score.",
        "  - Minimização de Dados: Ausência de atributos proibidos nos rastros de rede.",
        "  - Eficiência: Tempo de conclusão e número de ciclos de revisão."
    ]
    for pt in e2_points:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s15.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 15:00 - 16:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar o protocolo da Seção 8 do artigo.\n"
        "- Demonstrar que a pesquisa tem continuidade metodológica bem desenhada para virar uma publicação empírica futura."
    )

    # =========================================================================
    # SLIDE 16: DISCUSSÃO - INSIGHTS ARQUITETURAIS & FRONTEIRAS
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    add_bg(s16)
    add_header(s16, "9. Discussão", "Insights Arquiteturais e Lições Aprendidas", "Análise crítica sobre privacidade na borda e soberania de dados")

    insights = [
        ("A Fronteira Crítica de Sanitização",
         "No protótipo atual, o PrivacyGuardSanitizer é uma etapa lógica de raciocínio da LLM externa.\n"
         "Conclusão crítica: O cenário viaja pela rede antes desse diagnóstico. Para assegurar minimização absoluta (Invariante I1), a versão futura deve mover a sanitização para antes da chamada em PromptMediator ou no próprio navegador.",
         RED_ACCENT),
        ("Rótulos Semânticos não são Anonimização Mágica",
         "Substituir GPS por 'Área Comercial' reduz a precisão espacial, mas continua sendo dado pessoal se o usuário puder ser identificado por rotinas ou horários (quase-identificadores).\n"
         "A pseudonimização é medida de mitigação, não dispensa o cumprimento da LGPD.",
         AMBER_ACCENT),
        ("O Papel Irrenunciável da Revisão Humana",
         "Modelos de linguagem podem alucinar, omitir artigos de lei ou sugerir limiares arbitrários.\n"
         "A ferramenta atua como suporte de design; o engenheiro e o DPO permanecem como controladores legais responsáveis.",
         BLUE)
    ]

    for i, (title, text, clr) in enumerate(insights):
        y = 1.8 + i * 1.7
        add_card(s16, 0.8, y, 11.7, 1.5, border_color=clr)
        tb = s16.shapes.add_textbox(Inches(1.0), Inches(y + 0.12), Inches(11.3), Inches(1.3))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = text
        p2.font.size = Pt(13)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(4)

    s16.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m30s | 16:00 - 17:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Demonstrar maturidade crítica ao reconhecer a localização atual do PrivacyGuardSanitizer.\n"
        "- Enfatizar a necessidade de revisão humana perante o Artigo 20 da LGPD."
    )

    # =========================================================================
    # SLIDE 17: LIMITAÇÕES DA PESQUISA
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    add_bg(s17)
    add_header(s17, "9. Discussão", "Limitações Reconhecidas do Trabalho", "Transparência científica quanto às fronteiras do estudo atual")

    limits = [
        ("Taxonomia Não-Exaustiva", "As três tensões cobrem cenários recorrentes, mas não esgotam todos os dispositivos da LGPD (ex: dados de crianças e adolescentes, biometria sensível estrita)."),
        ("Dependência de Modelo e Prompts", "A qualidade da reescrita depende da capacidade de raciocínio da LLM configurada; saídas podem variar entre execuções."),
        ("Validação Formal de ACME", "A especificação arquitetural ainda não foi compilada em parser automatizado de ACME para prova de tipos e invariantes de primeira ordem."),
        ("Persistência em Navegador", "O LocalStorageVault atende ao paradigma offline-first em protótipo, mas implantações corporativas exigem cofre seguro com KMS e criptografia ponta a ponta."),
        ("Escopo de Tempo de Projeto", "A ferramenta gera a especificação; ela não impõe ou fiscaliza o comportamento dos sensores no aplicativo em produção.")
    ]

    for i, (ltitle, ldesc) in enumerate(limits):
        y = 1.8 + i * 1.05
        add_card(s17, 0.8, y, 11.7, 0.9)
        tb = s17.shapes.add_textbox(Inches(1.0), Inches(y + 0.08), Inches(11.3), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"• {ltitle}: "
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = RED_ACCENT
        r = p.add_run()
        r.text = ldesc
        r.font.size = Pt(13)
        r.font.bold = False
        r.font.color.rgb = TEXT_MAIN

    s17.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 17:30 - 18:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Passar rapidamente pelas limitações com objetividade.\n"
        "- Mostrar que cada limitação mapeia diretamente para um item de trabalho futuro."
    )

    # =========================================================================
    # SLIDE 18: CONCLUSÕES E TRABALHOS FUTUROS
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    add_bg(s18)
    add_header(s18, "10. Conclusão", "Conclusões e Trabalhos Futuros", "Síntese dos resultados alcançados e agenda de pesquisa")

    add_card(s18, 0.8, 1.8, 5.6, 5.2, border_color=BLUE)
    tb = s18.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🎯 Conclusões do Estudo"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = BLUE

    concl_points = [
        "A Qualidade de Contexto (QoC) pode e deve ser formalizada como variável de negociação de requisitos sob a LGPD.",
        "A especificação em ADL ACME provou ser adequada para modularizar o sistema em representações compostas com isolamento claro de borda e nuvem.",
        "O protótipo ContextLGPD-Negotiator materializa o método e viabiliza a geração semi-automatizada de requisitos rastreáveis e matrizes de accountability.",
        "A contingência determinística local garante operacionalidade zero-cloud, resiliente a falhas de rede."
    ]
    for cp in concl_points:
        p = tf.add_paragraph()
        p.text = "✔ " + cp
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    add_card(s18, 6.8, 1.8, 5.6, 5.2, border_color=GREEN_ACCENT)
    tb = s18.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.8))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🚀 Trabalhos Futuros"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    future_points = [
        "Mover o componente PrivacyGuardSanitizer para o navegador ou PromptMediator, assegurando minimização anterior à chamada de rede.",
        "Executar a avaliação empírica planejada: painel de especialistas (TAM) e estudo quase-experimental com desenvolvedores no CIn/UFPE.",
        "Validação formal da arquitetura ACME por compilador dedicado.",
        "Desenvolvimento de agentes de verificação em tempo de execução baseados nos critérios BDD gerados pela ferramenta."
    ]
    for fp in future_points:
        p = tf.add_paragraph()
        p.text = "➔ " + fp
        p.font.size = Pt(13)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s18.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 18:30 - 19:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Resumir as respostas às QPs 1, 2 e 3.\n"
        "- Enfatizar o legado do trabalho: uma ferramenta funcional no ar e uma base teórica sólida para publicações futuras."
    )

    # =========================================================================
    # SLIDE 19: REFERÊNCIAS BIBLIOGRÁFICAS PRINCIPAIS (SUBSTITUINDO O ANTIGO SLIDE 19)
    # =========================================================================
    s19 = prs.slides.add_slide(blank_layout)
    add_bg(s19)
    add_header(s19, "Referências", "Principais Referências Bibliográficas", "Fundamentação teórica, metodológica e regulatória do artigo")

    add_card(s19, 0.8, 1.8, 5.7, 5.2)
    tb1 = s19.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.3), Inches(4.8))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "📚 Teoria de Contexto & Regulação"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = BLUE

    refs_col1 = [
        "[1] Dey, A.K. (2001). Understanding and using context. Personal and Ubiquitous Computing, 5(1), 4–7.",
        "[2] Abowd, G.D. et al. (1999). Towards a better understanding of context and context-awareness. HUC 1999, LNCS 1707.",
        "[4] Brasil (2018). Lei nº 13.709/2018 - Lei Geral de Proteção de Dados Pessoais (LGPD).",
        "[5] Buchholz, T. et al. (2003). Quality of context: what it is and why we need it. HPOVUA Workshop, Geneva.",
        "[18] ANPD (2024). Resolução CD/ANPD nº 19/2024 - Regulamento de Transferência Internacional de Dados."
    ]
    for r in refs_col1:
        p = tf1.add_paragraph()
        p.text = r
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    add_card(s19, 6.8, 1.8, 5.7, 5.2)
    tb2 = s19.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.8))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "📐 Arquitetura, RE & Privacy by Design"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = NAVY

    refs_col2 = [
        "[10] Cavoukian, A. (2009). Privacy by Design: The 7 Foundational Principles. IPC, Toronto.",
        "[11] Hoepman, J.-H. (2014). Privacy design strategies. IFIP AICT, vol. 428, Springer.",
        "[12] Rawson, J., Reddivari, S. (2025). Acceptance criteria generation for user stories. IEEE IRI 2025.",
        "[15] Garlan, D., Monroe, R., Wile, D. (2000). Acme: architectural description of component-based systems.",
        "[16] Hevner, A.R. et al. (2004). Design science in information systems research. MIS Quarterly, 28(1).",
        "[24] Castro, J., Lucena, M., Silva, C., Alencar, F., Santos, E., Pimentel, J. (2012). Changing attitudes towards the generation of architectural models. JSS, 85(3)."
    ]
    for r in refs_col2:
        p = tf2.add_paragraph()
        p.text = r
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    s19.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 0m30s | 19:30 - 20:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar as referências pilares do trabalho: clássicos de computação sensível ao contexto (Dey, Abowd, Buchholz), referências de RE e arquitetura (Castro et al., Garlan, Rawson & Reddivari) e as bases normativas (LGPD e ANPD)."
    )

    # =========================================================================
    # SLIDE 20: ENCERRAMENTO & PERGUNTAS (Q&A)
    # =========================================================================
    s20 = prs.slides.add_slide(blank_layout)
    add_bg(s20, NAVY)

    tb_end = s20.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(11.0), Inches(4.8))
    tf_end = tb_end.text_frame
    tf_end.word_wrap = True

    p = tf_end.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "Obrigado pela Atenção!"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    p_sub = tf_end.add_paragraph()
    p_sub.alignment = PP_ALIGN.CENTER
    p_sub.text = "Aberto para Perguntas e Contribuições da Banca Examinadora"
    p_sub.font.size = Pt(22)
    p_sub.font.color.rgb = RGBColor(147, 197, 253)
    p_sub.space_before = Pt(16)

    p_info = tf_end.add_paragraph()
    p_info.alignment = PP_ALIGN.CENTER
    p_info.text = (
        "\nSamuel Celso dos Anjos Neto\n"
        "Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE)\n"
        "E-mail: scan@cin.ufpe.br  |  ORCID: 0009-0007-5141-9484\n\n"
        "Protótipo Online: https://context-lgpd-negotiator.vercel.app/\n"
        "Repositório GitHub: https://github.com/scan4364/ContextLGPD-Negotiator\n\n"
        "Apoio Financeiro: FACEPE | CAPES (Código 001) | CNPq"
    )
    p_info.font.size = Pt(14)
    p_info.font.color.rgb = RGBColor(226, 232, 240)
    p_info.space_before = Pt(16)

    s20.notes_slide.notes_text_frame.text = (
        "[Tempo final da apresentação: 20m00s]\n"
        "NOTAS DO ORADOR:\n"
        "- Agradecer à banca examinadora e abrir a sessão para perguntas e debate."
    )

    output_path = "Apresentacao_ContextLGPD_Negotiator_20min.pptx"
    try:
        prs.save(output_path)
        print(f"Apresentação atualizada com sucesso: {output_path}")
    except PermissionError:
        output_path = "Apresentacao_ContextLGPD_Negotiator_20min_v2.pptx"
        prs.save(output_path)
        print(f"Arquivo principal bloqueado (aberto no PowerPoint). Salvo com sucesso como: {output_path}")

if __name__ == "__main__":
    create_presentation()
