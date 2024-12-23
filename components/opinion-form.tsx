'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  opinion: z.string().min(50, 'Opinion must be at least 50 characters'),
});

export type OpinionFormData = z.infer<typeof formSchema>;

export function OpinionForm({ formData, setFormData, onBack, onNext }: { formData: OpinionFormData, setFormData: (data: OpinionFormData) => void, onBack: () => void, onNext: () => void }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  function onSubmit(values: OpinionFormData) {
    setFormData({ ...formData, ...values });
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="opinion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Opinion</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts and opinions..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
}