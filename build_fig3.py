# -*- coding: utf-8 -*-
"""
Script para geração da Figura 3 do Artigo:
'diagrama_interacao_ferramenta_BPMN.drawio'
Modelo BPMN 2.0 do Fluxo de Interação do Usuário com o ContextLGPD-Negotiator
Mostrando Engenheiro, Cliente SPA, Servidor Next.js, Provedor Externo e Desvio para Contingência Local.
"""

import xml.etree.ElementTree as ET

drawio_content = '''<mxfile host="app.diagrams.net" modified="2026-11-18T16:00:00.000Z" agent="Mozilla/5.0" version="24.0.0" type="device">
  <diagram id="bpmn_fig3_interaction" name="Figura 3 - Fluxo de Interacao da Ferramenta e Contingencia">
    <mxGraphModel dx="1400" dy="850" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1350" pageHeight="850" background="#ffffff" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />

        <!-- TITULO DA FIGURA -->
        <mxCell id="title_fig3" value="Figura 3: Modelo BPMN do Fluxo de Interação do Usuário com o ContextLGPD-Negotiator e Caminho de Contingência Local" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=13;fontStyle=1;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="40" y="15" width="1270" height="25" as="geometry" />
        </mxCell>

        <!-- POOL DE INTERAÇÃO -->
        <mxCell id="pool_main" value="Fluxo de Interação com a Ferramenta ContextLGPD-Negotiator (BPMN 2.0)" style="swimlane;html=1;childLayout=stackLayout;resizeParent=1;resizeParentMax=0;startSize=28;horizontal=0;horizontalFlip=1;fillColor=#F8FAFC;strokeColor=#334155;fontStyle=1;fontSize=12;fontColor=#0F172A;" vertex="1" parent="1">
          <mxGeometry x="40" y="45" width="1270" height="780" as="geometry" />
        </mxCell>

        <!-- ========================================================================= -->
        <!-- RAIA 1: ENGENHEIRO DE REQUISITOS (USUÁRIO) -->
        <!-- ========================================================================= -->
        <mxCell id="lane_eng" value="Raia 1: Engenheiro de Requisitos (Usuário / Especialista)" style="swimlane;html=1;startSize=24;horizontal=0;fillColor=#EFF6FF;strokeColor=#3B82F6;fontColor=#1E3A8A;fontStyle=1;" vertex="1" parent="pool_main">
          <mxGeometry x="28" y="0" width="1242" height="180" as="geometry" />
        </mxCell>

        <!-- EV-01: Início -->
        <mxCell id="ev_01" value="Início:&lt;br&gt;Entrada 4W" style="shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;perimeter=ellipsePerimeter;outline=standard;symbol=general;fillColor=#D1FAE5;strokeColor=#059669;" vertex="1" parent="lane_eng">
          <mxGeometry x="30" y="70" width="36" height="36" as="geometry" />
        </mxCell>

        <!-- ACT-Input: Registro Estruturado -->
        <mxCell id="act_reg" value="Registrar Cenário, 4W,&lt;br&gt;Fontes, QoC Desejada e&lt;br&gt;Critérios BDD (Given-When-Then)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane_eng">
          <mxGeometry x="95" y="60" width="170" height="56" as="geometry" />
        </mxCell>

        <!-- ACT-02: Refinar Gatilhos -->
        <mxCell id="act_02" value="ACT-02: Ajustar e Calibrar&lt;br&gt;Gatilhos de Ativação&lt;br&gt;&amp;amp; Frequência de Amostragem" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane_eng">
          <mxGeometry x="460" y="60" width="160" height="56" as="geometry" />
        </mxCell>

        <!-- ACT-06: Validação e Edição Humana -->
        <mxCell id="act_06" value="ACT-06: Revisar, Editar,&lt;br&gt;Interagir no Chat,&lt;br&gt;Aprovar ou Rejeitar Proposta" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2563EB;strokeWidth=2;fontColor=#1E3A8A;fontSize=10;fontStyle=1;" vertex="1" parent="lane_eng">
          <mxGeometry x="930" y="60" width="160" height="56" as="geometry" />
        </mxCell>

        <!-- ========================================================================= -->
        <!-- RAIA 2: CLIENTE SPA (NAVEGADOR / LOCALSTORAGE) -->
        <!-- ========================================================================= -->
        <mxCell id="lane_spa" value="Raia 2: Cliente SPA (Navegador / LocalStorageVault)" style="swimlane;html=1;startSize=24;horizontal=0;fillColor=#F0FDF4;strokeColor=#10B981;fontColor=#065F46;fontStyle=1;" vertex="1" parent="pool_main">
          <mxGeometry x="28" y="180" width="1242" height="190" as="geometry" />
        </mxCell>

        <!-- ACT-01: Estruturar Cenário -->
        <mxCell id="act_01" value="ACT-01: Estruturar Vetores 4W&lt;br&gt;e Validar Consistência&lt;br&gt;Sintática do Cenário" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#059669;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane_spa">
          <mxGeometry x="95" y="65" width="170" height="56" as="geometry" />
        </mxCell>

        <!-- ACT-05: Preparar Documentação -->
        <mxCell id="act_05" value="ACT-05: Compilar Matriz de&lt;br&gt;Accountability (Art. 6º, X)&lt;br&gt;e Rascunho do RIPD (.md)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#059669;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane_spa">
          <mxGeometry x="930" y="65" width="160" height="56" as="geometry" />
        </mxCell>

        <!-- EV-02: Persistência e Fim -->
        <mxCell id="ev_02" value="EV-02: Salvar no&lt;br&gt;Cofre Local &amp;amp;&lt;br&gt;Exportar JSON" style="shape=mxgraph.bpmn.shape;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;perimeter=ellipsePerimeter;outline=end;symbol=general;fillColor=#FEE2E2;strokeColor=#DC2626;" vertex="1" parent="lane_spa">
          <mxGeometry x="1140" y="75" width="36" height="36" as="geometry" />
        </mxCell>

        <!-- ========================================================================= -->
        <!-- RAIA 3: SERVIDOR NEXT.JS (API ROUTES / PROMPT MEDIATOR) -->
        <!-- ========================================================================= -->
        <mxCell id="lane_srv" value="Raia 3: Servidor Next.js (Rotas de API / PromptMediator / Fallback)" style="swimlane;html=1;startSize=24;horizontal=0;fillColor=#FFFBEB;strokeColor=#F59E0B;fontColor=#78350F;fontStyle=1;" vertex="1" parent="pool_main">
          <mxGeometry x="28" y="370" width="1242" height="220" as="geometry" />
        </mxCell>

        <!-- GW-01: Verificação de Tensões -->
        <mxCell id="gw_01" value="GW-01: Tensão&lt;br&gt;com Paradoxos&lt;br&gt;Detectada?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;fontColor=#78350F;fontSize=9;fontStyle=1;" vertex="1" parent="lane_srv">
          <mxGeometry x="310" y="55" width="105" height="75" as="geometry" />
        </mxCell>

        <!-- ACT-Format: Montar Prompt -->
        <mxCell id="act_format" value="formatPrompt() &amp;amp;&lt;br&gt;SYSTEM_PROMPT_NEGOTIATOR&lt;br&gt;&lt;i&gt;(Anonimização &amp;amp; Borda)&lt;/i&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D97706;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane_srv">
          <mxGeometry x="460" y="65" width="160" height="56" as="geometry" />
        </mxCell>

        <!-- GW-Key: Chave de API / Rede presente? -->
        <mxCell id="gw_key" value="Chave de API&lt;br&gt;configurada &amp;amp;&lt;br&gt;Rede ativa?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;fontColor=#78350F;fontSize=9;fontStyle=1;" vertex="1" parent="lane_srv">
          <mxGeometry x="660" y="55" width="105" height="75" as="geometry" />
        </mxCell>

        <!-- ACT-Contingency: Motor Local de Contingência -->
        <mxCell id="act_contingency" value="&lt;b style='color:#DC2626;'&gt;LocalAcmeFallbackEngine&lt;/b&gt;&lt;br&gt;[CAMINHO DE CONTINGÊNCIA]&lt;br&gt;Diagnóstico Heurístico &amp;amp; Degradação&lt;br&gt;Determinística 100% Offline" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF2F2;strokeColor=#DC2626;strokeWidth=2;fontColor=#7F1D1D;fontSize=10;" vertex="1" parent="lane_srv">
          <mxGeometry x="635" y="150" width="220" height="55" as="geometry" />
        </mxCell>

        <!-- ACT-Parser: Serializar Resposta -->
        <mxCell id="act_parse" value="parseJson() &amp;amp; NextResponse:&lt;br&gt;Normalizar Requisito Candidato&lt;br&gt;&amp;amp; Matriz de Conformidade" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D97706;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane_srv">
          <mxGeometry x="930" y="65" width="160" height="56" as="geometry" />
        </mxCell>

        <!-- ========================================================================= -->
        <!-- RAIA 4: PROVEDOR EXTERNO DE LLM (NUVEM INTERNACIONAL) -->
        <!-- ========================================================================= -->
        <mxCell id="lane_llm" value="Raia 4: Provedor Externo de LLM (Nuvem Internacional / Zero Retention)" style="swimlane;html=1;startSize=24;horizontal=0;fillColor=#FAF5FF;strokeColor=#9333EA;fontColor=#581C87;fontStyle=1;" vertex="1" parent="pool_main">
          <mxGeometry x="28" y="590" width="1242" height="190" as="geometry" />
        </mxCell>

        <!-- ACT-03: Pipeline de Raciocínio IA -->
        <mxCell id="act_03" value="ACT-03: Pipeline Lógico de IA&lt;br&gt;• ContextParserEngine (Etapa 1)&lt;br&gt;• PrivacyGuardSanitizer (Etapa 2)&lt;br&gt;• RegulatoryDocGenerator (Etapa 3)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#9333EA;strokeWidth=2;fontColor=#581C87;fontSize=10;fontStyle=1;" vertex="1" parent="lane_llm">
          <mxGeometry x="620" y="50" width="210" height="65" as="geometry" />
        </mxCell>

        <!-- ACT-04: Retorno com Retenção Zero -->
        <mxCell id="act_04" value="ACT-04: Retornar Requisito&lt;br&gt;Negociado sob Contrato&lt;br&gt;de Retenção Zero (Art. 33 LGPD)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#9333EA;strokeWidth=1.5;fontColor=#0F172A;fontSize=10;" vertex="1" parent="lane_llm">
          <mxGeometry x="870" y="55" width="180" height="55" as="geometry" />
        </mxCell>

        <!-- ========================================================================= -->
        <!-- FLUXOS DE SEQUÊNCIA (EDGES) -->
        <!-- ========================================================================= -->

        <!-- Início -> Registrar -->
        <mxCell id="f1" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;" edge="1" parent="pool_main" source="ev_01" target="act_reg">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- Registrar -> Estruturar (SPA) -->
        <mxCell id="f2" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;" edge="1" parent="pool_main" source="act_reg" target="act_01">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- Estruturar -> GW-01 (Server) -->
        <mxCell id="f3" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#059669;" edge="1" parent="pool_main" source="act_01" target="gw_01">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- GW-01 -> Ajustar Gatilhos (Engenheiro) -->
        <mxCell id="f4" value="Sim (Conflito)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#D97706;fontColor=#B45309;fontSize=9;" edge="1" parent="pool_main" source="gw_01" target="act_02">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="390" y="340" />
              <mxPoint x="540" y="340" />
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- Ajustar Gatilhos -> formatPrompt -->
        <mxCell id="f5" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;" edge="1" parent="pool_main" source="act_02" target="act_format">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- GW-01 -> formatPrompt (Direto se Não) -->
        <mxCell id="f6" value="Não" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#059669;fontColor=#065F46;fontSize=9;" edge="1" parent="pool_main" source="gw_01" target="act_format">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- formatPrompt -> GW-Key -->
        <mxCell id="f7" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#D97706;" edge="1" parent="pool_main" source="act_format" target="gw_key">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- GW-Key -> ACT-03 (Nuvem LLM) [SIM] -->
        <mxCell id="f8" value="Sim (Chave Presente)" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=#9333EA;fontColor=#581C87;fontSize=9;" edge="1" parent="pool_main" source="gw_key" target="act_03">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- GW-Key -> Contingência [NÃO / CAMINHO DE CONTINGÊNCIA] -->
        <mxCell id="f9" value="&lt;b style='color:#DC2626;'&gt;Não (Sem Chave / Falha Rede)&lt;br&gt;[DESVIO DE CONTINGÊNCIA]&lt;/b&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2.5;strokeColor=#DC2626;dashed=1;dashPattern=5 3;fontColor=#B91C1C;fontSize=9;" edge="1" parent="pool_main" source="gw_key" target="act_contingency">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- Contingência -> ACT-Parse -->
        <mxCell id="f10" value="Saída Local Baseada em Regras" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=#DC2626;dashed=1;dashPattern=5 3;fontColor=#B91C1C;fontSize=9;" edge="1" parent="pool_main" source="act_contingency" target="act_parse">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="900" y="550" />
              <mxPoint x="900" y="460" />
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- ACT-03 -> ACT-04 -->
        <mxCell id="f11" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=2;strokeColor=#9333EA;" edge="1" parent="pool_main" source="act_03" target="act_04">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- ACT-04 -> ACT-Parse -->
        <mxCell id="f12" value="JSON Estruturado" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#9333EA;fontColor=#581C87;fontSize=9;" edge="1" parent="pool_main" source="act_04" target="act_parse">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="960" y="620" />
              <mxPoint x="960" y="490" />
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- ACT-Parse -> ACT-05 (SPA) -->
        <mxCell id="f13" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#D97706;" edge="1" parent="pool_main" source="act_parse" target="act_05">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- ACT-05 -> ACT-06 (Engenheiro) -->
        <mxCell id="f14" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#059669;" edge="1" parent="pool_main" source="act_05" target="act_06">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- ACT-06 -> Salvar (EV-02) -->
        <mxCell id="f15" value="Aprovado" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;fontColor=#1E3A8A;fontSize=9;" edge="1" parent="pool_main" source="act_06" target="ev_02">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>

        <!-- ACT-06 -> Loop de Refinamento (Chat) -->
        <mxCell id="f16" value="Iteração no Chat de Refinamento" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeWidth=1.5;strokeColor=#2563EB;dashed=1;fontColor=#1E3A8A;fontSize=9;" edge="1" parent="pool_main" source="act_06" target="act_02">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="1010" y="30" />
              <mxPoint x="540" y="30" />
            </Array>
          </mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
'''

output_path = "diagrama_interacao_ferramenta_BPMN.drawio"
with open(output_path, "w", encoding="utf-8") as f:
    f.write(drawio_content)

tree = ET.parse(output_path)
print(f"Sucesso! Arquivo '{output_path}' gerado e validado com parser XML ({len(list(tree.iter()))} elementos).")
