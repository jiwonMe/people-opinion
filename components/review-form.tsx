'use client';

import { forwardRef, useState } from 'react';
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
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { CTAButton } from './ui/cta-button';
import { VSpace } from './ui/vspace';

export const reviewSubmitFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.string().min(1, 'Please select your gender'),
  birth: z.string().min(1, 'Please select your birth'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  opinion: z.string().min(50, '의견은 최소 50자 이상이어야 합니다.'),
  wannabe: z.string().min(50, '원하는 세상은 최소 50자 이상이어야 합니다.'),
  reason: z.string().min(50, '원하는 이유는 최소 50자 이상이어야 합니다.'),
  personalAgreement: z.boolean().refine((data) => data === true, {
    message: '개인정보 수집 및 이용에 동의해야 합니다.',
  }),
});

export type ReviewSubmitFormData = z.infer<typeof reviewSubmitFormSchema>;

export const ReviewForm = forwardRef(({ form, onSubmit, id, context }: { form: UseFormReturn<ReviewSubmitFormData>, onSubmit: (values: ReviewSubmitFormData) => Promise<void>, id: string, context: ReviewSubmitFormData }, ref) => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  async function _onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      await onSubmit(values);
      sessionStorage.setItem('submissionStatus', 'completed');
      toast({
        title: '제출 완료!',
        description: '제출이 완료되었습니다.',
      });
      // setIsDrawerOpen(true);
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
      <div className="space-y-4">
          <div>
            <h3 className="font-semibold">제출 정보</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[
                { label: '이름', value: context.name },
                { label: '성별', value: context.gender },
                { label: '생년월일', value: context.birth },
                { label: '거주지', value: context.address },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>

        <div>
          <h3 className="font-semibold">의견</h3>
          <ScrollArea className="text-sm bg-gray-200 rounded-xl px-6 py-4 shadow-md mt-4">
            <p className="whitespace-pre-wrap">{context.opinion}</p>
          </ScrollArea>
        </div>
      </div>
      <form id={id} onSubmit={_onSubmit}>
        <input type="hidden" name="url" value={window.location.href} />
      </form>
      <VSpace size={80} />

      {/* <div className="flex justify-between">
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              navigator.share({
                title: '헌재로 보내자! - 국민참여의견서 제출하기',
                text: `헌재로 보내자! - 국민참여의견서 제출하기\n\n제가 원하는 세상은\n[${context.wannabe}]\n이고,\n\n윤석열은\n[${context.reason}]\n탄핵되어야합니다.\n\n 함께 헌재로 갑시다!\n\nhttps://attack.valid.or.kr`,
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
      </div> */}

      {/* <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent 
          className={cn(
            "w-full", 
            "max-w-lg"
          )}
        >
          <div 
            className={cn(
              "p-4", 
              "h-full", 
              "flex", 
              "flex-col", 
              "justify-center"
            )}
          >
            <h2 
              className={cn(
                "text-lg", 
                "font-bold"
              )}
            >
              제출 완료
            </h2>
            <p 
              className={cn(
                "text-sm", 
                "text-muted-foreground"
              )}
            >
              제출이 완료되었습니다. 함께 해주셔서 감사합니다.
            </p>
            <p 
              className={cn(
                "text-sm", 
                "text-muted-foreground"
              )}
            >
              이후 제출 내용은 헌재로 전달됩니다.
            </p>
            <p 
              className={cn(
                "text-sm", 
                "text-muted-foreground"
              )}
            >
              자세한 내용은 @valid.kr에서 확인해주세요.
            </p>
            <CTAButton
              onClick={() => {
                setIsDrawerOpen(false);
                router.push('/');
              }}
              className="w-full"
            >
              확인
            </CTAButton>
          </div>
        </DrawerContent>
      </Drawer> */}
    </div>
  );
});