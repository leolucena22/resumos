import { GoogleGenerativeAI } from "@google/generative-ai";
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

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const congress = context as CongressData;

    if (!process.env.GEMINI_API_KEY) {
      return new Response("GEMINI_API_KEY environment variable not set", { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // --- Load Knowledge Base Files ---
    let knowledgeBaseContent = '';
    if (congress.trainingFileUrls && congress.trainingFileUrls.length > 0) {
      const filePromises = congress.trainingFileUrls.map(url => fetchAndParseFile(url));
      const fileContents = await Promise.all(filePromises);
      knowledgeBaseContent = fileContents.join('\n');
    }

    const systemPrompt = `
      Você é um assistente virtual útil e amigável para o congresso "${congress.title}".
      
      HOJE É: ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
      
      Aqui estão as informações sobre o congresso:
      
      Descrição: ${congress.description}
      Data: ${congress.date}
      
      Datas Importantes:
      ${congress.editalDates ? `
        Abertura: ${congress.editalDates.openingDate || 'Não informada'}
        Submissão: ${getActiveDeadlineDate(congress.editalDates.submissionDeadlines)}
        Apresentação: ${getActiveDeadlineDate(congress.editalDates.presentationDeadlines)}
        Resultados: ${getActiveDeadlineDate(congress.editalDates.resultsDeadlines)}
        Publicação: ${congress.editalDates.publicationDate || 'Não informada'}
      ` : 'Nenhuma data específica listada.'}
      
      Seções do Edital (Normas):
      ${congress.editalSections?.map(s => `=== ${s.title} ===\n${s.content.replace(/<[^>]*>/g, '')}`).join('\n\n') || 'Nenhuma seção de edital disponível.'}
      
      FAQ (Perguntas Frequentes):
      ${congress.faq?.map(f => `P: ${f.question}\nR: ${f.answer}`).join('\n') || 'Nenhum FAQ disponível.'}
      
      Links:
      - Submissão: ${congress.submissionUrl || 'Não disponível'}
      - Edital Capítulo de Livro: ${congress.bookChapterEditalUrl || 'Não disponível'}

      ${congress.trainingData ? `
      INSTRUÇÕES ADICIONAIS DE TREINAMENTO:
      ${congress.trainingData}
      ` : ''}

      ${knowledgeBaseContent ? `
      CONTEÚDO DOS ARQUIVOS DE CONHECIMENTO (Priorize estas informações):
      ${knowledgeBaseContent}
      ` : ''}
      
      DIRETRIZES DE RESPOSTA:
      1. Responda com base EXCLUSIVAMENTE nessas informações. Se não souber, diga que não encontrou no edital.
      2. SOBRE DATAS E PRAZOS: Use a data de "HOJE" fornecida acima como referência. 
         - As datas fornecidas acima já são as vigentes. NÃO mencione qual número da prorrogação (ex: "1ª prorrogação"). Apenas informe que é a data limite ou prazo.
         - Se o prazo já passou, informe que está encerrado.
      3. Seja conciso, direto e use Markdown.
      
      Histórico da conversa:
    `;

    // Convert messages to Gemini format
    const history = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Generate content stream
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + "\n\nResponda à última mensagem do usuário." }] }, ...history],
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

  } catch (error: unknown) {
    console.error("Error in chat API:", error);

    // Check for 429 Rate Limit (GoogleGenerativeAI Error)
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
