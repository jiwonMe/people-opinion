'use client'

/**
 * @description 탄핵 축구 의견서 제출 완료 페이지를 표시하는 component
 */
import Link from 'next/link'
import Image from 'next/image'
import { CTAButton } from '@/components/ui/cta-button'
import CompleteCard from '@/components/CompleteCard'
import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function FinishPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; index: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/opinions?onlyCount=true')
      .then(response => response.json())
      .then(responseData => {
        setData({
          name: "한패닉", // 실제 데이터로 교체 필요
          index: responseData.totalCount
        });
        setLoading(false);
      });
  }, []);

  /**
   * @description CompleteCard를 이미지로 저장하는 함수
   */
  const handleSaveImage = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      
      const link = document.createElement('a');
      link.download = '탄핵촉구_참여인증.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 저장 중 오류 발생:', error);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center bg-white px-4">
      <div className='flex flex-col sticky top-0 left-0 right-0 px-4 py-4 pt-8 bg-gradient-to-b from-white from-80% to-white/0 w-full z-50'>
        <Link href="/" className='mb-4'>
          <Image src="/assets/images/court-attack-logo.svg" alt="헌법재판소" width={150} height={100} />
        </Link>
        <div className='text-[21px] font-semibold leading-tight mb-4'>
          탄핵 촉구 의견서<br/>발송완료!
        </div>
      </div>

      <div className="flex w-full flex-col items-center space-y-6">
        <div className="text-gray-600 text-center">
          아래 이미지를 SNS에 공유하고,<br />
          더 많은 사람들의 참여를 이끌어주세요!
        </div>

        <div className="w-full space-y-4 px-4">
          <p className="font-bold">참여링크 복사</p>
          <div className="relative flex w-full items-center rounded-lg bg-gray-100 p-4">
            <span className="flex-1 text-gray-700">https://attack.valid.or.kr/10fs4J</span>
            <button className="absolute right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>    

          {loading ? (
            <div className="h-[200px] animate-pulse bg-gray-100 rounded-lg" />
          ) : (
            data && <div ref={cardRef}><CompleteCard name={data.name} index={data.index} /></div>
          )}
          
          <CTAButton 
            onClick={handleSaveImage}
            className="w-full rounded-lg bg-[#0B1A45] py-4 text-white"
          >
            이미지로 저장하기
          </CTAButton>
        </div>
      </div>
    </div>
  )
}