# ContextLGPD-Negotiator 🛡️
### Mediação entre Sistemas Sensíveis ao Contexto e a LGPD por meio da Engenharia de Requisitos de Software

> **Trabalho Acadêmico & Sistema de Software em Next.js**  
> **Desenvolvido por:** Samuel Anjos Neto  
> **Instituição:** Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE), Recife – PE, Brasil.

---

## 📌 Visão Geral do Sistema

O **ContextLGPD-Negotiator** é um sistema completo desenvolvido em **Next.js (App Router)** para operacionalizar a conciliação entre a **Computação Sensível ao Contexto** (Dey, 2001; Abowd et al., 1999) e a **Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)** através da Engenharia de Requisitos de Software.

O sistema substitui o paradigma de *chat livre com IA* por uma **Tabela Interativa de Cenários de Usuário**:
1. O desenvolvedor/engenheiro especifica os cenários com as variáveis contextuais implícitas (Where, Who, When, What, Sensores, QoC e Gatilhos).
2. O motor agêntico de IA analisa os **3 Paradoxos** técnicos e jurídicos.
3. O sistema gera a especificação corrigida sob **Privacy by Design** (com amostragem na borda, degradação de granularidade de QoC e Zero-Storage em RAM) e a **Matriz de Comprovação Regulatória (Accountability — Art. 6º, X)**.

---

## 💾 Banco de Dados Integrado (Zero-Configuração)

Para eliminar qualquer necessidade de serviços externos pagos ou limitados:
- **SEM Supabase:** Você **não precisa** de conta no Supabase nem de bancos de dados externos.
- **SEM GitHub Actions:** Você **não precisa** ativar ou configurar nenhum workflow no GitHub.
- **Armazenamento Integrado & Persistente:** O sistema gerencia os dados de forma nativa e persistente no próprio navegador e estado da aplicação.
- **Backup & Restauração com 1 Clique:**
  - Botão **"Backup JSON"** para baixar um arquivo completo com todos os seus cenários, histórico de negociações e configurações.
  - Botão **"Importar JSON"** para carregar cenários salvos em qualquer computador ou navegador.
  - Botão **"⚡ Restaurar Cenários do Artigo"** para recarregar instantaneamente os 4 cenários clássicos do pré-artigo científico (CIn-UFPE).

---

## 🚀 Como Enviar para o GitHub e Vercel

O projeto foi totalmente construído e validado em **Next.js 16** com rotas serverless, sendo 100% pronto para a **Vercel** com zero esforço de configuração.

### Passo 1: Enviar para o GitHub
No seu terminal (na pasta do projeto), execute:
```bash
# 1. Definir o branch principal como main
git branch -M main

# 2. Conectar com o seu repositório no GitHub (crie um repo vazio no github.com)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 3. Fazer o push dos arquivos
git push -u origin main
```

### Passo 2: Fazer o Deploy na Vercel
1. Acesse **[vercel.com](https://vercel.com)** e faça login com seu GitHub.
2. Clique no botão **"Add New..."** ➔ **"Project"**.
3. Selecione o repositório e clique em **Import**.
4. O framework **Next.js** é detectado automaticamente.
5. Clique em **Deploy**! Em menos de 1 minuto seu sistema estará no ar.

---

## 💻 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# Ou compilar para produção:
npm run build
npm start
```
Acesse: **[http://localhost:3000](http://localhost:3000)**

---

## 🔒 Modelos de IA e Segurança de Chaves

- **Modelos Suportados:**
  - **Google Gemini:** `gemini-2.0-flash` (Padrão recomendado), `gemini-1.5-pro` (Long-Context de 2M tokens), `gemini-1.5-flash`.
  - **OpenAI:** `gpt-4o`, `gpt-4o-mini`.
  - **Groq:** `llama-3.3-70b-versatile`.
  - **Motor Especialista Local (Regras ADL ACME):** Opera offline mesmo sem chave de API informada.
- **Proteção:** As chaves de API nunca são expostas na tela nem salvas em texto puro desprotegido, operando com mascaramento no front-end.

---

## 📐 Os Três Paradoxos da LGPD vs. Contexto (CIn-UFPE)

1. **O Paradoxo da Inferência (Art. 6º, III - Necessidade):** A fusão simultânea de múltiplos sensores de baixo nível exige calibração estrita da Qualidade de Contexto (QoC) e justificativa técnica formal para cada sensor.
2. **O Paradoxo da Proatividade (Art. 6º, I e II - Finalidade):** O monitoramento passivo 24/7 em background é substituído por **Gatilhos Estritos de Ativação (Triggers)**.
3. **O Paradoxo do Largo Contexto e Nuvem Externa (Art. 33 e Art. 46):** O envio de janelas massivas para servidores internacionais de LLMs é prevenido por **sanitização na borda (Edge Computing)** com conversão para rótulos semânticos abstratos (ex: `'Zona_Comercial'`) e descarte imediato da memória RAM (Zero-Storage).

---

## 📄 Exportação do Relatório RIPD

O botão **"Exportar RIPD (Art. 6º, X)"** compila na hora um arquivo Markdown pronto para auditoria da ANPD e apresentação acadêmica.
