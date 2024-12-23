/**
 * 세로 간격 컴포넌트
 * @param size 간격 크기 | 기본값: 16px | 단위: px 또는 %
 * @returns 
 */
export function VSpace({ size = 16, className, children }: { size?: number | string, className?: string, children?: React.ReactNode }) {
  return <div style={{ minHeight: typeof size === 'number' ? `${size}px` : size }} className={className}>{children}</div>;
}