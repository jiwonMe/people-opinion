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
            <h1 className="text-4xl font-bold tracking-tight">Citizen Participation Portal</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your voice with the Constitutional Court. Your opinion matters in shaping our democracy.
            </p>
            <Link href="/submit">
              <Button size="lg" className="mt-4">
                Submit Your Opinion
              </Button>
            </Link>
          </div>
          
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Submissions</h2>
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <OpinionsList />
            </ScrollArea>
          </Card>
        </div>
      </div>
    </main>
  );
}