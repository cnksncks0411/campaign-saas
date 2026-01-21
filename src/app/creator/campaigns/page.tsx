"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Search, Filter, MapPin, Star, TrendingUp } from "lucide-react"

const Icons = {
    Search: Search as any,
    Filter: Filter as any,
    MapPin: MapPin as any,
    Star: Star as any,
    TrendingUp: TrendingUp as any
}

export default function CreatorCampaignsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('all')

    // Mock 캠페인 데이터
    const campaigns = [
        {
            id: 'cam-1',
            title: '[강남점] 시그니처 파스타 체험단 모집',
            business: '이탈리안 레스토랑',
            reward: 50000,
            type: '콘텐츠+리뷰',
            location: '서울 강남구',
            deadline: '2026-01-20',
            slots: { total: 10, filled: 3 },
            tags: ['맛집', '파스타', '인스타그램']
        },
        {
            id: 'cam-2',
            title: '신메뉴 런칭 기념 블로그 리뷰',
            business: '카페 ○○',
            reward: 30000,
            type: '리뷰',
            location: '서울 마포구',
            deadline: '2026-01-25',
            slots: { total: 5, filled: 5 },
            tags: ['카페', '블로그', '신메뉴']
        }
    ]

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        캠페인 둘러보기
                    </h1>
                    <p className="text-gray-600">나에게 맞는 캠페인을 찾아 신청하세요</p>
                </div>

                {/* 검색 & 필터 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="캠페인 검색..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-lg"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="review">리뷰</option>
                            <option value="content">콘텐츠</option>
                            <option value="package">패키지</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        {['맛집', '카페', '뷰티', '패션'].map((tag) => (
                            <button
                                key={tag}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 캠페인 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all overflow-hidden group"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                                            {campaign.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{campaign.business}</p>
                                    </div>
                                    {campaign.slots.filled === campaign.slots.total && (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                            마감
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Icons.MapPin size={16} />
                                        {campaign.location}
                                    </div>
                                    <div>마감: {formatDate(campaign.deadline)}</div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1">리워드</div>
                                        <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            {formatCurrency(campaign.reward)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500 mb-1">모집</div>
                                        <div className="text-sm font-medium">
                                            {campaign.slots.filled}/{campaign.slots.total}명
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    {campaign.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Button
                                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                    disabled={campaign.slots.filled === campaign.slots.total}
                                >
                                    {campaign.slots.filled === campaign.slots.total ? '모집 마감' : '신청하기'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
