import { cn } from "@/lib/utils";

/**
 * 세로 간격 컴포넌트
 * @param size 간격 크기 | 기본값: 16px | 단위: px 또는 %
 * @returns 
 */
export function VSpace({ size = 16, className, children }: { size?: number | string, className?: string, children?: React.ReactNode }) {
  return (
    <div
      style={{
        // Set minimum height
        minHeight: typeof size === 'number' ? `${size}px` : size,
        // Set height
        height: typeof size === 'number' ? `${size}px` : size,
        // flex-min-height
        flexBasis: typeof size === 'number' ? `${size}px` : size,
        // Display as block
        display: 'block'
      }}
      className={cn(
        /* Full width */
        "w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
