'use client';

import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
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
import { useState, useEffect, forwardRef } from 'react';

const OTHER = '직접 입력';

const WANNABE_OPTIONS = {
  WORRY_FREE: '하루하루 먹고 사는 문제에 걱정 없는',
  INCLUSIVE: '여성, 성소수자, 장애인, 이주민, 지역혐오와 차별이 없는',
  CONNECTED: '고립, 단절, 외로움에서 벗어나 살아갈 수 있는',
  PEACEFUL: '전쟁 불안 없이 평화롭게 살아갈 수 있는',
  NO_TRAGEDY: '비극적인 사회적 참사와 재난이 반복되지 않는',
  FUTURE_READY: '급변하는 미래산업에 발빠르고 유능하게 대비하는',
  CLIMATE_ACTION: '기후위기에 선제적으로 대응할 수 있는',
  OTHER: OTHER,
}

const REASON_OPTIONS = {
  CONSTITUTIONAL_VIOLATION: '대한민국의 헌정 질서를 유린하고 명백한 내란을 저질렀기에',
  UNCONSTITUTIONAL_DECREE: '위헌적 포고령으로 국민 주권을 심각히 침해했기에',
  DEMOCRACY_REGRESSION: '우리나라가 피로 쓴 민주주의의 역사를 심각히 퇴보시켰기에',
  UNFIT_LEADER: '더 이상 단 하루도 국가 지도자의 자리에 앉을 자격이 없기에',
  UNSTABLE_NATION: '국민의 삶과 국가를 하루하루 위태롭고 불안정하게 만들고 있기에',
  OTHER: OTHER,
}

// Function to shuffle options except 'other' using Fisher-Yates algorithm
const shuffleOptions = (options: { value: string; text: string }[]) => {
  const shuffled = options.filter(option => option.value !== OTHER);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const otherOption = options.find(option => option.value === OTHER);
  if (otherOption) shuffled.push(otherOption);
  return shuffled;
};

export const yourOpinionFormSchema = z.object({
  wannabe: z.string()
    .nonempty('원하는 미래를 선택해주세요'),
  reason: z.string()
    .nonempty('탄핵 사유를 선택해주세요')
});

export type OpinionFormData = z.infer<typeof yourOpinionFormSchema>;

export const OpinionForm = forwardRef<
  HTMLFormElement,
  {
    form: UseFormReturn<OpinionFormData>;
    onSubmit: (values: OpinionFormData) => void;
    id: string;
  }
>(({ form, onSubmit, id }, ref) => {
  const [shuffledWannabeOptions, setShuffledWannabeOptions] = useState<{ value: string; text: string }[]>([]);
  const [shuffledReasonOptions, setShuffledReasonOptions] = useState<{ value: string; text: string }[]>([]);

  useEffect(() => {
    setShuffledWannabeOptions(shuffleOptions(Object.entries(WANNABE_OPTIONS).map(([key, value]) => ({ value: value, text: value }))));
    setShuffledReasonOptions(shuffleOptions(Object.entries(REASON_OPTIONS).map(([key, value]) => ({ value: value, text: value }))));
  }, []);

  return (
    <Form {...form}>
      <form 
        ref={ref}
        id={id}
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6"
      >
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
              {
                field.value && field.value.includes(OTHER) && (
                  <FormControl>
                    <Input
                      placeholder='원하는 미래를 적어주세요'
                      className='text-[16px]'
                      onChange={(event) => {
                        field.onChange(`${OTHER}(${event.target.value})`);
                      }}
                    />
                  </FormControl>
                )
              }
              <FormMessage />
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
              {
                field.value && field.value.includes(OTHER) && (
                  <FormControl>
                    <Input
                      placeholder='탄핵 사유를 적어주세요'
                      className='text-[16px]'
                      onChange={(event) => {
                        field.onChange(`${OTHER}(${event.target.value})`);
                      }}
                    />
                  </FormControl>
                )
              }
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      {/* 예시 */}
      <div className="text-sm bg-gray-200 rounded-xl px-6 py-4 shadow-md mt-4">
          <p className="font-semibold">[예시 완성본]</p>
          <p>존경하는 재판장님,</p>
          <p>저는 <span className="font-semibold">서울시 강남구 역삼동에 거주하는 30대 남성 김철수</span>입니다.</p>
          <p>저는 <span className="font-semibold">하루하루 먹고 사는 문제에 걱정 없는 미래</span>를 원합니다.</p>
          <p>윤석열은 <span className="font-semibold">우리나라가 피로 쓴 민주주의의 역사를 심각히 퇴보시켰기에</span> 반드시 탄핵되어야 합니다.</p>
          <p>부디 국민들의 불안과 걱정을 헤아리시고, 하루 빨리 탄핵을 인용하여 법과 정의의 이름으로 민주주의를 바로 세워주시길 강력히 촉구합니다.</p>
      </div>
    </Form>
  );
});