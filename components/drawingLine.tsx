'use client';

import { cn } from "@/lib/utils";

const pathLength = 5000;

const speed = 2;

function DrawingLine({ className, delay = 0 }: { className?: string, delay?: number }) {
  return (
    <>
      <style jsx>{`
        #cross-path {
          /* 1) path 전체 길이에 맞춰 dasharray, dashoffset 설정 */
          stroke-dasharray: ${pathLength}; /* path 길이에 맞춰 설정 (예시값) */
          stroke-dashoffset: ${pathLength}; /* stroke-dasharray와 동일하게 시작 */
          animation: draw ${speed}s ease-in-out forwards;
          animation-delay: ${delay}s;
        }
        @keyframes draw {
          to {
            /* 2) stroke-dashoffset을 0으로 만들어 선이 나타나게 함 */
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <svg
        id="cross-path"
        width="100%" viewBox="0 0 400 86" fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "relative", // Positioning
          "overflow-hidden", // Hide overflow
          "mix-blend-multiply",
          className // Custom className
        )}
      >
        <path
        d="M7 59C140.513 28.9305 216.319 20.3193 355 34.9947"
        stroke-width="60"
        stroke="#00FF59"
        className={cn(
          "stroke-dasharray-${pathLength}", // Set dasharray
          "stroke-dashoffset-${pathLength}", // Set dashoffset
          "animate-draw" // Apply animation
        )}
        />
      </svg>

      

    </>
  );
}

export default DrawingLine;
