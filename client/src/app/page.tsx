'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Quiz App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            onClick={() => router.push('/creator')}
          >
            Creator
          </Button>
          <Button 
            className="w-full" 
            onClick={() => router.push('/player')}
          >
            Player
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}