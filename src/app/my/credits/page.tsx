"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Wallet, Plus, ArrowDownRight, ArrowUpRight } from "lucide-react"

const Icons = { Wallet: Wallet as any, Plus: Plus as any, ArrowDownRight: ArrowDownRight as any, ArrowUpRight: ArrowUpRight as any }

export default function MyCreditsPage() {
    const balance = { total: 150000, available: 145000, frozen: 5000 }

    const transactions = [
        { id: 1, type: 'charge', amount: 100000, desc: '크레딧 충전', date: '2026-01-10' },
        { id: 2, type: 'use', amount: -50000, desc: '캠페인 지급 (블로그 리뷰)', date: '2026-01-09' },
    ]

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                        크레딧 장부
                    </h1>
                    <p className="text-gray-600">충전, 사용, 이동 내역</p>
                </div>

                {/* 잔액 */}
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-8 text-white mb-6">
                    <h3 className="text-2xl font-bold mb-6">크레딧 잔액</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-yellow-100 mb-1">총 잔액</p>
                            <p className="text-4xl font-bold">{formatCurrency(balance.total)}</p>
                        </div>
                        <div>
                            <p className="text-yellow-100 mb-1">가용</p>
                            <p className="text-4xl font-bold">{formatCurrency(balance.available)}</p>
                        </div>
                        <div>
                            <p className="text-yellow-100 mb-1">보류</p>
                            <p className="text-2xl font-bold text-red-200">{formatCurrency(balance.frozen)}</p>
                        </div>
                    </div>
                    <Button className="mt-6 bg-white text-orange-600 hover:bg-gray-100 font-bold">
                        <Icons.Plus size={18} className="mr-2" />
                        크레딧 충전
                    </Button>
                </div>

                {/* 거래 내역 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="font-bold text-lg">거래 내역</h3>
                    </div>
                    <div className="divide-y">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${tx.type === 'charge' ? 'bg-blue-100' : 'bg-red-100'}`}>
                                        {tx.type === 'charge' ? (
                                            <Icons.ArrowDownRight className="text-blue-600" size={20} />
                                        ) : (
                                            <Icons.ArrowUpRight className="text-red-600" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{tx.desc}</p>
                                        <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                                    </div>
                                </div>
                                <p className={`text-lg font-bold ${tx.type === 'charge' ? 'text-blue-600' : 'text-red-600'}`}>
                                    {tx.type === 'charge' ? '+' : ''}{formatCurrency(tx.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
