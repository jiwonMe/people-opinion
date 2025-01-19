'use client'

/**
 * @description 탄핵 축구 의견서 제출 완료 페이지를 표시하는 component
 */
import Link from 'next/link'
import Image from 'next/image'
import { CTAButton } from '@/components/ui/cta-button'
import CompleteCard from '@/components/CompleteCard'
import { useState, useEffect, useRef } from 'react'
import { VSpace } from '@/components/ui/vspace'
import { v4 as uuidv4 } from 'uuid'
import { Send } from 'lucide-react'

export default function FinishPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ name: string; index: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const submittedData = sessionStorage.getItem('submittedData');
    const userData = submittedData ? JSON.parse(submittedData) : null;

    fetch('/api/opinions?onlyCount=true')
      .then(response => response.json())
      .then(responseData => {
        setData({
          name: userData?.name || "익명의 시민", // session storage에서 이름을 가져오거나 기본값 사용
          index: responseData.totalCount
        });
        setLoading(false);
      });
  }, []);

  /**
   * @description CompleteCard의 canvas 내용을 이미지로 저장하는 함수
   */
  const handleSaveImage = () => {
    if (!cardRef.current) return;

    // CompleteCard 내부의 canvas element를 찾음
    const canvas = cardRef.current.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas element를 찾을 수 없습니다');
      return;
    }

    try {
      const link = document.createElement('a');
      link.download = '탄핵촉구_참여인증.png';
      // canvas의 내용을 직접 PNG로 변환
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 저장 중 오류 발생:', error);
    }
  };

  /**
   * @description 참여 링크를 클립보드에 복사하는 함수
   */
  const handleCopyLink = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const shareLink = `https://attack.valid.or.kr?ref=${userId || ''}`;
      await navigator.clipboard.writeText(shareLink);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (error) {
      console.error('링크 복사 중 오류 발생:', error);
    }
  };

  /**
   * @description Canvas 이미지를 Blob으로 변환하는 함수
   * @returns Promise<Blob | null>
   */
  const getCanvasBlob = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const canvas = cardRef.current.querySelector('canvas');
    if (!canvas) return null;

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png');
    });
  };

  /**
   * @description 이미지와 텍스트를 외부로 공유하는 함수
   */
  const handleShare = async () => {
    try {
      const blob = await getCanvasBlob();
      if (!blob) {
        console.error('이미지 생성 실패');
        return;
      }

      const shareData = {
        title: '탄핵 촉구 의견서 제출 완료',
        text: '저는 방금 탄핵 촉구 의견서를 제출했습니다. 더 많은 시민들과 함께 헌법재판소의 문을 두드려요!',
        url: 'https://attack.valid.or.kr',
        files: [new File([blob], '탄핵촉구_참여인증.png', { type: 'image/png' })]
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        console.error('Web Share API가 지원되지 않습니다');
      }
    } catch (error) {
      console.error('공유 중 오류 발생:', error);
    }
  };

  /**
   * @description Instagram Story로 공유하는 함수
   */
  const handleInstagramShare = () => {
    // Instagram story 공유를 위한 기본 파라미터
    const params = {
      source_application: 'attack.valid.or.kr',
      text: '탄핵 촉구 의견서 제출 완료! 더 많은 시민들과 함께해요',
      link: 'https://attack.valid.or.kr',
    };

    // URL 인코딩된 파라미터로 Instagram 스토리 URL 생성
    const instagramURL = `instagram-stories://share?${new URLSearchParams(params).toString()}`;

    // Instagram 앱으로 이동
    window.location.href = instagramURL;
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center bg-white px-4">
      <div className='flex flex-col sticky top-0 left-0 right-0 px-4 py-4 pt-8 bg-gradient-to-b from-white from-80% to-white/0 w-full z-50'>
        <Link href="/" className='mb-4'>
          <Image src="/assets/images/court-attack-logo.svg" alt="헌법재판소" width={150} height={100} />
        </Link>
        <div className='text-[21px] font-semibold leading-tight mb-4 flex items-center gap-2'>
          <div>
            <span>탄핵 촉구 의견서</span>
            <span className="flex items-center gap-1">
              발송완료!
              <Send className="w-5 h-5 inline-block" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center space-y-6">
        

        <div className="w-full space-y-4 px-4">
            
        <div className="text-gray-600">
        <strong>참여 인증 이미지와 링크를 SNS에 공유</strong>하고 <br />
        더 많은 시민들과 헌법재판소 문 두드려요!
        </div>
          {loading ? (
            <div className="h-[200px] animate-pulse bg-gray-200 rounded-lg" />
          ) : (
            data && (
              <div className="w-full flex flex-col items-center justify-center">
                <div ref={cardRef} className="mx-auto">
                  <CompleteCard name={data.name} index={Number(data.index) + 1} className="w-full max-w-[300px] aspect-square rounded-xl shadow-xl border-gray-100 border"/>
                </div>
                <div className="flex flex-col w-full gap-2 mt-4">
                  <CTAButton 
                    onClick={handleSaveImage}
                    className="w-full rounded-xl bg-[#0B1A45] py-4 text-white"
                  >
                    이미지로 저장하기
                  </CTAButton>
                 
                </div>
              </div>
            )
          )}
          
          <p className="font-bold">참여링크 복사</p>
          <div 
            onClick={handleCopyLink}
            className="relative flex w-full items-center rounded-xl bg-gray-100 p-4 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <span className="flex-1 text-gray-700">https://attack.valid.or.kr</span>
            <button className="absolute right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            {showTooltip && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm">
                복사되었습니다
              </div>
            )}
          </div>

          <CTAButton 
            onClick={handleShare}
            className="w-full rounded-xl bg-[#2563EB] hover:bg-[#2563EB]/80 py-4 text-white"
            >
            외부로 공유하기
            </CTAButton>
          <VSpace size={120} />   
        </div>
      </div>
    </div>
  )
}