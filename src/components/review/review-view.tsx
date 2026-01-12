"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Participant, Campaign, ParticipationStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
// Lucide React 아이콘 호환성 이슈 해결을 위한 강제 캐스팅
import { ExternalLink, CheckCircle, XCircle, AlertTriangle, FileText, Image as ImageIcon } from "lucide-react"

// React 19 + Lucide React 타입 충돌 방지
const Icons = {
    ExternalLink: ExternalLink as any,
    ImageIcon: ImageIcon as any,
    FileText: FileText as any,
    CheckCircle: CheckCircle as any,
    AlertTriangle: AlertTriangle as any
}

interface ReviewViewProps {
    participant: Participant
    campaign: Campaign
}

export default function ReviewView({ participant, campaign }: ReviewViewProps) {
    const router = useRouter()
    // loading 상태는 'approve' | 'reject' | null 값만 가짐
    const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [showRejectForm, setShowRejectForm] = useState(false)

    // 상태 체크
    const isReviewable =
        participant.status === ParticipationStatus.SUBMITTED ||
        participant.status === ParticipationStatus.RESUBMITTED;

    // 승인 핸들러
    const handleApprove = async () => {
        // window.confirm 사용 시 브라우저 환경 체크 (Next.js 안전장치)
        if (typeof window !== 'undefined' && !window.confirm("정말 승인하시겠습니까? 크레딧이 즉시 차감됩니다.")) return;

        setLoading('approve');
        try {
            const res = await fetch(`/api/submissions/${participant.id}/approve`, { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || '승인 실패');

            alert(`승인되었습니다! 지급액: ${formatCurrency(data.paid_amount)}`);
            router.refresh(); // 데이터 갱신
        } catch (err: any) {
            alert(err.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(null);
        }
    }

    // 수정 요청 핸들러
    const handleReject = async () => {
        if (!rejectReason.trim()) return alert("수정 요청 사유를 입력해주세요.");

        setLoading('reject');
        try {
            const res = await fetch(`/api/submissions/${participant.id}/reject`, {
                method: 'POST',
                body: JSON.stringify({ comment: rejectReason })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || '요청 실패');

            alert("수정 요청이 전송되었습니다.");
            setShowRejectForm(false);
            router.refresh();
        } catch (err: any) {
            alert(err.message || "알 수 없는 오류가 발생했습니다.");
        } finally {
            setLoading(null);
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <span className="text-sm text-slate-500 font-medium">{campaign.title}</span>
                    <h1 className="text-2xl font-bold flex items-center gap-2 mt-1">
                        {participant.nickname}님의 제출물
                        <StatusBadge status={participant.status} />
                    </h1>
                </div>
                <Button variant="outline" onClick={() => router.back()}>목록으로</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 좌측: 제출물 내용 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. 링크 섹션 */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Icons.ExternalLink size={20} /> 제출 링크
                        </h3>
                        {participant.submission?.link_url ? (
                            <a
                                href={participant.submission.link_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline text-lg break-all hover:text-blue-800"
                            >
                                {participant.submission.link_url}
                            </a>
                        ) : (
                            <p className="text-slate-400">링크가 없습니다.</p>
                        )}
                    </div>

                    {/* 2. 이미지 섹션 */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Icons.ImageIcon size={20} /> 제출 이미지
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {participant.submission?.image_urls?.map((url: string, idx: number) => (
                                <div key={idx} className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={url} alt="submission" className="object-cover w-full h-full" />
                                </div>
                            ))}
                            {/* 안전하게 수정된 부분: Optional Chaining 사용 */}
                            {(!participant.submission?.image_urls?.length) && (
                                <p className="text-slate-400 col-span-2">제출된 이미지가 없습니다.</p>
                            )}
                        </div>
                    </div>

                    {/* 3. 텍스트 내용 */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Icons.FileText size={20} /> 추가 메시지
                        </h3>
                        <p className="whitespace-pre-wrap text-slate-700">
                            {participant.submission?.content || "내용 없음"}
                        </p>
                    </div>
                </div>

                {/* 우측: 액션 패널 */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-6">
                        <h3 className="font-semibold text-lg mb-4">검수 액션</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">지급 예정금액</span>
                                <span className="font-bold">{formatCurrency(campaign.reward_amount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">자동승인 남은시간</span>
                                <span className="text-orange-600 font-medium">47시간 30분</span>
                            </div>

                            <div className="h-px bg-slate-100 my-4" />

                            {/* 검수 가능 상태일 때만 버튼 노출 (State Guard) */}
                            {isReviewable ? (
                                <>
                                    {!showRejectForm ? (
                                        <div className="flex flex-col gap-3">
                                            <Button
                                                size="lg"
                                                className="w-full bg-blue-600 hover:bg-blue-700"
                                                onClick={handleApprove}
                                                isLoading={loading === 'approve'}
                                            >
                                                <Icons.CheckCircle className="mr-2 h-4 w-4" /> 승인하기
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="outline"
                                                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                                onClick={() => setShowRejectForm(true)}
                                                disabled={loading === 'approve'}
                                            >
                                                <Icons.AlertTriangle className="mr-2 h-4 w-4" /> 수정 요청
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
                                            <h4 className="font-medium text-red-800 mb-2">수정 요청 사유</h4>
                                            <textarea
                                                className="w-full p-2 text-sm border border-red-200 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                rows={3}
                                                placeholder="예: 사진이 너무 어둡습니다. 밝게 보정해주세요."
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={handleReject}
                                                    isLoading={loading === 'reject'}
                                                >
                                                    요청 보내기
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowRejectForm(false)}
                                                    disabled={loading === 'reject'}
                                                >
                                                    취소
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // 검수 불가능 상태 안내
                                <div className="bg-slate-50 p-4 rounded-lg text-center text-slate-500 text-sm">
                                    현재 검수 가능한 상태가 아닙니다.<br />
                                    ({participant.status})
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: ParticipationStatus | string }) {
    // Record 타입을 사용하여 Enum Key 접근을 안전하게 처리
    const styles: Record<string, string> = {
        [ParticipationStatus.SUBMITTED]: "bg-green-100 text-green-700",
        [ParticipationStatus.RESUBMITTED]: "bg-green-100 text-green-700",
        [ParticipationStatus.IN_REVISION]: "bg-orange-100 text-orange-700",
        [ParticipationStatus.APPROVED]: "bg-blue-100 text-blue-700",
        [ParticipationStatus.PAID]: "bg-slate-100 text-slate-700",
    };

    const labels: Record<string, string> = {
        [ParticipationStatus.SUBMITTED]: "검수 대기",
        [ParticipationStatus.RESUBMITTED]: "재검수 대기",
        [ParticipationStatus.IN_REVISION]: "수정중",
        [ParticipationStatus.APPROVED]: "승인됨",
        [ParticipationStatus.PAID]: "정산완료",
    };

    const styleClass = styles[status] || "bg-gray-100 text-gray-700";
    const labelText = labels[status] || status;

    return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${styleClass}`}>
            {labelText}
        </span>
    )
}
