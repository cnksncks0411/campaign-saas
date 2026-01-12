"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Campaign, CampaignStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"

interface CampaignWithStats extends Campaign {
    stats?: {
        total: number
        applied: number
        selected: number
        submitted: number
        approved: number
    }
}

export default function CampaignsPage() {
    const router = useRouter()
    const [campaigns, setCampaigns] = useState<CampaignWithStats[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('/api/campaigns')
            const data = await res.json()
            setCampaigns(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">로딩중...</div>
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">내 캠페인</h1>
                <Button onClick={() => router.push('/owner/campaigns/new')}>+ 새 캠페인</Button>
            </div>

            <div className="grid gap-4">
                {campaigns.map((campaign) => (
                    <div
                        key={campaign.id}
                        className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/owner/campaigns/${campaign.id}`)}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">{campaign.title}</h2>
                                <p className="text-slate-600 text-sm line-clamp-2">{campaign.mission_guide}</p>
                            </div>
                            <CampaignStatusBadge status={campaign.status} />
                        </div>

                        <div className="flex gap-6 text-sm text-slate-600">
                            <div>
                                <span className="font-medium">리워드:</span> {formatCurrency(campaign.reward_amount)}
                            </div>
                            <div>
                                <span className="font-medium">모집마감:</span> {formatDate(campaign.recruit_end_date)}
                            </div>
                        </div>

                        {campaign.stats && (
                            <div className="mt-4 pt-4 border-t flex gap-4 text-sm">
                                <div>신청 <span className="font-bold text-blue-600">{campaign.stats.applied}</span></div>
                                <div>선정 <span className="font-bold text-green-600">{campaign.stats.selected}</span></div>
                                <div>검수대기 <span className="font-bold text-orange-600">{campaign.stats.submitted}</span></div>
                                <div>승인 <span className="font-bold text-slate-600">{campaign.stats.approved}</span></div>
                            </div>
                        )}
                    </div>
                ))}

                {campaigns.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        아직 캠페인이 없습니다. 첫 캠페인을 만들어보세요!
                    </div>
                )}
            </div>
        </div>
    )
}

function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
    const styles: Record<string, string> = {
        [CampaignStatus.DRAFT]: "bg-gray-100 text-gray-700",
        [CampaignStatus.RECRUITING]: "bg-blue-100 text-blue-700",
        [CampaignStatus.IN_PROGRESS]: "bg-green-100 text-green-700",
        [CampaignStatus.COMPLETED]: "bg-slate-100 text-slate-700",
    };

    const labels: Record<string, string> = {
        [CampaignStatus.DRAFT]: "작성중",
        [CampaignStatus.RECRUITING]: "모집중",
        [CampaignStatus.IN_PROGRESS]: "진행중",
        [CampaignStatus.COMPLETED]: "종료",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles[CampaignStatus.DRAFT]}`}>
            {labels[status] || status}
        </span>
    )
}
