import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface CompleteCardProps {
  name: string;
  index: number;    
  className: string;
}

/**
 * Canvas를 사용하여 완료 카드를 렌더링하는 컴포넌트
 * @param props - CompleteCard props
 * @returns Canvas element
 */
const CompleteCard = ({ name, index, className }: CompleteCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas의 기본 크기를 640px로 설정 (2x)
    const BASE_WIDTH = 512;
    const BASE_HEIGHT = 640; // 4:5 비율을 위해 높이 조정
    const SCALE = 2;
    canvas.width = BASE_WIDTH * SCALE;
    canvas.height = BASE_HEIGHT * SCALE;

    // Scale context를 2배로 설정
    ctx.scale(SCALE, SCALE);

    // Logo image 로드
    const logoImage = new Image();
    logoImage.src = '/assets/images/court-attack-logo.png';
    
    // Background image 로드
    const bgImage = new Image();
    bgImage.src = '/assets/images/complete-card-bg.png';

    // Font loading 확인
    const fontCheck = new Promise<void>((resolve) => {
      // Font face 정의
      const font = new FontFace(
        'SUIT Variable',
        'url(/assets/fonts/SUIT-Variable.woff2)',
        {
          weight: '100 900',
          display: 'swap'
        }
      );

      // Font 로드 및 document fonts에 추가
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        resolve();
      });
    });

    Promise.all([
      fontCheck,
      new Promise(resolve => { logoImage.onload = resolve; }),
      new Promise(resolve => { bgImage.onload = resolve; })
    ]).then(() => {
      // Canvas 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 상단 흰색 배경 (위쪽 2/3)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT * 0.67);

      // 하단 검정색 배경 (아래쪽 1/5)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, BASE_HEIGHT * 0.8, BASE_WIDTH, BASE_HEIGHT * 0.2);

      // Green curve 렌더링
      ctx.strokeStyle = '#00FF59';
      ctx.lineWidth = 97;
      ctx.beginPath();
      ctx.moveTo(-45, 263);
      ctx.quadraticCurveTo(192, 210, 573, 221);
      ctx.stroke();

      // Logo 렌더링 (512px 기준으로 비율 조정)
      ctx.drawImage(logoImage, BASE_WIDTH - 150 - 32, 32, 150, 45);

      // Safari에서 더 안정적인 폰트 렌더링을 위해 font-family에 fallback 추가
      const fontFamily = '"SUIT Variable", sans-serif';

      // Username 렌더링
      ctx.fillStyle = '#000000';
      
      // name 부분 (700 weight)
      ctx.font = `700 40px ${fontFamily}`;
      ctx.fillText(name, 36, 150);
      
      // '님이' 부분 (500 weight)
      ctx.font = `500 40px ${fontFamily}`;
      const nameWidth = ctx.measureText(name).width;
      if (index <= 500) {
        ctx.fillText('님이', 36 + nameWidth, 150);
      } else {
        ctx.fillText('님과', 36 + nameWidth, 150)
      }

      // Index number 렌더링 (900 weight)
      const indexText = `${index.toLocaleString()}` + (index <= 500 ? '번째' : '명');
      let fontSize = 100;  // 초기 font size
      
      // Text width가 400px을 넘지 않을 때까지 폰트 크기 조절
      do {
        ctx.font = `900 ${fontSize}px ${fontFamily}`;
        const textWidth = ctx.measureText(indexText).width;
        if (textWidth <= 400) break;
        fontSize -= 2;  // 2px씩 감소
      } while (fontSize > 30);  // 최소 폰트 사이즈 제한
      
      ctx.fillText(indexText, 36, 260);

      // Description text 렌더링 (500 weight)
      ctx.font = `500 30px ${fontFamily}`;
      if (index <= 500) {
        ctx.fillText('시민으로 헌법재판소로', 36, 310);
        ctx.fillText('앞장서는 중!', 36, 350);
      } else {
        ctx.fillText('시민이 함께 헌법재판소에', 36, 310);
        ctx.fillText('요구하는 중!', 36, 350);
      }

      // Background image 렌더링
      ctx.drawImage(bgImage, 0, BASE_HEIGHT - 209, BASE_WIDTH, 169);
    });
  }, [name, index]);

  return (
    <canvas 
      ref={canvasRef}
      className={cn("aspect-[4/5] relative select-none w-[512px]", className)}
    //   style={{ width: '512px', height: '640px' }}
    />
  );
};

export default CompleteCard;