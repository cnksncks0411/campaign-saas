"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Search, Filter, Download, Star, MessageCircle, MoreVertical, ShieldAlert, ShieldCheck, Heart, UserCheck, MessageSquare,
    X, Edit2, Save, ExternalLink, Calendar, Link as LinkIcon, History as HistoryIcon, Tag, Smartphone, Instagram, Youtube, CheckCircle
} from "lucide-react"

// --- Types ---
interface CreatorCRM {
    id: string
    name: string
    avatar: string
    platforms: ('instagram' | 'youtube' | 'blog')[]
    grade: 'VIP' | 'Gold' | 'Silver' | 'Bronze'
    status: 'active' | 'blocked' | 'withdrawn'
    memo: string
    sns_links: {
        platform: 'instagram' | 'youtube' | 'blog',
        url: string,
        insights?: {
            followers: number,
            avg_interaction?: number, // likes + comments
            engagement_rate?: number // %
        }
    }[]
    stats: {
        total_campaigns: number
        completion_rate: number // %
        avg_score: number // 5.0 scale
        followers_total: number
        avg_view?: number // NEW: for profile card
        engagement_rate?: number // NEW: for profile card
    }
    last_active: string
    tags: string[]
    // NEW FIELDS FOR UI MATCHING
    description?: string // e.g. "맛집/이선생 크리에이터"
    application_message?: string
    insight_stats?: {
        reach: number
        impressions: number
    }
    audience_stats?: {
        gender_split: { female: number, male: number }
        age_range: string
        location: string
    }
    recent_posts?: string[] // Image URLs
    history: {
        id: string
        campaign_title: string
        status: 'completed' | 'no_show' | 'late'
        date: string
        score: number
        link?: string
        modification_count?: number
    }[]
    associated_stores?: string[] // IDs of stores they participated in
}

// --- Mock Data ---
const MOCK_CREATORS: CreatorCRM[] = [
    {
        id: 'c1',
        name: '서울라이프',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
        platforms: ['instagram', 'blog'],
        grade: 'VIP',
        status: 'active',
        memo: '사진 퀄리티가 매우 좋고, 가이드라인을 완벽하게 준수함. 다음에 또 초대하고 싶음.',
        sns_links: [
            { platform: 'instagram', url: 'https://instagram.com/seoul_life', insights: { followers: 45000, avg_interaction: 1200, engagement_rate: 2.6 } },
            { platform: 'blog', url: 'https://blog.naver.com/seoul_life', insights: { followers: 3000, avg_interaction: 150 } }
        ],
        stats: { total_campaigns: 5, completion_rate: 100, avg_score: 4.9, followers_total: 48000, avg_view: 3500, engagement_rate: 5.6 },
        last_active: '2026-01-20',
        tags: ['사진맛집', '약속철저'],
        associated_stores: ['gangnam', 'hongdae'],
        description: '맛집/카페 전문 크리에이터',
        application_message: '"안녕하세요! 릴스 전문 크리에이터 입니다. 고화질 영상으로 매장의 분위기를 잘 담아보겠습니다. 유튜브 숏츠도 함께 올려드릴 수 있어요!"',
        insight_stats: { reach: 85000, impressions: 120000 },
        audience_stats: { gender_split: { female: 70, male: 30 }, age_range: '25-34세', location: '서울 강남구' },
        recent_posts: [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80',
            'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80'
        ],

        history: [
            { id: 'h1', campaign_title: '[강남점] 시그니처 파스타 체험단', status: 'completed', date: '2026-01-15', score: 5, link: 'https://instagram.com/p/12345', modification_count: 0 },
            { id: 'h2', campaign_title: '겨울 신메뉴 출시 기념', status: 'completed', date: '2025-12-20', score: 5, link: 'https://blog.naver.com/post/123', modification_count: 1 }
        ]
    },
    {
        id: 'c2',
        name: '푸드러버',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        platforms: ['instagram'],
        grade: 'Gold',
        status: 'active',
        memo: '팔로워 반응이 좋음. 다만 마감 시간을 간신히 맞춤.',
        sns_links: [
            { platform: 'instagram', url: 'https://instagram.com/foodlover', insights: { followers: 12000, avg_interaction: 800, engagement_rate: 6.5 } }
        ],
        stats: { total_campaigns: 3, completion_rate: 100, avg_score: 4.5, followers_total: 12000 },
        last_active: '2026-01-15',
        tags: ['인기급상승'],
        associated_stores: ['gangnam'],
        audience_stats: { gender_split: { female: 65, male: 35 }, age_range: '20-29세', location: '서울 마포구' },
        history: [
            { id: 'h3', campaign_title: '[강남점] 시그니처 파스타 체험단', status: 'late', date: '2026-01-18', score: 4, link: 'https://instagram.com/p/67890', modification_count: 2 },
            { id: 'h4', campaign_title: '가을 디저트 페어', status: 'completed', date: '2025-10-10', score: 5, link: 'https://instagram.com/p/abcde', modification_count: 0 }
        ]
    },
    {
        id: 'c3',
        name: '카페투어',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80',
        platforms: ['blog'],
        grade: 'Silver',
        status: 'active',
        memo: '',
        sns_links: [
            { platform: 'blog', url: 'https://blog.naver.com/cafetour', insights: { followers: 500, avg_interaction: 50 } }
        ],
        stats: { total_campaigns: 1, completion_rate: 100, avg_score: 4.0, followers_total: 500 },
        last_active: '2025-12-28',
        tags: ['블로거'],
        associated_stores: ['hongdae', 'busan'],
        audience_stats: { gender_split: { female: 55, male: 45 }, age_range: '30-39세', location: '서울 홍대' },
        history: [
            { id: 'h5', campaign_title: '연말 파티룸 체험단', status: 'completed', date: '2025-12-28', score: 4, link: 'https://blog.naver.com/cafe/999', modification_count: 0 }
        ]
    },
    {
        id: 'c4',
        name: '노쇼빌런',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        platforms: ['instagram'],
        grade: 'Bronze',
        status: 'withdrawn',
        memo: '연락 두절 후 잠수. 절대 선정 금지.',
        associated_stores: ['gangnam'],
        sns_links: [
            { platform: 'instagram', url: 'https://instagram.com/noshow', insights: { followers: 2000, avg_interaction: 10, engagement_rate: 0.5 } }
        ],
        stats: { total_campaigns: 1, completion_rate: 0, avg_score: 1.0, followers_total: 2000 },
        last_active: '2025-11-10',
        tags: ['노쇼', '블랙리스트'],
        audience_stats: { gender_split: { female: 50, male: 50 }, age_range: '18-24세', location: '서울 강남구' },
        history: [
            { id: 'h6', campaign_title: '무료 시식권 이벤트', status: 'no_show', date: '2025-11-10', score: 1, modification_count: 0 }
        ]
    }
]

// --- Icons ---
const Icons = {
    Search, Filter, Download, Star, MessageCircle, MoreVertical,
    ShieldAlert, ShieldCheck, Heart, UserCheck, MessageSquare, X,
    Edit2, Save, ExternalLink, Calendar, LinkIcon, HistoryIcon, Tag, Smartphone,
    Instagram, Youtube, CheckCircle
}

// ------------------------------------------------------------------
// Component: Creator Detail Modal
// ------------------------------------------------------------------
function CreatorDetailModal({ creator, onClose, onUpdate }: { creator: CreatorCRM, onClose: () => void, onUpdate: (updated: CreatorCRM) => void }) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(creator)
    const [newTag, setNewTag] = useState('')

    const handleSave = () => {
        onUpdate(formData)
        setIsEditing(false)
    }

    const handleAddTag = () => {
        if (newTag && !formData.tags.includes(newTag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
            setNewTag('')
        }
    }

    const handleRemoveTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div className="flex gap-4 w-full">
                        <img src={creator.avatar} alt={creator.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-200" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2>
                                <span className={`px-2.5 py-1 rounded text-xs font-bold ${formData.status === 'active' ? 'bg-green-100 text-green-700' :
                                    formData.status === 'blocked' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-500'
                                    }`}>
                                    {formData.status === 'active' ? '활동중' : formData.status === 'blocked' ? '차단함' : '탈퇴함'}
                                </span>
                            </div>

                            {/* 주요 타깃 */}
                            {creator.audience_stats && (
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-medium text-gray-500">주요 타깃:</span>
                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">
                                        {creator.audience_stats.gender_split.female > creator.audience_stats.gender_split.male ? '여성' : '남성'}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-bold">
                                        {creator.audience_stats.age_range}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col gap-2 mb-2 w-full">
                                {creator.sns_links.map((sns, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-indigo-100 transition-colors shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${sns.platform === 'instagram' ? 'bg-pink-50 text-pink-600' :
                                                sns.platform === 'youtube' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                {sns.platform === 'instagram' && <Icons.Instagram size={16} />}
                                                {sns.platform === 'youtube' && <Icons.Youtube size={16} />}
                                                {sns.platform === 'blog' && <span className="font-bold text-xs">N</span>}
                                            </div>
                                            <div>
                                                <a href={sns.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-bold text-sm text-gray-900 hover:text-indigo-600 hover:underline">
                                                    {sns.platform === 'instagram' ? 'Instagram' : sns.platform === 'youtube' ? 'YouTube' : 'Blog'}
                                                    <Icons.ExternalLink size={10} className="text-gray-400" />
                                                </a>
                                                <div className="text-xs text-gray-500">
                                                    {sns.insights?.followers && <span>팔로워 {sns.insights.followers.toLocaleString()}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right text-xs space-y-0.5">
                                            {sns.insights?.avg_interaction && (
                                                <div className="flex justify-end gap-1">
                                                    <span className="text-gray-400">반응</span>
                                                    <span className="font-bold text-gray-900">{sns.insights.avg_interaction.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {sns.insights?.engagement_rate && (
                                                <div className="flex justify-end gap-1">
                                                    <span className="text-gray-400">참여율</span>
                                                    <span className="font-bold text-indigo-600">{sns.insights.engagement_rate}%</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Icons.X size={24} className="text-gray-400" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row">
                    {/* Left: CRM Info (Editable) */}
                    <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 space-y-6 bg-white">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Icons.Edit2 size={16} /> 파트너 노트</h3>
                            {!isEditing ? (
                                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="text-indigo-600">수정</Button>
                            ) : (
                                <Button size="sm" onClick={handleSave} className="bg-indigo-600 text-white">저장</Button>
                            )}
                        </div>

                        {/* Edit Mode */}
                        {isEditing ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">등급 설정</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value as any })}
                                    >
                                        <option value="VIP">VIP (최우수)</option>
                                        <option value="Gold">Gold (우수)</option>
                                        <option value="Silver">Silver (일반)</option>
                                        <option value="Bronze">Bronze (주의)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">메모</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm h-32"
                                        value={formData.memo}
                                        onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                                        placeholder="이 파트너에 대한 특징을 기록하세요."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">태그 관리</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                                            placeholder="태그 입력 (Enter)"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                        />
                                        <Button size="sm" variant="outline" onClick={handleAddTag}>추가</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                                                {tag} <button onClick={() => handleRemoveTag(tag)}><Icons.X size={10} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                    {formData.memo || <span className="text-gray-400 italic">등록된 메모가 없습니다.</span>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">#{tag}</span>
                                    ))}
                                    {formData.tags.length === 0 && <span className="text-xs text-gray-400">태그 없음</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Campaign History (Read-only) */}
                    <div className="flex-1 p-6 bg-gray-50/30">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><Icons.HistoryIcon size={18} /> 참여 캠페인 이력 ({creator.history.length})</h3>
                        <div className="space-y-3">
                            {creator.history.map((hist) => (
                                <div key={hist.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-300 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-gray-900 text-sm">{hist.campaign_title}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${hist.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                            hist.status === 'late' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {hist.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1"><Icons.Calendar size={12} /> {hist.date}</span>
                                        <span className="flex items-center gap-1"><Icons.Star size={12} className="text-yellow-400" /> 만족도 {hist.score}점</span>
                                        <span className="flex items-center gap-1"><Icons.Edit2 size={12} /> 수정 {hist.modification_count}회</span>
                                    </div>
                                    {hist.link && (
                                        <a href={hist.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-indigo-600 hover:underline bg-indigo-50 p-2 rounded-lg">
                                            <Icons.LinkIcon size={12} />
                                            {hist.link}
                                            <Icons.ExternalLink size={12} className="ml-auto" />
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default function ParticipantsPage() {
    const router = useRouter()
    const [creators, setCreators] = useState<CreatorCRM[]>([])
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStore, setSelectedStore] = useState('all')
    const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        // 실제로는 API 호출
        setCreators(MOCK_CREATORS)
    }, [])

    const handleUpdateCreator = (updated: CreatorCRM) => {
        setCreators(prev => prev.map(c => c.id === updated.id ? updated : c))
        // API Call here to save changes
        alert('파트너 정보가 수정되었습니다.')
    }

    const filtered = creators.filter(c => {
        // Store Filter
        if (selectedStore !== 'all' && c.associated_stores && !c.associated_stores.includes(selectedStore)) return false;
        // Search Filter
        if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    })

    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCreators = filtered.slice(startIndex, startIndex + itemsPerPage)

    const formatNumber = (num: number) => {
        if (num >= 10000) return (num / 10000).toFixed(1) + '만';
        if (num >= 1000) return (num / 1000).toFixed(1) + '천';
        return num.toLocaleString();
    }

    const openChat = (name: string) => alert(`${name}님과의 1:1 대화방을 엽니다.`);

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            {/* Creator Detail Modal */}
            {selectedCreator && (
                <CreatorDetailModal
                    creator={creators.find(c => c.id === selectedCreator)!}
                    onClose={() => setSelectedCreator(null)}
                    onUpdate={handleUpdateCreator}
                />
            )}

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">참여자 관리</h1>
                    <p className="text-gray-500">내 캠페인에 신청한 크리에이터 목록입니다.</p>
                </div>

                {/* Filter & List Section */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {/* Store Selector */}
                            <select
                                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 shadow-sm min-w-[140px]"
                                value={selectedStore}
                                onChange={(e) => setSelectedStore(e.target.value)}
                            >
                                <option value="all">전체 사업장</option>
                                <option value="gangnam">강남점</option>
                                <option value="hongdae">홍대점</option>
                                <option value="busan">부산서면점</option>
                            </select>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="크리에이터 이름 검색..."
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider text-left">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">크리에이터</th>
                                    <th className="px-6 py-4 font-semibold">상태</th>
                                    <th className="px-6 py-4 font-semibold">신청/선정</th>
                                    <th className="px-6 py-4 font-semibold">메모 & 태그</th>
                                    <th className="px-6 py-4 font-semibold text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedCreators.map(c => (
                                    <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedCreator(c.id)}>
                                                <div className="relative">
                                                    <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                                                    {c.platforms.includes('instagram') && (
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-yellow-400 to-purple-600 rounded-full flex items-center justify-center border-2 border-white text-white text-[10px]">
                                                            In
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{c.name}</div>
                                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                                        {c.audience_stats && (
                                                            <>
                                                                <span className="text-[10px] font-medium text-gray-400">주요 타깃:</span>
                                                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                                                                    {c.audience_stats.gender_split.female > c.audience_stats.gender_split.male ? '여성' : '남성'}
                                                                </span>
                                                                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                                                                    {c.audience_stats.age_range}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded text-xs font-bold ${c.status === 'active' ? 'bg-green-100 text-green-700' :
                                                c.status === 'blocked' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                {c.status === 'active' ? '활동중' : c.status === 'blocked' ? '차단함' : '탈퇴함'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">
                                                <span className="text-indigo-600">{c.stats.total_campaigns}</span>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <span className="text-green-600">{c.history.filter(h => h.status === 'completed' || h.status === 'late').length}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px]">
                                                {c.memo && <p className="text-xs text-gray-500 truncate mb-1">"{c.memo}"</p>}
                                                <div className="flex flex-wrap gap-1">
                                                    {c.tags.slice(0, 2).map(tag => (
                                                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>
                                                    ))}
                                                    {c.tags.length > 2 && <span className="text-[10px] text-gray-400">+{c.tags.length - 2}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-gray-200" onClick={() => openChat(c.name)}>
                                                    <Icons.MessageCircle size={14} />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedCreator(c.id)}>
                                                    <Icons.MoreVertical size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedCreators.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-gray-400">
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                전체 {filtered.length}명 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)}명 표시
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    이전
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className={currentPage === page ? 'bg-indigo-600 text-white' : ''}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    다음
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
