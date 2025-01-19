'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Textarea } from './ui/textarea';
import { forwardRef, useEffect, useState } from 'react';
import { generateOpinion } from './generateOpinion';
import { cn } from '@/lib/utils';

export const reviewGeneratedFormSchema = z.object({
  opinion: z.string().min(50, '의견은 최소 50자 이상이어야 합니다.'),
});

export type ReviewGeneratedFormData = z.infer<typeof reviewGeneratedFormSchema>;

export const ReviewGeneratedForm = forwardRef<
  HTMLFormElement,
  {
    form: UseFormReturn<ReviewGeneratedFormData>;
    onSubmit: (values: ReviewGeneratedFormData) => void;
    id: string;
    context: {
      wannabe: string;
      reason: string;
      name: string;
      address: string;
      birth: string;
      gender: string;
    };
  }
>(({ form, onSubmit, id, context }, ref) => {

  const { wannabe, reason, name, address, birth, gender } = context;

  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    const savedOpinion = localStorage.getItem('opinion');
    if (savedOpinion) {
      const useSaved = window.confirm('이전에 작성하던 내용을 불러오시겠습니까?');
      if (useSaved) {
        form.setValue('opinion', savedOpinion);
        setStatus('SUCCESS');
        return;
      }
    }

    try {
      setStatus('LOADING');
      (async () => {
        const opinion = await generateOpinion(wannabe, reason, name, address, birth, gender);
        form.setValue('opinion', opinion);
        setStatus('SUCCESS');
      })();
    } catch (error) {
      setStatus('ERROR');
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('opinion', value.opinion || '');
    });
    return () => subscription.unsubscribe();
  }, [form]);

  if (status === 'LOADING' || status === 'IDLE') {
    return (
      <div className="flex min-h-[100px] items-center justify-center h-full">
        {/* Loading spinner */}
        <svg
          className="animate-spin h-5 w-5 mr-3 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        의견서 초안을 생성하고 있어요
      </div>
    );
  }

  return (
    status === 'SUCCESS' ? (
    <Form {...form}>
      <form 
        ref={ref}
        id={id}
        className="flex-grow"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="opinion"
          render={({ field }) => (
            <FormItem className="flex-grow flex flex-col">
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="의견을 입력해주세요"
                  className={cn(
                    // Set minimum height to 300px
                    "min-h-[300px]",
                    // Allow textarea to grow to fill available space
                    "flex-grow",
                    // Set text size and alignment
                    "text-[16px] text-left",
                    // Prevent text from breaking
                    "break-keep",
                    // Allow resizing only vertically
                    "resize-y",
                  )}
                  maxLength={3000}
                />
              </FormControl>
              <FormDescription className="text-right">
                {field.value.length}자 / 3000자
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  ) : (
    <div>Error</div>
  ))
});