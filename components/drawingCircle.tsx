'use client';

import { cn } from "@/lib/utils";

const pathLength = 10000;

const speed = 2;

function DrawingCircle({ className, delay }: { className?: string, delay?: number }) {
  return (
    <>
      <style jsx>{`
        #circle-path {
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
        width="130"
        height="64"
        viewBox="0 0 130 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          // Block comment: SVG container styles
          "relative", // Positioning
          "overflow-hidden", // Hide overflow
          className // Custom className
        )}
      >
        <path
          id="circle-path"
          d="M81.9197 62C75.9952 61.6846 70.2108 60.9677 64.3533 59.9496C51.5652 57.7268 38.148 55.171 26.1039 50.1687C15.2867 45.6759 4.93728 35.4725 15.1485 24.8092C25.2983 14.21 40.663 12.3651 54.6729 12.3651C72.9791 12.3651 95.8485 15.6682 109.285 29.4993C115.65 36.0523 116.094 47.6902 108.175 53.4683C97.9376 60.9373 83.077 60.7045 71.2713 58.0405C53.0827 53.9363 35.4581 45.2208 19.0679 36.5933C16.4193 35.1991 10.4763 31.9851 7.64032 30.1356C6.92269 29.6676 4.74941 28.2214 4.33482 27.0246C3.31461 24.0796 8.35879 21.1674 10.0486 20.2369C22.8316 13.1982 38.2067 11.3828 52.4299 9.65473C63.0025 8.37016 73.5702 7.46028 84.2336 7.60428C93.4407 7.72862 104.081 7.65673 112.803 11.1867C121.018 14.5119 131.914 21.6742 126.591 31.8325C123.472 37.7851 116.901 41.719 111.103 44.583C98.7572 50.6811 85.3275 53.1167 71.6727 53.9868C49.6889 55.3875 25.3464 50.8202 8.53753 35.5092C5.77085 32.989 2.29772 29.0978 2.02096 25.092C1.66262 19.9054 5.97084 14.4847 9.38752 11.116C20.4028 0.255409 38.7946 1.04533 52.9257 3.6448C65.1713 5.89744 77.577 8.81182 89.0502 13.7321C101.2 18.9425 112.754 25.6992 124.419 31.8797"
          strokeWidth="3"
          strokeLinecap="round"
          className={cn(
            // Block comment: Path animation styles
            "stroke-dasharray-${pathLength}", // Set dasharray
            "stroke-dashoffset-${pathLength}", // Set dashoffset
            "animate-draw" // Apply animation
          )}
        />
      </svg>
    </>
  );
}

export default DrawingCircle;