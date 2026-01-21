"use client"

/**
 * 캠페인 관리 페이지 - Clean & Professional Style
 * 대시보드와 톤앤매너를 맞춘 깔끔한 카드형 디자인 (이미지 포함)
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Campaign, CampaignStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
import {
    Plus,
    Search,
    Filter,
    Instagram,
    Youtube,
    FileText,
    Image as ImageIcon,
    Users,
    MousePointerClick,
    MessageCircle,
    Hash,
    Gift,
    Coins
} from "lucide-react"

// 아이콘 매핑
const Icons = {
    Instagram: Instagram as any,
    Youtube: Youtube as any,
    Blog: FileText as any,
    Shorts: ImageIcon as any,
    Users: Users as any,
    Click: MousePointerClick as any,
    Review: MessageCircle as any,
    Hash: Hash as any,
    Gift: Gift as any,
    Coins: Coins as any,
    Store: Store as any, // 상점 아이콘 추가
    ChevronRight: ChevronRight as any // 화살표 아이콘 추가
}

import { Store, ChevronRight } from "lucide-react"

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
    imageUrl?: string
    is_always_open?: boolean
    // Live Preview 관련 추가 필드
    type?: 'package' | 'content' | 'review' // 캠페인 타입
    business_intro?: string // 한줄 소개
    keywords?: string[] // 키워드
    reward_items?: string[] // 물품 보상 목록
    business_id?: string // 사업장 ID
}

const BUSINESSES = [
    { id: "all", name: "전체 사업장" },
    { id: "gangnam", name: "강남점" },
    { id: "hongdae", name: "홍대점" }
]

// 더미 데이터
const MOCK_CAMPAIGNS: CampaignWithStats[] = [
    {
        id: '1',
        owner_id: 'user1',
        business_id: 'gangnam',
        title: '[강남점] 시그니처 파스타 체험단 모집',
        mission_guide: '매장 방문 후 인스타그램 릴스 1건 업로드',
        reward_amount: 30000,
        recruit_start_date: '2026-01-10',
        recruit_end_date: '2026-01-20',
        status: CampaignStatus.RECRUITING,
        platform: 'instagram',
        img_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80',
        stats: { total: 20, applied: 15, selected: 0, submitted: 0, approved: 0 },
        type: 'content',
        business_intro: '정성을 담아 운영하는 오프라인 매장입니다.',
        keywords: ['강남맛집', '파스타', '데이트'],
        reward_items: ['5만원 식사권']
    },
    {
        id: '2',
        owner_id: 'user1',
        business_id: 'hongdae',
        title: '신메뉴 런칭 기념 블로그 리뷰',
        mission_guide: '네이버 블로그 1000자 이상, 사진 15장 이상',
        reward_amount: 50000,
        recruit_start_date: '2026-01-01',
        recruit_end_date: '2026-01-15',
        status: CampaignStatus.IN_PROGRESS,
        platform: 'blog',
        img_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        stats: { total: 10, applied: 32, selected: 10, submitted: 5, approved: 2 },
        type: 'package',
        business_intro: '신선한 재료로 만든 브런치 카페입니다.',
        keywords: ['신메뉴', '블로그리뷰', '브런치'],
        reward_items: ['2인 브런치 세트', '음료 2잔']
    },
    {
        id: '3',
        owner_id: 'user1',
        business_id: 'gangnam',
        title: '여름 시즌 음료 유튜브 쇼츠 홍보',
        mission_guide: '음료 제조 과정 및 시음 영상',
        reward_amount: 100000,
        recruit_start_date: '2025-12-20',
        recruit_end_date: '2025-12-31',
        status: CampaignStatus.COMPLETED,
        platform: 'youtube',
        img_url: 'https://images.unsplash.com/photo-1497515114629-f71d768fd61c?w=800&q=80',
        stats: { total: 5, applied: 20, selected: 5, submitted: 5, approved: 5 },
        type: 'content',
        business_intro: '여름 시즌 한정 메뉴 홍보',
        keywords: ['여름음료', '유튜브쇼츠', '카페'],
        reward_items: []
    },
    {
        id: '4',
        owner_id: 'user1',
        business_id: 'hongdae',
        title: '주말 웨이팅 필수 맛집! 방문 체험단',
        mission_guide: '주말 방문 가능자 모집',
        reward_amount: 0,
        recruit_start_date: '2026-01-15',
        recruit_end_date: '2026-01-25',
        status: CampaignStatus.RECRUITING, // 모집중인데 신청자 0인 케이스
        platform: 'blog',
        img_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
        stats: { total: 10, applied: 0, selected: 0, submitted: 0, approved: 0 },
        type: 'review',
        business_intro: '줄 서서 먹는 맛집입니다.',
        keywords: ['웨이팅맛집', '주말데이트'],
        reward_items: ['3만원 식사권']
    },
    {
        id: '5',
        owner_id: 'user1',
        business_id: 'gangnam',
        title: '비건 베이커리 신제품 인스타 공구',
        mission_guide: '팔로워 1k 이상, 공구 진행 경험자 우대',
        reward_amount: 150000,
        recruit_start_date: '2026-01-12',
        recruit_end_date: '2026-01-22',
        status: CampaignStatus.RECRUITING,
        platform: 'instagram',
        img_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
        stats: { total: 3, applied: 8, selected: 0, submitted: 0, approved: 0 },
        is_always_open: true,
        type: 'content',
        business_intro: '건강하고 맛있는 비건 빵',
        keywords: ['비건', '베이커리', '공구'],
        reward_items: ['비건 빵 세트']
    },
    // 페이징 테스트를 위한 추가 더미 데이터
    {
        id: '6',
        owner_id: 'user1',
        business_id: 'hongdae',
        title: '[홍대] 힙한 감성 카페 체험단',
        mission_guide: '인생샷 3장 이상 필수 포함',
        reward_amount: 20000,
        recruit_start_date: '2026-02-01',
        recruit_end_date: '2026-02-10',
        status: CampaignStatus.RECRUITING,
        platform: 'instagram',
        img_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
        stats: { total: 10, applied: 5, selected: 0, submitted: 0, approved: 0 },
        type: 'content',
        business_intro: '홍대 입구 3분거리 힙플레이스',
        keywords: ['홍대카페', '감성카페'],
        reward_items: ['음료 2잔', '디저트 1개']
    },
    {
        id: '7',
        owner_id: 'user1',
        business_id: 'gangnam',
        title: '가성비 무선 이어폰 리뷰 (유튜브)',
        mission_guide: '언박싱 및 사용 후기 영상 10분 내외',
        reward_amount: 100000,
        recruit_start_date: '2026-02-05',
        recruit_end_date: '2026-02-20',
        status: CampaignStatus.RECRUITING,
        platform: 'youtube',
        img_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
        stats: { total: 3, applied: 10, selected: 0, submitted: 0, approved: 0 },
        type: 'review',
        business_intro: '음질 좋은 가성비 이어폰',
        keywords: ['무선이어폰', '테크리뷰'],
        reward_items: ['제품 제공']
    },
    {
        id: '8',
        owner_id: 'user1',
        business_id: 'hongdae',
        title: '제주도 한달살기 숙소 체험',
        mission_guide: '숙소 실내외 사진 20장 이상+동영상',
        reward_amount: 0,
        recruit_start_date: '2026-03-01',
        recruit_end_date: '2026-03-15',
        status: CampaignStatus.DRAFT,
        platform: 'blog',
        img_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        stats: { total: 1, applied: 0, selected: 0, submitted: 0, approved: 0 },
        type: 'package',
        business_intro: '제주 숲속 프라이빗 독채 펜션',
        keywords: ['제주여행', '한달살기', '감성숙소'],
        reward_items: ['2박 3일 숙박권']
    },
    {
        id: '9',
        owner_id: 'user1',
        business_id: 'gangnam',
        title: '[테스트] 긴 텍스트와 많은 해시태그 레이아웃 확인용',
        mission_guide: '해시태그와 리워드 텍스트가 길어질 때 카드가 어떻게 변하는지 확인하기 위한 테스트 데이터입니다.',
        reward_amount: 500000,
        recruit_start_date: '2026-04-01',
        recruit_end_date: '2026-04-10',
        status: CampaignStatus.RECRUITING,
        platform: 'blog',
        img_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
        stats: { total: 100, applied: 50, selected: 10, submitted: 5, approved: 0 },
        type: 'content',
        business_intro: '긴 텍스트 테스트 매장',
        keywords: ['엄청나게긴키워드테스트', '두번째긴키워드입니다', '세번째키워드도길어요', '숨겨진네번째키워드', '숨겨진다섯번째'],
        reward_items: ['매우 긴 이름의 고급 코스 요리 2인 식사권 제공', '추가 음료 및 디저트 무제한 제공']
    },
    {
        id: '10',
        owner_id: 'user1',
        business_id: 'hongdae',
        title: '[극한테스트] 제목이 너무 길어서 두 줄을 넘어갈 때 어떻게 되는지 확인해보는 캠페인입니다. 어디까지 길어지나요?',
        mission_guide: '키워드와 리워드 뱃지가 엄청나게 많을 때의 테스트입니다.',
        reward_amount: 1000,
        recruit_start_date: '2026-05-01',
        recruit_end_date: '2026-05-10',
        status: CampaignStatus.RECRUITING,
        platform: 'instagram',
        img_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
        stats: { total: 10, applied: 1, selected: 0, submitted: 0, approved: 0 },
        type: 'content',
        business_intro: '데이터 폭탄 테스트',
        keywords: ['키워드1', '키워드2', '키워드3', '키워드4', '키워드5', '키워드6', '키워드7', '키워드8', '키워드9', '키워드10'],
        reward_items: ['커피', '케이크', '쿠키', '샌드위치', '마카롱']
    }
]

export default function CampaignsPage() {
    const router = useRouter()
    const [campaigns, setCampaigns] = useState<CampaignWithStats[]>([])
    const [activeTab, setActiveTab] = useState<string>('all')
    const [selectedBusiness, setSelectedBusiness] = useState("all") // 사업장 선택 상태 추가
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 6

    useEffect(() => {
        setCampaigns(MOCK_CAMPAIGNS)
    }, [])

    const filteredCampaigns = campaigns.filter(c => {
        // 탭 필터
        if (activeTab === 'recruiting' && c.status !== CampaignStatus.RECRUITING) return false;
        if (activeTab === 'progress' && c.status !== CampaignStatus.IN_PROGRESS) return false;
        if (activeTab === 'completed' && c.status !== CampaignStatus.COMPLETED) return false;

        // 사업장 필터
        if (selectedBusiness !== 'all' && c.business_id !== selectedBusiness) return false;

        return true;
    })

    // Pagination Logic
    const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE)
    const currentCampaigns = filteredCampaigns.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // 탭 또는 사업장 변경 시 페이지 리셋
    useEffect(() => {
        setCurrentPage(1)
    }, [activeTab, selectedBusiness])

    const handleCardClick = (id: string, e: React.MouseEvent) => {
        // 이미 버튼 클릭 이벤트가 처리되었으면 무시 (하지만 버튼은 stopPropagation을 씀)
        // 카드 전체 클릭 시 기본 상세 페이지로 이동
        router.push(`/owner/campaigns/${id}`)
    }

    const handleActionClick = (e: React.MouseEvent, campaign: CampaignWithStats) => {
        e.stopPropagation()

        if (campaign.status === CampaignStatus.RECRUITING) {
            if ((campaign.stats?.applied || 0) === 0) {
                // 신청자 0명 -> 수정하기
                router.push(`/owner/campaigns/${campaign.id}/edit`)
            } else {
                // 신청자 1명 이상 -> 신청자 보기
                router.push(`/owner/campaigns/${campaign.id}?tab=applicants`)
            }
        } else if (campaign.status === CampaignStatus.IN_PROGRESS) {
            // 진행중 -> 검수하기
            router.push(`/owner/campaigns/${campaign.id}?tab=review`)
        } else if (campaign.status === CampaignStatus.COMPLETED) {
            // 완료 -> 내용 보기
            router.push(`/owner/campaigns/${campaign.id}?tab=report`)
        } else {
            router.push(`/owner/campaigns/${campaign.id}`)
        }
    }

    const getActionButtonLabel = (campaign: CampaignWithStats) => {
        if (campaign.status === CampaignStatus.RECRUITING) {
            return (campaign.stats?.applied || 0) === 0 ? '수정하기' : '신청자 보기'
        }
        if (campaign.status === CampaignStatus.IN_PROGRESS) return '검수하기'
        if (campaign.status === CampaignStatus.COMPLETED) return '내용 보기'
        if (campaign.status === CampaignStatus.DRAFT) return '이어서 작성'
        return '자세히 보기'
    }

    const getActionButtonStyle = (campaign: CampaignWithStats) => {
        if (campaign.status === CampaignStatus.RECRUITING) {
            return (campaign.stats?.applied || 0) === 0
                ? 'bg-white border text-gray-700 hover:bg-gray-50' // 수정하기
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' // 신청자 보기
        }
        if (campaign.status === CampaignStatus.IN_PROGRESS) return 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
        if (campaign.status === CampaignStatus.COMPLETED) return 'bg-gray-800 text-white hover:bg-gray-900 shadow-sm'
        return 'bg-white border text-gray-700 hover:bg-gray-50'
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">내 캠페인</h1>
                        <div className="flex items-center gap-3">
                            {/* 사업장 선택 드롭다운 */}
                            <div className="relative inline-block">
                                <select
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-8 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium cursor-pointer"
                                    value={selectedBusiness}
                                    onChange={(e) => setSelectedBusiness(e.target.value)}
                                >
                                    {BUSINESSES.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                <Icons.Store size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <Icons.ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 rotate-90" />
                            </div>
                            <span className="text-sm text-gray-500">
                                총 <span className="font-semibold text-indigo-600">{filteredCampaigns.length}개</span>의 캠페인
                            </span>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium"
                        onClick={() => router.push('/owner/campaigns/new')}
                    >
                        <Plus size={18} className="mr-2" />
                        새 캠페인 만들기
                    </Button>
                </div>

                {/* 탭 및 필터 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-1">
                    <div className="flex gap-6">
                        {['all', 'recruiting', 'progress', 'completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === tab
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab === 'all' && '전체'}
                                {tab === 'recruiting' && '모집중'}
                                {tab === 'progress' && '진행중'}
                                {tab === 'completed' && '완료됨'}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="캠페인 검색..."
                                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full sm:w-64"
                            />
                        </div>

                    </div>
                </div>

                {/* 캠페인 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCampaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group flex flex-col h-full overflow-hidden"
                            onClick={(e) => handleCardClick(campaign.id, e)}
                        >
                            {/* 카드 상단: 이미지 */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden shrink-0">
                                {campaign.img_url ? (
                                    <img
                                        src={campaign.img_url}
                                        alt={campaign.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <ImageIcon size={48} opacity={0.2} />
                                    </div>
                                )}

                                {/* 뱃지 오버레이 */}
                                <div className="absolute top-4 right-4">
                                    <StatusBadge status={campaign.status as CampaignStatus} />
                                </div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <PlatformIcon platform={campaign.platform} />

                                </div>
                            </div>

                            {/* 카드 내용 */}
                            <div className="p-5 flex-1 flex flex-col gap-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                        {campaign.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                        {campaign.business_intro || campaign.mission_guide}
                                    </p>
                                </div>

                                {/* 키워드 & 해시태그 */}
                                <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                                    {(campaign.keywords || []).slice(0, 3).map((k, i) => (
                                        <span key={i} className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center">
                                            <Icons.Hash size={10} className="mr-0.5" />{k}
                                        </span>
                                    ))}
                                </div>

                                {/* 리워드 뱃지 */}
                                <div className="flex flex-wrap gap-1.5">
                                    {(campaign.reward_items || []).slice(0, 2).map((item, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded border border-indigo-100">
                                            <Icons.Gift size={12} /> {item}
                                        </span>
                                    ))}
                                    {(campaign.reward_amount || 0) > 0 && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded border border-yellow-100">
                                            <Icons.Coins size={12} /> {(campaign.reward_amount || 0).toLocaleString()}P
                                        </span>
                                    )}
                                </div>

                                {/* 하단 액션 영역: 요약 정보 + 버튼 */}
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                                    {/* 모집기간/인원 요약 */}
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-gray-700">모집</span>
                                            <span>
                                                {campaign.is_always_open
                                                    ? '상시모집'
                                                    : campaign.status === CampaignStatus.DRAFT ? '-' : `~ ${formatDateSimple(campaign.recruit_end_date)}`}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-gray-700">신청</span>
                                            <span className="text-indigo-600 font-bold">{campaign.stats?.applied}명</span>
                                            <span className="text-gray-300">/</span>
                                            <span>{campaign.stats?.total || 0}명 모집</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        size="sm"
                                        className={`${getActionButtonStyle(campaign)} transition-all text-xs h-9 px-4 rounded-lg`}
                                        onClick={(e) => handleActionClick(e, campaign)}
                                    >
                                        {getActionButtonLabel(campaign)}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredCampaigns.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-gray-300 text-gray-400">
                            <p>조건에 맞는 캠페인이 없습니다.</p>
                        </div>
                    )}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-white"
                        >
                            이전
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-white"
                        >
                            다음
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

function PlatformIcon({ platform }: { platform?: string }) {
    if (!platform) return null;

    let Icon = Icons.Blog;
    let bgColor = "bg-green-500";
    let text = "N";

    if (platform === 'instagram') {
        Icon = Icons.Instagram;
        bgColor = "bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500";
        text = "";
    } else if (platform === 'youtube') {
        Icon = Icons.Youtube;
        bgColor = "bg-red-600";
        text = "";
    }

    return (
        <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center text-white shadow-sm`}>
            {text ? <span className="font-bold text-xs">{text}</span> : <Icon size={16} />}
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
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-sm ${styles[status] || styles[CampaignStatus.DRAFT]}`}>
            {labels[status] || "상태없음"}
        </span>
    )
}

function formatDateSimple(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
}
