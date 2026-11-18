# -*- coding: utf-8 -*-
"""
Script para geração de apresentação de slides PPTX completa e profissional:
Artigo: Negociação entre Sistemas Sensíveis a Contexto e a LGPD por meio da Engenharia de Requisitos
Autor: Samuel Celso dos Anjos Neto (CIn/UFPE)
Tempo de apresentação: Máximo de 20 minutos (20 slides com notas de orador e tempos estimados)
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # Configurar formato Widescreen 16:9
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # layout em branco

    # Paleta de Cores
    NAVY = RGBColor(15, 23, 42)       # Slate 900
    BLUE = RGBColor(29, 78, 216)      # Blue 700
    LIGHT_BG = RGBColor(248, 250, 252)# Slate 50
    CARD_BG = RGBColor(255, 255, 255) # White
    BORDER_CLR = RGBColor(203, 213, 225) # Slate 300
    TEXT_MAIN = RGBColor(30, 41, 59)  # Slate 800
    TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
    RED_ACCENT = RGBColor(185, 28, 28) # Red 700
    GREEN_ACCENT = RGBColor(4, 120, 87) # Emerald 700
    AMBER_ACCENT = RGBColor(180, 83, 9) # Amber 700

    def add_bg(slide, color=LIGHT_BG):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.color.rgb = color
        return bg

    def add_header(slide, tag, title, subtitle=None):
        # Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.3))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = BLUE

        # Título
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.6))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY

        # Subtítulo (se houver)
        if subtitle:
            tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.2), Inches(11.7), Inches(0.4))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle
            p_sub.font.size = Pt(12)
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
        card.fill.fore_color.rgb = RGBColor(241, 245, 249) # Slate 100
        card.line.color.rgb = BLUE
        card.line.width = Pt(2)
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = f"📷 [ESPAÇO RESERVADO PARA IMAGEM]\n\n{label}\n\n(Clique com o botão direito para anexar a figura manualmente)"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = BLUE
        return card

    # =========================================================================
    # SLIDE 1: CAPA
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, NAVY)

    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(11), Inches(1.0))
    p = tb.text_frame.paragraphs[0]
    p.text = "UFPE | CENTRO DE INFORMÁTICA (CIn)"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)

    tb_main = s1.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11), Inches(2.6))
    tf_main = tb_main.text_frame
    tf_main.word_wrap = True
    p1 = tf_main.paragraphs[0]
    p1.text = "Negociação entre Sistemas Sensíveis a Contexto e a LGPD por meio da Engenharia de Requisitos"
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)

    p2 = tf_main.add_paragraph()
    p2.text = "Arquitetura de Software e Ferramenta ContextLGPD-Negotiator"
    p2.font.size = Pt(18)
    p2.font.color.rgb = RGBColor(226, 232, 240)
    p2.space_before = Pt(10)

    # Autor e Instituição
    tb_author = s1.shapes.add_textbox(Inches(1.2), Inches(5.0), Inches(11), Inches(1.8))
    tf_author = tb_author.text_frame
    pa1 = tf_author.paragraphs[0]
    pa1.text = "Autor: Samuel Celso dos Anjos Neto  |  scan@cin.ufpe.br"
    pa1.font.size = Pt(14)
    pa1.font.bold = True
    pa1.font.color.rgb = RGBColor(255, 255, 255)

    pa2 = tf_author.add_paragraph()
    pa2.text = "Centro de Informática — Universidade Federal de Pernambuco (CIn/UFPE)\nApoio Financeiro: FACEPE | CAPES (Código 001) | CNPq"
    pa2.font.size = Pt(12)
    pa2.font.color.rgb = RGBColor(148, 163, 184)
    pa2.space_before = Pt(6)

    s1.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 00:00 - 01:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar-se e introduzir o tema da pesquisa.\n"
        "- Destacar que o trabalho une duas áreas de fronteira: Computação Sensível ao Contexto com Modelos de Linguagem (LLMs) e a Engenharia de Requisitos orientada à Privacidade sob a LGPD.\n"
        "- Agradecer aos órgãos de fomento FACEPE, CAPES e CNPq."
    )

    # =========================================================================
    # SLIDE 2: CONTEXTO E O PROBLEMA DE PESQUISA
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "1. Introdução & Motivação", "Sistemas Sensíveis a Amplo Contexto vs. LGPD", "A tensão entre personalização extrema e a proteção de dados pessoais")

    # Card 1: Sistemas Sensíveis ao Contexto
    add_card(s2, 0.8, 1.8, 5.6, 5.0)
    tb = s2.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🌐 Sistemas Sensíveis ao Contexto"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = BLUE

    bullets1 = [
        "Definição clássica (Dey, 2001; Abowd et al., 1999): sistemas que adaptam seu comportamento ao usuário, ambiente e atividade.",
        "Dimensões 4W primárias: Where (onde), Who (quem), When (quando) e What (o quê).",
        "Evolução com LLMs de Contexto Longo: capacidade de ingerir fluxos ininterruptos de telemetria, conversas e rotinas.",
        "Risco Crítico: 'Sistemas sensíveis a amplo contexto' ampliam exponencialmente a exposição de dados pessoais implícitos."
    ]
    for b in bullets1:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    # Card 2: A LGPD como Problema de Requisitos
    add_card(s2, 6.8, 1.8, 5.6, 5.0)
    tb = s2.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚖️ O Desafio sob a LGPD (Lei 13.709/2018)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = RED_ACCENT

    bullets2 = [
        "Princípios Mandatórios: Finalidade legítima, Necessidade (minimização) e Adequação (Art. 6º, I, II, III).",
        "Transferência Internacional (Art. 33 e Resolução CD/ANPD 19/2024): envio de dados a servidores de nuvem de LLMs.",
        "O 'Gap' de Engenharia de Requisitos: declarações como 'monitorar o usuário' são vagas; por outro lado, 'minimizar dados' não diz como implementar.",
        "Necessidade: transformar restrições legais e técnicas em requisitos explícitos, rastreáveis e verificáveis em tempo de projeto."
    ]
    for b in bullets2:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s2.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 01:00 - 02:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Explicar o que são sistemas sensíveis a amplo contexto: fusão de múltiplos sensores + LLMs com janelas longas.\n"
        "- Enfatizar que a capacidade de entrada da LLM não justifica transmitir todos os dados.\n"
        "- Contextualizar que a privacidade não é um filtro posterior, mas uma decisão de projeto na Engenharia de Requisitos."
    )

    # =========================================================================
    # SLIDE 3: QUESTÕES DE PESQUISA & CONTRIBUIÇÕES
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "1. Introdução", "Questões de Pesquisa e Principais Contribuições", "Objetivos norteadores e artefatos gerados na pesquisa")

    # 3 Cards para as Questões de Pesquisa
    qp_data = [
        ("QP1: Tensão QoC vs. LGPD", "Como requisitos contextuais podem explicitar a tensão entre Qualidade de Contexto (QoC) e os princípios da LGPD?", BLUE),
        ("QP2: Elementos Arquiteturais", "Quais elementos arquiteturais apoiam a negociação de requisitos e a produção de artefatos de prestação de contas (accountability)?", GREEN_ACCENT),
        ("QP3: Apoio por Ferramenta Web", "Como uma ferramenta baseada nessa arquitetura pode apoiar a produção e a revisão de requisitos contextuais orientados à privacidade?", AMBER_ACCENT)
    ]
    for i, (qp_title, qp_desc, clr) in enumerate(qp_data):
        y = 1.8 + i * 1.6
        add_card(s3, 0.8, y, 6.0, 1.4, border_color=clr)
        tb = s3.shapes.add_textbox(Inches(1.0), Inches(y + 0.1), Inches(5.6), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = qp_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = qp_desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MAIN

    # Card da Direita: Contribuições Centrais
    add_card(s3, 7.2, 1.8, 5.3, 4.6)
    tb = s3.shapes.add_textbox(Inches(7.4), Inches(2.0), Inches(4.9), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🎯 Principais Contribuições do Artigo"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = NAVY

    contribs = [
        "Arquitetura de Software Formal em ACME: modelada em 3 representações compostas com portas, bindings e contingência.",
        "Ferramenta ContextLGPD-Negotiator: protótipo funcional em Next.js com cofre local offline e motor heurístico de contingência.",
        "Três Modelos de Processos em BPMN 2.0: Percurso da pesquisa, método de negociação e fluxo de interação da ferramenta.",
        "Caracterização dos 3 Paradoxos da Privacidade Contextual.",
        "Protocolo Futuro de Avaliação em Duas Etapas (Especialistas + Quase-Experimento)."
    ]
    for c in contribs:
        p = tf.add_paragraph()
        p.text = "✔ " + c
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s3.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 02:00 - 03:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Deixar claro o escopo: as três QPs cobrem conceito, arquitetura e ferramenta.\n"
        "- Destacar que não reivindicamos imposição de requisitos em tempo de execução ou consultoria jurídica automática, mas apoio em tempo de projeto."
    )

    # =========================================================================
    # SLIDE 4: FUNDAMENTAÇÃO TEÓRICA - QUALIDADE DE CONTEXTO (QoC)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "2. Fundamentação Teórica", "Qualidade de Contexto (QoC) como Variável Negociável", "Buchholz et al. (2003): Qualidade da informação vs. Desempenho de hardware")

    # 4 Cards de Métricas QoC
    qoc_items = [
        ("Resolução Espacial & Precisão", "Métrica de granularidade geográfica. Exemplo: Coordenada GPS milimétrica (alta resolução/alto risco) vs. Raio zonal de 100m ou rótulo 'Área Comercial' (menor resolução/privacidade preservada).", BLUE),
        ("Resolução Temporal & Amostragem", "Frequência de leitura dos sensores. Exemplo: Amostragem ininterrupta de acelerômetro a 100 Hz vs. Amostragem em rajadas (bursts) a cada 30 segundos acionadas por gatilho.", GREEN_ACCENT),
        ("Atualidade / Frescor (Freshness)", "Intervalo de tempo entre a medição e o uso da informação. Uma coordenada de 5 minutos atrás pode ser suficiente para trânsito sem monitorar em tempo real.", AMBER_ACCENT),
        ("Probabilidade de Correção & Confiabilidade", "Nível de certeza da inferência contextual. Aumentar a confiança pode exigir múltiplos sensores; a negociação busca o trade-off ótimo para a tarefa.", RED_ACCENT)
    ]

    for i, (title, desc, clr) in enumerate(qoc_items):
        col = i % 2
        row = i // 2
        x = 0.8 + col * 6.0
        y = 1.8 + row * 2.5
        add_card(s4, x, y, 5.7, 2.3, border_color=clr)
        tb = s4.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.15), Inches(5.3), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(6)

    s4.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 03:00 - 04:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Explicar a tese central: QoC não deve ser maximizada incondicionalmente.\n"
        "- A maximização padrão de precisão e frequência gera invasão de privacidade e violação da LGPD.\n"
        "- O método introduz a degradação controlada de QoC como instrumento técnico de minimização de dados."
    )

    # =========================================================================
    # SLIDE 5: OS TRÊS PARADOXOS DA PRIVACIDADE CONTEXTUAL
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "2. Fundamentação & Regulação", "As Três Tensões Estruturais (Paradoxos da LGPD)", "Tabela 1 do Artigo: Conflitos inerentes entre computação ubíqua e proteção de dados")

    paradoxes = [
        ("Paradoxo 1: Fusão de Sensores vs. Minimização",
         "Artigo 6º, III da LGPD (Necessidade)",
         "Sistemas contextuais tentam coletar o máximo de sensores (GPS, BLE, áudio, batimentos) para enriquecer inferências.\n\n"
         "Conflito: A LGPD exige coleta estritamente restrita ao mínimo indispensável para a finalidade explícita.\n\n"
         "Solução de Projeto: Justificar cada sensor, degradar resolução métrica e aplicar amostragem local calibrada.",
         BLUE),
        ("Paradoxo 2: Monitoramento Contínuo vs. Finalidade",
         "Artigo 6º, I e II da LGPD (Finalidade e Adequação)",
         "Sensores mantidos ativos ininterruptamente 'em espera' geram vigilância contínua desproporcional.\n\n"
         "Conflito: A necessidade de contexto é pontual e dependente de evento situacional.\n\n"
         "Solução de Projeto: Impor gatilhos explícitos de ativação (trigger events) e desativação imediata.",
         AMBER_ACCENT),
        ("Paradoxo 3: LLMs de Nuvem vs. Segurança / Transferência",
         "Artigos 33 e 46 da LGPD + Res. CD/ANPD 19/2024",
         "Envio de históricos e fluxos brutos a APIs de LLMs em nuvem internacional.\n\n"
         "Conflito: Retenção zero contratual reduz risco, mas não dispensa salvaguardas contratuais e base de transferência.\n\n"
         "Solução de Projeto: Anonimização e abstração na borda antes de qualquer chamada remota.",
         RED_ACCENT)
    ]

    for i, (title, legal, body, clr) in enumerate(paradoxes):
        x = 0.8 + i * 4.0
        add_card(s5, x, 1.8, 3.8, 5.0, border_color=clr)
        tb = s5.shapes.add_textbox(Inches(x + 0.15), Inches(1.95), Inches(3.5), Inches(4.7))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = clr

        p_l = tf.add_paragraph()
        p_l.text = f"⚖️ {legal}"
        p_l.font.size = Pt(10)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_MUTED
        p_l.space_before = Pt(4)

        for paragraph in body.split("\n\n"):
            p_b = tf.add_paragraph()
            p_b.text = paragraph
            p_b.font.size = Pt(10)
            p_b.font.color.rgb = TEXT_MAIN
            p_b.space_before = Pt(6)

    s5.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m30s | 04:00 - 05:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Detalhar cada um dos três paradoxos.\n"
        "- Ressaltar o uso do termo 'paradoxo': não se trata de contradição lógica insuperável, mas de tensões de engenharia onde maximizar um lado prejudica o outro.\n"
        "- Explicar que a validação desses paradoxos foi feita confrontando diretamente o texto da LGPD com a teoria de contexto."
    )

    # =========================================================================
    # SLIDE 6: EXEMPLO ILUSTRATIVO DE TRANSFORMAÇÃO (TABELA 2)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "3. Exemplo Prático de Negociação", "Transformação Ilustrativa de Requisito Bruto em Negociado", "Tabela 2 do Artigo: Aplicando degradação de QoC e gatilhos estritos")

    # Card Antes (Requisito Bruto)
    add_card(s6, 0.8, 1.8, 5.6, 5.0, border_color=RED_ACCENT)
    tb = s6.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ ANTES: Requisito Pouco Especificado"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = RED_ACCENT

    p_raw = tf.add_paragraph()
    p_raw.text = '"REQ-01: O sistema deverá monitorar continuamente GPS, acelerômetro e histórico do usuário, enviando os dados a uma LLM em nuvem para personalizar recomendações de deslocamento."'
    p_raw.font.size = Pt(11)
    p_raw.font.italic = True
    p_raw.font.color.rgb = TEXT_MAIN
    p_raw.space_before = Pt(8)

    raw_problems = [
        "QoC não especificada: monitoramento ininterrupto de GPS drena bateria e gera trilha de vigilância completa.",
        "Finalidade genérica: não há critérios de quando a recomendação deve ocorrer.",
        "Violação da Minimização (Art. 6º, III): dados brutos sem anonimização transmitidos para nuvem externa de LLM."
    ]
    for prob in raw_problems:
        p = tf.add_paragraph()
        p.text = "• " + prob
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    # Card Depois (Requisito Negociado)
    add_card(s6, 6.8, 1.8, 5.6, 5.0, border_color=GREEN_ACCENT)
    tb = s6.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "✔ DEPOIS: Requisito Negociado (Privacy by Design)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    p_neg = tf.add_paragraph()
    p_neg.text = '"REQ-01: Para inferir \'User_In_Transit\' (finalidade), o sistema deverá amostrar localmente o acelerômetro a cada 30 s. Somente quando detectada velocidade > 15 km/h o GPS será ativado com precisão de 100 m, convertendo a coordenada em \'Commercial_Zone\' na borda e descartando o dado bruto da RAM antes de qualquer chamada à LLM externa."'
    p_neg.font.size = Pt(11)
    p_neg.font.italic = True
    p_neg.font.color.rgb = TEXT_MAIN
    p_neg.space_before = Pt(8)

    neg_points = [
        "Gatilho Estrito: acelerômetro local atua como sentinela; GPS só liga se velocidade > 15 km/h.",
        "Degradação de QoC: GPS de 100m em vez de precisão centimétrica.",
        "Processamento de Borda: conversão em rótulo semântico e descarte imediato de RAM antes do envio externo."
    ]
    for pt in neg_points:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    s6.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 05:30 - 06:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar a Tabela 2 do artigo como contraste prático.\n"
        "- Explicar como a ambiguidade de requisitos clássica ('monitorar') é substituída por cláusulas mensuráveis de QoC e privacidade.\n"
        "- Enfatizar o descarte em RAM e o processamento local na borda."
    )

    # =========================================================================
    # SLIDE 7: METODOLOGIA DA PESQUISA & DSR
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "4. Metodologia", "Percurso Metodológico e Perspectiva DSR", "Classificação do estudo, artefatos gerados e limites do escopo")

    # Card Esquerdo: DSR e Artefatos
    add_card(s7, 0.8, 1.8, 5.6, 5.0)
    tb = s7.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔬 Enquadramento Metodológico"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = BLUE

    method_bullets = [
        "Pesquisa Aplicada em Engenharia de Software orientada pela literatura de Design Science Research (DSR; Hevner et al., 2004; Wieringa, 2014).",
        "Três categorias de artefatos gerados:",
        "  1. Construtos e Modelos: taxonomia dos 3 paradoxos, estrutura 4W estendida, método e diagramas BPMN.",
        "  2. Especificação Arquitetural: descrição formal em ADL ACME.",
        "  3. Instanciação: protótipo web ContextLGPD-Negotiator.",
        "Transparência Acadêmica: O trabalho NÃO reivindica ciclo completo de DSR nem validação empírica concluída (escopo delimitado à concepção, arquitetura e ferramenta)."
    ]
    for mb in method_bullets:
        p = tf.add_paragraph()
        p.text = mb
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    # Espaço para Imagem da Figura 1
    add_image_placeholder(s7, 6.8, 1.8, 5.6, 5.0, "FIGURA 1 DO ARTIGO: BPMN do Percurso Metodológico da Pesquisa\n(4 raias: Problema, Método, Arquitetura, Consolidação)")

    s7.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 06:30 - 07:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Explicar que foram gerados 3 diagramas BPMN com funções estritas e separadas.\n"
        "- Na Figura 1 está o percurso do pesquisador.\n"
        "- Deixar claro que a avaliação futura aparece como anotação tracejada no BPMN."
    )

    # =========================================================================
    # SLIDE 8: O MÉTODO DE NEGOCIAÇÃO DE REQUISITOS (ETAPAS M1 A M6)
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
        y = 1.8 + row * 2.5
        add_card(s8, x, y, 3.8, 2.3, border_color=clr)
        tb = s8.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.15), Inches(3.5), Inches(2.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(6)

    s8.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 07:30 - 08:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Passar pelas etapas M1 a M6 mostrando a linearidade conceitual.\n"
        "- Ressaltar que a etapa M6 exige chancela humana: o método não transfere responsabilidade jurídica para o software."
    )

    # =========================================================================
    # SLIDE 9: MODELO BPMN DO MÉTODO (FIGURA 2)
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "5. Método de Negociação", "Modelo BPMN do Processo de Negociação", "Fluxo em três raias: Engenheiro, ContextLGPD-Negotiator e Provedor LLM / Auditoria")

    # Card Esquerdo Explicativo
    add_card(s9, 0.8, 1.8, 4.2, 5.0)
    tb = s9.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(3.8), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🔄 Dinâmica das Três Raias"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = NAVY

    bpmn2_bullets = [
        "Raia 1 (Engenheiro): Elicitação 4W, QoC e iteração interativa via chat de refinamento.",
        "Raia 2 (ContextLGPD-Negotiator): Decomposição de contexto, gateway de detecção de conflitos, imposição de gatilho estrito e degradação de QoC na borda.",
        "Raia 3 (LLM Nuvem / Auditoria): Síntese de Privacy by Design sob retenção zero e comprovação técnica perante ANPD.",
        "Gateway de Conflito: Ponto de decisão que devolve o requisito para renegociação iterativa."
    ]
    for b in bpmn2_bullets:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    # Espaço para Imagem da Figura 2
    add_image_placeholder(s9, 5.3, 1.8, 7.2, 5.0, "FIGURA 2 DO ARTIGO: BPMN do Método de Negociação de Requisitos\n(Raias: Engenheiro, PrivacyGuard Borda, LLM Nuvem / Auditoria ANPD)")

    s9.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 08:30 - 09:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Apontar para os elementos do diagrama: o gateway de conflito e o loop de iteração.\n"
        "- Mostrar que a auditoria da ANPD é alimentada diretamente pela Matriz de Accountability gerada."
    )

    # =========================================================================
    # SLIDE 10: FLUXO DE INTERAÇÃO COM A FERRAMENTA (FIGURA 3)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "6. A Ferramenta", "Fluxo de Interação da Ferramenta e Contingência Local", "Interação entre Cliente SPA, API Routes Next.js, LLM Externa e Fallback Determinístico")

    # Card Esquerdo Explicativo
    add_card(s10, 0.8, 1.8, 4.2, 5.0)
    tb = s10.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(3.8), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚡ Arquitetura com Fallback"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = BLUE

    flow_bullets = [
        "Entrada Estruturada: Captura no navegador de 4W, sensores, QoC, gatilhos e Given-When-Then BDD.",
        "Caminho Principal (Nuvem): Envio do payload sanitizado para Gemini, OpenAI ou Groq via rotas de API no servidor.",
        "Caminho de Contingência (Local): Se não houver chave de API ou se houver falha de conexão, o sistema aciona o motor determinístico local.",
        "Zero Cloud Database: Persistência local no navegador (HTML5 LocalStorageVault) com desfazer por snapshots (Undo)."
    ]
    for b in flow_bullets:
        p = tf.add_paragraph()
        p.text = "• " + b
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    # Espaço para Imagem da Figura 3
    add_image_placeholder(s10, 5.3, 1.8, 7.2, 5.0, "FIGURA 3 DO ARTIGO: BPMN de Interação do Usuário com a Ferramenta\n(Cliente SPA, Rotas de API, LLM Externa e Desvio para Contingência Local)")

    s10.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 09:30 - 10:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Explicar a distinção entre a Fig 2 (método abstrato) e a Fig 3 (implementação concreta do software).\n"
        "- Destacar a garantia de contingência: a ferramenta não quebra e não fica bloqueada sem chave de API."
    )

    # =========================================================================
    # SLIDE 11: ARQUITETURA FORMAL EM ADL ACME (VISÃO GERAL)
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11)
    add_header(s11, "7. Especificação Arquitetural", "Visão Arquitetural em ADL ACME: Três Representações Compostas", "Baseada no framework STREAM (Castro et al., 2012) e ACME (Garlan et al., 2000)")

    acme_reps = [
        ("1. Browser Client SPA", "Representação: BrowserClient_Rep",
         "Executado no navegador do engenheiro (Next.js client-side).\n\n"
         "Subcomponentes:\n"
         "• ReqInputInterface (formulários 4W, QoC, BDD)\n"
         "• WorkspaceUIOrchestrator (abas, chat, modais)\n"
         "• LocalStorageVault (persistência offline, Undo)\n"
         "• LocalDeterministicEngine (motor heurístico local)", BLUE),
        ("2. Next.js Server Runtime", "Representação: ServerRuntime_Rep",
         "Backend mediador serverless (API Routes).\n\n"
         "Subcomponentes:\n"
         "• APIRoutesHandler (/api/negotiate e /api/chat)\n"
         "• PrivacyGuardSanitizer (sanitização de borda)\n"
         "• ContingencyGate (seletor de fallback)\n"
         "• RegulatoryDocGenerator (RIPD e Accountability)", GREEN_ACCENT),
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
        add_card(s11, x, 1.8, 3.8, 5.0, border_color=clr)
        tb = s11.shapes.add_textbox(Inches(x + 0.15), Inches(1.95), Inches(3.5), Inches(4.7))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = clr

        p_r = tf.add_paragraph()
        p_r.text = rep
        p_r.font.size = Pt(10)
        p_r.font.italic = True
        p_r.font.color.rgb = TEXT_MUTED
        p_r.space_before = Pt(2)

        for paragraph in desc.split("\n\n"):
            p_d = tf.add_paragraph()
            p_d.text = paragraph
            p_d.font.size = Pt(10)
            p_d.font.color.rgb = TEXT_MAIN
            p_d.space_before = Pt(6)

    s11.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 10:30 - 11:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Explicar por que optamos por Representações Compostas ACME: reflete fielmente o software implementado.\n"
        "- Não inventamos microsserviços fictícios; os subcomponentes estão agrupados nas 3 fronteiras reais de execução."
    )

    # =========================================================================
    # SLIDE 12: DIAGRAMA ACME ATUALIZADO (FIGURA 4)
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12)
    add_header(s12, "7. Especificação Arquitetural", "Diagrama ACME Completo: Portas, Bindings e Contingência", "Figura 4 do Artigo: Estrutura formal com destaque ao caminho de contingência")

    # Card Esquerdo com Detalhes da Notação
    add_card(s12, 0.8, 1.8, 4.2, 5.0)
    tb = s12.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(3.8), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "📐 Notação e Conexões ACME"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = NAVY

    acme_notes = [
        "Portas Provided (sólidas) & Required (vazadas): interação externa formal.",
        "Mecanismo de Bindings: ligam portas do componente pai diretamente às portas dos subcomponentes internos.",
        "Conectores RPC & Pipes: isolamento estrito entre o cliente local e a nuvem externa.",
        "Caminho de Contingência (Vermelho Tracejado): desvio automático do ContingencyGate para o LocalDeterministicEngine em caso de falha.",
        "Sem dados crus na nuvem: o canal ZeroStorageCloudRPC transporta apenas payloads sanitizados sem PII."
    ]
    for n in acme_notes:
        p = tf.add_paragraph()
        p.text = "• " + n
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    # Espaço para Imagem da Figura 4
    add_image_placeholder(s12, 5.3, 1.8, 7.2, 5.0, "FIGURA 4 DO ARTIGO: Diagrama ACME com 3 Representações Compostas\n(Browser Client SPA, Next.js Server Runtime, ExternalLLMReasoning e Caminho de Contingência)")

    s12.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m30s | 11:30 - 13:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Guiar a atenção da banca para a Figura 4: mostrar o encaixe das portas e bindings.\n"
        "- Apontar a linha vermelha tracejada da contingência.\n"
        "- Mencionar que a correspondência entre código e ACME foi validada por inspeção direta do repositório."
    )

    # =========================================================================
    # SLIDE 13: DEMONSTRAÇÃO E TELAS DO PROTÓTIPO (FIGURA 5)
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13)
    add_header(s13, "7. Protótipo & Demonstração", "Telas do Protótipo ContextLGPD-Negotiator", "Figura 5 do Artigo: Painel de evidências funcionais em três etapas")

    # 3 Placeholders para as 3 telas da Figura 5
    screens = [
        ("(a) Entrada do Cenário 4W e QoC", "Captura de código, título, ator, User Story, Where/Who/When/What, sensores e BDD."),
        ("(b) Requisito Negociado", "Visualização da reescrita Privacy by Design, mitigação dos paradoxos e comparação antes/depois."),
        ("(c) Matriz de Accountability & RIPD", "Tabela formal com papéis, ciclo de vida e bases legais da LGPD para auditoria ANPD.")
    ]

    for i, (stitle, sdesc) in enumerate(screens):
        x = 0.8 + i * 4.0
        add_image_placeholder(s13, x, 1.8, 3.8, 3.6, f"FIGURA 5{stitle[:4]}:\n{stitle[4:]}")
        tb = s13.shapes.add_textbox(Inches(x), Inches(5.6), Inches(3.8), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = stitle
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = NAVY
        p2 = tf.add_paragraph()
        p2.text = sdesc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED
        p2.space_before = Pt(4)

    s13.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 13:00 - 14:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Apresentar as 3 capturas reais da ferramenta.\n"
        "- Mostrar como o engenheiro interage na prática: preenche o 4W, clica em 'Negociar com IA' e inspeciona o requisito gerado e a matriz de conformidade."
    )

    # =========================================================================
    # SLIDE 14: VERIFICAÇÃO FUNCIONAL IMPLEMENTADA
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14)
    add_header(s14, "4. Verificação Funcional", "Funções Efetivamente Implementadas e Verificadas", "Diferenciando verificação funcional manual de avaliação empírica formal")

    # Card 1: O que foi implementado e verificado
    add_card(s14, 0.8, 1.8, 5.6, 5.0, border_color=GREEN_ACCENT)
    tb = s14.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "✔ Implementado & Verificado Funcionalmente"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    verified_items = [
        "Entrada Estruturada: formulários 4W, sensores, QoC, gatilhos e Given-When-Then BDD.",
        "Motor Local Determinístico: regras heurísticas de contingência executadas 100% offline.",
        "Rotas de API (/api/negotiate e /api/chat): integração com Gemini, GPT-4o e Groq, com chaveamento gracioso.",
        "Chat Assistente de Negociação: diálogo iterativo para refinamento contínuo de requisitos.",
        "Cofre Local (LocalStorageVault): multi-projetos, snapshots de desfazer (Undo) e backup preventivo no logout.",
        "Emissão de Artefatos: Matriz de Accountability e exportação de RIPD em Markdown (.md)."
    ]
    for vi in verified_items:
        p = tf.add_paragraph()
        p.text = "• " + vi
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

    # Card 2: Delimitação e Rigor Científico
    add_card(s14, 6.8, 1.8, 5.6, 5.0, border_color=AMBER_ACCENT)
    tb = s14.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⚠️ Delimitações e Não-Reivindicações"
    p.font.size = Pt(15)
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
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(6)

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

    # Card Etapa 1
    add_card(s15, 0.8, 1.8, 5.6, 5.0, border_color=BLUE)
    tb = s15.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "👥 Etapa 1: Avaliação por Especialistas"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = BLUE

    e1_points = [
        "Amostra: 6 a 10 especialistas intencionalmente selecionados em Engenharia de Requisitos, LGPD/Direito Digital e Computação Ubíqua.",
        "Instrumento: Questionário Likert de 5 pontos baseado no Technology Acceptance Model (TAM) + perguntas abertas.",
        "Dimensões Avaliadas: Clareza, utilidade percebida, completude dos requisitos, viabilidade e consistência regulatória.",
        "Objetivo: Revisar e calibrar as três tensões e validar a aplicabilidade prática dos artefatos gerados."
    ]
    for pt in e1_points:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    # Card Etapa 2
    add_card(s15, 6.8, 1.8, 5.6, 5.0, border_color=GREEN_ACCENT)
    tb = s15.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🧪 Etapa 2: Comparação Quase-Experimental"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    e2_points = [
        "Delineamento: Comparação pareada entre especificação manual vs. especificação assistida pelo ContextLGPD-Negotiator.",
        "Participantes: Desenvolvedores e pesquisadores do Centro de Informática da UFPE (CIn/UFPE).",
        "Métricas Formais (Tabela 10):",
        "  - Identificação de Conflitos: Precisão, Revocação e F1-score.",
        "  - Minimização de Dados: Ausência de atributos proibidos nos rastros de rede.",
        "  - Eficiência: Tempo de conclusão e número de ciclos de revisão."
    ]
    for pt in e2_points:
        p = tf.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(11)
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
        y = 1.8 + i * 1.6
        add_card(s16, 0.8, y, 11.7, 1.4, border_color=clr)
        tb = s16.shapes.add_textbox(Inches(1.0), Inches(y + 0.1), Inches(11.3), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = clr
        p2 = tf.add_paragraph()
        p2.text = text
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MAIN
        p2.space_before = Pt(4)

    s16.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m30s | 16:00 - 17:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Este é um dos slides mais fortes da apresentação: demonstra maturidade crítica.\n"
        "- Admitir e discutir a localização do PrivacyGuardSanitizer prova domínio arquitetural e transparência."
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
        y = 1.8 + i * 1.0
        add_card(s17, 0.8, y, 11.7, 0.85)
        tb = s17.shapes.add_textbox(Inches(1.0), Inches(y + 0.05), Inches(11.3), Inches(0.75))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"• {ltitle}: "
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = RED_ACCENT
        r = p.add_run()
        r.text = ldesc
        r.font.size = Pt(11)
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

    # Card Conclusões
    add_card(s18, 0.8, 1.8, 5.6, 5.0, border_color=BLUE)
    tb = s18.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🎯 Conclusões do Estudo"
    p.font.size = Pt(15)
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
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    # Card Trabalhos Futuros
    add_card(s18, 6.8, 1.8, 5.6, 5.0, border_color=GREEN_ACCENT)
    tb = s18.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🚀 Trabalhos Futuros"
    p.font.size = Pt(15)
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
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s18.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 1m00s | 18:30 - 19:30]\n"
        "NOTAS DO ORADOR:\n"
        "- Resumir as respostas às QPs 1, 2 e 3.\n"
        "- Enfatizar o legado do trabalho: uma ferramenta funcional no ar e uma base teórica sólida para publicações futuras."
    )

    # =========================================================================
    # SLIDE 19: AGRADECIMENTOS, FINANCIAMENTO & DECLARAÇÃO DE IA
    # =========================================================================
    s19 = prs.slides.add_slide(blank_layout)
    add_bg(s19)
    add_header(s19, "Declarações Obrigatórias", "Financiamento, Ética e Declaração de Uso de IA", "Cumprimento das diretrizes de integridade científica do CNPq")

    # Card Financiamento
    add_card(s19, 0.8, 1.8, 5.6, 5.0)
    tb = s19.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🏛️ Órgãos de Fomento"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = BLUE

    fund_text = [
        "O presente trabalho foi realizado com o apoio financeiro das seguintes agências brasileiras:",
        "• FACEPE: Fundação de Amparo à Ciência e Tecnologia do Estado de Pernambuco.",
        "• CAPES: Coordenação de Aperfeiçoamento de Pessoal de Nível Superior – Brasil (Código de Financiamento 001).",
        "• CNPq: Conselho Nacional de Desenvolvimento Científico e Tecnológico.",
        "O autor expressa profundo agradecimento pelo suporte à pesquisa científica de pós-graduação no Centro de Informática da UFPE."
    ]
    for ft in fund_text:
        p = tf.add_paragraph()
        p.text = ft
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    # Card Declaração de IA
    add_card(s19, 6.8, 1.8, 5.6, 5.0, border_color=AMBER_ACCENT)
    tb = s19.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🤖 Declaração de Uso de IA (Normas CNPq)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = AMBER_ACCENT

    ai_text = [
        "Em conformidade com as diretrizes de integridade científica do CNPq:",
        "• Uso Assistivo: Ferramentas de IA generativa (Google Antigravity / Gemini 3.8 Flash High) foram utilizadas exclusivamente como apoio à prototipação de código, exploração inicial de tensões e refinamento da redação.",
        "• Responsabilidade Humana Integral: Todas as formulações conceituais, análises legais da LGPD, especificações arquiteturais e conclusões foram concebidas, rigorosamente checadas e validadas pelo autor.",
        "• O autor assume integral e exclusiva responsabilidade pela veracidade e integridade acadêmica do trabalho."
    ]
    for at in ai_text:
        p = tf.add_paragraph()
        p.text = at
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_MAIN
        p.space_before = Pt(8)

    s19.notes_slide.notes_text_frame.text = (
        "[Tempo estimado: 0m30s | 19:30 - 20:00]\n"
        "NOTAS DO ORADOR:\n"
        "- Agradecer publicamente à FACEPE, CAPES e CNPq.\n"
        "- Fazer a declaração de transparência de IA conforme exigência dos editais e do CNPq."
    )

    # =========================================================================
    # SLIDE 20: ENCERRAMENTO & PERGUNTAS (Q&A)
    # =========================================================================
    s20 = prs.slides.add_slide(blank_layout)
    add_bg(s20, NAVY)

    tb_end = s20.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.3), Inches(3.8))
    tf_end = tb_end.text_frame
    tf_end.word_wrap = True

    p = tf_end.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "Obrigado pela Atenção!"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = RGBColor(255, 255, 255)

    p_sub = tf_end.add_paragraph()
    p_sub.alignment = PP_ALIGN.CENTER
    p_sub.text = "Aberto para Perguntas e Contribuições da Banca"
    p_sub.font.size = Pt(20)
    p_sub.font.color.rgb = RGBColor(147, 197, 253)
    p_sub.space_before = Pt(14)

    p_info = tf_end.add_paragraph()
    p_info.alignment = PP_ALIGN.CENTER
    p_info.text = "\nSamuel Celso dos Anjos Neto\nCentro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE)\nE-mail: scan@cin.ufpe.br  |  ORCID: 0009-0007-5141-9484\n\nProtótipo Online: https://context-lgpd-negotiator.vercel.app/\nRepositório GitHub: https://github.com/scan4364/ContextLGPD-Negotiator"
    p_info.font.size = Pt(12)
    p_info.font.color.rgb = RGBColor(226, 232, 240)
    p_info.space_before = Pt(16)

    s20.notes_slide.notes_text_frame.text = (
        "[Tempo final da apresentação: 20m00s]\n"
        "NOTAS DO ORADOR:\n"
        "- Agradecer à banca examinadora e abrir a sessão para arguição e perguntas."
    )

    output_path = "Apresentacao_ContextLGPD_Negotiator_20min.pptx"
    prs.save(output_path)
    print(f"Apresentação gerada com sucesso: {output_path}")

if __name__ == "__main__":
    create_presentation()
