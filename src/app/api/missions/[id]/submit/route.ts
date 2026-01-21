import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';
import { ParticipationStatus } from '@/types';

// POST /api/missions/[id]/submit (제출하기)
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params; // id = participantId
    const body = await request.json();

    const participant = db.getParticipant(id);

    if (!participant) {
        return NextResponse.json({ message: '참여 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 1. 상태 체크 (SELECTED 또는 IN_REVISION 상태에서만 제출 가능)
    if (participant.status !== ParticipationStatus.SELECTED && participant.status !== ParticipationStatus.IN_REVISION) {
        return NextResponse.json({
            code: 'CONFLICT_STATE',
            message: '제출할 수 없는 상태입니다.'
        }, { status: 409 });
    }

    // 2. 제출 데이터 업데이트
    participant.submission = {
        link_url: body.link_url || '',
        image_urls: body.image_urls || [],
        content: body.content || '',
        submitted_at: new Date().toISOString()
    };

    // 3. 상태 변경
    const newStatus = participant.status === ParticipationStatus.IN_REVISION
        ? ParticipationStatus.RESUBMITTED
        : ParticipationStatus.SUBMITTED;

    const updated = db.updateParticipantStatus(id, newStatus, {
        action_type: 'SUBMIT',
        actor_id: participant.user_id,
        timestamp: new Date().toISOString(),
        comment: participant.status === ParticipationStatus.IN_REVISION ? '재제출' : '최초 제출'
    });

    return NextResponse.json({
        status: newStatus,
        message: '제출되었습니다.',
        data: updated
    });
}
