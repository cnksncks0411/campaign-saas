"use client"

import { useState, ReactNode } from "react"
import { Button } from "./button"
import { X } from "lucide-react"

/**
 * DES_07 2.3 - Preflight Modal (실수 방지 모달)
 * Publish/Approve(Selected)/Approve(Review) 같은 "돌이킬 수 있는 행동"에서 사용
 * 
 * 구성:
 * - 상단: 결과 요약(예: "예치가 발생합니다")
 * - 중단: 체크리스트(필수 확인)
 * - 하단: Confirm 버튼은 체크 완료 전까지 Disable
 */

interface ChecklistItem {
    id: string
    label: string
    checked?: boolean
}

interface PreflightModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
    title: string
    summary: string | ReactNode
    checklist: ChecklistItem[]
    confirmLabel?: string
    confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    isLoading?: boolean
}

export default function PreflightModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    summary,
    checklist: initialChecklist,
    confirmLabel = "확인",
    confirmVariant = "default",
    isLoading = false
}: PreflightModalProps) {
    const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist)

    // 모든 체크리스트 완료 여부
    const allChecked = checklist.every(item => item.checked)

    const handleCheck = (id: string) => {
        setChecklist(prev =>
            prev.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        )
    }

    const handleConfirm = async () => {
        if (!allChecked) return
        await onConfirm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-xl max-w-md w-full pointer-events-auto animate-slide-in-top"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-neutral-400 hover:text-neutral-600 transition-colors"
                            disabled={isLoading}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="p-6 bg-blue-50 border-b border-blue-100">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 mb-1">결과 확인</h3>
                                <div className="text-sm text-blue-800">{summary}</div>
                            </div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="p-6 space-y-3">
                        <p className="text-sm font-medium text-neutral-600 mb-3">
                            아래 항목을 모두 확인해주세요:
                        </p>
                        {checklist.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={item.checked || false}
                                    onChange={() => handleCheck(item.id)}
                                    className="mt-0.5 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                                    disabled={isLoading}
                                />
                                <span className="text-sm text-neutral-700 flex-1">
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-neutral-50 border-t border-neutral-200 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isLoading}
                        >
                            취소
                        </Button>
                        <Button
                            variant={confirmVariant}
                            onClick={handleConfirm}
                            disabled={!allChecked || isLoading}
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            {confirmLabel}
                        </Button>
                    </div>

                    {/* Disabled reason tooltip */}
                    {!allChecked && (
                        <div className="px-6 pb-4">
                            <p className="text-xs text-center text-neutral-500">
                                모든 항목을 체크해야 진행할 수 있습니다
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

/**
 * 사용 예시:
 * 
 * const [showPreflight, setShowPreflight] = useState(false)
 * 
 * <PreflightModal
 *   isOpen={showPreflight}
 *   onClose={() => setShowPreflight(false)}
 *   onConfirm={handleApprove}
 *   title="선정하시겠습니까?"
 *   summary="이 크리에이터를 선정하면 리워드가 예치됩니다."
 *   checklist={[
 *     { id: "1", label: "리워드 금액이 설정되어 있습니다" },
 *     { id: "2", label: "내 지갑 잔액이 충분합니다" },
 *     { id: "3", label: "자동승인/수정요청 정책을 확인했습니다" }
 *   ]}
 *   confirmLabel="선정하기"
 * />
 */
