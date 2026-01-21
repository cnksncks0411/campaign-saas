"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { CreditCard, Download, Check } from "lucide-react"

const Icons = { CreditCard: CreditCard as any, Download: Download as any, Check: Check as any }

export default function BillingPage() {
    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                        요금제 & 결제
                    </h1>
                    <p className="text-gray-600">구독 관리 및 결제 수단</p>
                </div>

                {/* 현재 플랜 */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Basic Plan</h3>
                            <p className="text-blue-100">사업체 1개 + 기본 기능</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-blue-100">월 구독료</div>
                            <div className="text-3xl font-bold">무료</div>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <Icons.Check size={20} />
                            <span>캠페인 무제한 생성</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icons.Check size={20} />
                            <span>기본 템플릿</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Icons.Check size={20} />
                            <span>검수 자동화</span>
                        </div>
                    </div>
                </div>

                {/* 결제 수단 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">결제 수단</h3>
                        <Button variant="outline" size="sm">추가</Button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Icons.CreditCard size={32} className="text-gray-400" />
                        <div className="flex-1">
                            <p className="font-medium">신한카드 **** **** **** 1234</p>
                            <p className="text-sm text-gray-500">기본 결제 수단</p>
                        </div>
                    </div>
                </div>

                {/* 결제 내역 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="font-bold text-lg">결제 내역</h3>
                        <Button variant="ghost" size="sm">
                            <Icons.Download size={16} className="mr-2" />
                            전체 내역
                        </Button>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">날짜</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">내역</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">금액</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">영수증</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            <tr>
                                <td className="px-6 py-4 text-sm">{formatDate('2026-01-01')}</td>
                                <td className="px-6 py-4 text-sm">크레딧 충전</td>
                                <td className="px-6 py-4 text-sm text-right font-medium">{formatCurrency(100000)}</td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm">다운로드</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
