"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Participant, Campaign } from "@/types"
import { Button } from "@/components/ui/button"

interface MissionSubmitProps {
    participantId: string
}

export default function MissionSubmitClient({ participantId }: MissionSubmitProps) {
    const router = useRouter()
    const [participant, setParticipant] = useState<Participant | null>(null)
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        link_url: '',
        content: '',
        image_urls: [] as string[]
    })

    useEffect(() => {
        fetchData()
    }, [participantId])

    const fetchData = async () => {
        try {
            // Mock: 직접 DB에서 조회 대신 API 사용 (실제로는 GET /api/participants/[id])
            // 여기서는 간단히 기존 제출물이 있으면 불러오기
            const res = await fetch(`/api/campaigns/${participantId}`) // 임시
            // 실제로는 participant 정보를 가져와야 하나, Mock이므로 생략

            // Mock data 세팅 (실제로는 API에서 가져와야 함)
            setParticipant({
                id: participantId,
                campaign_id: 'cam-2',
                user_id: 'user-creator-1',
                nickname: '크리에이터',
                status: 'SELECTED' as any,
                applied_at: new Date().toISOString(),
                history: []
            })

            setCampaign({
                id: 'cam-2',
                owner_id: 'user-owner',
                title: '신메뉴 런칭 기념 블로그 리뷰',
                status: 'IN_PROGRESS' as any,
                recruit_end_date: '2026-01-10',
                mission_guide: '네이버 블로그 1000자 이상, 사진 5장 필수',
                reward_amount: 50000
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.link_url.trim()) {
            return alert('링크를 입력해주세요.')
        }

        setSubmitting(true)
        try {
            const res = await fetch(`/api/missions/${participantId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.message)

            alert('제출되었습니다!')
            router.push('/creator/dashboard')
        } catch (err: any) {
            alert(err.message || '제출에 실패했습니다.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">로딩중...</div>
    }

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">← 뒤로</Button>

            <div className="bg-white rounded-lg border p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">{campaign?.title}</h1>
                <p className="text-slate-600 mb-4">{campaign?.mission_guide}</p>
                <div className="text-sm text-slate-500">
                    리워드: <span className="font-bold text-lg text-blue-600">{campaign?.reward_amount.toLocaleString()}원</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-6">
                <h2 className="text-xl font-semibold">제출물</h2>

                {/* 링크 입력 */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        링크 URL <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://blog.naver.com/..."
                        value={formData.link_url}
                        onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                        required
                    />
                </div>

                {/* 이미지 URL (간소화) */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        이미지 URL (테스트용)
                    </label>
                    <input
                        type="url"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://placehold.co/600x400.png"
                        value={formData.image_urls[0] || ''}
                        onChange={(e) => setFormData({ ...formData, image_urls: e.target.value ? [e.target.value] : [] })}
                    />
                    <p className="text-xs text-slate-500 mt-1">※ MVP: 이미지 URL 직접 입력 방식 (파일 업로드는 추후 구현)</p>
                </div>

                {/* 추가 내용 */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        추가 메시지
                    </label>
                    <textarea
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        placeholder="선택사항: 추가로 전달할 내용이 있다면 작성해주세요."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                {/* 제출 버튼 */}
                <Button type="submit" size="lg" className="w-full" isLoading={submitting}>
                    제출하기
                </Button>
            </form>
        </div>
    )
}
