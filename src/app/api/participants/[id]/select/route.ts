import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';
import { ParticipationStatus } from '@/types';

// POST /api/participants/[id]/select (참여자 승인)
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const participant = db.getParticipant(id);

    if (!participant) {
        return NextResponse.json({ message: '참여자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 1. 상태 체크 (APPLIED 상태에서만 선정 가능)
    if (participant.status !== ParticipationStatus.APPLIED) {
        return NextResponse.json({
            code: 'CONFLICT_STATE',
            message: '선정할 수 없는 상태입니다. (신청 상태여야 함)'
        }, { status: 409 });
    }

    // 2. 상태 변경 -> SELECTED
    const updated = db.updateParticipantStatus(id, ParticipationStatus.SELECTED, {
        action_type: 'SELECT',
        actor_id: 'user-owner',
        timestamp: new Date().toISOString(),
        comment: '참여자 선정'
    });

    return NextResponse.json({
        status: 'SELECTED',
        message: '참여자가 선정되었습니다.',
        data: updated
    });
}
