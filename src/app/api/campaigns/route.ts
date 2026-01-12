import { NextResponse } from 'next/server';
import { db } from '@/lib/mock-db';
import { Campaign, Participant } from '@/types';

// GET /api/campaigns (캠페인 목록 조회)
export async function GET() {
    const campaigns = db.campaigns;

    // 각 캠페인별 참여자 통계 추가
    const campaignsWithStats = campaigns.map((campaign: Campaign) => {
        const participants = db.getParticipantsByCampaign(campaign.id);
        return {
            ...campaign,
            stats: {
                total: participants.length,
                applied: participants.filter((p: Participant) => p.status === 'APPLIED').length,
                selected: participants.filter((p: Participant) => p.status === 'SELECTED').length,
                submitted: participants.filter((p: Participant) => p.status === 'SUBMITTED' || p.status === 'RESUBMITTED').length,
                approved: participants.filter((p: Participant) => p.status === 'APPROVED').length,
            }
        };
    });

    return NextResponse.json({
        data: campaignsWithStats,
        total: campaignsWithStats.length
    });
}
