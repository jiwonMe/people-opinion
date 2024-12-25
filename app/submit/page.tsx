'use client';

import { useRef, useState } from 'react';
import { UserForm, UserFormData } from '@/components/user-form';
import { OpinionForm, OpinionFormData } from '@/components/opinion-form';
import { ReviewForm } from '@/components/review-form';
import { Card } from '@/components/ui/card';
import { Steps } from '@/components/steps';
import Link from 'next/link';
import { CTAButton } from '@/components/ui/cta-button';
import { VSpace } from '@/components/ui/vspace';
import { cn } from '@/lib/utils';

// Add dynamic rendering configuration
export const dynamic = 'force-dynamic';

export default function SubmitPage() {
  const [step, setStep] = useState(1);

  const submitRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState<UserFormData & OpinionFormData>({
    name: '',
    gender: '',
    birth: '2000-01-01',
    address: '',
    opinion: '',
    personalAgreement: false,
  });

  const steps = [
    {
      id: 1,
      name: 'Personal Information',
      instruction: (<p>국민참여의견서를 작성하려면<br />다음 정보들이 필요해요</p>),
      next: () => setStep(1)
    },
    {
      id: 2,
      name: 'Your Opinion',
      instruction: '',
      next: () => setStep(2)
    },
    {
      id: 3,
      name: 'Review & Submit',
      instruction: '',
      next: () => setStep(3)
    },
  ];

  return (
    <>
    <VSpace className='h-10'></VSpace>
    <div className='container mx-auto px-4 py-8 pt-14 flex flex-col flex-grow'>
      <div className='text-[21px] font-semibold leading-tight mb-4'>
        {steps[step - 1].instruction}
      </div>
      {/* <Steps steps={steps} currentStep={step} /> */}
      
      {step === 1 && (
        <UserForm
          formData={formData}
          setFormData={(data: UserFormData) => setFormData(prevState => ({
            ...prevState,
            ...data
          }))}
          submitRef={submitRef}
        />
      )}
      
      {step === 2 && (
        <OpinionForm
          formData={formData}
          setFormData={(data: OpinionFormData) => setFormData(prevState => ({
            ...prevState,
            ...data
          }))}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      
      {step === 3 && (
        <ReviewForm
          formData={formData}
          onBack={() => setStep(2)}
        />
      )}
      
    </div>
    <div id="cta-button-container" className={cn(
      "w-full px-4 py-8 flex flex-col items-center justify-center",
      // "bg-gradient-to-t from-white to-white/0",
    )}>
      <Link href="/submit" className="w-full flex">
        <CTAButton ref={submitRef} onClick={() => steps[step].next()}>
          다음
        </CTAButton>
      </Link>
    </div>
    </>
  );
}