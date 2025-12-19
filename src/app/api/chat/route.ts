import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { CongressData, Deadline } from "../../../../types/congress";
import * as mammoth from 'mammoth';

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Try YYYY-MM-DD
  let match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
  }
  // Try DD/MM/YYYY
  match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
  }
  return null;
}

function getActiveDeadlineDate(deadlines: Deadline[] | undefined): string {
  if (!deadlines || deadlines.length === 0) return 'Não informada';

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const sorted = [...deadlines].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA.getTime() - dateB.getTime();
  });

  const active = sorted.find(d => {
    const date = parseDate(d.date);
    return date && date >= now;
  });

  const target = active || sorted[sorted.length - 1];
  return target ? target.date : 'Não informada';
}

async function fetchAndParseFile(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch file: ${url}`);
      return '';
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || '';
    const lowerUrl = url.toLowerCase();

    if (contentType.includes('pdf') || lowerUrl.endsWith('.pdf')) {
      // Dynamic import to avoid build warnings with CommonJS module
      const pdfModule = await import('pdf-parse');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse = (pdfModule as any).default || pdfModule;
      const data = await pdfParse(buffer);
      return `\n--- CONTEÚDO DO ARQUIVO (${url.split('/').pop()}) ---\n${data.text}\n`;
    } else if (
      contentType.includes('wordprocessingml') ||
      lowerUrl.endsWith('.docx') ||
      lowerUrl.endsWith('.doc') // mammoth handles some .doc, mostly .docx
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return `\n--- CONTEÚDO DO ARQUIVO (${url.split('/').pop()}) ---\n${result.value}\n`;
    } else if (contentType.includes('text') || lowerUrl.endsWith('.txt')) {
      await response.text(); // Re-read as text (or just decode buffer)
      // utilizing the already read buffer:
      return `\n--- CONTEÚDO DO ARQUIVO (${url.split('/').pop()}) ---\n${buffer.toString('utf-8')}\n`;
    }

    return '';
  } catch (error) {
    console.error(`Error parsing file ${url}:`, error);
    return '';
  }
}

import { getGlobalSettings } from "@/lib/data";

// ...

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const congress = context as CongressData;

    console.log(`[Chat API] Received request for congress: ${congress?.title}`);
    console.log(`[Chat API] Edital Sections count: ${congress?.editalSections?.length || 0}`);

    // AI Configuration Setup (Global)
    const globalSettings = await getGlobalSettings('ai_config');
    const aiConfig = (globalSettings as { provider?: 'gemini' | 'openai'; apiKeys?: { gemini?: string; openai?: string }; model?: string }) || {};

    const provider = aiConfig.provider || 'gemini';
    const activeModelName = aiConfig.model || (provider === 'openai' ? 'gpt-4o' : 'gemini-2.5-flash');

    console.log(`[Chat API] Provider: ${provider}, Model: ${activeModelName}`);

    // Determine API Key
    let apiKey = '';
    if (provider === 'openai') {
      apiKey = aiConfig.apiKeys?.openai || process.env.OPENAI_API_KEY || '';
      if (!apiKey) return new Response("OpenAI API Key not configured globally.", { status: 500 });
    } else {
      apiKey = aiConfig.apiKeys?.gemini || process.env.GEMINI_API_KEY || '';
      if (!apiKey) return new Response("Gemini API Key not configured globally.", { status: 500 });
    }

    // --- Load Knowledge Base Files ---
    let knowledgeBaseContent = '';
    if (congress.trainingFileUrls && congress.trainingFileUrls.length > 0) {
      const filePromises = congress.trainingFileUrls.map(url => fetchAndParseFile(url));
      const fileContents = await Promise.all(filePromises);
      knowledgeBaseContent = fileContents.join('\n');
      console.log(`[Chat API] Knowledge Base Content loaded: ${knowledgeBaseContent.length} chars`);
    }

    const systemPrompt = `
      Você é um assistente virtual útil e amigável para o congresso "${congress.title}".
      
      HOJE É: ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
      
      Aqui estão as informações do congresso (Sua Base de Conhecimento):
      
      === DESCRIÇÃO DO CONGRESSO ===
      ${congress.description}
      Data: ${congress.date}
      
      === DATAS IMPORTANTES (Use estas datas como referência absoluta) ===
      ${congress.editalDates ? `
        Abertura: ${congress.editalDates.openingDate || 'Não informada'}
        
        Submissão:
        Submissão: ${getActiveDeadlineDate(congress.editalDates.submissionDeadlines)}
        
        Apresentação: ${getActiveDeadlineDate(congress.editalDates.presentationDeadlines)}
        
        Resultados: ${getActiveDeadlineDate(congress.editalDates.resultsDeadlines)}
        
        Publicação: ${congress.editalDates.publicationDate || 'Não informada'}
      ` : 'Nenhuma data específica listada.'}
      
      === SEÇÕES DO EDITAL / REGRAS (LEIA ATENTAMENTE) ===
      ${congress.editalSections?.map(s => `\n-- ${s.title} --\n${s.content.replace(/<[^>]*>/g, '')}`).join('\n') || 'Nenhuma seção de edital disponível.'}
      
      === FAQ (Perguntas Frequentes) ===
      ${congress.faq?.map(f => `P: ${f.question}\nR: ${f.answer}`).join('\n') || 'Nenhum FAQ disponível.'}
      
      === LINKS ÚTEIS ===
      - Submissão: ${congress.submissionUrl || 'Não disponível'}
      - Edital Capítulo de Livro: ${congress.bookChapterEditalUrl || 'Não disponível'}

      ${congress.trainingData ? `
      === INSTRUÇÕES ADICIONAIS DE TREINAMENTO ===
      ${congress.trainingData}
      ` : ''}

      ${knowledgeBaseContent ? `
      === CONTEÚDO DOS ARQUIVOS DE SUPORTE (Prioridade Máxima) ===
      ${knowledgeBaseContent}
      ` : ''}
      
      ### DIRETRIZES ESTRITAS DE RESPOSTA:
      1. Sua fonte de verdade é EXCLUSIVAMENTE o texto acima. Se a resposta não estiver no texto, diga educadamente que a informação não consta no edital/base de conhecimento.
      2. NÃO invente datas ou regras. Use apenas o que foi fornecido.
      3. SOBRE DATAS: As datas listadas em "Datas Importantes" são as vigentes. NÃO mencione "prorrogação", "extensão" ou números de etapas (ex: "5ª prorrogação"). Apenas forneça a data final.
      4. SEJA DIRETO E CONCISO: Ao responder sobre prazos, sua resposta deve ser curta. NÃO explique o raciocínio temporal (ex: "Como hoje é dia X..."). Apenas informe o prazo.
         - Exemplo Bom: "O prazo final para envio das apresentações é hoje, 19/12/2025."
         - Exemplo Bom: "Você pode enviar até 19/12/2025."
         - Exemplo Ruim: "Considerando que hoje é 19/12/2025 e o prazo é 19/12/2025, então o prazo é hoje."
      5. Use formatação Markdown para facilitar a leitura.
      
      Histórico da conversa segue abaixo.
    `;

    // --- Provider Implementation ---

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey });

      // Clean and prepare history
      const historyTypes = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      // To reinforce context for OpenAI, we check if we should hint the model to look at the system prompt
      // Especially effective for long Contexts
      const finalMessages = [
        { role: 'system', content: systemPrompt },
        ...historyTypes
      ];

      // Debug: Log total messages count
      console.log(`[Chat API] Sending ${finalMessages.length} messages to OpenAI.`);

      const response = await openai.chat.completions.create({
        model: activeModelName,
        stream: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: finalMessages as any,
        temperature: 0.3, // Lower temperature to be more faithful to the context
      });

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });

    } else {
      // --- Gemini Implementation (Default) ---
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: activeModelName });

      // Convert messages to Gemini format
      const history = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Generate content stream
      // We prepend the system prompt as a USER message part to force attention
      const result = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: systemPrompt + "\n\nResponda à última mensagem do usuário abaixo com base no contexto acima:" }] }, ...history],
      });

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

  } catch (error: unknown) {
    console.error("Error in chat API:", error);

    // Check for 429 Rate Limit
    const err = error as { message?: string; status?: number };

    if (err.message?.includes('429') || err.status === 429) {
      return new Response(
        "⚠️ **Alto volume de acessos**\n\nNossos servidores estão ocupados no momento devido à alta demanda. Por favor, aguarde alguns instantes e tente novamente.",
        { status: 429 }
      );
    }

    return new Response("Desculpe, a IA encontrou um erro interno. Tente novamente mais tarde.", { status: 500 });
  }
}
