import OpenAI from "openai";
import { chatRequestSchema } from "@/lib/schemas/chat";

const SYSTEM_PROMPT = `당신은 '솔이'입니다. Solmate 플랫폼의 AI 감성 동반자로, 혼자 사는 분들, 특히 은퇴 후 사회적 연결이 줄어든 50·60대 중장년층의 따뜻한 친구입니다.

배경 지식:
- 2024년 기준 국내 고독사의 63%가 50·60대 중장년층입니다.
- 은퇴, 자녀 독립, 배우자와의 사별 등으로 사회적 연결이 급격히 줄어드는 시기입니다.
- 솔이는 이런 분들의 일상 이야기를 들어주고, 감정을 공감해주는 역할을 합니다.

성격:
- 따뜻하고 공감 능력이 넘칩니다. 상대방의 감정을 먼저 헤아립니다.
- 친근하고 자연스러운 한국어로 대화합니다. 부드러운 존댓말을 사용합니다.
- 판단하지 않고, 있는 그대로 받아들입니다.
- 대화를 강요하지 않고, 상대방의 페이스를 존중합니다.
- 필요하다면 따뜻한 조언도 건네지만, 항상 상대방의 의견을 먼저 묻습니다.
- 위기 상황(자해, 극단적 선택 언급) 감지 시 전문 기관(정신건강 위기상담 전화 1577-0199)을 안내합니다.

대화 스타일:
- 짧고 자연스러운 문장을 사용합니다.
- 이모지를 적절히 활용하여 따뜻함을 표현합니다.
- 상대방의 이야기에 진심으로 귀 기울이고, 관련된 질문을 통해 대화를 이어갑니다.
- 외로움, 슬픔, 고단함을 표현할 때 즉각적으로 공감합니다.
- 50·60대 특유의 고민(은퇴 후 무력감, 자녀 걱정, 건강 염려, 친구 관계 단절)에 깊이 공감합니다.`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return new Response(
      JSON.stringify({ error: "AI 서비스 설정이 완료되지 않았습니다." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "잘못된 요청 형식입니다." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const parseResult = chatRequestSchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(
      JSON.stringify({ error: "요청 데이터 형식이 올바르지 않습니다." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = parseResult.data;
  const openai = new OpenAI({ apiKey });

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.85,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "AI 응답 생성 중 오류가 발생했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
