"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold">캠페인 운영 SaaS (MVP)</h1>
        <p className="text-slate-600 text-lg">역할을 선택하여 진입하세요</p>

        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="px-8"
            onClick={() => router.push('/owner/campaigns')}
          >
            사장님으로 진입
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8"
            onClick={() => router.push('/creator/dashboard')}
          >
            크리에이터로 진입
          </Button>
        </div>

        <div className="mt-12 p-4 bg-white rounded-lg border text-sm text-left max-w-md mx-auto">
          <h3 className="font-semibold mb-2">테스트 시나리오</h3>
          <ul className="space-y-1 text-slate-600">
            <li>1. 사장님: 캠페인 목록 → cam-1 클릭 → 참여자 승인</li>
            <li>2. 사장님: cam-2 클릭 → 검수대기 건 검수 → 승인</li>
            <li>3. 크리에이터: To-Do 확인 → 제출/재제출</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
