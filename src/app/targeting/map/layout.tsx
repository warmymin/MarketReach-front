import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '위치 타겟팅 - MarketReach',
  description: 'Kakao Maps를 활용한 위치 기반 타겟팅 설정',
}

export default function TargetingMapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
