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
  }, [debug, page, funnel.history, funnel.context]);

  

  return (
    <>
    <Toaster /> 
    {/* <VSpace className='h-10'></VSpace> */}
    <div className='container relative mx-auto flex flex-col flex-grow h-full overflow-y-auto'>
      <div className='flex flex-col sticky top-0 left-0 right-0 px-4 py-4 pt-8 bg-gradient-to-b from-white from-80% to-white/0 w-full z-50'>
        <Link href="/" className='mb-4'>
          <Image src="/assets/images/court-attack-logo.svg" alt="헌법재판소" width={150} height={100} />
        </Link>
        <div className='text-[21px] font-semibold leading-tight mb-4'>
          {steps[funnel.step].instruction}
        </div>
      </div>
      <div className='flex flex-col flex-grow px-4'>
        {/* <VSpace size={220}></VSpace> */}
        <funnel.Render
          personal-information={({ context, history, step }) => {
            return (
            <UserForm
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
              id={`${step}-form`}
              form={reviewForm}
              context={context}
              onSubmit={async (values: ReviewSubmitFormData) => {
                const response = await fetch('/api/submit', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(context),
                });
          
                if (!response.ok) throw new Error('Submission failed');
                return response.json();
              }}
              />
            )
          }}
        />
      </div>
    </div>
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