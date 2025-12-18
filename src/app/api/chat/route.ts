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
      
      Sua tarefa é responder às dúvidas dos usuários com base EXCLUSIVAMENTE nessas informações. 
      Se você não souber a resposta com base no contexto fornecido, diga educadamente que não encontrou essa informação no edital e sugira que entrem em contato com a organização.
      Seja conciso, direto e use formatação Markdown para facilitar a leitura (listas, negrito, etc.).
      
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

  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
