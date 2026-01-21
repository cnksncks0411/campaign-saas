"use client"

import { ParticipationStatus, CampaignStatus } from "@/types"

/**
 * DES_07 2.3 - Status Badge (필수)
 * 캠페인/참여자/제출 상태를 단일 컴포넌트로 표준화
 * 배지 옆에 "상태 설명 툴팁" 항상 제공
 */

interface StatusBadgeProps {
    status: ParticipationStatus | CampaignStatus | string
    showTooltip?: boolean
    className?: string
}

// FE_02 매핑 기준
const PARTICIPATION_STATUS_CONFIG: Record<string, {
    label: string
    bgColor: string
    textColor: string
    description: string
}> = {
    [ParticipationStatus.APPLIED]: {
        label: "신청",
        bgColor: "bg-neutral-100",
        textColor: "text-neutral-700",
        description: "사장님의 선정을 기다리는 중입니다"
    },
    [ParticipationStatus.SELECTED]: {
        label: "미션 수행중",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        description: "미션 마감일까지 제출해주세요"
    },
    [ParticipationStatus.SUBMITTED]: {
        label: "검수 대기",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        description: "담당자가 검수 중입니다 (자동승인 대기)"
    },
    [ParticipationStatus.IN_REVISION]: {
        label: "수정중",
        bgColor: "bg-orange-100",
        textColor: "text-orange-700",
        description: "수정 요청을 확인하고 재제출해주세요"
    },
    [ParticipationStatus.RESUBMITTED]: {
        label: "재검수 대기",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        description: "재제출된 내용을 검수 중입니다"
    },
    [ParticipationStatus.APPROVED]: {
        label: "승인됨",
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
        description: "미션이 승인되었습니다"
    },
    [ParticipationStatus.PAID]: {
        label: "정산완료",
        bgColor: "bg-neutral-100",
        textColor: "text-neutral-700",
        description: "크레딧이 지급되었습니다"
    },
    [ParticipationStatus.OVERDUE]: {
        label: "미제출/지연",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        description: "마감일이 지났습니다"
    },
    [ParticipationStatus.REJECTED]: {
        label: "반려",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        description: "제출물이 반려되었습니다"
    },
    // Campaign Status
    "DRAFT": {
        label: "작성중",
        bgColor: "bg-neutral-100",
        textColor: "text-neutral-600",
        description: "모집 시작 전입니다"
    },
    "RECRUITING": {
        label: "모집중",
        bgColor: "bg-blue-500",
        textColor: "text-white",
        description: "크리에이터를 모집하고 있습니다"
    },
    "RECRUIT_CLOSED": {
        label: "모집마감",
        bgColor: "bg-neutral-400",
        textColor: "text-white",
        description: "모집이 마감되었습니다"
    },
    "IN_PROGRESS": {
        label: "진행중",
        bgColor: "bg-green-500",
        textColor: "text-white",
        description: "캠페인이 진행 중입니다"
    },
    "COMPLETED": {
        label: "종료",
        bgColor: "bg-neutral-300",
        textColor: "text-neutral-700",
        description: "캠페인이 종료되었습니다"
    }
}

export default function StatusBadge({
    status,
    showTooltip = true,
    className = ""
}: StatusBadgeProps) {
    const config = PARTICIPATION_STATUS_CONFIG[status] || {
        label: status,
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        description: "알 수 없는 상태"
    }

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${config.bgColor} ${config.textColor} ${className}`}
            title={showTooltip ? config.description : undefined}
        >
            {config.label}
            {showTooltip && (
                <svg
                    className="w-3 h-3 opacity-60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            )}
        </span>
    )
}
