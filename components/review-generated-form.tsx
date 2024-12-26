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
    return <div>Loading...</div>;
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