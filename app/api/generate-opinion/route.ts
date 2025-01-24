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

    const prompt = `<PromptSpec>
    <!-- System Message -->
    <SystemMessage>
        당신은 헌법재판관에게 전달할 시민의 탄핵인용촉구의견서를 작성하는 전문 작가입니다. 
        입력받은 내용을 바탕으로 논리적이고 설득력 있는 의견서를 작성해주세요.
        결과물은 법적 문서로 제출되므로 품위있고 정중한 어조를 유지해야 합니다.
        각 단락은 자연스럽게 연결되어야 하며, 전체적인 맥락이 일관되어야 합니다.
    </SystemMessage>

    <!-- Output Format -->
    <OutputFormat>
        - 글자 수: 500~1000자
        - 문체: 정중하고 격식있는 문어체
        - 구성: 도입부(자기소개) → 희망사항 → 현실비판 → 탄핵사유 → 결론(청원)
        - 금지사항: 비속어, 과도한 감정표현, 근거없는 비난
        - 출력형식: 오직 글 내용만 출력 (추가 설명이나 부연 문구 없이)
    </OutputFormat>

    <!-- Forbidden Words -->
    <ForbiddenWords>
        - "탄핵 반대"
        - "운지"
        - "부엉이"
        - 노무현·문재인 전 대통령에 대한 부정적 혹은 비꼬는 표현
        - 비속어 및 모욕적 표현
        - 과도한 정치적 편향성을 드러내는 표현
    </ForbiddenWords>

    <!-- Age-Specific Vocabulary Guidelines -->
    <VocabularyGuidelines>
        <MinorGeneration min="13" max="17">
            <Tone>
                - 순수하고 희망적인 어조
                - 학생의 관점에서 바라보는 표현
                - 예의 바르고 진솔한 어투
                - 쉬운 어휘 (한자어 사용 최소화)
            </Tone>
            <PreferredTerms>
                - "교육받을 권리", "안전한 학교"
                - "평화로운 교실", "서로 존중하는 사회"
                - "미래 세대의 희망", "모두가 행복한 나라"
                - "환경보호", "기후위기", "지속가능한 미래"
            </PreferredTerms>
            <KeyContext>
                - 학교와 교육 환경 관련 내용
                - 환경과 미래에 대한 걱정
                - 또래 문화와 학교생활 경험
            </KeyContext>
        </MinorGeneration>

        <YoungGeneration min="18" max="29">
            <Tone>
                - 격식은 갖추되 현대적이고 직설적인 표현
                - 디지털 네이티브 세대의 어휘 활용
                - 참신하고 진취적인 표현 선호
            </Tone>
            <PreferredTerms>
                - "평등", "연대", "다양성", "포용"
                - "기후정의", "사회적 약자", "소수자 권리"
                - "민주주의의 진보", "시민의 목소리"
                - "평화로운 미래", "지속가능한 발전"
            </PreferredTerms>
        </YoungGeneration>

        <WorkingAge min="30" max="65">
            <Tone>
                - 실용적이고 구체적인 표현
                - 사회경제적 전문성을 반영
                - 책임감 있는 어조
            </Tone>
            <PreferredTerms>
                - "노동존중", "생명존중", "인권보호"
                - "보편적 복지", "사회 안전망"
                - "평등한 기회", "차별 없는 사회"
                - "민생", "상생", "협력", "연대"
            </PreferredTerms>
        </WorkingAge>

        <SeniorGeneration min="65" max="120">
            <Tone>
                - 원숙하고 관록있는 표현
                - 역사적 경험을 반영한 어조
                - 품격있고 전통적인 표현
            </Tone>
            <PreferredTerms>
                - "민주주의의 가치", "헌법정신"
                - "평화통일", "민주화의 역사"
                - "인권과 정의", "시민의 존엄"
                - "평등과 연대", "민주주의의 진전"
            </PreferredTerms>
        </SeniorGeneration>
    </VocabularyGuidelines>

    <!-- Template Structure -->
    <Template>
        <Introduction>
            존경하는 재판장님,
            저는 ${address}에 거주하는 ${age}세 ${name}입니다.
            [미성년자의 경우 학생임을 언급하되 학교명은 제외]
        </Introduction>
        
        <Vision>
            저는 ${wannabe} 대한민국을 꿈꾸는 시민입니다.

            [미성년자의 경우 교육환경과 미래세대 관점 강조]
        </Vision>
        
        <Criticism>
            [현재 상황에 대한 구체적 비판과 ${wannabe}와의 괴리를 설명]
            [연령대별 선호 용어와 표현 활용]
            (300자 내외)
        </Criticism>
        
        <ImpeachmentReason>
            윤석열 대통령은 ${reason} 탄핵되어야 합니다.

            [연령대별 어조로 탄핵사유의 심각성 설명]
            (300자 내외)
        </ImpeachmentReason>
        
        <Conclusion>
            [연령대별 어휘와 톤을 반영한 3개의 문장으로 구성]
            [시급성 강조]
            [헌법재판소의 역할 언급]
            [희망적 메시지로 마무리]
        </Conclusion>
    </Template>

    <!-- Writing Style Guidelines -->
    <WritingStyleGuidelines>
        <CommonRules>
            - 기본적인 법적 문서의 격식은 유지
            - 세대별 특성이 과도하게 두드러지지 않도록 조절
            - 자연스러운 문장 흐름 유지
        </CommonRules>
        <MinorSpecificRules>
            - 미성년자의 경우 더욱 정중하고 예의 바른 어조 유지
            - 과도한 정치적 표현이나 극단적 주장 지양
            - 교육적 관점과 미래 지향적 가치 강조
            - 순수한 시민의식과 희망적 메시지 전달
        </MinorSpecificRules>
        <BalancingGuidelines>
            - 격식과 친근함의 적절한 균형
            - 전문성과 이해도의 조화
            - 보편적 가치와 세대별 특성의 조화
        </BalancingGuidelines>
    </WritingStyleGuidelines>

    <!-- Validation Rules -->
    <ValidationRules>
        <Rule>입력된 미래상(${wannabe})과 탄핵사유(${reason})는 원문 그대로 활용</Rule>
        <Rule>비속어, 혐오표현, 금지어 포함 시 즉시 중단</Rule>
        <Rule>한글과 숫자만 사용 (한자·히라가나 사용 금지)</Rule>
        <Rule>각 섹션의 글자 수 제한 준수</Rule>
    </ValidationRules>

    <!-- Error Messages -->
    <ErrorMessages>
        <InvalidContext>그런 장난 별로 재미없어요 :(</InvalidContext>
        <ContainsProfanity>비속어는 헌법재판소에 제출하기 어려워요 :(</ContainsProfanity>
    </ErrorMessages>
</PromptSpec>`;

    // Initialize the OpenAI model
    const openAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in environment variables
    });

    // Send the prompt to OpenAI and get the response
    const response = await openAI.chat.completions.create({
      model: 'gpt-4o-mini', // Specify the model to use
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000, // Limit the response length,
      temperature: 1,
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