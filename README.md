# ContextLGPD-Negotiator 🛡️
### Mediação entre Sistemas Sensíveis ao Contexto e a LGPD por meio da Engenharia de Requisitos de Software

> **Trabalho Acadêmico & Sistema de Software**  
> **Autor:** Samuel Celso dos Anjos Neto  
> **Instituição:** Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE), Recife – PE, Brasil.

---

## 📌 Visão Geral do Sistema

O **ContextLGPD-Negotiator** é um sistema completo desenvolvido para operacionalizar a conciliação entre a **Computação Sensível ao Contexto** (Dey, 2001; Abowd et al., 1999) e a **Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)** através da Engenharia de Requisitos de Software.

O sistema transforma o conceito tradicional de *chat livre com IA* em uma **Tabela Interativa de Cenários de Usuário**:
1. O desenvolvedor/engenheiro especifica os cenários de uso com as variáveis contextuais implícitas (Where, Who, When, What, Sensores, QoC e Gatilhos).
2. O motor agêntico de IA analisa os paradoxos técnicos e jurídicos.
3. O sistema gera a especificação corrigida sob **Privacy by Design** (com amostragem na borda, degradação de QoC e Zero-Storage em RAM) e a **Matriz de Comprovação Regulatória (Accountability — Art. 6º, X)**.

---

## 🚀 Como Executar o Sistema

### 1. Pré-requisitos
- Node.js instalado (v18, v20 ou v24).

### 2. Instalação e Execução
```bash
# 1. Instalar as dependências (já instaladas)
npm install

# 2. Iniciar a aplicação
npm start
```

### 3. Acesso no Navegador
Abra: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Acesso de Demonstração (Seed Automático)
O banco de dados já vem populado com a conta de demonstração e com os 4 cenários clássicos do artigo científico:
- **E-mail:** `pesquisador@cin.ufpe.br`
- **Senha:** `senha123`

*(Você também pode criar uma conta nova a qualquer momento na tela de cadastro).*

---

## ☁️ Banco de Dados Online 24/7 (Supabase / Nuvem)

O sistema conta com arquitetura de dados híbrida:
1. **SQLite Local Persistente (Padrão):** Funciona imediatamente sem depender de conexões externas.
2. **Supabase / PostgreSQL na Nuvem (100% Online o Tempo Todo):**
   - Acesse o painel **"Chave API & Nuvem"** no topo da tela.
   - Na aba **"Banco Online (Supabase)"**, informe a URL e a Anon Key do seu projeto gratuito no [Supabase](https://supabase.com).
   - O arquivo `supabase_schema.sql` contém a estrutura completa de tabelas prontas para execução no *SQL Editor* do Supabase.

---

## 🔒 Segurança Criptográfica de Chaves de API (Art. 46 LGPD)

Em atendimento estrito às normas de segurança da informação e à solicitação de proteção de dados:
- As chaves de API dos modelos LLM (Google Gemini, OpenAI, Groq, Anthropic) **nunca são armazenadas em texto simples**.
- O backend utiliza o algoritmo de cifragem simétrica **AES-256-GCM** com vetor de inicialização (IV) aleatório de 96 bits e tag de autenticação para cada chave.
- O front-end exibe apenas a chave mascarada (`AIzaSy...4f1B`), garantindo segredo mesmo em sessões compartilhadas.

---

## 🧠 Modelos de IA e Chat com LLMs Suportados

Na modal de configurações, o usuário pode configurar e alternar dinamicamente entre:
- **Google Gemini (Oficial):** `gemini-2.0-flash` (Padrão ultra-rápido), `gemini-1.5-pro` (Janela Long-Context de 2M tokens), `gemini-1.5-flash`.
- **OpenAI:** `gpt-4o`, `gpt-4o-mini`.
- **Groq:** `llama-3.3-70b-versatile`.
- **Motor Especialista Local (Regras ADL ACME):** Caso o usuário queira testar sem inserir chave de API de imediato, o motor de regras da Listagem 2 do pré-artigo opera autonomamente.

---

## 📐 Estrutura Formal dos 3 Paradoxos (Fundamentação Teórica)

1. **O Paradoxo da Inferência (Art. 6º, III - Necessidade):** A fusão simultânea de múltiplos sensores de baixo nível exige calibração estrita da Qualidade de Contexto (QoC) e justificativa técnica formal para cada sensor.
2. **O Paradoxo da Proatividade (Art. 6º, I e II - Finalidade):** O monitoramento passivo 24/7 em background é substituído por **Gatilhos Estritos de Ativação (Triggers)**.
3. **O Paradoxo do Largo Contexto e Nuvem Externa (Art. 33 e Art. 46):** Envio de dados pessoais para servidores internacionais de LLMs é prevenido por **sanitização na borda (Edge Computing)** com conversão para rótulos semânticos abstratos (ex: `'Zona_Comercial'`) e descarte imediato da memória RAM (Zero-Storage).

---

## 📄 Exportação do Relatório RIPD

Ao clicar no botão **"Exportar RIPD (Art. 6º, X)"**, o sistema compila automaticamente um documento completo em Markdown/PDF com:
- Catálogo de Requisitos Negociados;
- Diagnóstico detalhado de violações evitadas;
- Matriz de Rastreabilidade e Prestação de Contas (Accountability).
