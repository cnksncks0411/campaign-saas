"use client"

import { useEffect, useState } from "react"

/**
 * DES_07 2.3 - Timer Chip (자동승인/마감)
 * 형태: ⏳ 자동승인까지 12:34 또는 ⏸ 중지됨: 보류
 * 상태에 따라 색상/아이콘 변경
 * 중지 상태는 회색 처리 X → 오히려 "정산 사고 구간"이라 노란/빨강 계열로 눈에 띄게
 */

type TimerState = "active" | "paused" | "expired" | "blocked"

interface TimerChipProps {
    targetDate?: string | Date | null // auto_approve_at
    state?: TimerState
    pauseReason?: string // blocked_reason
    label?: string
    className?: string
}

export default function TimerChip({
    targetDate,
    state = "active",
    pauseReason,
    label,
    className = ""
}: TimerChipProps) {
    const [timeLeft, setTimeLeft] = useState<string>("")

    useEffect(() => {
        if (!targetDate || state !== "active") {
            setTimeLeft("")
            return
        }

        const calculateTimeLeft = () => {
            const target = new Date(targetDate).getTime()
            const now = new Date().getTime()
            const diff = target - now

            if (diff <= 0) {
                return "자동승인됨"
            }

            const hours = Math.floor(diff / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            return `${hours}시간 ${minutes}분`
        }

        setTimeLeft(calculateTimeLeft())
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 60000) // 1분마다 업데이트

        return () => clearInterval(interval)
    }, [targetDate, state])

    // DES_07: 중지 상태는 "정산 사고 구간"이라 노란/빨강 계열로 눈에 띄게
    const getStateConfig = () => {
        switch (state) {
            case "active":
                if (timeLeft === "자동승인됨") {
                    return {
                        icon: "✓",
                        bgColor: "bg-green-50",
                        textColor: "text-green-700",
                        borderColor: "border-green-200",
                        message: "자동승인 완료"
                    }
                }
                return {
                    icon: "⏳",
                    bgColor: "bg-blue-50",
                    textColor: "text-blue-700",
                    borderColor: "border-blue-200",
                    message: label || `자동승인까지 ${timeLeft}`
                }
            case "paused":
                return {
                    icon: "⏸",
                    bgColor: "bg-yellow-50",
                    textColor: "text-yellow-700",
                    borderColor: "border-yellow-300",
                    message: `중지됨: ${pauseReason || "보류"}`
                }
            case "blocked":
                return {
                    icon: "🚫",
                    bgColor: "bg-red-50",
                    textColor: "text-red-700",
                    borderColor: "border-red-300",
                    message: `차단됨: ${pauseReason || "분쟁"}`
                }
            case "expired":
                return {
                    icon: "✓",
                    bgColor: "bg-green-50",
                    textColor: "text-green-700",
                    borderColor: "border-green-200",
                    message: "자동승인 완료"
                }
        }
    }

    const config = getStateConfig()

    // [필드 필요] 처리 (DES_07 5.3)
    if (state === "active" && !targetDate) {
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 ${className}`}>
                <span className="text-neutral-500 text-xs font-medium">
                    ⚠ 필드 필요: auto_approve_at
                </span>
            </div>
        )
    }

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.borderColor} ${config.bgColor} ${className}`}
            title={state === "paused" || state === "blocked" ? `사유: ${pauseReason || "없음"}` : undefined}
        >
            <span className="text-base">{config.icon}</span>
            <span className={`text-xs font-semibold ${config.textColor}`}>
                {config.message}
            </span>
        </div>
    )
}

/**
 * 사용 예시:
 * 
 * // Active timer
 * <TimerChip targetDate="2026-01-15T10:00:00Z" state="active" />
 * 
 * // Paused (OnHold)
 * <TimerChip state="paused" pauseReason="증빙 확인 중" />
 * 
 * // Blocked (Disputed)
 * <TimerChip state="blocked" pauseReason="분쟁 접수됨" />
 * 
 * // Missing field
 * <TimerChip state="active" targetDate={null} />
 */
