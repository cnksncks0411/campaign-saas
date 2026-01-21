"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Participant, Campaign, ParticipationStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { Clock, AlertCircle, CheckCircle } from "lucide-react"

const Icons = {
    Clock: Clock as any,
    AlertCircle: AlertCircle as any,
    CheckCircle: CheckCircle as any
}

interface TaskItem extends Participant {
    campaign?: Campaign
    priority: number
}

export default function CreatorDashboard() {
    const router = useRouter()
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/my/tasks')
            const data = await res.json()
            setTasks(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">로딩중...</div>
    }

    // 액션이 필요한 태스크만 필터
    const actionRequired = tasks.filter(t =>
        t.status === ParticipationStatus.SELECTED ||
        t.status === ParticipationStatus.IN_REVISION
    )

    const pending = tasks.filter(t =>
        t.status === ParticipationStatus.SUBMITTED ||
        t.status === ParticipationStatus.RESUBMITTED
    )

    const completed = tasks.filter(t =>
        t.status === ParticipationStatus.APPROVED ||
        t.status === ParticipationStatus.PAID
    )

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">할 일</h1>

            {/* 액션 필요 */}
            {actionRequired.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Icons.AlertCircle className="text-red-500" size={24} />
                        조치 필요 ({actionRequired.length})
                    </h2>
                    <div className="space-y-4">
                        {actionRequired.map((task) => (
                            <TaskCard key={task.id} task={task} onAction={fetchTasks} />
                        ))}
                    </div>
                </div>
            )}

            {/* 검수 대기 */}
            {pending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Icons.Clock className="text-orange-500" size={24} />
                        검수 대기중 ({pending.length})
                    </h2>
                    <div className="space-y-4">
                        {pending.map((task) => (
                            <TaskCard key={task.id} task={task} onAction={fetchTasks} />
                        ))}
                    </div>
                </div>
            )}

            {/* 완료 */}
            {completed.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Icons.CheckCircle className="text-green-500" size={24} />
                        완료 ({completed.length})
                    </h2>
                    <div className="space-y-4">
                        {completed.map((task) => (
                            <TaskCard key={task.id} task={task} onAction={fetchTasks} />
                        ))}
                    </div>
                </div>
            )}

            {tasks.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    참여중인 캠페인이 없습니다.
                </div>
            )}
        </div>
    )
}

function TaskCard({ task, onAction }: { task: TaskItem; onAction: () => void }) {
    const router = useRouter()

    const getStatusColor = (status: ParticipationStatus) => {
        if (status === ParticipationStatus.IN_REVISION) return 'bg-red-50 border-red-200'
        if (status === ParticipationStatus.SELECTED) return 'bg-blue-50 border-blue-200'
        if (status === ParticipationStatus.SUBMITTED || status === ParticipationStatus.RESUBMITTED) return 'bg-orange-50 border-orange-200'
        return 'bg-slate-50 border-slate-200'
    }

    const getActionButton = () => {
        if (task.status === ParticipationStatus.SELECTED) {
            return (
                <Button onClick={() => router.push(`/creator/missions/${task.id}/submit`)}>
                    제출하기
                </Button>
            )
        }
        if (task.status === ParticipationStatus.IN_REVISION) {
            const lastRevision = task.history.filter(h => h.action_type === 'REQUEST_REVISION').pop()
            return (
                <div className="space-y-2">
                    {lastRevision && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            <strong>수정 요청:</strong> {lastRevision.comment}
                        </div>
                    )}
                    <Button variant="destructive" onClick={() => router.push(`/creator/missions/${task.id}/submit`)}>
                        재제출하기
                    </Button>
                </div>
            )
        }
        if (task.status === ParticipationStatus.SUBMITTED || task.status === ParticipationStatus.RESUBMITTED) {
            return <span className="text-sm text-slate-500">검수 대기중</span>
        }
        if (task.status === ParticipationStatus.APPROVED) {
            return <span className="text-sm text-green-600 font-medium">승인 완료</span>
        }
        return null
    }

    return (
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(task.status)}`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{task.campaign?.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{task.campaign?.mission_guide}</p>
                    <div className="text-xs text-slate-500">
                        신청일: {formatDate(task.applied_at)}
                    </div>
                </div>
                <div className="ml-4">
                    {getActionButton()}
                </div>
            </div>
        </div>
    )
}
