"use client"

import { useState } from "react"
import { X } from "lucide-react"

/**
 * DES_07 2.3 - Audit Drawer (감사 추적 패널)
 * 검수/원장 화면에서 우측 슬라이드 패널로 열림
 * ledger_entries, reserve_id, paid_ledger_entry_id 등 연결 키를 노출(운영/분쟁 대응)
 */

interface AuditEntry {
    timestamp: string
    action: string
    actor?: string
    details?: Record<string, any>
}

interface AuditDrawerProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    entries: AuditEntry[]
    metadata?: Record<string, any>
}

export default function AuditDrawer({
    isOpen,
    onClose,
    title = "감사 추적",
    entries,
    metadata
}: AuditDrawerProps) {
    const [expandedEntry, setExpandedEntry] = useState<number | null>(null)

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl z-50 animate-slide-in-right overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50">
                    <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Metadata Section */}
                {metadata && (
                    <div className="p-6 bg-blue-50 border-b border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-900 mb-3">연결 정보</h3>
                        <div className="space-y-2">
                            {Object.entries(metadata).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center text-xs">
                                    <span className="text-blue-700 font-medium">{key}:</span>
                                    <code className="bg-blue-100 px-2 py-1 rounded text-blue-900 font-mono">
                                        {String(value)}
                                    </code>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-neutral-200" />

                        <div className="space-y-6">
                            {entries.map((entry, index) => (
                                <div key={index} className="relative pl-12">
                                    {/* Timeline dot */}
                                    <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-primary-500 border-4 border-white ring-2 ring-primary-100" />

                                    {/* Entry card */}
                                    <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="font-semibold text-neutral-900 text-sm">
                                                    {entry.action}
                                                </div>
                                                {entry.actor && (
                                                    <div className="text-xs text-neutral-500 mt-1">
                                                        {entry.actor}
                                                    </div>
                                                )}
                                            </div>
                                            <time className="text-xs text-neutral-500">
                                                {new Date(entry.timestamp).toLocaleString('ko-KR', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </time>
                                        </div>

                                        {/* Details (expandable) */}
                                        {entry.details && Object.keys(entry.details).length > 0 && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => setExpandedEntry(expandedEntry === index ? null : index)}
                                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                                >
                                                    {expandedEntry === index ? "상세 정보 닫기" : "상세 정보 보기"}
                                                </button>
                                                {expandedEntry === index && (
                                                    <div className="mt-2 p-3 bg-neutral-50 rounded border border-neutral-200">
                                                        <dl className="space-y-1.5">
                                                            {Object.entries(entry.details).map(([key, value]) => (
                                                                <div key={key} className="flex gap-2 text-xs">
                                                                    <dt className="text-neutral-500 font-medium min-w-24">{key}:</dt>
                                                                    <dd className="text-neutral-700 font-mono break-all">
                                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                    </dd>
                                                                </div>
                                                            ))}
                                                        </dl>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {entries.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-neutral-400 text-sm">감사 기록이 없습니다</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-neutral-200 bg-neutral-50">
                    <p className="text-xs text-neutral-500 text-center">
                        모든 기록은 분쟁 대응 및 운영 감사를 위해 저장됩니다
                    </p>
                </div>
            </div>
        </>
    )
}

/**
 * 사용 예시:
 * 
 * const [showAudit, setShowAudit] = useState(false)
 * 
 * <AuditDrawer
 *   isOpen={showAudit}
 *   onClose={() => setShowAudit(false)}
 *   title="제출물 감사 기록"
 *   metadata={{
 *     participant_id: "part_123",
 *     submission_id: "sub_456",
 *     reserve_id: "rsv_789"
 *   }}
 *   entries={[
 *     {
 *       timestamp: "2026-01-13T10:00:00Z",
 *       action: "제출됨",
 *       actor: "creator@example.com",
 *       details: { link_url: "https://...", image_count: 3 }
 *     },
 *     {
 *       timestamp: "2026-01-13T11:00:00Z",
 *       action: "검수 시작",
 *       actor: "owner@example.com"
 *     }
 *   ]}
 * />
 */
