"use client"

import { formatDate } from "@/lib/utils"
import { Clock, CheckCircle, XCircle } from "lucide-react"

const Icons = { Clock: Clock as any, CheckCircle: CheckCircle as any, XCircle: XCircle as any }

export default function ApplicationsPage() {
    const applications = [
        { id: 1, campaign: '강남점 파스타', status: 'APPLIED', appliedAt: '2026-01-10', icon: Icons.Clock, color: 'blue' },
        { id: 2, campaign: '신메뉴 블로그', status: 'SELECTED', appliedAt: '2026-01-08', icon: Icons.CheckCircle, color: 'green' },
    ]

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        내 신청/선정
                    </h1>
                    <p className="text-gray-600">신청한 캠페인과 선정 현황</p>
                </div>

                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-${app.color}-100`}>
                                        <app.icon size={24} className={`text-${app.color}-600`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{app.campaign}</h3>
                                        <p className="text-sm text-gray-600">신청일: {formatDate(app.appliedAt)}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${app.color}-100 text-${app.color}-700`}>
                                    {app.status === 'APPLIED' ? '검토중' : '선정완료'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {applications.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            아직 신청한 캠페인이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
