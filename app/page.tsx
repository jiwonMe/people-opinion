import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { OpinionsList } from '@/components/opinions-list';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">이렇게 된 이상 헌재로 간다</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              우리가 원하는 미래를 쟁취하는 가장 빠르고 확실한 방법
            </p>
            <Link href="/submit">
              <Button size="lg" className="mt-4">
                지금바로 의견 제출하기
              </Button>
            </Link>
          </div>
          
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">최근 제출된 의견</h2>
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <OpinionsList />
            </ScrollArea>
          </Card>
        </div>
      </div>
    </main>
  );
}