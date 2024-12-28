import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { OpinionsList } from '@/components/opinions-list';
import { cn } from '@/lib/utils';
import { CTAButton } from '@/components/ui/cta-button';
import { VSpace } from '@/components/ui/vspace';

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center justify-center max-h-screen">
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
              우리가 원하는 미래를 쟁취하는 <br />
              가장 빠르고 확실한 방법
            </p>
            <h1>
              <Image src="/assets/images/court-attack-logo.svg" alt="헌재로 보내자" width={352} height={76} />
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
      <Image src="/assets/images/valid-logo-white.svg" alt="전진하는 민주주의 VALID" width={62} height={28} />
      <div id="cta-button-container" className={cn(
        "w-full px-4 py-8 flex flex-col items-center justify-center",
        // "bg-gradient-to-t from-white to-white/0",
      )}>
        <Link href="/submit" className="w-full flex">
          <CTAButton>
            지금 바로 의견 보내기
          </CTAButton>
        </Link>
      </div>
      <VSpace className="w-full flex flex-col items-center justify-start" size={60} />
      <div className="fixed bottom-0 left-0 right-0 -z-10">
        <Image className="absolute bottom-0 max-h-[500px] object-contain" src="/assets/images/home-bg.png" alt="헌법재판소" width={2000} height={500} />
      </div>
    </main>
  );
}