import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

// GET /api/campaigns/[id]/participants (참여자 목록 조회)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const participants = db.getParticipantsByCampaign(id);

    return NextResponse.json({
        data: participants,
        total: participants.length
    });
}
