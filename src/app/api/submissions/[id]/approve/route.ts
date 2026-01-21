import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';
import { ParticipationStatus, User } from '@/types';

// POST /api/submissions/[id]/approve
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const participant = db.getParticipant(id);

    if (!participant) {
        return NextResponse.json({ code: 'NOT_FOUND', message: '참여 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 1. 상태 체크 (Guard)
    if (participant.status !== ParticipationStatus.SUBMITTED && participant.status !== ParticipationStatus.RESUBMITTED) {
        return NextResponse.json({
            code: 'CONFLICT_STATE',
            message: '승인할 수 없는 상태입니다. (검수 대기 상태여야 함)'
        }, { status: 409 });
    }

    // 2. 캠페인 정보 조회 (리워드 금액 확인)
    const campaign = db.getCampaign(participant.campaign_id);
    if (!campaign) {
        return NextResponse.json({ message: '캠페인 정보 오류' }, { status: 500 });
    }

    // 3. Owner 크레딧 체크
    const owner = db.users.find((u: User) => u.id === campaign.owner_id);
    if (!owner) return NextResponse.json({ message: 'Owner 오류' }, { status: 500 });

    if (owner.credit_balance < campaign.reward_amount) {
        return NextResponse.json({
            code: 'CREDIT_INSUFFICIENT',
            message: '보유 크레딧이 부족합니다. 충전 후 다시 시도해주세요.'
        }, { status: 402 }); // 402 Payment Required
    }

    // 4. 트랜잭션 처리 (Mock)
    // Owner 차감
    owner.credit_balance -= campaign.reward_amount;

    // Creator 지급 (db에는 Creator 찾아서 더해줘야 하지만 생략 가능 - MVP 핵심은 아님)
    // 상태 변경
    const updated = db.updateParticipantStatus(id, ParticipationStatus.APPROVED, {
        action_type: 'APPROVE',
        actor_id: owner.id,
        timestamp: new Date().toISOString(),
        comment: '검수 승인 및 지급 완료'
    });

    // 5. 응답
    return NextResponse.json({
        status: 'APPROVED',
        message: '승인되었습니다.',
        paid_amount: campaign.reward_amount,
        current_balance: owner.credit_balance,
        data: updated
    });
}
