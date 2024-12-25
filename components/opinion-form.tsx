'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';

// Constants for select options
const WANNABE_OPTIONS = [
  { value: 'worry-free', text: '하루하루 먹고 사는 문제에 걱정 없는' },
  { value: 'inclusive', text: '여성, 성소수자, 장애인, 이주민, 지역혐오와 차별이 없는' },
  { value: 'connected', text: '고립, 단절, 외로움에서 벗어나 살아갈 수 있는' },
  { value: 'peaceful', text: '전쟁 불안 없이 평화롭게 살아갈 수 있는' },
  { value: 'no-tragedy', text: '비극적인 사회적 참사와 재난이 반복되지 않는' },
  { value: 'future-ready', text: '급변하는 미래산업에 발빠르고 유능하게 대비하는' },
  { value: 'climate-action', text: '기후위기에 선제적으로 대응할 수 있는' },
  { value: 'other', text: '직접 입력' },
];

const REASON_OPTIONS = [
  { value: 'constitutional-violation', text: '대한민국의 헌정 질서를 유린하고 명백한 내란을 저질렀기에' },
  { value: 'unconstitutional-decree', text: '위헌적 포고령으로 국민 주권을 심각히 침해했기에' },
  { value: 'democracy-regression', text: '우리나라가 피로 쓴 민주주의의 역사를 심각히 퇴보시켰기에' },
  { value: 'unfit-leader', text: '더 이상 단 하루도 국가 지도자의 자리에 앉을 자격이 없기에' },
  { value: 'unstable-nation', text: '국민의 삶과 국가를 하루하루 위태롭고 불안정하게 만들고 있기에' },
  { value: 'other', text: '직접 입력' },
];

// Function to shuffle options except 'other' using Fisher-Yates algorithm
const shuffleOptions = (options: { value: string; text: string }[]) => {
  const shuffled = options.filter(option => option.value !== 'other');
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const otherOption = options.find(option => option.value === 'other');
  if (otherOption) shuffled.push(otherOption);
  return shuffled;
};

export const yourOpinionFormSchema = z.object({
  wannabe: z.string().min(1, '원하는 미래를 선택해주세요'),
  reason: z.string().min(1, '탄핵 사유를 선택해주세요'),
});

export type OpinionFormData = z.infer<typeof yourOpinionFormSchema>;

export const OpinionForm = ({ form, onSubmit, id }: { form: UseFormReturn<OpinionFormData>, onSubmit: (values: OpinionFormData) => void, id: string }) => {
  const [shuffledWannabeOptions, setShuffledWannabeOptions] = useState<{ value: string; text: string }[]>([]);
  const [shuffledReasonOptions, setShuffledReasonOptions] = useState<{ value: string; text: string }[]>([]);

  useEffect(() => {
    setShuffledWannabeOptions(shuffleOptions(WANNABE_OPTIONS));
    setShuffledReasonOptions(shuffleOptions(REASON_OPTIONS));
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="wannabe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>원하는 미래</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="원하는 미래를 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shuffledWannabeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.text}</SelectItem>
                  ))}
                </SelectContent>
                </Select>
              <FormMessage />
              {
                field.value && field.value.includes('other') && (
                  <FormControl>
                    <Input
                      placeholder='원하는 미래를 적어주세요'
                      className='text-[16px]'
                      onChange={(event) => {
                        field.onChange({
                          ...event,
                          target: {
                            value: `other(${event.target.value})`
                          }
                        })
                      }}
                    />
                  </FormControl>
                )
              }
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>탄핵 사유</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="탄핵 사유를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {shuffledReasonOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.text}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormMessage />
              {
                field.value && field.value.includes('other') && (
                  <FormControl>
                    <Input
                      placeholder='탄핵 사유를 적어주세요'
                      className='text-[16px]'
                      onChange={(event) => {
                        field.onChange({
                          ...event,
                          target: {
                            value: `other(${event.target.value})`
                          }
                        })
                      }}
                    />
                  </FormControl>
                )
              }
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}