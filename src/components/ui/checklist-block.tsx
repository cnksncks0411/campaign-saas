"use client"

/**
 * DES_07 2.3 - Checklist Block (제출 기준 강제)
 * 캠페인 기준 체크리스트(고정) vs 제출 체크(사용자)
 * "필수 충족 여부"를 상단에 자동 판정 배지로 표시(충족/미충족)
 */

interface ChecklistItemType {
    id: string
    text: string
    required: boolean
    checked?: boolean
    readOnly?: boolean
}

interface ChecklistBlockProps {
    title?: string
    items: ChecklistItemType[]
    onChange?: (itemId: string, checked: boolean) => void
    readOnly?: boolean
    showRequirementBadge?: boolean
}

export default function ChecklistBlock({
    title = "제출 기준",
    items,
    onChange,
    readOnly = false,
    showRequirementBadge = true
}: ChecklistBlockProps) {
    // 필수 항목 충족 여부 판정
    const requiredItems = items.filter(item => item.required)
    const checkedRequiredItems = requiredItems.filter(item => item.checked)
    const allRequiredMet = requiredItems.length > 0 && requiredItems.every(item => item.checked)

    const handleToggle = (itemId: string) => {
        if (readOnly) return
        const item = items.find(i => i.id === itemId)
        if (item?.readOnly) return
        onChange?.(itemId, !item?.checked)
    }

    return (
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
            {/* Header with Badge */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-section-title font-semibold text-neutral-900">
                    {title}
                </h3>
                {showRequirementBadge && requiredItems.length > 0 && (
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${allRequiredMet
                            ? "bg-success-100 text-success-700"
                            : "bg-warning-100 text-warning-700"
                        }`}>
                        {allRequiredMet ? "✓ 충족" : `미충족 (${checkedRequiredItems.length}/${requiredItems.length})`}
                    </div>
                )}
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
                {items.map((item) => (
                    <label
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${item.checked
                                ? "border-primary-200 bg-primary-50"
                                : "border-neutral-200 bg-white"
                            } ${readOnly || item.readOnly
                                ? "cursor-default"
                                : "cursor-pointer hover:bg-neutral-50"
                            } transition-colors`}
                    >
                        <input
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={() => handleToggle(item.id)}
                            disabled={readOnly || item.readOnly}
                            className="mt-0.5 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 disabled:opacity-50"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm ${item.checked ? "text-primary-900 font-medium" : "text-neutral-700"
                                    }`}>
                                    {item.text}
                                </span>
                                {item.required && (
                                    <span className="text-xs text-danger-600 font-semibold">
                                        *필수
                                    </span>
                                )}
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            {/* Helper Text */}
            {!allRequiredMet && showRequirementBadge && requiredItems.length > 0 && !readOnly && (
                <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                    <p className="text-xs text-warning-800">
                        <strong>필수 항목</strong>을 모두 완료해야 제출할 수 있습니다.
                    </p>
                </div>
            )}
        </div>
    )
}

/**
 * 사용 예시:
 * 
 * // Campaign creation (고정 기준 표시)
 * <ChecklistBlock
 *   title="제출 시 필수 확인 사항"
 *   items={[
 *     { id: "1", text: "블로그 포스팅 URL 1개 이상", required: true, checked: true, readOnly: true },
 *     { id: "2", text: "인증 이미지 1장 이상", required: true, checked: true, readOnly: true }
 *   ]}
 *   readOnly={true}
 * />
 * 
 * // Submission form (user editable)
 * <ChecklistBlock
 *   title="캠페인 참여 동의"
 *   items={checklistItems}
 *   onChange={(id, checked) => updateChecklist(id, checked)}
 *   showRequirementBadge={true}
 * />
 */
