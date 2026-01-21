"use client"

import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"

const Icons = {
    BarChart3: BarChart3 as any,
    TrendingUp: TrendingUp as any,
    Users: Users as any,
    DollarSign: DollarSign as any
}

export default function ReportsPage() {
    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                        리포트
                    </h1>
                    <p className="text-gray-600">캠페인 성과와 운영 지표를 확인하세요</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {[
                        { icon: Icons.BarChart3, title: '캠페인 성과', desc: '전환율, 참여율, ROI' },
                        { icon: Icons.TrendingUp, title: '트렌드 분석', desc: '시간대별, 요일별 추이' },
                        { icon: Icons.Users, title: '참여자 분석', desc: '완료율, 반려율, 재참여율' },
                        { icon: Icons.DollarSign, title: '크레딧 사용', desc: '지출 내역 및 패턴' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
                                <item.icon size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                            <div className="mt-4 text-sm text-gray-400">준비중...</div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8 text-center">
                    <h3 className="text-2xl font-bold mb-2">고급 리포트 기능</h3>
                    <p className="text-gray-600 mb-4">상세한 분석과 AI 인사이트는 곧 제공됩니다</p>
                </div>
            </div>
        </div>
    )
}
