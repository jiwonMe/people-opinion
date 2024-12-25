'use client';

import { useRef, useState } from 'react';
import { personalInformationFormSchema, UserForm, UserFormData } from '@/components/user-form';
import { OpinionForm, OpinionFormData, yourOpinionFormSchema } from '@/components/opinion-form';
import { ReviewForm } from '@/components/review-form';
import Link from 'next/link';
import { CTAButton } from '@/components/ui/cta-button';
import { VSpace } from '@/components/ui/vspace';
import { cn } from '@/lib/utils';
import { createFunnelSteps, useFunnel, UseFunnelOptions, UseFunnelResults } from '@use-funnel/browser';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Add dynamic rendering configuration
export const dynamic = 'force-dynamic';

const reviewSubmitFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.string().min(1, 'Please select your gender'),
  birth: z.string().min(1, 'Please select your birth'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  personalAgreement: z.boolean().refine((data) => data === true, {
    message: '개인정보 수집 및 이용에 동의해야 합니다.',
  }),
});


type PersonalInformation = z.infer<typeof personalInformationFormSchema>;

type YourOpinion = z.infer<typeof yourOpinionFormSchema>;

type ReviewSubmit = z.infer<typeof reviewSubmitFormSchema>;

type StepContextMap = {
  'personal-information': PersonalInformation,
  'your-opinion': YourOpinion,
  'review-submit': ReviewSubmit
}

type StepContext = Partial<PersonalInformation> & Partial<YourOpinion> & Partial<ReviewSubmit>;



const funnelSteps = createFunnelSteps<StepContext>()
  .extends('personal-information', {
    requiredKeys: ['name', 'gender', 'birth', 'address', 'personalAgreement']
  })
  .extends('your-opinion', {
    requiredKeys: ['wannabe', 'reason']
  })
  .extends('review-submit', {
    requiredKeys: ['name', 'gender', 'birth', 'address', 'personalAgreement', 'wannabe', 'reason']
  })
  .build();


export default function SubmitPage() {

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

  const reviewForm = useForm({
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
    'review-submit': {
      id: 3,
      name: 'Review & Submit',
      instruction: (<p>작성한 내용을 검토하고<br />제출해주세요</p>),
    },
  }

  return (
    <>
    <VSpace className='h-10'></VSpace>
    <div className='container mx-auto px-4 py-8 pt-14 flex flex-col flex-grow'>
      <Link href="/" className='mb-4'>
        <Image src="/assets/images/court-attack-logo.svg" alt="헌법재판소" width={150} height={100} />
      </Link>
      <div className='text-[21px] font-semibold leading-tight mb-4'>
        {steps[funnel.step].instruction}
      </div>
      {/* <Steps steps={steps} currentStep={step} /> */}

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
              history.push('review-submit', {
                ...context,
                ...values,
              });
            }} />
          )
        }}
        review-submit={({ context, history }) => {
          return (
            <div>
              {JSON.stringify(context)}
            </div>
          )
        }}
      />
    
      
    </div>
    <div id="cta-button-container" className={cn(
      "w-full px-4 py-8 flex items-center justify-center space-x-2",
      // "bg-gradient-to-t from-white to-white/0",
    )}>
      {
        funnel.step !== 'personal-information' && (
          <CTAButton onClick={() => {
            funnel.history.back();
          }}
          className='w-1/3 bg-[#EAECF1] hover:bg-[#EAECF1]/90 text-black rounded-[14px]'
          >
            이전
          </CTAButton>
        )
      }
      <CTAButton type="submit" form={`${funnel.step}-form`}>
        다음
      </CTAButton>
    </div>
    </>
  );
}