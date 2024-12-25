'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Textarea } from './ui/textarea';

export const reviewGeneratedFormSchema = z.object({
  opinion: z.string().min(50, '의견은 최소 50자 이상이어야 합니다.'),
});

export type ReviewGeneratedFormData = z.infer<typeof reviewGeneratedFormSchema>;

export const ReviewGeneratedForm = ({ form, onSubmit, id }: { form: UseFormReturn<ReviewGeneratedFormData>, onSubmit: (values: ReviewGeneratedFormData) => void, id: string }) => {
  return (
    <Form {...form}>
      <form 
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="opinion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>의견</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value}
                  defaultValue={field.value}
                  placeholder="의견을 입력해주세요"
                  className="h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}