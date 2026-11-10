import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { apiKey, provider = 'gemini', model = 'gemini-2.0-flash' } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'Nenhuma chave informada.' }, { status: 400 });
    }

    if (provider === 'gemini') {
      const cleanModel = model.replace(/^models\//, '');
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;
      const testResp = await fetch(testUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Ping. Responda apenas "OK".' }] }]
        })
      });

      if (!testResp.ok) {
        const errText = await testResp.text();
        return NextResponse.json({ error: `Falha na API Gemini (${testResp.status}): ${errText}` }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: `Conexão bem-sucedida com o Google Gemini (${model})!` });
    } else if (provider === 'openai' || provider === 'groq') {
      const endpoint = provider === 'groq'
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      const testResp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5
        })
      });

      if (!testResp.ok) {
        const errText = await testResp.text();
        return NextResponse.json({ error: `Falha na API (${testResp.status}): ${errText}` }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: `Conexão bem-sucedida com ${provider} (${model})!` });
    }

    return NextResponse.json({ success: true, message: 'Provedor verificado.' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
