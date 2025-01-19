'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface OpinionCountsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function OpinionCounts({ className }: OpinionCountsProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/opinions?onlyCount=true')
      .then(response => response.json())
      .then(data => setCount(data.totalCount));
  }, []);

  return <div className={cn(className)}>{count}</div>;
}