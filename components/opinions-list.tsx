'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';

type Opinion = {
  id: string;
  name: string;
  opinion: string;
  createdAt: string;
  metadata: {
    gender: string;
    age: string;
    address: string;
    maskedName: string;
  };
};

export function OpinionsList() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);

  useEffect(() => {
    fetch('/api/opinions')
      .then((res) => res.json())
      .then((data) => setOpinions(data));
  }, []);

  return (
    <div className="space-y-4">
      {opinions.map((opinion) => (
        <Card key={opinion.id} className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{opinion.metadata.maskedName}</h3>
              <time className="text-sm text-muted-foreground">
                {new Date(opinion.createdAt).toLocaleDateString()}
              </time>
            </div>
            <p className="text-muted-foreground">{opinion.opinion}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}