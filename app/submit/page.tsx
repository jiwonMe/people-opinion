'use client';

import { useRef, useState } from 'react';
import { personalInformationFormSchema, UserForm, UserFormData } from '@/components/user-form';
import { OpinionForm, OpinionFormData } from '@/components/opinion-form';
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



const yourOpinionFormSchema = z.object({
  opinion: z.string().min(10, 'Opinion must be at least 10 characters'),
});

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
    requiredKeys: ['opinion']
  })
  .extends('review-submit', {
    requiredKeys: ['name', 'gender', 'birth', 'address', 'personalAgreement', 'opinion']
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

  const [step, setStep] = useState(1);

  const userForm = useForm({
    resolver: zodResolver(personalInformationFormSchema),
    defaultValues: funnel.step === 'personal-information' ? funnel.context : undefined
  });

  const opinionForm = useForm({
    resolver: zodResolver(yourOpinionFormSchema),
    defaultValues: funnel.step === 'your-opinion' ? funnel.context : undefined
  });

  const reviewForm = useForm({
    resolver: zodResolver(reviewSubmitFormSchema),
    defaultValues: funnel.step === 'review-submit' ? {
      ...funnel.context,
      opinion: ''
    } : undefined
  });

  const steps = [
    {
      id: 1,
      name: 'Personal Information',
      instruction: (<p>국민참여의견서를 작성하려면<br />다음 정보들이 필요해요</p>),
    },
    {
      id: 2,
      name: 'Your Opinion',
      instruction: (<p>여러분이 원하는<br />세상은 어떤 모습인가요?</p>),
    },
    {
      id: 3,
      name: 'Review & Submit',
      instruction: '',
    },
  ];

  return (
    <>
    <VSpace className='h-10'></VSpace>
    <div className='container mx-auto px-4 py-8 pt-14 flex flex-col flex-grow'>
      <Link href="/" className='mb-4'>
        <Image src="/assets/images/court-attack-logo.svg" alt="헌법재판소" width={100} height={100} />
      </Link>
      <div className='text-[21px] font-semibold leading-tight mb-4'>
        {steps[step - 1].instruction}
      </div>
      {/* <Steps steps={steps} currentStep={step} /> */}

      <funnel.Render
        personal-information={({ context, history, step }) => {
          return (
          <UserForm
          id={`${step}-form`}
          form={userForm}
          onSubmit={(values: UserFormData) => {
            setStep(2);
            history.push('your-opinion', {
              ...context,
              opinion: '',
            });
          }}
          />
        )}}
        your-opinion={({ context, history }) => {
          return (
            <OpinionForm formData={context} setFormData={(data: OpinionFormData) => opinionForm.setValue('opinion', data.opinion)} onBack={() => setStep(1)} onNext={() => setStep(3)} />
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
      "w-full px-4 py-8 flex flex-col items-center justify-center",
      // "bg-gradient-to-t from-white to-white/0",
    )}>
      {/* <Link href="/submit" className="w-full flex"> */}
        <CTAButton type="submit" form={`${step}-form`}>
          다음
        </CTAButton>
      {/* </Link> */}
    </div>
    </>
  );
}