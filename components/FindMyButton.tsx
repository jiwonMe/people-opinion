'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * localStorage에 userId가 있는 경우에만 보여지는 카드 확인 버튼 컴포넌트
 * @param className - 추가적인 스타일링을 위한 className
 */
export default function FindMyButton({ className }: { className?: string }) {
  const [hasUserId, setHasUserId] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setHasUserId(!!userId);
  }, []);

  if (!hasUserId) return null;

  return (
    <Link href="/finish" className={cn(
      'font-bold text-sm text-black underline bg-white/50 px-4 fixed bottom-[calc(10vh-32px)] left-1/2 -translate-x-1/2',
      className
    )}>
        내 카드 다시 확인하기
    </Link>
  )
}