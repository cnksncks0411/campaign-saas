import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';
import { ParticipationStatus, ActionLog } from '@/types';

// POST /api/submissions/[id]/reject (Request Revision)
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json(); // { comment: string }

    if (!body.comment) {
        return NextResponse.json({ message: '수정 요청 사유는 필수입니다.' }, { status: 400 });
    }

    const participant = db.getParticipant(id);
    if (!participant) {
        return NextResponse.json({ message: '참여 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 1. 상태 체크
    if (participant.status !== ParticipationStatus.SUBMITTED && participant.status !== ParticipationStatus.RESUBMITTED) {
        return NextResponse.json({
            code: 'CONFLICT_STATE',
            message: '수정 요청을 보낼 수 없는 상태입니다.'
        }, { status: 409 });
    }

    // 2. 횟수 제한 체크 (Logic)
    // h: ActionLog 타입 명시
    const revisionCount = participant.history.filter((h: ActionLog) => h.action_type === 'REQUEST_REVISION').length;
    if (revisionCount >= 2) {
        return NextResponse.json({
            code: 'REVISION_LIMIT_EXCEEDED',
            message: '수정 요청 횟수(2회)를 초과했습니다. 승인 또는 중재 요청만 가능합니다.'
        }, { status: 400 });
    }

    // 3. 상태 변경 -> IN_REVISION
    const updated = db.updateParticipantStatus(id, ParticipationStatus.IN_REVISION, {
        action_type: 'REQUEST_REVISION',
        actor_id: 'user-owner', // Mocking Owner ID
        timestamp: new Date().toISOString(),
        comment: body.comment
    });

    return NextResponse.json({
        status: 'IN_REVISION',
        message: '수정 요청이 전송되었습니다.',
        revision_count: revisionCount + 1,
        data: updated
    });
}
