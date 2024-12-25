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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from './ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { useEffect, useState } from 'react';

export const personalInformationFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.string().min(1, 'Please select your gender'),
  birth: z.string().min(1, 'Please select your birth'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  personalAgreement: z.boolean().refine((data) => data === true, {
    message: '개인정보 수집 및 이용에 동의해야 합니다.',
  }),
});

export type UserFormData = z.infer<typeof personalInformationFormSchema>;

export const UserForm = ({ form, onSubmit, id }: { form: UseFormReturn<UserFormData>, onSubmit: (values: UserFormData) => void, id: string }) => {
  return (
    <Form {...form}>
      <form
      id={id}
      onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input placeholder="이름을 입력해주세요"
                className='text-[16px]'
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>성별</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="성별을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="secret">밝히지 않음</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="others">직접 작성</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              {
                field.value.includes('others') && (
              <FormControl>
                <Input
                  placeholder='직접 자신의 성별/젠더를 적어주세요'
                  className='text-[16px]'
                  onChange={(event) => {
                    field.onChange({
                      ...event,
                      target: {
                        value: `others(${event.target.value})`
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
          name="birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>생년월일 6자리 (YYMMDD)</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  onChange={(value) => {
                    field.onChange(value)
                  }}
                  value={field.value}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                    index={0}
                    className='text-[16px]'
                    />
                    <InputOTPSlot
                    index={1}
                    className='text-[16px]'
                    />
                    <InputOTPSlot
                    index={2}
                    className='text-[16px]'
                    />
                    <InputOTPSlot
                    index={3}
                    className='text-[16px]'
                    />
                    <InputOTPSlot
                    index={4}
                    className='text-[16px]'
                    />
                    <InputOTPSlot
                    index={5}
                    className='text-[16px]'
                    />
                  </InputOTPGroup>
                </InputOTP>
                {/* <Input type="date" placeholder="생년월일을 입력해주세요"
                {...field} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>거주지</FormLabel>
              <FormControl>
                <Input placeholder="주소를 입력해주세요 
                (OO구/동까지만)"
                className='text-[16px]'
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalAgreement"
          render={({ field }) => (
            <FormItem
              className="flex items-center space-x-2"
            >
              <FormControl>
                <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>
                <span className="text-sm text-muted-foreground">개인정보 수집 및 이용에 동의합니다.</span>
              </FormLabel>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}