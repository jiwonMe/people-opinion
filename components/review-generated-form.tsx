'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Textarea } from './ui/textarea';
import { useEffect, useState } from 'react';
import { generateOpinion } from './generateOpinion';

export const reviewGeneratedFormSchema = z.object({
  opinion: z.string().min(50, '의견은 최소 50자 이상이어야 합니다.'),
});

export type ReviewGeneratedFormData = z.infer<typeof reviewGeneratedFormSchema>;

export const ReviewGeneratedForm = ({ form, onSubmit, id, context }: { form: UseFormReturn<ReviewGeneratedFormData>, onSubmit: (values: ReviewGeneratedFormData) => void, id: string, context: {
  wannabe: string;
  reason: string;
  name: string;
  address: string;
  birth: string;
  gender: string;
} }) => {

  const { wannabe, reason, name, address, birth, gender } = context;

  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');


  useEffect(() => {
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

  if (status === 'LOADING' || status === 'IDLE') {
    return (
      <div className="flex items-center justify-center h-full">
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
        의견서를 생성하고 있어요
      </div>
    );
  }

  return (
    status === 'SUCCESS' ? (
    <Form {...form}>
      <form 
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
                  className="h-[450px] resize-none flex-grow text-[16px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  ) : (
    <div>Error</div>
  ))
}