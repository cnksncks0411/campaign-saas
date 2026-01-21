"use client"

import { Button } from "@/components/ui/button"
import { Building2, Plus, Edit } from "lucide-react"

const Icons = { Building2: Building2 as any, Plus: Plus as any, Edit: Edit as any }

export default function BusinessPage() {
    const businesses = [
        { id: 1, name: '강남 이탈리안 레스토랑', role: '소유자', status: '활성', campaigns: 3, credits: 150000 },
    ]

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                                사업체 관리
                            </h1>
                            <p className="text-gray-600">사업체 추가 및 정보 관리</p>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                            <Icons.Plus size={18} className="mr-2" />
                            사업체 추가
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {businesses.map((business) => (
                        <div key={business.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-blue-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                                        <Icons.Building2 size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{business.name}</h3>
                                        <p className="text-sm text-gray-600">{business.role} • {business.status}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Icons.Edit size={16} className="mr-2" />
                                    수정
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-sm text-gray-500">진행중 캠페인</p>
                                    <p className="text-2xl font-bold">{business.campaigns}개</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">크레딧 잔액</p>
                                    <p className="text-2xl font-bold text-blue-600">{business.credits.toLocaleString()}원</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                    <h3 className="font-bold text-lg mb-2">사업체 추가 구독</h3>
                    <p className="text-gray-600 mb-4">
                        여러 매장을 운영하시나요? 사업체를 추가하여 각각 독립적으로 관리하세요.
                    </p>
                    <p className="text-sm text-gray-500">
                        💡 사업체 1개당 월 29,000원 (부가세 별도)
                    </p>
                </div>
            </div>
        </div>
    )
}
