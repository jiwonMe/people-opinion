'use client';

import { useEffect, useRef, useState } from 'react';
import { personalInformationFormSchema, UserForm, UserFormData } from '@/components/user-form';
import { OpinionForm, OpinionFormData, yourOpinionFormSchema } from '@/components/opinion-form';
import { ReviewForm, ReviewSubmitFormData, reviewSubmitFormSchema } from '@/components/review-form';
import Link from 'next/link';
import { CTAButton } from '@/components/ui/cta-button';
import { VSpace } from '@/components/ui/vspace';
import { cn } from '@/lib/utils';
import { createFunnelSteps, useFunnel, UseFunnelOptions, UseFunnelResults } from '@use-funnel/browser';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReviewGeneratedForm, ReviewGeneratedFormData, reviewGeneratedFormSchema } from '@/components/review-generated-form';
import { generateOpinion } from '@/components/generateOpinion';
import { Toast, ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter, useSearchParams } from 'next/navigation';
// Add dynamic rendering configuration
export const dynamic = 'force-dynamic';




type PersonalInformation = z.infer<typeof personalInformationFormSchema>;

type YourOpinion = z.infer<typeof yourOpinionFormSchema>;

type ReviewSubmit = z.infer<typeof reviewSubmitFormSchema>;

type ReviewGenerated = z.infer<typeof reviewGeneratedFormSchema>;

type StepContextMap = {
  'personal-information': PersonalInformation,
  'your-opinion': YourOpinion,
  'review-generated': ReviewGenerated
  'review-submit': ReviewSubmit,
}

type StepContext = Partial<PersonalInformation> & Partial<YourOpinion> & Partial<ReviewSubmit> & Partial<ReviewGenerated>;



const funnelSteps = createFunnelSteps<StepContext>()
  .extends('personal-information', {
    requiredKeys: ['name', 'gender', 'birth', 'address', 'personalAgreement', 'phone', 'email']
  })
  .extends('your-opinion', {
    requiredKeys: ['wannabe', 'reason']
  })
  .extends('review-generated', {
    requiredKeys: ['opinion']
  })
  .extends('review-submit', {
    requiredKeys: ['name', 'gender', 'birth', 'address','wannabe', 'reason', 'personalAgreement', 'opinion', 'phone', 'email']
  })
  .build();


export default function SubmitPage() {
  const searchParams = useSearchParams();
  const debug = searchParams.get('debug');
  const page = searchParams.get('page');

  const router = useRouter();

  const funnel = useFunnel({
    id: 'personal-information',
    steps: funnelSteps,
    initial: {
      step: 'personal-information',
      context: {
        name: '',
        gender: '',
        birth: '',
        address: '',
        personalAgreement: false,
        phone: '',
        email: '',
      }
    }
  } satisfies UseFunnelOptions<StepContextMap>);

  const userForm = useForm<UserFormData>({
    resolver: zodResolver(personalInformationFormSchema),
    defaultValues: funnel.context
  });

  const opinionForm = useForm<OpinionFormData>({
    resolver: zodResolver(yourOpinionFormSchema),
    defaultValues: funnel.context
  });

  const reviewGeneratedForm = useForm<ReviewGeneratedFormData>({
    resolver: zodResolver(reviewGeneratedFormSchema),
    defaultValues: funnel.context
  });

  const reviewForm = useForm<ReviewSubmitFormData>({
    resolver: zodResolver(reviewSubmitFormSchema),
    defaultValues: funnel.context
  });

  const steps = {
    'personal-information': {
      id: 1,
      name: 'Personal Information',
      instruction: (<p>국민참여의견서를 작성하려면<br />다음 정보들이 필요해요</p>),
    },
    'your-opinion': {
      id: 2,
      name: 'Your Opinion',
      instruction: (<p>여러분이 원하는 미래와<br />윤석열의 탄핵 사유를 선택해주세요</p>),
    },
    'review-generated': {
      id: 3,
      name: 'Review Generated',
      instruction: (<p>생성된 초안을 검토하고<br />수정해주세요</p>),
    },
    'review-submit': {
      id: 4,
      name: 'Review & Submit',
      instruction: (<p>작성한 내용을 검토하고<br />제출해주세요</p>),
    },
  }

  // scroll 상태를 추적하기 위한 state 추가
  const [showScrollHint, setShowScrollHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // form ref들을 추가
  const formRefs = {
    'personal-information': useRef<HTMLFormElement>(null),
    'your-opinion': useRef<HTMLFormElement>(null),
    'review-generated': useRef<HTMLFormElement>(null),
    'review-submit': useRef<HTMLFormElement>(null),
  };

  useEffect(() => {
    // Container가 있을 경우 스크롤을 최상단으로 이동
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [funnel.step]); // funnel.step이 변경될 때마다 실행

  useEffect(() => {
    // 디버깅 모드에서 특정 페이지로 이동
    if (debug === 'true' && page) {
      if (steps[page as keyof typeof steps]) {
        funnel.history.push(page as keyof typeof steps, funnel.context);
      }
    }

    window.addEventListener('beforeunload', function (event) {
      event.returnValue = '';
      return 'Are you sure you want to leave?';
    });

    const container = containerRef.current;
    if (!container) return;

    /**
     * Scroll event handler
     * Container의 scroll 위치를 체크하여 hint 표시 여부를 결정
     */
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = container;
      // scroll이 끝까지 도달하지 않았을 때 hint 표시
      setShowScrollHint(scrollHeight - scrollTop - clientHeight > 20);
    };

    container.addEventListener('scroll', handleScroll);
    // 초기 로드시 scroll 상태 체크
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [debug, page, funnel.history, funnel.context]);

  useEffect(() => {
    // 현재 step의 form이 있을 경우 해당 form으로 scroll
    const currentForm = formRefs[funnel.step]?.current;
    if (currentForm) {
      currentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [funnel.step]); // funnel.step이 변경될 때마다 실행

  

  return (
    <>
    <Toaster /> 
    {/* <VSpace className='h-10'></VSpace> */}
    <div className='container relative mx-auto flex flex-col flex-grow h-full overflow-y-auto' ref={containerRef}>
      <div className='flex flex-col sticky top-0 left-0 right-0 px-4 py-4 pt-8 bg-gradient-to-b from-white from-80% to-white/0 w-full z-50'>
        <Link href="/" className='mb-2'>
          <Image src="/assets/images/court-attack-logo.svg" alt="헌법재판소" width={120} height={32} />
        </Link>
        <div className='text-[21px] font-semibold leading-tight mb-4'>
          {steps[funnel.step].instruction}
        </div>
      </div>
      <div className='flex flex-col flex-grow px-4 h-fit'>
        {/* <VSpace size={220}></VSpace> */}
        <funnel.Render
          personal-information={({ context, history, step }) => {
            return (
            <UserForm
            ref={formRefs['personal-information']}
            id={`${step}-form`}
            form={userForm}
            onSubmit={(values: UserFormData) => {
              history.push('your-opinion', {
                ...context,
                ...values,
                wannabe: '',
                reason: '',
              });
            }}
            />
          )}}
          your-opinion={({ context, history, step }) => {
            return (
              <OpinionForm
              ref={formRefs['your-opinion']}
              id={`${step}-form`}
              form={opinionForm}
              onSubmit={(values: OpinionFormData) => {
                console.log(values);
                history.push('review-generated', {
                  ...context,
                  ...values,
                  opinion: `test: ${values.wannabe} ${values.reason}`,
                });
              }} />
            )
          }}
          review-generated={({ context, history, step }) => {
            return (
              <ReviewGeneratedForm
              ref={formRefs['review-generated']}
              id={`${step}-form`}
              form={reviewGeneratedForm}
              onSubmit={(values: ReviewGeneratedFormData) => {
                history.push('review-submit', {
                  ...context,
                  ...values,
                });
              }}
              context={context}
              />
            )
          }}
          review-submit={({ context, history, step }) => {
            return (
              <ReviewForm
              ref={formRefs['review-submit']}
              id={`${step}-form`}
              form={reviewForm}
              context={context}
              onSubmit={async (values: ReviewSubmitFormData) => {
                try {
                  // session storage에 제출 데이터 저장
                  sessionStorage.setItem('submittedData', JSON.stringify(context));

                  const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ...context,
                      sessionId: sessionStorage.getItem('userId'),
                    }),
                  });

                  if (!response.ok) throw new Error('Submission failed');
                  
                  // API 호출 성공 후 finish 페이지로 이동
                  router.push('/finish');
                  return response.json();
                } catch (error) {
                  console.error('Submit error:', error);
                  throw error;
                }
              }}
              />
            )
          }}
        />
      </div>
    </div>

    {showScrollHint && (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 inline-block">
          <path d="M6 9l6 6 6-6"/>
        </svg>
        아래에 내용이 더 있어요
      </div>
    )}

    <div id="cta-button-container" className={cn(
      "w-full px-4 py-8 flex items-center justify-center space-x-2 fixed bottom-0 left-0 right-0 user-select-none pointer-events-none",
      // "bg-gradient-to-t from-white to-white/0",
    )}>
      {
        funnel.step !== 'personal-information' && (
          <CTAButton onClick={() => {
            funnel.history.back();
          }}
          className='w-1/3 bg-[#EAECF1] hover:bg-[#EAECF1]/90 text-black rounded-[14px] pointer-events-auto user-select-auto'
          >
            이전
          </CTAButton>
        )
      }
      <CTAButton type="submit" form={`${funnel.step}-form`}
          disabled={funnel.step === 'personal-information' && !userForm.formState.errors}
          className={cn(
            'pointer-events-auto user-select-auto',
            funnel.step === 'review-submit' && 'bg-[#00FF59] hover:bg-[#00FF59]/90 text-black text-lg font-bold',
          )}
      >
        {funnel.step === 'review-submit' ? '완료! 헌재로 보내기' : '다음'}
      </CTAButton>
    </div>
    </>
  );
}