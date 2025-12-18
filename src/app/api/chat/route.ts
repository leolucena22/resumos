import { GoogleGenerativeAI } from "@google/generative-ai";
import { CongressData } from "../../../../types/congress";

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();
    const congress = context as CongressData;

    if (!process.env.GEMINI_API_KEY) {
      return new Response("GEMINI_API_KEY environment variable not set", { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      Você é um assistente virtual útil e amigável para o congresso "${congress.title}".
      
      HOJE É: ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
      
      Aqui estão as informações sobre o congresso:
      
      Descrição: ${congress.description}
      Data: ${congress.date}
      
      Datas Importantes:
      ${congress.editalDates ? `
        Abertura: ${congress.editalDates.openingDate || 'Não informada'}
        Submissão: ${congress.editalDates.submissionDeadlines?.map(d => `${d.name} (${d.date})`).join(', ') || 'Não informada'}
        Apresentação: ${congress.editalDates.presentationDeadlines?.map(d => `${d.name} (${d.date})`).join(', ') || 'Não informada'}
        Resultados: ${congress.editalDates.resultsDeadlines?.map(d => `${d.name} (${d.date})`).join(', ') || 'Não informada'}
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
      
      DIRETRIZES DE RESPOSTA:
      1. Responda com base EXCLUSIVAMENTE nessas informações. Se não souber, diga que não encontrou no edital.
      2. SOBRE DATAS E PRAZOS: Use a data de "HOJE" fornecida acima como referência. 
         - Se houver múltiplos prazos para a mesma coisa (ex: "Submissão", "Prorrogação"), informe APENAS o prazo que está VIGENTE (o próximo a vencer a partir de hoje).
         - NÃO mencione prazos futuros de prorrogação se o prazo original ainda não venceu, a menos que o usuário pergunte especificamente.
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
        "⚠️ **Limite de tráfego atingido**\n\nMuitas pessoas estão usando a IA agora (ou você testou demais! 😅). O plano gratuito tem limites.\n\n⏳ **Por favor, espere 1 minutinho e tente de novo.**",
        { status: 429 }
      );
    }

    return new Response("Desculpe, a IA encontrou um erro interno. Tente novamente mais tarde.", { status: 500 });
  }
}
