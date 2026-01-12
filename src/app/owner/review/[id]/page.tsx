import { notFound } from "next/navigation"
import { db } from "@/lib/mock-db"
import ReviewView from "@/components/review/review-view"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ReviewPage({ params }: PageProps) {
    const { id } = await params

    // 1. 참여 정보 조회
    const participant = db.getParticipant(id);

    if (!participant) {
        notFound();
    }

    // 2. 캠페인 정보 조회 (보상 정보 등)
    const campaign = db.getCampaign(participant.campaign_id);

    if (!campaign) {
        return <div>캠페인 정보를 찾을 수 없습니다.</div>
    }

    // 3. Client Component로 데이터 넘김
    return (
        <ReviewView participant={participant} campaign={campaign} />
    )
}
