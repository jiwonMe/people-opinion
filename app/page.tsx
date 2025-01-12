import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { OpinionsList } from '@/components/opinions-list';
import { cn } from '@/lib/utils';
import { CTAButton } from '@/components/ui/cta-button';
import { VSpace } from '@/components/ui/vspace';
import dynamic from 'next/dynamic';
import { PencilLine, Send } from 'lucide-react';

const DrawingCircle = dynamic(() => import('@/components/drawingCircle'), {
  ssr: false,
});

const DrawingCross = dynamic(() => import('@/components/drawingCross'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="container mx-auto min-h-[100dvh] flex flex-col items-center justify-center max-h-screen max-w-[500px]">
      <div className={cn(
        "fixed top-0 left-0 right-0",
        "bg-black text-white text-sm text-center py-2"
      )}>
        개발중인 사이트로 현재 작성된 데이터는 실제 반영되지 않습니다
      </div>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center flex-grow">
        <div className="relative h-full flex flex-col items-center justify-center">
          <VSpace size="40%" />
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-lg max-w-2xl mx-auto text-center leading-tight font-semibold">
            내란범 윤석열의 신속 탄핵을 촉구하는 <br />
            100만 시민의견 헌재 전달 프로젝트
            </p>
            <h1>
              <DrawingCross className="absolute top-[110px] left-[10px] stroke-red-500" delay={0.5} />
              <DrawingCircle className="absolute top-[100px] left-[160px] stroke-red-500" delay={1} />
              <Image src={`/assets/images/logo-hero.svg?v=${Math.random()}`} alt="헌재로 보내자" width={352} height={76} loading='eager' />
            </h1>
          </div>
          
          {/* <Card className={cn(
            "p-6"
          )}>
            <h2 className={cn(
              "text-2xl",
              "font-semibold",
              "mb-4"
            )}>
              최근 제출된 의견
            </h2>
            <ScrollArea className={cn(
              "h-[600px]",
              "rounded-md",
              "border",
              "p-4"
            )}>
              <OpinionsList />
            </ScrollArea>
          </Card> */}
        </div>
        <VSpace size={60} />
      </div>
      <div id="cta-button-container" className={cn(
        "fixed bottom-0 left-0 right-0 flex flex-col items-end justify-center",
        // "bg-gradient-to-t from-white to-white/0",
      )}>
        <Link href="/submit" className="w-full flex">
          <CTAButton className='h-16 font-bold text-lg rounded-full bg-black hover:bg-black/70 fixed bottom-[10vh] left-4 right-4 w-9/12 min-w-[230px] border-2 border-white ring-2 ring-black'>
          {/* send icon */}
          <PencilLine color='white' size={24} className='mr-2'/>
          지금 의견 보내기
          </CTAButton>
        </Link>
        <div className='text-white text-xs text-center bg-black/50 rounded-tl-xl px-4 py-2'>
          <Image src="/assets/images/valid-logo-white.svg" alt="전진하는 민주주의 VALID" width={62} height={24} />
        </div>
      </div>
      <VSpace className="w-full flex flex-col items-center justify-start" size={60} />
      <div className="fixed bottom-0 left-0 right-0 -z-10 sm:opacity-30 opacity-75">
        <Image className="absolute bottom-0 max-h-[500px] object-contain" src="/assets/images/home-bg.png" alt="헌법재판소" width={2000} height={500} loading='eager' priority/>
      </div>
    </main>
  );
}