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
import { VSpace } from './ui/vspace';

export const personalInformationFormSchema = z.object({
  name: z.string().min(2, '이름은 최소 2글자 이상이어야 합니다.'),
  gender: z.string().min(1, '성별을 선택해주세요'),
  birth: z.string()
    .length(6, '생년월일은 6자리여야 합니다')
    .refine((val) => {
      // Check if it's a valid date in YYMMDD format
      const year = parseInt('20' + val.substring(0, 2));
      const month = parseInt(val.substring(2, 4));
      const day = parseInt(val.substring(4, 6));
      
      const date = new Date(year, month - 1, day);
      return date instanceof Date && 
             !isNaN(date.getTime()) &&
             date.getMonth() === month - 1 &&
             date.getDate() === day;
    }, '올바른 생년월일을 입력해주세요'),
  address: z.string().min(5, '주소는 최소 5글자 이상이어야 합니다.'),
  phone: z.string().min(10, '전화번호는 최소 10자리 이상이어야 합니다.').refine((val) => {
    return /^\d{10,11}$/.test(val);
  }, '전화번호는 숫자만 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요').refine((val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }, '올바른 이메일 주소를 입력해주세요'),
  personalAgreement: z.boolean().refine((data) => data === true, {
    message: '개인정보 수집 및 이용에 동의해야 합니다.',
  }),
});

export type UserFormData = z.infer<typeof personalInformationFormSchema>;

export const UserForm = ({ form, onSubmit, id }: { form: UseFormReturn<UserFormData>, onSubmit: (values: UserFormData) => void, id: string }) => {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
                <Input
                  placeholder="이름을 입력해주세요"
                  className='text-[16px]'
                  onFocus={handleFocus}
                  {...field}
                />
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
                  <SelectItem value="밝히지 않음">밝히지 않음</SelectItem>
                  <SelectItem value="여성">여성</SelectItem>
                  <SelectItem value="남성">남성</SelectItem>
                  <SelectItem value="others">직접 작성</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              {
                field.value.includes('others') && (
              <FormControl>
                <Input
                  placeholder='성별/젠더를 적어주세요'
                  className='text-[16px]'
                  onFocus={handleFocus}
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
                  onFocus={handleFocus}
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호</FormLabel>
              <FormControl>
                <Input
                  placeholder="전화번호를 입력해주세요"
                  className='text-[16px]'
                  onFocus={handleFocus}
                  {...field}
                  maxLength={11}
                  // Only allow numeric input
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                    field.onChange(e);
                  }}
                  type="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  placeholder="이메일을 입력해주세요"
                  className='text-[16px]'
                  onFocus={handleFocus}
                  {...field}
                />
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
                <Input
                  placeholder="주소를 입력해주세요 
                  (OO구/동까지만)"
                  className='text-[16px]'
                  onFocus={handleFocus}
                  {...field}
                />
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
              className="items-center space-x-2"
            >
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  <span className="text-sm text-muted-foreground">개인정보 수집 및 이용에 동의합니다.</span>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <VSpace size={60} />
    </Form>
  );
}