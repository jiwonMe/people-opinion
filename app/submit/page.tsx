'use client';

import { useState } from 'react';
import { UserForm, UserFormData } from '@/components/user-form';
import { OpinionForm, OpinionFormData } from '@/components/opinion-form';
import { ReviewForm } from '@/components/review-form';
import { Card } from '@/components/ui/card';
import { Steps } from '@/components/steps';

// Add dynamic rendering configuration
export const dynamic = 'force-dynamic';

export default function SubmitPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData & OpinionFormData>({
    name: '',
    gender: '',
    birth: '2000-01-01',
    address: '',
    opinion: '',
    personalAgreement: false,
  });

  const steps = [
    { id: 1, name: 'Personal Information' },
    { id: 2, name: 'Your Opinion' },
    { id: 3, name: 'Review & Submit' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-6">
          {/* <Steps steps={steps} currentStep={step} /> */}
          
          {step === 1 && (
            <UserForm
              formData={formData}
              setFormData={(data: UserFormData) => setFormData(prevState => ({
                ...prevState,
                ...data
              }))}
              onNext={() => setStep(2)}
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
        </Card>
      </div>
    </div>
  );
}