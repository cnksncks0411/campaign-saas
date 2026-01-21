"use client"

/**
 * DES_07 A-4 검수 화면 (제출물 확인 + 승인/수정요청/보류/반려)
 * 페이지 구조: Left 65% (제출물 뷰어) + Right 35% (상태/타이머/히스토리) + Bottom Sticky Action Bar
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Participant, Campaign, ParticipationStatus } from "@/types"
import { Button } from "@/components/ui/button"
import ReviewStatusBadge from "@/components/ui/status-badge"
import TimerChip from "@/components/ui/timer-chip"
import PreflightModal from "@/components/ui/preflight-modal"
import AuditDrawer from "@/components/ui/audit-drawer"
import { formatCurrency } from "@/lib/utils"
import { ExternalLink, CheckCircle, AlertTriangle, FileText, Image as ImageIcon, Pause, Ban, Eye } from "lucide-react"

const Icons = {
    ExternalLink: ExternalLink as any,
    ImageIcon: ImageIcon as any,
    FileText: FileText as any,
    CheckCircle: CheckCircle as any,
    AlertTriangle: AlertTriangle as any,
    Pause: Pause as any,
    Ban: Ban as any,
    Eye: Eye as any
}

interface ReviewViewProps {
    participant: Participant
    campaign: Campaign
}

export default function ReviewViewNew({ participant, campaign }: ReviewViewProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showApprovalPreflight, setShowApprovalPreflight] = useState(false)
    const [showAuditDrawer, setShowAuditDrawer] = useState(false)

    // DES_07 4.1: Button Guard (상태 기반 버튼 가시성)
    const isReviewable =
        participant.status === ParticipationStatus.SUBMITTED ||
        participant.status === ParticipationStatus.RESUBMITTED

    // Mock data (실제로는 API 응답에서 가져옴)
    const revisionCount = 1 // participant.revision_count || 0
    const canRequestRevision = revisionCount < 2
    const autoApproveAt = isReviewable ? "2026-01-15T14:30:00Z" : null

    // Timer state
    const getTimerState = () => {
        if (participant.status === ParticipationStatus.IN_REVISION) return "paused"
        if (participant.status === ParticipationStatus.OVERDUE) return "paused"
        if (isReviewable) return "active"
        return "expired"
    }

    const getBlockedReason = () => {
        if (participant.status === ParticipationStatus.IN_REVISION) return "크리에이터가 수정 중입니다"
        return undefined
    }

    // Handlers
    const handleApprove = async () => {
        setLoading('approve')
        try {
            const res = await fetch(`/api/submissions/${participant.id}/approve`, { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || '승인 실패')
            alert(`승인되었습니다! 지급액: ${formatCurrency(data.paid_amount)}`)
            router.refresh()
        } catch (err: any) {
            alert(err.message || "알 수 없는 오류가 발생했습니다.")
        } finally {
            setLoading(null)
            setShowApprovalPreflight(false)
        }
    }

    const handleReject = async () => {
        if (!rejectReason.trim()) return alert("수정 요청 사유를 입력해주세요.")
        setLoading('reject')
        try {
            const res = await fetch(`/api/submissions/${participant.id}/reject`, {
                method: 'POST',
                body: JSON.stringify({ comment: rejectReason })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || '요청 실패')
            alert("수정 요청이 전송되었습니다.")
            setShowRejectModal(false)
            setRejectReason("")
            router.refresh()
        } catch (err: any) {
            alert(err.message || "알 수 없는 오류가 발생했습니다.")
        } finally {
            setLoading(null)
        }
    }

    // Mock audit entries
    const auditEntries = [
        {
            timestamp: "2026-01-13T10:00:00Z",
            action: "제출됨",
            actor: participant.nickname,
            details: { link_url: participant.submission?.link_url, image_count: participant.submission?.image_urls?.length || 0 }
        },
        {
            timestamp: "2026-01-13T10:05:00Z",
            action: "검수 시작",
            actor: "owner@example.com"
        }
    ]

    return (
        <>
            <div className="min-h-screen bg-neutral-50">
                {/* DES_07: 상단 핵심 정보 (절대 상단 고정) */}
                <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                                    ← 목록
                                </Button>
                                <div>
                                    <div className="text-sm text-neutral-500">{campaign.title}</div>
                                    <h1 className="text-xl font-bold flex items-center gap-2">
                                        {participant.nickname}님의 제출물
                                        <ReviewStatusBadge status={participant.status} />
                                        {revisionCount > 0 && (
                                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                                                수정요청 {revisionCount}/2
                                            </span>
                                        )}
                                    </h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TimerChip
                                    targetDate={autoApproveAt}
                                    state={getTimerState()}
                                    pauseReason={getBlockedReason()}
                                />
                                <Button variant="outline" size="sm" onClick={() => setShowAuditDrawer(true)}>
                                    <Icons.Eye size={16} className="mr-2" />
                                    감사 기록
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DES_07: 3영역 레이아웃 (좌 65% / 우 35%) */}
                <div className="container mx-auto px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: 제출물 뷰어 (65%) */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* 링크 */}
                            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                                <h3 className="text-section-title font-semibold mb-4flex items-center gap-2">
                                    <Icons.ExternalLink size={20} />
                                    제출 링크
                                </h3>
                                {participant.submission?.link_url ? (
                                    <a
                                        href={participant.submission.link_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary-600 underline break-all hover:text-primary-700"
                                    >
                                        {participant.submission.link_url}
                                    </a>
                                ) : (
                                    <p className="text-neutral-400">링크가 없습니다.</p>
                                )}
                            </div>

                            {/* 이미지 */}
                            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                                <h3 className="text-section-title font-semibold mb-4 flex items-center gap-2">
                                    <Icons.ImageIcon size={20} />
                                    제출 이미지
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {participant.submission?.image_urls?.map((url: string, idx: number) => (
                                        <div key={idx} className="relative aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`제출 이미지 ${idx + 1}`} className="object-cover w-full h-full" />
                                        </div>
                                    ))}
                                    {(!participant.submission?.image_urls?.length) && (
                                        <p className="text-neutral-400 col-span-2">제출된 이미지가 없습니다.</p>
                                    )}
                                </div>
                            </div>

                            {/* 텍스트 */}
                            <div className="bg-white rounded-xl border border-neutral-200 p-6">
                                <h3 className="text-section-title font-semibold mb-4 flex items-center gap-2">
                                    <Icons.FileText size={20} />
                                    추가 메시지
                                </h3>
                                <p className="whitespace-pre-wrap text-neutral-700">
                                    {participant.submission?.content || "내용 없음"}
                                </p>
                            </div>
                        </div>

                        {/* Right: 히스토리 패널 (35%) */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-neutral-200 p-6 sticky top-24">
                                <h3 className="text-section-title font-semibold mb-4">검수 정보</h3>
                                <dl className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">지급 예정 금액</dt>
                                        <dd className="font-bold text-primary-700">{formatCurrency(campaign.reward_amount)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">제출 라운드</dt>
                                        <dd className="font-medium">{revisionCount > 0 ? `재제출 ${revisionCount}회` : "초회 제출"}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">수정요청 가능</dt>
                                        <dd className={canRequestRevision ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                            {canRequestRevision ? `${2 - revisionCount}회 남음` : "소진됨"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DES_07: Bottom Sticky Action Bar (조건부 표시) */}
                {isReviewable && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg z-40">
                        <div className="container mx-auto px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-neutral-600">
                                    {participant.nickname}님의 제출물을 검수하세요
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={!canRequestRevision || !!loading}
                                    >
                                        <Icons.AlertTriangle size={16} className="mr-2" />
                                        수정 요청 {!canRequestRevision && "(불가)"}
                                    </Button>
                                    <Button variant="outline" disabled={!!loading}>
                                        <Icons.Pause size={16} className="mr-2" />
                                        보류
                                    </Button>
                                    <Button variant="destructive" disabled={!!loading}>
                                        <Icons.Ban size={16} className="mr-2" />
                                        반려
                                    </Button>
                                    <Button
                                        onClick={() => setShowApprovalPreflight(true)}
                                        isLoading={loading === 'approve'}
                                        className="bg-primary-600 hover:bg-primary-700"
                                    >
                                        <Icons.CheckCircle size={16} className="mr-2" />
                                        승인하기
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DES_07 4.1: 검수 불가능 상태 안내 */}
                {!isReviewable && (
                    <div className="fixed bottom-0 left-0 right-0 bg-warning-50 border-t-2 border-warning-300 z-40">
                        <div className="container mx-auto px-6 py-4">
                            <p className="text-sm text-warning-800 text-center">
                                현재 상태에서는 검수할 수 없습니다. ({participant.status})
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <PreflightModal
                isOpen={showApprovalPreflight}
                onClose={() => setShowApprovalPreflight(false)}
                onConfirm={handleApprove}
                title="승인하시겠습니까?"
                summary="승인 시 크레딧이 즉시 차감되며, 크리에이터에게 리워드가 지급됩니다."
                checklist={[
                    { id: "1", label: "제출물이 캠페인 기준을 충족합니다" },
                    { id: "2", label: "링크와 이미지를 확인했습니다" },
                    { id: "3", label: "승인 후에는 취소할 수 없습니다" }
                ]}
                confirmLabel="승인하기"
                isLoading={loading === 'approve'}
            />

            <AuditDrawer
                isOpen={showAuditDrawer}
                onClose={() => setShowAuditDrawer(false)}
                title="감사 추적"
                metadata={{
                    participant_id: participant.id,
                    submission_id: participant.id,
                    reserve_id: "rsv_mock_123"
                }}
                entries={auditEntries}
            />
        </>
    )
}
