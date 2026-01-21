"use client"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Wallet, ArrowUpRight, ArrowDownRight, Download } from "lucide-react"

const Icons = {
    Wallet: Wallet as any,
    ArrowUpRight: ArrowUpRight as any,
    ArrowDownRight: ArrowDownRight as any,
    Download: Download as any
}

export default function CreatorCreditsPage() {
    const balance = {
        total: 85000,
        available: 80000,
        frozen: 5000
    }

    const transactions = [
        { id: 1, type: 'earn', amount: 50000, desc: '블로그 리뷰 승인', date: '2026-01-12', status: '완료' },
        { id: 2, type: 'earn', amount: 30000, desc: '인스타그램 콘텐츠 승인', date: '2026-01-10', status: '완료' },
        { id: 3, type: 'pending', amount: 5000, desc: '파스타 리뷰 검수중', date: '2026-01-09', status: '보류' },
    ]

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        내 크레딧
                    </h1>
                    <p className="text-gray-600">획득한 크레딧과 인출 내역</p>
                </div>

                {/* 잔액 */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Icons.Wallet size={32} />
                        <h2 className="text-2xl font-bold">크레딧 잔액</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-green-100 text-sm mb-1">총 잔액</p>
                            <p className="text-4xl font-bold">{formatCurrency(balance.total)}</p>
                        </div>
                        <div>
                            <p className="text-green-100 text-sm mb-1">인출 가능</p>
                            <p className="text-4xl font-bold">{formatCurrency(balance.available)}</p>
                        </div>
                        <div>
                            <p className="text-green-100 text-sm mb-1">보류</p>
                            <p className="text-2xl font-bold text-yellow-200">{formatCurrency(balance.frozen)}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold">
                            인출하기
                        </Button>
                        <Button variant="outline" className="border-white text-white hover:bg-white/20">
                            내역 다운로드
                        </Button>
                    </div>
                </div>

                {/* 거래 내역 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="font-bold text-lg">거래 내역</h3>
                    </div>
                    <div className="divide-y">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${tx.type === 'earn' ? 'bg-green-100' : 'bg-orange-100'
                                        }`}>
                                        {tx.type === 'earn' ? (
                                            <Icons.ArrowDownRight className="text-green-600" size={20} />
                                        ) : (
                                            <Icons.ArrowUpRight className="text-orange-600" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{tx.desc}</p>
                                        <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-lg font-bold ${tx.type === 'earn' ? 'text-green-600' : 'text-orange-600'
                                        }`}>
                                        {tx.type === 'earn' ? '+' : ''}{formatCurrency(tx.amount)}
                                    </p>
                                    <p className="text-xs text-gray-500">{tx.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
