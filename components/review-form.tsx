'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Share2 } from 'lucide-react';
import { UserFormData } from './user-form';
import { OpinionFormData } from './opinion-form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { ScrollArea } from './ui/scroll-area';
import { useRouter } from 'next/navigation';

export const reviewSubmitFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.string().min(1, 'Please select your gender'),
  birth: z.string().min(1, 'Please select your birth'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  opinion: z.string().min(50, '의견은 최소 50자 이상이어야 합니다.'),
  personalAgreement: z.boolean().refine((data) => data === true, {
    message: '개인정보 수집 및 이용에 동의해야 합니다.',
  }),
});

export type ReviewSubmitFormData = z.infer<typeof reviewSubmitFormSchema>;

export function ReviewForm({ form, onSubmit, id, context }: { form: UseFormReturn<ReviewSubmitFormData>, onSubmit: (values: ReviewSubmitFormData) => Promise<void>, id: string, context: ReviewSubmitFormData }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function _onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      onSubmit(values).then(() => {
        toast({
          title: '제출 완료!',
          description: '제출이 완료되었습니다.',
        });
        router.push('/');
      });
    } catch (error) {
      toast({
        title: '제출 실패',
        description: '제출에 실패했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 flex flex-col">
      <ScrollArea className="flex-1">
        <div>
          <h3 className="font-semibold">제출 정보</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <span className="text-sm text-muted-foreground">이름</span>
              <p>{context.name}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">성별</span>
              <p>{context.gender}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">생년월일</span>
              <p>{context.birth}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">거주지</span>
              <p>{context.address}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">의견</h3>
          <ScrollArea className="mt-2 max-h-40 overflow-y-auto">
            <p className="whitespace-pre-wrap">{context.opinion}</p>
          </ScrollArea>
        </div>
      </ScrollArea>
      <form id={id} onSubmit={_onSubmit}>
        <input type="hidden" name="url" value={window.location.href} />
      </form>

      <div className="flex justify-between">
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              navigator.share({
                title: 'My Opinion Submission',
                text: context.opinion,
                url: window.location.href,
              }).catch(() => {
                toast({
                  description: '공유하기가 지원되지 않는 기기입니다.',
                });
              });
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            공유하기
          </Button>
        </div>
      </div>
    </div>
  );
}