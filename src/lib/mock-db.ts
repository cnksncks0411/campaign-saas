import { Campaign, CampaignStatus, Participant, ParticipationStatus, UserRole, User } from "@/types";

// Mock Database
// 실제 DB 대신 메모리상에서 데이터를 관리함.

const MOCK_USERS: User[] = [
    { id: 'user-owner', name: '김사장', email: 'owner@store.com', role: UserRole.OWNER, credit_balance: 50000 },
    { id: 'user-creator-1', name: '인플루언서A', email: 'a@creator.com', role: UserRole.CREATOR, credit_balance: 1000 },
    { id: 'user-creator-2', name: '블로거B', email: 'b@creator.com', role: UserRole.CREATOR, credit_balance: 500 },
];

const MOCK_CAMPAIGNS: Campaign[] = [
    {
        id: 'cam-1',
        owner_id: 'user-owner',
        title: '[강남점] 시그니처 파스타 체험단 모집',
        status: CampaignStatus.RECRUITING,
        recruit_end_date: '2026-02-01T00:00:00Z',
        mission_guide: '매장 방문 후 인스타그램 릴스 1건 업로드',
        reward_amount: 30000,
        participants_count: 5
    },
    {
        id: 'cam-2',
        owner_id: 'user-owner',
        title: '신메뉴 런칭 기념 블로그 리뷰',
        status: CampaignStatus.IN_PROGRESS, // 진행중 = 검수 가능 단계
        recruit_end_date: '2026-01-10T00:00:00Z',
        mission_guide: '네이버 블로그 1000자 이상, 사진 5장 필수',
        reward_amount: 50000,
        participants_count: 2
    }
];

const MOCK_PARTICIPANTS: Participant[] = [
    // cam-1 (모집중)에 신청한 사람
    {
        id: 'par-1',
        campaign_id: 'cam-1',
        user_id: 'user-creator-1',
        nickname: '맛집탐방러A',
        status: ParticipationStatus.APPLIED,
        applied_at: '2026-01-12T10:00:00Z',
        history: [{ action_type: 'APPLY', actor_id: 'user-creator-1', timestamp: '2026-01-12T10:00:00Z' }]
    },
    // cam-2 (진행중/검수)에 제출한 사람 -> 검수 대상
    {
        id: 'par-2',
        campaign_id: 'cam-2',
        user_id: 'user-creator-1',
        nickname: '맛집탐방러A',
        status: ParticipationStatus.SUBMITTED,
        applied_at: '2026-01-05T09:00:00Z',
        submission: {
            content: '맛있게 잘 먹었습니다! 블로그 링크 첨부합니다.',
            link_url: 'https://blog.naver.com/test/1234',
            image_urls: ['https://placehold.co/600x400/png', 'https://placehold.co/600x400/png'],
            submitted_at: '2026-01-13T09:00:00Z'
        },
        history: [
            { action_type: 'APPLY', actor_id: 'user-creator-1', timestamp: '2026-01-05T09:00:00Z' },
            { action_type: 'SELECT', actor_id: 'user-owner', timestamp: '2026-01-06T10:00:00Z' },
            { action_type: 'SUBMIT', actor_id: 'user-creator-1', timestamp: '2026-01-13T09:00:00Z' }
        ]
    },
    // cam-2 수정 요청 받은 사람
    {
        id: 'par-3',
        campaign_id: 'cam-2',
        user_id: 'user-creator-2',
        nickname: '리뷰어B',
        status: ParticipationStatus.IN_REVISION,
        applied_at: '2026-01-05T12:00:00Z',
        submission: {
            content: '사진이 좀 어둡게 나왔는데 괜찮나요?',
            link_url: 'https://blog.naver.com/test/5678',
            image_urls: [],
            submitted_at: '2026-01-12T15:00:00Z'
        },
        history: [
            { action_type: 'APPLY', actor_id: 'user-creator-2', timestamp: '2026-01-05T12:00:00Z' },
            { action_type: 'SELECT', actor_id: 'user-owner', timestamp: '2026-01-06T10:00:00Z' },
            { action_type: 'SUBMIT', actor_id: 'user-creator-2', timestamp: '2026-01-12T15:00:00Z' },
            { action_type: 'REQUEST_REVISION', actor_id: 'user-owner', timestamp: '2026-01-12T18:00:00Z', comment: '사진을 좀 더 밝게 보정해주세요.' }
        ]
    }
];

// Singleton Class to manage mock data
export class MockDB {
    users: User[] = MOCK_USERS;
    campaigns: Campaign[] = MOCK_CAMPAIGNS;
    participants: Participant[] = MOCK_PARTICIPANTS;

    getCampaign(id: string) {
        return this.campaigns.find(c => c.id === id);
    }

    getParticipantsByCampaign(campaignId: string) {
        return this.participants.filter(p => p.campaign_id === campaignId);
    }

    getParticipant(id: string) {
        return this.participants.find(p => p.id === id);
    }

    updateParticipantStatus(id: string, status: ParticipationStatus, actionLog?: any) {
        const p = this.participants.find(p => p.id === id);
        if (p) {
            p.status = status;
            if (actionLog) p.history.push(actionLog);
        }
        return p;
    }
}

// Global instance to persist across HMR (in dev)
export const db = (global as any).mockDB || new MockDB();
if (process.env.NODE_ENV !== 'production') (global as any).mockDB = db;
