// MVP 핵심 Type Definitions
// BE_04_API_Spec_v1.yaml 내용을 기반으로 FE에서 사용할 타입 정의

export enum UserRole {
    OWNER = 'OWNER',
    CREATOR = 'CREATOR',
    ADMIN = 'ADMIN',
}

export enum CampaignStatus {
    DRAFT = 'DRAFT', // 작성중
    RECRUITING = 'RECRUITING', // 모집중
    RECRUIT_CLOSED = 'RECRUIT_CLOSED', // 모집 마감
    IN_PROGRESS = 'IN_PROGRESS', // 진행중 (선정 완료 후)
    REVIEWING = 'REVIEWING', // 검수중
    COMPLETED = 'COMPLETED', // 종료
    CANCELLED = 'CANCELLED', // 취소됨
}

export enum ParticipationStatus {
    APPLIED = 'APPLIED', // 신청함
    SELECTED = 'SELECTED', // 선정됨 (미션 수행 시작)
    SUBMITTED = 'SUBMITTED', // 제출 완료 (검수 대기)
    IN_REVISION = 'IN_REVISION', // 수정 요청 받음 (수정중)
    RESUBMITTED = 'RESUBMITTED', // 재제출 완료 (재검수 대기)
    APPROVED = 'APPROVED', // 검수 승인 (지급 대기)
    PAID = 'PAID', // 지급 완료 (크레딧 이체됨)
    REJECTED = 'REJECTED', // 선정 탈락
    OVERDUE = 'OVERDUE', // 기한 초과
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    credit_balance: number; // 현재 보유 크레딧
}

export interface Campaign {
    id: string;
    owner_id: string;
    title: string;
    status: CampaignStatus;
    recruit_end_date: string; // ISO Date
    mission_guide: string;
    reward_amount: number;
    participants_count?: number; // 통계용
}

export interface Participant {
    id: string; // Participation ID
    campaign_id: string;
    user_id: string;
    nickname: string;
    status: ParticipationStatus;
    applied_at: string;
    submission?: Submission;
    history: ActionLog[];
}

export interface Submission {
    link_url?: string;
    image_urls: string[];
    content: string; // 추가 텍스트
    submitted_at: string;
}

export interface ActionLog {
    action_type: 'APPLY' | 'SELECT' | 'SUBMIT' | 'REQUEST_REVISION' | 'APPROVE' | 'REJECT';
    actor_id: string;
    timestamp: string;
    comment?: string; // 수정요청 사유 등
}

// API Responses
export interface ApiListResponse<T> {
    data: T[];
    total: number;
    page: number;
}

export interface ApiErrorResponse {
    code: string;
    message: string;
}
