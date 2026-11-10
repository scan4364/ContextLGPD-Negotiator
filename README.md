# ContextLGPD-Negotiator 🛡️
### Mediação entre Sistemas Sensíveis ao Contexto e a LGPD por meio da Engenharia de Requisitos de Software

> **Trabalho Acadêmico & Sistema de Software em Next.js**  
> **Autor:** Samuel Celso dos Anjos Neto  
> **Instituição:** Centro de Informática (CIn) — Universidade Federal de Pernambuco (UFPE), Recife – PE, Brasil.

---

## 📌 Visão Geral do Sistema

O **ContextLGPD-Negotiator** é um sistema completo em **Next.js (App Router)** projetado para operacionalizar a mediação entre a **Computação Sensível ao Contexto** (Dey, 2001; Abowd et al., 1999) e a **Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)** através da Engenharia de Requisitos de Software.

O sistema substitui o paradigma de *chat livre com IA* por uma **Tabela Interativa de Cenários de Usuário**:
1. O desenvolvedor/engenheiro especifica os cenários com as variáveis contextuais implícitas (Where, Who, When, What, Sensores, QoC e Gatilhos).
2. O motor agêntico de IA analisa os **3 Paradoxos** técnicos e jurídicos.
3. O sistema gera a especificação corrigida sob **Privacy by Design** (com amostragem na borda, degradação de granularidade de QoC e Zero-Storage em RAM) e a **Matriz de Comprovação Regulatória (Accountability — Art. 6º, X)**.

---

## 🚀 Como Enviar para o GitHub e Vercel

O projeto foi totalmente configurado e testado em **Next.js 16** com rotas serverless, sendo 100% compatível com a **Vercel** com zero esforço de configuração.

### Passo 1: Enviar para o GitHub
No seu terminal (na pasta do projeto), execute:
```bash
# 1. Renomear o branch para main
git branch -M main

# 2. Vincular ao seu repositório no GitHub (crie um repo vazio no github.com)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 3. Fazer o push dos arquivos
git push -u origin main
```

### Passo 2: Fazer o Deploy na Vercel
1. Acesse **[vercel.com](https://vercel.com)** e faça login com seu GitHub.
2. Clique em **"Add New..."** ➔ **"Project"**.
3. Selecione o repositório `contexto-computacional` e clique em **Import**.
4. O framework **Next.js** será detectado automaticamente.
5. (Opcional) Em **Environment Variables**, você pode adicionar:
   - `NEXT_PUBLIC_SUPABASE_URL`: sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sua chave anon do Supabase
6. Clique em **Deploy**! Em menos de 1 minuto seu sistema estará online no ar.

---

## 💻 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento Next.js
npm run dev

# Ou rodar a build de produção:
npm run build
npm start
```
Abra: **[http://localhost:3000](http://localhost:3000)**

---

## ☁️ Banco de Dados Online 24/7 (Supabase na Nuvem)

Para que os cenários permaneçam salvos o tempo todo na nuvem mesmo em ambientes serverless como a Vercel:
1. Crie um projeto gratuito no [Supabase](https://supabase.com).
2. Vá no **SQL Editor** do Supabase e cole o conteúdo do arquivo [`supabase_schema.sql`](supabase_schema.sql).
3. Na aplicação, clique em **"Chave API & Nuvem"** ➔ aba **"Banco Online (Supabase)"** e insira a URL e a Anon Key.
4. O sistema também possui um cofre local persistente para uso imediato mesmo sem internet!

---

## 🔒 Segurança Criptográfica e Modelos de IA Suportados

- **Modelos Compatíveis:**
  - **Google Gemini:** `gemini-2.0-flash` (Recomendado), `gemini-1.5-pro` (Long-Context de 2M tokens), `gemini-1.5-flash`.
  - **OpenAI:** `gpt-4o`, `gpt-4o-mini`.
  - **Groq:** `llama-3.3-70b-versatile`.
  - **Motor Especialista Local (Regras ADL ACME):** Opera offline caso nenhuma chave seja inserida de imediato.
- **Proteção:** As chaves de API nunca são expostas na tela nem salvas em texto puro desprotegido, operando com mascaramento no front-end.

---

## 📐 Os Três Paradoxos da LGPD vs. Contexto (CIn-UFPE)

1. **O Paradoxo da Inferência (Art. 6º, III - Necessidade):** A fusão simultânea de múltiplos sensores de baixo nível exige calibração estrita da Qualidade de Contexto (QoC) e justificativa técnica formal para cada sensor.
2. **O Paradoxo da Proatividade (Art. 6º, I e II - Finalidade):** O monitoramento passivo 24/7 em background é substituído por **Gatilhos Estritos de Ativação (Triggers)**.
3. **O Paradoxo do Largo Contexto e Nuvem Externa (Art. 33 e Art. 46):** O envio de janelas massivas para servidores internacionais de LLMs é prevenido por **sanitização na borda (Edge Computing)** com conversão para rótulos semânticos abstratos (ex: `'Zona_Comercial'`) e descarte imediato da memória RAM (Zero-Storage).

---

## 📄 Exportação do Relatório RIPD

O botão **"Exportar RIPD (Art. 6º, X)"** compila na hora um arquivo Markdown pronto para auditoria da ANPD e apresentação acadêmica.
