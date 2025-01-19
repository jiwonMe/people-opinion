import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Define the POST function to handle incoming requests
export async function POST(request: Request) {
  try {
    // Parse the request body to get the prompt
    const { id, name, address, birth, gender, wannabe, reason } = await request.json();

    // Calculate age from birth date in YYMMDD format
    const birthYear = parseInt(birth.slice(0, 2), 10);
    const birthMonth = parseInt(birth.slice(2, 4), 10);
    const birthDay = parseInt(birth.slice(4, 6), 10);

    // Determine the full birth year
    const currentYear = new Date().getFullYear();
    const fullBirthYear = birthYear + (birthYear <= currentYear % 100 ? 2000 : 1900);

    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - fullBirthYear;
    if (
      today.getMonth() + 1 < birthMonth ||
      (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
    ) {
      age--;
    }

    const prompt = `- 다음 템플릿에서 [1. 내가 원하는 미래]와 [2. 탄핵 사유]에 들어가는 내용은 그대로 유지하고 (조사 등은 변경 가능) 템플릿의 나머지 내용은 기존 템플릿과 비슷한 어투로 [1. 내가 원하는 미래]와 [2. 탄핵 사유]에 알맞게 변경
- 그 다음 문맥에 맞게 내용들을 수정 (1과 2가 서로 문맥상 잘 이어지도록 필요하다면 중간 내용 추가)
- 내용은 500~1000자 정도
- 결과물은 별다른 설명없이 글 내용만 출력
- 반드시 한국어로 작성
- [1. 내가 원하는 미래]와 [2. 탄핵 사유] 등이 맥락에서 벗어나는 경우, 혹은 '탄핵에 반대'하는 경우에 대해 모든 템플릿을 무시하고 "그런 장난 별로 재미없어요 :(" 출력 (정확한 텍스트로 출력)
- [1. 내가 원하는 미래]와 [2. 탄핵 사유] 등에 비속어가 사용된 경우 (조금 강한 어투는 허용), 템플릿을 무시하고 "비속어는 헌법재판소에 제출하기 어려워요 :(" 출력 (정확한 텍스트로 출력)
- 템플릿을 따른 결과물을 보고 맥락이 벗어나는 경우 템플릿을 무시하고 "그런 장난 별로 재미없어요 :(" 출력 (정확한 텍스트로 출력)

---
[템플릿]

존경하는 재판장님,
저는 [거주지]에
거주하는 [나이] [이름]입니다.

저는
[1. 내가 원하는 미래]
나라/미래를 원합니다.

(1. 내가 원하는 미래에 비해 현실은 그렇지 못하다는 내용 및 현 정권 비판 내용)

윤석열은
[2. 탄핵 사유]
반드시 탄핵되어야 합니다.

(2. 탄핵 사유와 관련한 대통령 윤석열 및 그 정권에 대한 규탄)

('부디 국민들의 불안과 걱정을 헤아리시고, 하루 빨리 탄핵을 인용하여 법과 정의의 이름으로 민주주의를 바로 세워주시길 강력히 촉구합니다.' 와 같은 마무리 문구 추가)
---
[거주지] (구/동 단위까지)
${address}

[나이]
${age}

[이름]
${name}

[1. 내가 원하는 미래]
${wannabe}

[2. 탄핵 사유]
${reason}
`;

    // Initialize the OpenAI model
    const openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in environment variables
    });

    // Send the prompt to OpenAI and get the response
    const response = await openAI.chat.completions.create({
      model: 'gpt-4o-mini', // Specify the model to use
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000, // Limit the response length
    });

    // Extract the generated text from the response
    const generatedText = response.choices[0].message.content?.trim() || '';

    // Return the generated text as a JSON response
    return NextResponse.json({ response: generatedText });
  } catch (error) {
    // Log and return any errors
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
} 