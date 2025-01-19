'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface OpinionCountsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * OpinionCounts 컴포넌트는 의견 수를 표시합니다.
 * 로딩 중에는 무작위 숫자를 표시합니다.
 */
export default function OpinionCounts({ className }: OpinionCountsProps) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태를 추적

  useEffect(() => {
    // 무작위 숫자를 생성하는 인터벌 설정
    const interval = setInterval(() => {
      setCount(Math.floor(Math.random() * 100)); // 0부터 99까지의 무작위 숫자
    }, 3000); // 3000ms마다 숫자 변경

    fetch('/api/opinions?onlyCount=true')
      .then(response => response.json())
      .then(data => {
        clearInterval(interval); // 데이터 로드 후 인터벌 정리
        setCount(data.totalCount);
        setLoading(false); // 로딩 완료
      });

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  return <span className={cn(className)}>{loading ? '...' : count}</span>;
}