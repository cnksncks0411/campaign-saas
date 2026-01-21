"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Campaign, CampaignStatus } from "@/types"
import {
    ArrowLeft, Calendar, MapPin, Gift, Coins, Users, FileText, CheckCircle2, Clock,
    MoreVertical, Share2, MessageCircle, Instagram, Youtube, ImageIcon, Hash,
    AlertCircle, Ban, Globe, Target, Camera, Star, Eye, Filter,
    Check, X, Link as LinkIcon, AlertTriangle, TrendingUp, BarChart, ExternalLink, Heart, MessageSquare
} from "lucide-react"

// --- Utilities ---
function formatKoreanNumber(num: number) {
    if (num >= 10000) return (num / 10000).toFixed(1).replace('.0', '') + '만';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + '천';
    return num.toLocaleString();
}

// --- Types ---
interface CampaignWithStats extends Campaign {
    recruit_start_date?: string
    img_url?: string
    stats?: {
        total: number
        applied: number
        selected: number
        submitted: number
        approved: number
    }
    platform?: string
    business_intro?: string
    keywords?: string[]
    reward_items?: string[]
    is_always_open?: boolean
    detail_images?: string[]
    visit_instruction?: string
    mission_precautions?: string
    mandatory_inclusions?: string
    forbidden_content?: string
    submission_requirements?: string[]
    business_address?: string
    homepage_url?: string
    target_gender?: string
    target_age?: string[]
    license_usage?: string[]
    license_period?: string
    type?: string
    business_id?: string
    max_participants?: number
}

interface ChannelInfo {
    type: 'instagram' | 'youtube' | 'blog' | 'tiktok' | 'other'
    url: string
    is_main?: boolean
}

interface Applicant {
    id: string
    name: string
    avatar: string
    gender: 'male' | 'female'
    age: string
    category: string
    platform: 'instagram' | 'blog' | 'youtube' // Main Platform for filters
    channels?: ChannelInfo[] // Multi-channel support
    stats: {
        followers: number
        avg_views: number
        engagement_rate: number
        quality_score: 'S' | 'A' | 'B' | 'C'
        daily_visitors?: number
    }
    insights?: {
        reach: number // 최근 30일 도달
        impressions: number // 최근 30일 노출
        audience_gender: { male: number, female: number } // %
        audience_age_top: string
        audience_location_top: string[]
    }
    channel_name?: string
    recent_posts?: {
        id: string
        thumbnail: string
        likes: number
        comments: number
        date: string
    }[]
    message: string
    status: 'applied' | 'selected' | 'rejected'
    applied_at: string
}

interface Attachment {
    type: 'link' | 'image' | 'file'
    url: string
    name?: string // For display label
}

interface Submission {
    id: string
    campaign_id: string
    applicant_id: string
    attachments: Attachment[]
    message: string
    status: 'pending' | 'approved' | 'modification_requested'
    feedback?: string
    modification_count: number // Max 2
    submitted_at: string
}

interface ReportData {
    total_views: number
    total_likes: number
    total_comments: number
    estimated_ad_value: number
    daily_views: { date: string, value: number }[]
    top_contents: {
        creator_name: string
        avatar: string
        thumbnail: string
        views: number
        likes: number
    }[]
    keyword_ranking: { keyword: string, rank: number }[]
}

// --- Mock Data ---
const MOCK_CAMPAIGN_DETAIL: CampaignWithStats = {
    id: '1',
    owner_id: 'user1',
    business_id: 'gangnam',
    title: '[강남점] 시그니처 파스타 체험단 모집',
    business_intro: '정성을 담아 운영하는 오프라인 매장입니다. 강남역 11번 출구 도보 5분 거리에 위치해 있습니다.',
    mission_guide: '매장 방문 후 인스타그램 릴스 1건 업로드.\n활기찬 매장 분위기와 음식을 맛있게 먹는 장면을 담아주세요.',
    mission_precautions: '• 예약 시간 엄수 부탁드립니다.\n• 당일 취소 및 노쇼 시 향후 캠페인 참여가 제한됩니다.\n• 타인의 초상권을 침해하지 않도록 주의해주세요.',
    mandatory_inclusions: '• 매장 위치 지도 태그 필수\n• 메뉴판 및 매장 인테리어 컷 포함\n• 필수 해시태그 3개 이상 포함',
    forbidden_content: '• 타 브랜드(경쟁사) 언급 금지\n• 부정적인 표현이나 비속어 사용 금지',
    submission_requirements: ['콘텐츠 링크', '콘텐츠 스크린샷'],
    recruit_start_date: '2026-01-10',
    recruit_end_date: '2026-01-20',
    max_participants: 5,
    target_gender: 'any',
    target_age: ['20대', '30대'],
    visit_instruction: '평일 오후 2시~5시 방문 권장 (주말/공휴일 방문 불가). 방문 3일 전 예약 필수.',
    reward_amount: 30000,
    reward_items: ['5만원 식사권', '음료 2잔'],
    status: CampaignStatus.RECRUITING,
    platform: 'instagram',
    img_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
    detail_images: [
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
    ],
    stats: { total: 5, applied: 12, selected: 0, submitted: 0, approved: 0 },
    type: 'content',
    keywords: ['강남맛집', '파스타', '데이트', '이탈리안레스토랑'],
    business_address: '서울시 강남구 테헤란로 123',
    homepage_url: 'https://instagram.com/pasta_gangnam',
    license_usage: ['마케팅 홍보물', '공식 SNS 리그램'],
    license_period: '12'
}

const MOCK_APPLICANTS: Applicant[] = [
    {
        id: 'a1',
        name: '맛스타',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
        gender: 'female',
        age: '20대',
        category: '맛집/카페',
        platform: 'instagram',
        channels: [
            { type: 'instagram', url: 'https://instagram.com', is_main: true },
            { type: 'youtube', url: 'https://youtube.com' }
        ],
        stats: { followers: 15200, avg_views: 3500, engagement_rate: 5.6, quality_score: 'S' },
        insights: {
            reach: 85000,
            impressions: 120000,
            audience_gender: { male: 30, female: 70 },
            audience_age_top: '25-34세',
            audience_location_top: ['서울 강남구', '서울 서초구']
        },
        recent_posts: [
            { id: 'p1', thumbnail: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80', likes: 450, comments: 23, date: '1일 전' },
            { id: 'p2', thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', likes: 380, comments: 15, date: '3일 전' },
            { id: 'p3', thumbnail: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80', likes: 520, comments: 40, date: '5일 전' }
        ],
        message: '안녕하세요! 릴스 전문 크리에이터입니다. 고화질 영상으로 매장의 분위기를 잘 담아보겠습니다. 유튜브 숏츠도 함께 올려드릴 수 있어요!',
        status: 'applied',
        applied_at: '2026-01-15'
    },
    {
        id: 'a2',
        name: '서울라이프',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
        gender: 'male',
        age: '30대',
        category: '일상/브이로그',
        platform: 'instagram',
        channels: [
            { type: 'instagram', url: 'https://instagram.com', is_main: true },
            { type: 'blog', url: 'https://blog.naver.com' }
        ],
        stats: { followers: 5600, avg_views: 1200, engagement_rate: 5.7, quality_score: 'A' },
        insights: {
            reach: 45000,
            impressions: 60000,
            audience_gender: { male: 50, female: 50 },
            audience_age_top: '30-39세',
            audience_location_top: ['서울 마포구', '서울 용산구']
        },
        recent_posts: [
            { id: 'p1', thumbnail: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&q=80', likes: 250, comments: 23, date: '2일 전' },
            { id: 'p2', thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80', likes: 210, comments: 10, date: '4일 전' }
        ],
        message: '사진 퀄리티는 자신 있습니다. 제 피드 한번 확인해주세요! 블로그 리뷰도 가능합니다.',
        status: 'applied',
        applied_at: '2026-01-16'
    },
    {
        id: 'a5',
        name: '카페투어',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
        gender: 'female',
        age: '20대',
        category: '카페/디저트',
        platform: 'instagram',
        channels: [
            { type: 'instagram', url: '#', is_main: true }
        ],
        stats: { followers: 8900, avg_views: 2800, engagement_rate: 6.9, quality_score: 'A' },
        insights: {
            reach: 55000,
            impressions: 80000,
            audience_gender: { male: 20, female: 80 },
            audience_age_top: '18-24세',
            audience_location_top: ['서울', '경기']
        },
        recent_posts: [
            { id: 'p1', thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&q=80', likes: 850, comments: 53, date: '6시간 전' },
        ],
        message: '선정해주시면 일정 맞춰 방문하고 꼼꼼한 리뷰 약속드립니다.',
        status: 'selected',
        applied_at: '2026-01-15'
    }
]

const MOCK_SUBMISSIONS: Submission[] = [
    {
        id: 's1',
        campaign_id: '1',
        applicant_id: 'a5',
        attachments: [
            { type: 'link', url: 'https://instagram.com/reel/123456', name: '콘텐츠 링크' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80', name: '콘텐츠 스크린샷' }
        ],
        message: '가이드라인 꼼꼼히 체크해서 올렸습니다! 원본 파일은 용량이 커서 메일로 보냈습니다 확인 부탁드려요 :)',
        status: 'pending',
        modification_count: 0,
        submitted_at: '2026-01-18'
    },
    {
        id: 's2',
        campaign_id: '1',
        applicant_id: 'a2',
        attachments: [
            { type: 'link', url: 'https://instagram.com/reel/987654', name: '콘텐츠 링크' }
        ],
        message: '정성스럽게 작성했습니다. 키워드 상위노출 확인해주세요!',
        status: 'pending',
        modification_count: 1, // 1회 사용 예시
        submitted_at: '2026-01-19'
    }
]

const MOCK_REPORT_DATA: ReportData = {
    total_views: 45200,
    total_likes: 3105,
    total_comments: 89,
    estimated_ad_value: 1250000,
    daily_views: [
        { date: '1.20', value: 1200 },
        { date: '1.21', value: 2500 },
        { date: '1.22', value: 4800 },
        { date: '1.23', value: 3900 },
        { date: '1.24', value: 5100 },
        { date: '1.25', value: 6700 },
        { date: '1.26', value: 5400 }
    ],
    top_contents: [
        {
            creator_name: '서울라이프',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80',
            views: 15200,
            likes: 1205
        },
        {
            creator_name: '푸드러버',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
            views: 12800,
            likes: 980
        },
        {
            creator_name: '카페투어',
            avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80',
            thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
            views: 8900,
            likes: 650
        }
    ],
    keyword_ranking: [
        { keyword: '강남맛집', rank: 1 },
        { keyword: '파스타', rank: 2 },
        { keyword: '데이트코스', rank: 3 },
        { keyword: '서울핫플', rank: 5 }
    ]
}

// Icons
const Icons = {
    Instagram: Instagram as any,
    Youtube: Youtube as any,
    Blog: FileText as any,
    Star: Star as any,
    Eye: Eye as any,
    MessageCircle: MessageCircle as any,
    Globe: Globe as any
}

function PlatformIcon({ platform }: { platform?: string }) {
    if (!platform) return null;
    let Icon = Icons.Blog;
    let bgColor = "bg-green-500";
    if (platform === 'instagram') { Icon = Icons.Instagram; bgColor = "bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500"; }
    else if (platform === 'youtube') { Icon = Icons.Youtube; bgColor = "bg-red-600"; }

    return (
        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center text-white shadow-sm`}>
            {Icon && <Icon size={20} />}
        </div>
    )
}

function StatusBadge({ status }: { status: CampaignStatus }) {
    const styles: Record<CampaignStatus, string> = {
        [CampaignStatus.DRAFT]: "bg-gray-100 text-gray-600 border-gray-200",
        [CampaignStatus.RECRUITING]: "bg-indigo-50 text-indigo-600 border-indigo-100",
        [CampaignStatus.IN_PROGRESS]: "bg-green-50 text-green-600 border-green-100",
        [CampaignStatus.COMPLETED]: "bg-gray-800 text-white border-gray-800",
        [CampaignStatus.RECRUIT_CLOSED]: "bg-gray-100 text-gray-500 border-gray-200",
        [CampaignStatus.REVIEWING]: "bg-yellow-50 text-yellow-600 border-yellow-100",
        [CampaignStatus.CANCELLED]: "bg-red-50 text-red-600 border-red-100",
    }
    const labels: Record<CampaignStatus, string> = {
        [CampaignStatus.DRAFT]: "작성중",
        [CampaignStatus.RECRUITING]: "모집중",
        [CampaignStatus.IN_PROGRESS]: "진행중",
        [CampaignStatus.COMPLETED]: "종료됨",
        [CampaignStatus.RECRUIT_CLOSED]: "모집마감",
        [CampaignStatus.REVIEWING]: "검수중",
        [CampaignStatus.CANCELLED]: "취소됨",
    }
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
            {labels[status]}
        </span>
    )
}

function SectionTitle({ icon: Icon, title }: { icon: any, title: string }) {
    return (
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icon size={20} className="text-gray-500" />
            {title}
        </h3>
    )
}

// -------------------------------------------------------------
// Component: Creator Detail Modal (Enhanced with Meta API style data)
// -------------------------------------------------------------
function CreatorDetailModal({ creator, onClose }: { creator: Applicant | null, onClose: () => void }) {
    if (!creator) return null;

    const getChannelInfo = (platform: string) => {
        switch (platform) {
            case 'instagram': return { label: '인스타그램', icon: Icons.Instagram, bg: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500', text: 'text-white' };
            case 'youtube': return { label: '유튜브', icon: Icons.Youtube, bg: 'bg-red-600', text: 'text-white' };
            case 'blog': return { label: '블로그', icon: Icons.Blog, bg: 'bg-green-500', text: 'text-white' };
            default: return { label: '웹사이트', icon: Icons.Globe, bg: 'bg-gray-700', text: 'text-white' };
        }
    }

    // Normalize channels to list
    const channels = creator.channels?.length
        ? creator.channels
        : [{ type: creator.platform, url: '#' }];

    const MainChannelIcon = getChannelInfo(creator.platform).icon

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col md:flex-row h-full">
                    {/* Left: Profile & Basic Stats */}
                    <div className="md:w-1/3 bg-gray-50 p-8 border-b md:border-b-0 md:border-r border-gray-200">
                        <div className="text-center mb-6">
                            <div className="relative inline-block mb-3">
                                <img src={creator.avatar} alt={creator.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white object-cover" />
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                    <MainChannelIcon size={16} className={`
                                        ${creator.platform === 'youtube' ? 'text-red-500' : ''}
                                        ${creator.platform === 'instagram' ? 'text-pink-500' : ''}
                                        ${creator.platform === 'blog' ? 'text-green-500' : ''}
                                    `} />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-1">
                                {creator.name}
                                {creator.stats.quality_score === 'S' && <Star size={16} className="text-purple-600 fill-purple-600" />}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">{creator.category} 크리에이터</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">팔로워</span>
                                <span className="font-bold text-gray-900">{formatKoreanNumber(creator.stats.followers)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">평균 조회</span>
                                <span className="font-bold text-gray-900">{formatKoreanNumber(creator.stats.avg_views)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">참여율(ER)</span>
                                <span className={`font-bold ${creator.stats.engagement_rate > 5 ? 'text-green-600' : 'text-gray-900'}`}>{creator.stats.engagement_rate}%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-wider">운영 채널 ({channels.length})</h4>
                                <div className="space-y-2">
                                    {channels.map((ch, idx) => {
                                        const info = getChannelInfo(ch.type)
                                        const ChIcon = info.icon
                                        return (
                                            <Button key={idx} variant="outline" className="w-full justify-start gap-3 h-11 hover:bg-gray-50 border-gray-200" onClick={() => window.open(ch.url, '_blank')}>
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${info.bg} ${info.text} shrink-0`}>
                                                    <ChIcon size={14} />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-xs font-bold text-gray-800 leading-none mb-0.5">{info.label} 방문하기</span>
                                                    {ch.is_main && <span className="text-[10px] text-indigo-600 font-medium leading-none">Main Channel</span>}
                                                </div>
                                                <ExternalLink size={14} className="ml-auto text-gray-400 group-hover:text-gray-600" />
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200 text-sm text-gray-600 mt-4">
                                <h4 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-wider">지원 메시지</h4>
                                "{creator.message}"
                            </div>
                        </div>
                    </div>

                    {/* Right: Detailed Insights */}
                    <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <BarChart size={20} className="text-indigo-600" />
                                채널 인사이트
                            </h3>
                            <span className="text-xs text-gray-400">데이터 기준: 최근 30일</span>
                        </div>

                        {/* 1. Reach & Impressions */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                <div className="text-sm text-blue-600 font-medium mb-1">도달 계정 (Reach)</div>
                                <div className="text-2xl font-bold text-blue-900">{formatKoreanNumber(creator.insights?.reach || 0)}</div>
                            </div>
                            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                                <div className="text-sm text-purple-600 font-medium mb-1">총 노출 (Impressions)</div>
                                <div className="text-2xl font-bold text-purple-900">{formatKoreanNumber(creator.insights?.impressions || 0)}</div>
                            </div>
                        </div>

                        {/* 2. Audience Demographics */}
                        <div className="mb-8">
                            <h4 className="font-bold text-gray-900 mb-3 text-sm">타겟 오디언스 분석</h4>
                            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>여성 {creator.insights?.audience_gender.female}%</span>
                                        <span>남성 {creator.insights?.audience_gender.male}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-blue-100 rounded-full overflow-hidden flex">
                                        <div className="bg-pink-400 h-full" style={{ width: `${creator.insights?.audience_gender.female}%` }}></div>
                                        <div className="bg-blue-400 h-full" style={{ width: `${creator.insights?.audience_gender.male}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm mt-2">
                                    <div className="flex-1 bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                                        <Users size={16} className="text-gray-400" />
                                        <span>주 연령대: <span className="font-bold text-gray-900">{creator.insights?.audience_age_top}</span></span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>주 활동 지역: <span className="font-bold text-gray-900">{creator.insights?.audience_location_top[0]}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Recent Posts */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center justify-between">
                                최근 게시물 활동
                                <span className="text-xs font-normal text-gray-500">최근 게시물의 톤앤매너를 확인하세요</span>
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {creator.recent_posts?.map(post => (
                                    <div key={post.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
                                        <img src={post.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                                            <div className="flex items-center gap-1 text-sm font-bold">
                                                <Heart size={12} fill="white" /> {formatKoreanNumber(post.likes)}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <MessageSquare size={10} fill="white" /> {post.comments}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {!creator.recent_posts && (
                                    <div className="col-span-3 text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-lg">
                                        최근 게시물 데이터를 불러올 수 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={20} className="text-gray-600" />
                </button>
            </div>
        </div>
    )
}

// -------------------------------------------------------------
// Component: Applicants Tab
// -------------------------------------------------------------
function ApplicantsTab({ campaign, applicants: initialApplicants, onViewCreator, onSelectCountChange }: { campaign: CampaignWithStats, applicants: Applicant[], onViewCreator: (creator: Applicant) => void, onSelectCountChange: (count: number) => void }) {
    const [applicants, setApplicants] = useState(initialApplicants)
    const [filter, setFilter] = useState<'all' | 'applied' | 'selected' | 'rejected'>('all')

    // Notify parent of count change
    useEffect(() => {
        onSelectCountChange(applicants.filter(a => a.status === 'selected').length)
    }, [applicants, onSelectCountChange])

    const filtered = applicants.filter(a => filter === 'all' ? true : a.status === filter)

    const handleSelect = (id: string, name: string) => {
        if (confirm(`'${name}'님을 체험단으로 선정하시겠습니까?\n\n[주의] 선정 후에는 취소가 불가능합니다. 신중하게 결정해주세요.`)) {
            setApplicants(prev => prev.map(a =>
                a.id === id ? { ...a, status: 'selected' } : a
            ))
            alert(`${name}님이 선정되었습니다.`)
        }
    }

    const handleReject = (id: string) => {
        if (confirm("정말 거절하시겠습니까?")) {
            setApplicants(prev => prev.map(a =>
                a.id === id ? { ...a, status: 'rejected' } : a
            ))
        }
    }

    const openChat = (name: string) => {
        alert(`${name}님과의 1:1 대화방을 생성합니다.`)
    }

    return (
        <div className="space-y-6">
            {/* Filter & Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                <div className="flex gap-2">
                    {[{ id: 'all', label: '전체' }, { id: 'applied', label: '대기중' }, { id: 'selected', label: '선정됨' }, { id: 'rejected', label: '거절됨' }].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilter(t.id as any)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {t.label} {t.id === 'all' ? applicants.length : applicants.filter(a => a.status === t.id).length}
                        </button>
                    ))}
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="font-semibold text-indigo-600">{applicants.filter(a => a.status === 'selected').length}</span>
                    <span>/</span>
                    <span>{campaign.max_participants}명 선정완료</span>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                        <Users size={40} className="mx-auto mb-4 text-gray-300" />
                        <p>해당 조건의 신청자가 없습니다.</p>
                    </div>
                ) : filtered.map((applicant) => (
                    <div key={applicant.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-indigo-300 transition-colors flex flex-col md:flex-row gap-6">
                        {/* Profile */}
                        <div className="flex items-start gap-4 md:w-1/4 min-w-[200px] border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 cursor-pointer" onClick={() => onViewCreator(applicant)}>
                            <img src={applicant.avatar} alt={applicant.name} className="w-14 h-14 rounded-full object-cover border border-gray-100 shrink-0" />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900 hover:text-indigo-600 transition-colors">{applicant.name}</h4>
                                    {applicant.stats.quality_score === 'S' && <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">HIGH</span>}
                                </div>
                                <div className="text-xs text-gray-500 space-y-0.5">
                                    <p className="font-medium text-indigo-600">{applicant.category}</p>
                                    <p>{applicant.gender === 'female' ? '여성' : '남성'} · {applicant.age}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
                            <div className="text-center sm:text-left">
                                <span className="text-xs text-gray-500 block mb-1">팔로워</span>
                                <span className="font-bold text-gray-900 text-lg">{formatKoreanNumber(applicant.stats.followers)}</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <span className="text-xs text-gray-500 block mb-1">평균 조회수</span>
                                <span className="font-bold text-gray-900 text-lg flex items-center gap-1 justify-center sm:justify-start">
                                    <Icons.Eye size={14} className="text-indigo-500" />
                                    {formatKoreanNumber(applicant.stats.avg_views)}
                                </span>
                            </div>
                            <div className="text-center sm:text-left">
                                <span className="text-xs text-gray-500 block mb-1">참여율(ER)</span>
                                <span className={`font-bold text-lg ${applicant.stats.engagement_rate > 5 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {applicant.stats.engagement_rate}%
                                </span>
                            </div>
                            <div className="text-center sm:text-left">
                                <span className="text-xs text-gray-500 block mb-1">활동 등급</span>
                                <span className={`inline-block px-2 py-0.5 rounded text-sm font-bold ${applicant.stats.quality_score === 'S' ? 'bg-purple-100 text-purple-700' :
                                    applicant.stats.quality_score === 'A' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {applicant.stats.quality_score} Grade
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 justify-center md:w-48 md:pl-4 md:border-l border-gray-100">
                            {applicant.status === 'applied' && (
                                <>
                                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleSelect(applicant.id, applicant.name)}>
                                        선정하기
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1 border-gray-200" onClick={() => openChat(applicant.name)}>
                                            <MessageCircle size={14} />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="flex-1 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleReject(applicant.id)}>
                                            거절
                                        </Button>
                                    </div>
                                </>
                            )}
                            {applicant.status === 'selected' && (
                                <div className="text-center w-full">
                                    <div className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg mb-2">
                                        <CheckCircle2 size={16} /> 선정완료
                                    </div>
                                    <p className="text-xs text-indigo-500 cursor-pointer hover:underline" onClick={() => openChat(applicant.name)}>1:1 대화하기</p>
                                </div>
                            )}
                            {applicant.status === 'rejected' && (
                                <div className="text-center w-full text-gray-400 font-medium py-2 bg-gray-50 rounded-lg">
                                    거절됨
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                <Icons.Star className="text-blue-600 shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                    <p className="font-bold text-blue-900 mb-1">인플루언서 선정 Tip</p>
                    <p className="text-blue-800">
                        참여율(ER)이 5% 이상인 인플루언서는 팔로워들과의 소통이 활발합니다.
                        단순 팔로워 수보다는 평균 조회수와 등급(Grade)을 참고하여 성실한 리뷰어를 선정하세요.
                    </p>
                </div>
            </div>
        </div>
    )
}

// -------------------------------------------------------------
// Component: Review Tab
// -------------------------------------------------------------

// Helper for Submission Icons
const SUBMISSION_TYPE_MAP: Record<string, 'link' | 'image' | 'file'> = {
    '콘텐츠 링크': 'link',
    '콘텐츠 스크린샷': 'image',
    '포스팅 원본 파일': 'file',
    '기타 증빙 자료': 'file'
}

function ReviewTab({ campaign, applicants }: { campaign: CampaignWithStats, applicants: Applicant[] }) {
    const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'modification_requested'>('all')

    const getApplicant = (id: string) => applicants.find(a => a.id === id)

    const handleApprove = (id: string) => {
        if (confirm('이 콘텐츠를 승인하시겠습니까?\n승인 후에는 수정 요청을 할 수 없습니다.')) {
            setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s))
            alert('콘텐츠가 승인되었습니다. 포인트가 지급됩니다.')
        }
    }

    const handleRequestMod = (id: string, currentCount: number) => {
        if (currentCount >= 2) {
            alert('수정 요청은 최대 2회까지만 가능합니다.');
            return;
        }
        const reason = prompt(`수정 요청 사유를 입력해주세요.\n(남은 수정 횟수: ${2 - currentCount}회)`)
        if (reason) {
            setSubmissions(prev => prev.map(s => s.id === id ? {
                ...s,
                status: 'modification_requested',
                feedback: reason,
                modification_count: (s.modification_count || 0) + 1
            } : s))
            alert('수정 요청이 전송되었습니다.')
        }
    }

    const filtered = submissions.filter(s => filter === 'all' ? true : s.status === filter)

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">검수대기</span>
            case 'approved': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">승인짐</span>
            case 'modification_requested': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">수정요청</span>
            default: return null
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                {[{ id: 'all', label: '전체 제출' }, { id: 'pending', label: '검수 대기' }, { id: 'modification_requested', label: '수정 요청' }, { id: 'approved', label: '승인 완료' }].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setFilter(t.id as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {t.label} {t.id === 'all' ? submissions.length : submissions.filter(s => s.status === t.id).length}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
                        <CheckCircle2 size={40} className="mx-auto mb-4 text-gray-300" />
                        <p>제출된 콘텐츠가 없습니다.</p>
                    </div>
                ) : filtered.map(item => {
                    const creator = getApplicant(item.applicant_id)
                    return (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Creator Info */}
                                <div className="flex items-center gap-4 md:w-64 md:border-r border-gray-100 md:pr-6 shrink-0">
                                    <img src={creator?.avatar} alt={creator?.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                                    <div>
                                        <div className="font-bold text-gray-900">{creator?.name}</div>
                                        <div className="text-xs text-gray-500">{item.submitted_at} 제출</div>
                                    </div>
                                </div>

                                {/* Content Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <StatusBadge status={item.status} />
                                            <span className="text-xs text-gray-400">제출 현황: {item.attachments.length} / {campaign.submission_requirements?.length || 0}</span>
                                        </div>

                                        {/* Attachments List Based on Requirements */}
                                        <div className="grid gap-2">
                                            {campaign.submission_requirements?.map((reqName, idx) => {
                                                const att = item.attachments.find(a => a.name === reqName) // Match by name
                                                const isMissing = !att

                                                return (
                                                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isMissing ? 'bg-red-50 border-red-100 border-dashed' : 'bg-gray-50 border-gray-100 group hover:border-indigo-200'}`}>
                                                        {/* Icon Area */}
                                                        {isMissing ? (
                                                            <div className="p-2 bg-white rounded border border-red-100 text-red-400">
                                                                <AlertCircle size={16} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {att.type === 'link' && <div className="p-2 bg-white rounded border border-gray-200"><Icons.Globe size={16} className="text-blue-500" /></div>}
                                                                {att.type === 'image' && <div className="p-2 bg-white rounded border border-gray-200"><ImageIcon size={16} className="text-purple-500" /></div>}
                                                                {att.type === 'file' && <div className="p-2 bg-white rounded border border-gray-200"><FileText size={16} className="text-gray-500" /></div>}
                                                            </>
                                                        )}

                                                        {/* Text Area */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-sm font-medium ${isMissing ? 'text-red-700' : 'text-gray-700'}`}>{reqName}</span>
                                                                {isMissing && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">미제출</span>}
                                                            </div>
                                                            {att ? (
                                                                <a href={att.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 truncate hover:text-indigo-600 hover:underline block mt-0.5">
                                                                    {att.url}
                                                                </a>
                                                            ) : (
                                                                <p className="text-xs text-red-400 mt-0.5">이 항목이 제출되지 않았습니다.</p>
                                                            )}
                                                        </div>

                                                        {/* Preview/Action */}
                                                        {!isMissing && att.type === 'image' && (
                                                            <div className="relative w-10 h-10 rounded overflow-hidden border border-gray-200 shrink-0 group-hover:scale-105 transition-transform">
                                                                <img src={att.url} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        )}

                                                        {!isMissing && (
                                                            <a href={att.url} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-full transition-colors">
                                                                <ExternalLink size={16} />
                                                            </a>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <p className="text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg border border-gray-100/50 italic">
                                            "{item.message}"
                                        </p>
                                    </div>

                                    {item.status === 'modification_requested' && (
                                        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg flex items-start gap-2">
                                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                            <div>
                                                <div className="font-bold flex items-center gap-2">
                                                    수정 요청함 ({item.modification_count || 0}/2회)
                                                </div>
                                                <span className="text-xs">사유: {item.feedback}</span>
                                                <p className="text-xs mt-1 text-red-500 font-medium">👉 크리에이터의 수정본 제출을 기다리는 중입니다.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Auto-confirm Timer (Only for pending) */}
                                    {item.status === 'pending' && (
                                        <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
                                            <Clock size={14} />
                                            <span className="font-bold">자동 승인까지 48시간 남음</span>
                                            <span className="text-orange-400">({item.submitted_at} 기준)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-2 justify-center shrink-0 md:min-w-[140px]">
                                    {item.status === 'pending' && (
                                        <>
                                            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full" onClick={() => handleApprove(item.id)}>
                                                콘텐츠 승인
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className={`w-full ${(item.modification_count ?? 0) >= 2 ? 'text-gray-400 border-gray-200 bg-gray-50' : 'text-red-600 hover:bg-red-50 border-red-200'}`}
                                                disabled={(item.modification_count ?? 0) >= 2}
                                                onClick={() => handleRequestMod(item.id, item.modification_count ?? 0)}
                                            >
                                                {(item.modification_count ?? 0) >= 2 ? '수정 불가 (2/2)' : `수정 요청 (${item.modification_count ?? 0}/2)`}
                                            </Button>
                                        </>
                                    )}
                                    {item.status === 'approved' && (
                                        <div className="text-center w-full">
                                            <div className="inline-flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg">
                                                <CheckCircle2 size={16} /> 승인 완료
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">포인트 지급 대기중</p>
                                        </div>
                                    )}
                                    {item.status === 'modification_requested' && (
                                        <div className="text-center w-full">
                                            <div className="inline-flex items-center gap-1 text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                                                <Clock size={16} /> 수정 대기중
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// -------------------------------------------------------------
// Component: Report Tab
// -------------------------------------------------------------
function ReportTab({ campaign }: { campaign: CampaignWithStats }) {
    const data = MOCK_REPORT_DATA // In real app, fetch report by campaign ID

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* 1. Key Metrics Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: '총 노출 (Views)', value: formatKoreanNumber(data.total_views), sub: '목표 대비 120% 달성', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: '총 좋아요 (Likes)', value: formatKoreanNumber(data.total_likes), sub: '참여율 6.8%', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
                    { label: '총 댓글 (Comments)', value: formatKoreanNumber(data.total_comments), sub: '긍정 댓글 92%', icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: '예상 광고 효과', value: `${(data.estimated_ad_value / 10000).toLocaleString()}만원`, sub: 'ROI 410%', icon: Coins, color: 'text-yellow-600', bg: 'bg-yellow-50' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon size={18} className={stat.color} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-xs font-medium text-gray-400">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 2. Growth Chart (Simple CSS Bar Chart) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <BarChart size={20} className="text-indigo-600" />
                            일자별 노출 성과
                        </h3>
                        <span className="text-sm text-gray-400">최근 7일</span>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.daily_views.map((day, idx) => {
                            const maxVal = Math.max(...data.daily_views.map(d => d.value));
                            const heightPercent = (day.value / maxVal) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-full bg-indigo-50 rounded-t-lg relative group-hover:bg-indigo-100 transition-colors" style={{ height: `${heightPercent}%` }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {day.value.toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">{day.date}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* 3. Keyword Ranking */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <Hash size={20} className="text-indigo-600" />
                        상위 노출 키워드
                    </h3>
                    <div className="space-y-4">
                        {data.keyword_ranking.map((kw, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg leading-none ${idx === 0 ? 'bg-yellow-100 text-yellow-600' : idx === 1 ? 'bg-gray-200 text-gray-600' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {kw.rank}
                                    </div>
                                    <span className="font-medium text-gray-700">{kw.keyword}</span>
                                </div>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Rank In</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Best Contents */}
            <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6 text-lg">
                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                    베스트 콘텐츠 TOP 3
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {data.top_contents.map((content, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="relative aspect-[4/5] bg-gray-100">
                                <img src={content.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                    <Eye size={12} /> {formatKoreanNumber(content.views)}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <Button size="sm" className="w-full bg-white text-black hover:bg-gray-100 border-none">
                                        게시물 보러가기 <ExternalLink size={14} className="ml-2" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4 flex items-center gap-3">
                                <img src={content.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-100" />
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{content.creator_name}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                        <Heart size={10} className="fill-red-500 text-red-500" /> {content.likes.toLocaleString()}
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    {idx === 0 && <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-full text-xl">🥇</div>}
                                    {idx === 1 && <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-xl">🥈</div>}
                                    {idx === 2 && <div className="w-8 h-8 flex items-center justify-center bg-orange-50 rounded-full text-xl">🥉</div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// -------------------------------------------------------------
// Component: Main Page
// -------------------------------------------------------------
export default function CampaignDetailPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()

    // Tab State: 'overview' | 'applicants' | 'review' | 'report'
    const [activeTab, setActiveTab] = useState('overview')
    const [campaign, setCampaign] = useState<CampaignWithStats | null>(null)
    const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS)

    // UI States
    const [menuOpen, setMenuOpen] = useState(false)
    const [selectedCreator, setSelectedCreator] = useState<Applicant | null>(null)
    const [selectedCount, setSelectedCount] = useState(0)

    useEffect(() => {
        const mockData = { ...MOCK_CAMPAIGN_DETAIL, id: params.id as string }
        if (params.id === '2') { mockData.status = CampaignStatus.IN_PROGRESS; mockData.stats!.selected = 10; mockData.title = '진행중인 캠페인 예시'; }
        if (params.id === '3') { mockData.status = CampaignStatus.COMPLETED; mockData.title = '종료된 캠페인 예시'; }
        setCampaign(mockData)

        const tabParam = searchParams.get('tab')
        if (tabParam) setActiveTab(tabParam)
    }, [params.id, searchParams])

    // 실제 데이터가 없으므로 MOCK_APPLICANTS 기반으로 카운트 초기화
    useEffect(() => {
        setSelectedCount(applicants.filter(a => a.status === 'selected').length)
    }, [applicants])

    // Click outside to close menu
    useEffect(() => {
        const closeMenu = () => setMenuOpen(false)
        if (menuOpen) window.addEventListener('click', closeMenu)
        return () => window.removeEventListener('click', closeMenu)
    }, [menuOpen])

    if (!campaign) return <div className="p-10 text-center">Loading...</div>

    const getActionButton = () => {
        if (campaign.status === CampaignStatus.RECRUITING) {
            const isZeroApplicants = (applicants.length === 0)
            return {
                label: isZeroApplicants ? '캠페인 수정하기' : '신청자 관리',
                onClick: () => isZeroApplicants ? router.push(`/owner/campaigns/${campaign.id}/edit`) : setActiveTab('applicants'),
                primary: true
            }
        }
        if (campaign.status === CampaignStatus.IN_PROGRESS) {
            return { label: '미션 검수하기', onClick: () => setActiveTab('review'), primary: true }
        }
        if (campaign.status === CampaignStatus.COMPLETED) {
            return { label: '결과 리포트 보기', onClick: () => setActiveTab('report'), primary: false }
        }
        return { label: '수정하기', onClick: () => router.push(`/owner/campaigns/${campaign.id}/edit`), primary: false }
    }

    const actionBtn = getActionButton()
    const hasApplicants = applicants.length > 0
    const canEarlyClose = selectedCount > 0 && selectedCount < (campaign.max_participants || 10) && campaign.status === CampaignStatus.RECRUITING

    const formatTarget = () => {
        const genderMap: any = { any: '성별 무관', male: '남성', female: '여성' }
        const genderStr = genderMap[campaign.target_gender || 'any'] || '성별 무관'
        const ageStr = campaign.target_age?.length ? campaign.target_age.join(', ') : '연령 무관'
        return (
            <span>
                <span className="font-bold text-indigo-600 mr-1.5">[주요 타겟]</span>
                {genderStr} · {ageStr}
            </span>
        )
    }

    const handleEarlyClose = () => {
        if (confirm(`현재 선발된 ${selectedCount}명으로 모집을 조기에 마감하시겠습니까?\n마감 후에는 즉시 캠페인이 진행 상태로 변경됩니다.`)) {
            alert('모집이 마감되었습니다. 캠페인이 진행 중 상태로 변경되었습니다.')
            // API Call Here
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Creator Detail Modal */}
            {selectedCreator && (
                <CreatorDetailModal creator={selectedCreator} onClose={() => setSelectedCreator(null)} />
            )}

            {/* Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>내 캠페인</span>
                        <span>/</span>
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">{campaign.title}</span>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 relative">
                    {/* 신청자가 한 명이라도 있으면 수정/삭제 불가 -> 햄버거 메뉴 및 공유 제거 or 숨김 처리 */}
                    {hasApplicants ? (
                        <>
                            {/* 조기마감 버튼: 1명 이상 선정 시 노출 */}
                            {canEarlyClose && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold animate-in fade-in"
                                    onClick={handleEarlyClose}
                                >
                                    <AlertTriangle size={16} className="mr-1.5" />
                                    모집 조기마감
                                </Button>
                            )}
                        </>
                    ) : (
                        // 신청자가 없을 때만 수정/공유/메뉴 노출
                        <>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('링크가 복사되었습니다.'); }}>
                                <Share2 size={18} />
                            </Button>
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                    onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                                >
                                    <MoreVertical size={18} />
                                </Button>
                                {menuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in">
                                        <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600">캠페인 수정</button>
                                        <hr className="border-gray-100 my-1" />
                                        <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">캠페인 삭제</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">

                {/* Header (Always Visible) */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-72 h-48 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative group">
                        {campaign.img_url ? (
                            <img src={campaign.img_url} alt={campaign.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon size={40} /></div>
                        )}
                        <div className="absolute top-3 left-3">
                            <PlatformIcon platform={campaign.platform} />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <StatusBadge status={campaign.status as CampaignStatus} />
                                    <span className="text-sm text-gray-500 font-medium">{campaign.type === 'content' ? '콘텐츠 캠페인' : '기자단/배포'}</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                                    {campaign.title}
                                </h1>
                                <p className="text-gray-500 line-clamp-2">{campaign.business_intro}</p>
                            </div>
                            <div className="hidden md:block">
                                <Button
                                    size="lg"
                                    className={`${actionBtn.primary ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'} shadow-sm font-semibold px-8`}
                                    onClick={actionBtn.onClick}
                                >
                                    {actionBtn.label}
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto pt-6 border-t border-gray-100">
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">모집 기간</span>
                                <div className="flex items-center gap-1.5 font-medium text-gray-900 text-sm">
                                    <Calendar size={14} className="text-gray-400" />
                                    {campaign.recruit_start_date} ~ {campaign.recruit_end_date}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">제공 리워드</span>
                                <div className="flex items-center gap-1.5 font-medium text-gray-900 text-sm">
                                    <Gift size={14} className="text-gray-400" />
                                    {campaign.reward_items?.[0] || '없음'}
                                    {(campaign.reward_items?.length || 0) > 1 && ` 외 ${(campaign.reward_items?.length || 0) - 1}건`}
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">원고료(포인트)</span>
                                <div className="flex items-center gap-1.5 font-medium text-gray-900 text-sm">
                                    <Coins size={14} className="text-gray-400" />
                                    {(campaign.reward_amount || 0).toLocaleString()} P
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">검색 키워드</span>
                                <div className="flex items-center gap-1.5 font-medium text-gray-900 text-sm">
                                    <Hash size={14} className="text-gray-400" />
                                    {campaign.keywords?.[0]} 외 {(campaign.keywords?.length || 0) - 1}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div>
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8 overflow-x-auto">
                            {[
                                { id: 'overview', label: '캠페인 정보' },
                                {
                                    id: 'applicants', label: `신청자 (${// Mock Count Update
                                        applicants.length
                                        })`
                                },
                                { id: 'review', label: '콘텐츠 검수' },
                                { id: 'report', label: '성과 리포트' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Contents */}
                    <div className="py-8">
                        {activeTab === 'overview' && (
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* ... Overview Content ... */}
                                <div className="lg:col-span-2 space-y-8">
                                    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <SectionTitle icon={FileText} title="미션 가이드" />
                                        <div className="bg-gray-50 p-5 rounded-lg text-gray-700 whitespace-pre-line leading-relaxed mb-6"> {campaign.mission_guide} </div>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> 필수 포함 사항</h4>
                                                <p className="text-sm text-gray-600 whitespace-pre-line bg-indigo-50/50 p-3 rounded-lg">{campaign.mandatory_inclusions || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><Ban size={16} className="text-red-500" /> 금지 / 주의 사항</h4>
                                                <p className="text-sm text-gray-600 whitespace-pre-line bg-red-50/50 p-3 rounded-lg">{[campaign.forbidden_content, campaign.mission_precautions].filter(Boolean).join('\n') || '-'}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <SectionTitle icon={Target} title="제출물 및 키워드" />
                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-gray-900 mb-2">필수 해시태그 / 검색 키워드</h4>
                                            <div className="flex flex-wrap gap-2"> {campaign.keywords?.map((k, i) => (<span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"># {k}</span>))} </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-2">제출해야 할 증빙 자료</h4>
                                            <ul className="space-y-2"> {campaign.submission_requirements?.map((req, i) => (<li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>{req}</li>))} </ul>
                                        </div>
                                    </section>

                                    <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <SectionTitle icon={MapPin} title="매장 및 라이센스 정보" />
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 border rounded-lg">
                                                <div className="p-3 bg-gray-100 rounded-lg"><MapPin size={24} className="text-gray-500" /></div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 mb-1">방문 주소</h4>
                                                    <p className="text-gray-600 text-sm mb-2">{campaign.business_address}</p>
                                                    {campaign.homepage_url && (<a href={campaign.homepage_url} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm hover:underline flex items-center gap-1"><Globe size={14} /> 관련 링크 확인하기</a>)}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg text-sm">
                                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Camera size={16} /> 콘텐츠 2차 활용 범위</h4>
                                                <p className="text-gray-600 mb-2">제출된 콘텐츠는 <strong>{campaign.license_period}개월</strong> 동안 다음 목적으로 활용될 수 있습니다.</p>
                                                <div className="flex flex-wrap gap-2">{campaign.license_usage?.map((use, i) => (<span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">{use}</span>))}</div>
                                            </div>
                                        </div>
                                    </section>

                                    {campaign.detail_images && campaign.detail_images.length > 0 && (
                                        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                            <SectionTitle icon={ImageIcon} title="추가 이미지" />
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {campaign.detail_images.map((img, i) => (<div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"><img src={img} alt={`detail-${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform" /></div>))}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
                                        <h3 className="font-bold text-gray-900 mb-6">모집 요강</h3>
                                        <div className="space-y-6">
                                            <div><span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-2">모집 대상 (타겟)</span><div className="flex items-center gap-2 text-gray-900 font-medium"><Users size={18} className="text-gray-400" />{formatTarget()}</div></div>
                                            <div><span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-2">방문 및 예약 안내</span><div className="bg-orange-50 p-3 rounded-lg text-sm text-orange-800 leading-snug border border-orange-100"><div className="flex gap-2 mb-1 font-bold"><Clock size={16} /> 방문 가능 시간</div>{campaign.visit_instruction}</div></div>
                                            <div><span className="text-xs text-gray-500 font-medium uppercase tracking-wider block mb-2">제공 혜택 상세</span><ul className="space-y-2">{campaign.reward_items?.map((item, i) => (<li key={i} className="flex items-center gap-2 text-sm text-gray-700"><Gift size={16} className="text-indigo-500 shrink-0" /> {item}</li>))}{(campaign.reward_amount || 0) > 0 && (<li className="flex items-center gap-2 text-sm text-gray-700"><Coins size={16} className="text-yellow-500 shrink-0" /> {(campaign.reward_amount || 0).toLocaleString()}P 지급</li>)}</ul></div>
                                            <div className="pt-6 border-t border-gray-100"><div className="flex justify-between items-center text-sm mb-2"><span className="text-gray-500">참여 현황</span><span className="font-medium text-indigo-600">{campaign.stats?.applied} / {campaign.stats?.total} 명</span></div><div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(((campaign.stats?.applied || 0) / (campaign.stats?.total || 1)) * 100, 100)}%` }} /></div></div>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100"><h4 className="font-bold text-indigo-900 mb-2">도움이 필요하신가요?</h4><p className="text-sm text-indigo-700 mb-4">캠페인 수정이나 운영 가이드가 필요하면 확인해보세요.</p><Button variant="outline" size="sm" className="w-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50">운영 가이드 보기</Button></div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'applicants' && (
                            <ApplicantsTab
                                campaign={campaign}
                                applicants={applicants}
                                onViewCreator={(creator) => setSelectedCreator(creator)}
                                onSelectCountChange={setSelectedCount}
                            />
                        )}

                        {activeTab === 'review' && (
                            <ReviewTab campaign={campaign} applicants={applicants} />
                        )}
                        {activeTab === 'report' && (
                            <ReportTab campaign={campaign} />
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile Fab */}
            <div className="md:hidden fixed bottom-6 left-0 right-0 px-6 z-20">
                <Button size="lg" className={`w-full ${actionBtn.primary ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-gray-900 border shadow-lg'} shadow-xl font-bold py-6 rounded-xl`} onClick={actionBtn.onClick}>
                    {actionBtn.label}
                </Button>
            </div>
        </div>
    )
}
