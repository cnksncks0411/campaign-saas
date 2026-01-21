"use client"

/**
 * 소상공인 사장님을 위한 대시보드 - Clean & Professional Style
 * 알록달록한 색상을 배제하고, 신뢰감을 주는 화이트/그레이/딥블루 위주의 정제된 디자인
 * + 페이징 처리 및 용어 "검수"로 통일
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import StatusBadge from "@/components/ui/status-badge"
import TimerChip from "@/components/ui/timer-chip"
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    FileText,
    Users,
    ArrowRight,
    Phone,
    MessageSquare,
    ChevronRight,
    ChevronLeft,
    Wallet,
    TrendingUp,
    ClipboardCheck,
    Store,
    Calendar
} from "lucide-react"

const Icons = {
    AlertCircle: AlertCircle as any,
    CheckCircle2: CheckCircle2 as any,
    Clock: Clock as any,
    DollarSign: DollarSign as any,
    FileText: FileText as any,
    Users: Users as any,
    ArrowRight: ArrowRight as any,
    Phone: Phone as any,
    MessageSquare: MessageSquare as any,
    ChevronRight: ChevronRight as any,
    ChevronLeft: ChevronLeft as any,
    Wallet: Wallet as any,
    TrendingUp: TrendingUp as any,
    ClipboardCheck: ClipboardCheck as any,
    Store: Store as any,
    Calendar: Calendar as any
}

// 페이징 상수
const ITEMS_PER_PAGE = 3;

export default function OwnerDashboard() {
    const router = useRouter()

    // 페이징 상태 관리
    const [todoPage, setTodoPage] = useState(1);
    const [selectedBusiness, setSelectedBusiness] = useState("all");

    const businesses = [
        { id: "all", name: "전체 사업장" },
        { id: "gangnam", name: "강남점" },
        { id: "hongdae", name: "홍대점" }
    ];

    // 날짜 포맷팅 (이번주 월~일)
    const today = new Date();
    const currentDay = today.getDay(); // 0: 일요일, 1: 월요일...
    const diffToMon = currentDay === 0 ? -6 : 1 - currentDay; // 월요일까지의 차이

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMon);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDateShort = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
    const dateString = `${formatDateShort(startOfWeek)} ~ ${formatDateShort(endOfWeek)} 기준`;

    const data = {
        weeklySpent: 45000,
        runningCampaigns: [
            { name: "신메뉴 런칭 홍보", participants: 3, spent: 15000 },
            { name: "강남점 블로그 리뷰", participants: 2, spent: 30000 },
            { name: "가을 시즌 메뉴 체험단", participants: 5, spent: 50000 },
            { name: "인스타그램 릴스 챌린지", participants: 10, spent: 100000 },
            { name: "유튜브 쇼츠 바이럴", participants: 4, spent: 40000 },
            { name: "네이버 영수증 리뷰 이벤트", participants: 15, spent: 15000 },
            { name: "주말 한정 할인 프로모션", participants: 8, spent: 24000 },
        ],
        completedReviews: 12,
        pendingReviews: 8, // 데이터 개수에 맞춰 수정
        credits: {
            total: 150000,
            available: 145000,
            reserved: 5000
        }
    }

    // 할 일 리스트 (선정 + 검수)
    // 캠페인 정보를 중심으로 재구성
    // 할 일 리스트 (캠페인 기준 집계)
    const todos = [
        {
            id: 101,
            campaignTitle: "신메뉴 런칭 홍보 체험단",
            campaignStatus: "진행중",
            platform: 'blog',
            applied: 15,
            selected: 5,
            reviewWait: 3, // 검수 대기
            deadline: "2026-01-14T10:00:00Z",
            urgent: true,
            img_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80'
        },
        {
            id: 102,
            campaignTitle: "[강남점] 파스타 신메뉴 체험단",
            campaignStatus: "모집중",
            platform: 'instagram',
            applied: 42, // 신청자 많음
            selected: 0,
            reviewWait: 0,
            deadline: "2026-01-15T14:00:00Z",
            urgent: false,
            img_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'
        },
        {
            id: 103,
            campaignTitle: "여름 시즌 음료 쇼츠 홍보",
            campaignStatus: "진행중",
            platform: 'youtube',
            applied: 20,
            selected: 5,
            reviewWait: 1, // 1명 검수 대기
            deadline: "2026-01-13T23:59:00Z",
            urgent: true,
            img_url: 'https://images.unsplash.com/photo-1497515114629-f71d768fd61c?w=800&q=80'
        },
        {
            id: 105,
            campaignTitle: "인스타그램 릴스 챌린지",
            campaignStatus: "모집중",
            platform: 'instagram',
            applied: 8,
            selected: 0,
            reviewWait: 0,
            deadline: "2026-01-17T09:00:00Z",
            urgent: false,
            img_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80'
        },
    ];

    // 페이징 계산 로직
    // 긴급한 건 우선 정렬
    const sortedTodos = [...todos].sort((a, b) => (Number(b.urgent) - Number(a.urgent)));
    const totalTodoPages = Math.ceil(sortedTodos.length / ITEMS_PER_PAGE);
    const currentTodos = sortedTodos.slice((todoPage - 1) * ITEMS_PER_PAGE, todoPage * ITEMS_PER_PAGE);

    return (
        <div className="p-4 lg:p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* 헤더 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
                            <div className="relative">
                                <select
                                    className="appearance-none pl-8 pr-8 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                                    value={selectedBusiness}
                                    onChange={(e) => setSelectedBusiness(e.target.value)}
                                >
                                    {businesses.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                <Icons.Store size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                <Icons.ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 rotate-90" />
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">오늘 처리할 선정/검수 작업이 <span className="font-semibold text-indigo-600">{todos.length}건</span> 있습니다.</p>
                    </div>
                    <Button
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-medium"
                        onClick={() => router.push('/owner/campaigns/new')}
                    >
                        + 새 캠페인 만들기
                    </Button>
                </div>

                {/* 핵심 지표 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 카드 1 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-indigo-200 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">이번 주 사용 금액</span>
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Icons.DollarSign size={18} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{data.weeklySpent.toLocaleString()}</span>
                            <span className="text-lg font-medium text-gray-900">원</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Icons.Calendar size={12} />
                            {dateString} 기준
                        </p>
                    </div>

                    {/* 카드 2 */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-indigo-200 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">완료된 홍보</span>
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <Icons.TrendingUp size={18} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{data.completedReviews}</span>
                            <span className="text-lg font-medium text-gray-900">건</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            블로그, 인스타그램, 유튜브
                        </p>
                    </div>

                    {/* 카드 3 - 할 일 (선정/검수) */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-orange-200 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">할 일 (선정/검수)</span>
                            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                                <Icons.ClipboardCheck size={18} />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-gray-900">{todos.length}</span>
                            <span className="text-lg font-medium text-gray-900">건</span>
                        </div>
                        <p className="text-sm text-orange-600 font-medium mt-2 flex items-center gap-1">
                            <Icons.AlertCircle size={14} />
                            선정 및 검수가 필요합니다
                        </p>
                    </div>
                </div>

                {/* 메인 섹션 */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* 왼쪽: 리스트 영역 (2/3 차지) */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* 할 일 리스트 */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Icons.ClipboardCheck className="text-indigo-600" size={20} />
                                    할 일 리스트 (선정/검수)
                                </h2>
                                {/* 검수 대기 페이지네이션 */}
                                {totalTodoPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setTodoPage(p => Math.max(1, p - 1))}
                                            disabled={todoPage === 1}
                                        >
                                            <Icons.ChevronLeft size={14} />
                                        </Button>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {todoPage} / {totalTodoPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => setTodoPage(p => Math.min(totalTodoPages, p + 1))}
                                            disabled={todoPage === totalTodoPages}
                                        >
                                            <Icons.ChevronRight size={14} />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="divide-y divide-gray-100">
                                {currentTodos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className={`p-5 transition-colors group ${todo.urgent ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                                            {/* 왼쪽: 캠페인 썸네일 */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                <img
                                                    src={todo.img_url}
                                                    alt={todo.campaignTitle}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            {/* 가운데: 캠페인 및 통계 정보 */}
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${todo.campaignStatus === '모집중' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                        {todo.campaignStatus}
                                                    </span>
                                                    <PlatformIcons platform={todo.platform} />
                                                    {todo.urgent && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">
                                                            긴급
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-base font-bold text-gray-900 mb-3 truncate group-hover:text-indigo-600 transition-colors">
                                                    {todo.campaignTitle}
                                                </h3>

                                                {/* 신청 / 선정 / 검수 카운트 */}
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-gray-500 text-xs">신청</span>
                                                        <span className="font-semibold text-gray-900">{todo.applied}</span>
                                                    </div>
                                                    <span className="w-px h-3 bg-gray-200"></span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-gray-500 text-xs">선정</span>
                                                        <span className="font-semibold text-gray-900">{todo.selected}</span>
                                                    </div>
                                                    <span className="w-px h-3 bg-gray-200"></span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-xs ${todo.reviewWait > 0 ? 'text-orange-600 font-bold' : 'text-gray-500'}`}>검수</span>
                                                        <span className={`font-semibold ${todo.reviewWait > 0 ? 'text-orange-600' : 'text-gray-900'}`}>{todo.reviewWait}</span>
                                                    </div>

                                                    {/* 자동승인 타이머 제거 (개별 제출물별로 다르므로 대시보드에서는 노출 안 함) */}
                                                </div>
                                            </div>

                                            {/* 오른쪽: 액션 버튼 */}
                                            <div className="shrink-0 flex items-center justify-center pt-2 sm:pt-0">
                                                {todo.reviewWait > 0 ? (
                                                    <Button
                                                        size="sm"
                                                        className="bg-white border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border w-[100px]"
                                                        onClick={() => router.push('/owner/participants')}
                                                    >
                                                        검수하기 ({todo.reviewWait})
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="bg-purple-600 hover:bg-purple-700 text-white border-transparent shadow-sm w-[100px]"
                                                        onClick={() => router.push('/owner/participants')}
                                                    >
                                                        선정하기 ({todo.applied})
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* 오른쪽: 자산/정보 (1/3 차지) */}
                    <div className="space-y-6">

                        {/* 크레딧 카드 */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <h3 className="text-gray-900 font-bold flex items-center gap-2">
                                    <Icons.Wallet className="text-gray-400" size={20} />
                                    크레딧 잔액
                                </h3>
                                <Button size="sm" variant="outline" className="text-indigo-600 border-indigo-100 bg-indigo-50 hover:bg-indigo-100">
                                    충전
                                </Button>
                            </div>

                            <div className="mb-6 relative z-10">
                                <span className="text-3xl font-bold text-gray-900 tracking-tight">{data.credits.total.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">원</span>
                            </div>

                            <div className="space-y-3 relative z-10 border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">사용 가능</span>
                                    <span className="font-semibold text-gray-900">{data.credits.available.toLocaleString()}원</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">지급 대기 (예치)</span>
                                    <span className="font-semibold text-gray-400">{data.credits.reserved.toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>

                        {/* 도움말 배너 */}
                        <div className="bg-indigo-900 rounded-xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">도움이 필요하신가요?</h3>
                                <p className="text-indigo-200 text-sm mb-4">운영 가이드와 1:1 상담을 이용해보세요.</p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="bg-white text-indigo-900 hover:bg-indigo-50 w-full">
                                        <Icons.Phone size={14} className="mr-1" />
                                        전화 상담
                                    </Button>
                                    <Button size="sm" variant="ghost" className="bg-indigo-800 text-white hover:bg-indigo-700 w-full border border-indigo-700">
                                        <Icons.MessageSquare size={14} className="mr-1" />
                                        문의하기
                                    </Button>
                                </div>
                            </div>
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-800 rounded-full opacity-50"></div>
                            <div className="absolute top-20 -left-10 w-24 h-24 bg-indigo-600 rounded-full opacity-30"></div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function PlatformIcons({ platform }: { platform?: string }) {
    if (!platform) return null;

    // 간단한 텍스트 배지 형태로 반환 (대시보드 리스트용 최적화)
    let color = "text-gray-500 bg-gray-100";
    let text = platform;

    if (platform === 'instagram') {
        color = "text-pink-600 bg-pink-50 border-pink-100";
        text = "Instagram";
    } else if (platform === 'youtube') {
        color = "text-red-600 bg-red-50 border-red-100";
        text = "YouTube";
    } else if (platform === 'blog') {
        color = "text-green-600 bg-green-50 border-green-100";
        text = "Blog";
    }

    return (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${color}`}>
            {text}
        </span>
    )
}
