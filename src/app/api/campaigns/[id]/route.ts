import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';

// GET /api/campaigns/[id] (캠페인 상세 조회)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const campaign = db.getCampaign(id);

    if (!campaign) {
        return NextResponse.json({ message: '캠페인을 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(campaign);
}
