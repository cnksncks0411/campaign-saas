import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';
import { ParticipationStatus, Participant } from '@/types';

// GET /api/my/tasks (크리에이터 To-Do 조회)
// Mock: user-creator-1의 할 일 목록
export async function GET() {
    const userId = 'user-creator-1'; // Mock User ID

    // 내 참여 목록 필터링
    const myParticipations = db.participants.filter((p: Participant) => p.user_id === userId);

    // 우선순위: 수정요청 > 제출대기 > 검수대기
    const tasks = myParticipations.map((p: Participant) => {
        const campaign = db.getCampaign(p.campaign_id);
        return {
            ...p,
            campaign,
            priority: getPriority(p.status)
        };
    }).sort((a: any, b: any) => a.priority - b.priority);

    return NextResponse.json({
        data: tasks,
        total: tasks.length
    });
}

function getPriority(status: ParticipationStatus): number {
    if (status === ParticipationStatus.IN_REVISION) return 1; // 최우선
    if (status === ParticipationStatus.SELECTED) return 2; // 제출 대기
    if (status === ParticipationStatus.SUBMITTED || status === ParticipationStatus.RESUBMITTED) return 3; // 검수 대기
    return 99; // 기타
}
