"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Campaign, Participant, ParticipationStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"

interface CampaignDetailClientProps {
    campaignId: string
}

export default function CampaignDetailClient({ campaignId }: CampaignDetailClientProps) {
    const router = useRouter()
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [participants, setParticipants] = useState<Participant[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [campaignId])

    const fetchData = async () => {
        try {
            const [campaignRes, participantsRes] = await Promise.all([
                fetch(`/api/campaigns/${campaignId}`),
                fetch(`/api/campaigns/${campaignId}/participants`)
            ])

            const campaignData = await campaignRes.json()
            const participantsData = await participantsRes.json()

            setCampaign(campaignData)
            setParticipants(participantsData.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSelect = async (participantId: string) => {
        if (!confirm('이 참여자를 선정하시겠습니까?')) return

        setActionLoading(participantId)
        try {
            const res = await fetch(`/api/participants/${participantId}/select`, { method: 'POST' })
            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            alert('참여자가 선정되었습니다.')
            fetchData() // 새로고침
        } catch (err: any) {
            alert(err.message || '선정에 실패했습니다.')
        } finally {
            setActionLoading(null)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">로딩중...</div>
    }

    if (!campaign) {
        return <div className="p-6">캠페인을 찾을 수 없습니다.</div>
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            {/* 헤더 */}
            <div className="mb-8">
                <Button variant="outline" onClick={() => router.back()} className="mb-4">← 목록으로</Button>
                <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
                <p className="text-slate-600">{campaign.mission_guide}</p>

                <div className="mt-4 flex gap-6 text-sm">
                    <div><span className="text-slate-500">리워드:</span> <span className="font-bold">{formatCurrency(campaign.reward_amount)}</span></div>
                    <div><span className="text-slate-500">모집마감:</span> {formatDate(campaign.recruit_end_date)}</div>
                </div>
            </div>

            {/* 참여자 목록 */}
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">참여자 관리</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">닉네임</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">신청일</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">상태</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">액션</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {participants.map((participant) => (
                                <tr key={participant.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium">{participant.nickname}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(participant.applied_at)}</td>
                                    <td className="px-6 py-4">
                                        <ParticipantStatusBadge status={participant.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {participant.status === ParticipationStatus.APPLIED && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleSelect(participant.id)}
                                                isLoading={actionLoading === participant.id}
                                            >
                                                선정하기
                                            </Button>
                                        )}
                                        {(participant.status === ParticipationStatus.SUBMITTED || participant.status === ParticipationStatus.RESUBMITTED) && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/owner/review/${participant.id}`)}
                                            >
                                                검수하기
                                            </Button>
                                        )}
                                        {participant.status === ParticipationStatus.APPROVED && (
                                            <span className="text-sm text-green-600 font-medium">승인완료</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {participants.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                        아직 참여 신청이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function ParticipantStatusBadge({ status }: { status: ParticipationStatus }) {
    const styles: Record<string, string> = {
        [ParticipationStatus.APPLIED]: "bg-gray-100 text-gray-700",
        [ParticipationStatus.SELECTED]: "bg-blue-100 text-blue-700",
        [ParticipationStatus.SUBMITTED]: "bg-green-100 text-green-700",
        [ParticipationStatus.IN_REVISION]: "bg-orange-100 text-orange-700",
        [ParticipationStatus.APPROVED]: "bg-emerald-100 text-emerald-700",
        [ParticipationStatus.PAID]: "bg-slate-100 text-slate-700",
    };

    const labels: Record<string, string> = {
        [ParticipationStatus.APPLIED]: "신청",
        [ParticipationStatus.SELECTED]: "선정",
        [ParticipationStatus.SUBMITTED]: "검수대기",
        [ParticipationStatus.IN_REVISION]: "수정중",
        [ParticipationStatus.APPROVED]: "승인",
        [ParticipationStatus.PAID]: "정산완료",
    };

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {labels[status] || status}
        </span>
    )
}
