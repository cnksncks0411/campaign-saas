"use client"

/**
 * 새 캠페인 만들기 페이지 - Clean & Professional Style
 * 화이트/그레이 베이스의 정제된 디자인, 화려한 그라데이션 대신 쉐도우와 보더를 활용
 */

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    FileText,
    LayoutTemplate,
    Copy,
    Sparkles,
    ArrowRight,
    Save,
    Eye,
    Calendar,
    DollarSign,
    Users,
    Target,
    CheckCircle2,
    ChevronRight,
    Star,
    Layout,
    Gift,
    Plus,
    X,
    Smartphone,
    MapPin,
    Clock,
    AlertCircle,
    ChevronLeft,
    Check,
    Image as ImageIcon,
    Upload,
    Hash,
    AlertTriangle,
    Ban,
    Camera,
    Link as LinkIcon,
    FileCheck,
    Coins,
    Globe,

    Info,
    Instagram,
    Youtube,
    MessageCircle,
    MonitorPlay
} from "lucide-react"

const Icons = {
    FileText: FileText as any,
    LayoutTemplate: LayoutTemplate as any,
    Copy: Copy as any,
    Sparkles: Sparkles as any,
    ArrowRight: ArrowRight as any,
    Save: Save as any,
    Eye: Eye as any,
    Calendar: Calendar as any,
    DollarSign: DollarSign as any,
    Users: Users as any,
    Target: Target as any,
    CheckCircle2: CheckCircle2 as any,
    ChevronRight: ChevronRight as any,
    Star: Star as any,
    Layout: Layout as any,
    Gift: Gift as any,
    Plus: Plus as any,
    X: X as any,
    Smartphone: Smartphone as any,
    MapPin: MapPin as any,
    Clock: Clock as any,
    AlertCircle: AlertCircle as any,
    ChevronLeft: ChevronLeft as any,
    Check: Check as any,
    Image: ImageIcon as any,
    Upload: Upload as any,
    Hash: Hash as any,
    AlertTriangle: AlertTriangle as any,
    Ban: Ban as any,
    Camera: Camera as any,
    Link: LinkIcon as any,
    FileCheck: FileCheck as any,
    Coins: Coins as any,
    Globe: Globe as any,

    Info: Info as any,
    Instagram: Instagram as any,
    Youtube: Youtube as any,
    Blog: FileText as any,
    Shorts: MonitorPlay as any
}

interface FormData {
    title: string;
    type: string;
    mission_guide: string;
    recruit_end_date: string;
    max_participants: number;
    reward_amount: number;
    business_id: string;
    business_intro: string;
    photo_guide: string;
    thumbnail: string;
    detail_images: string[]; // 상세 이미지 배열 추가
    reward_items: string[];
    visit_instruction: string;
    keywords: string[];
    mission_precautions: string;
    mandatory_inclusions: string;
    forbidden_content: string;
    submission_requirements: string[];
    business_address: string; // 매장 주소 추가
    homepage_url: string; // 홈페이지 링크 추가
    channel: string; // SNS 채널
    target_gender: string; // 타겟 성별
    target_age: string[]; // 타겟 연령대
    license_usage: string[]; // 라이센스 활용 매체
    license_period: string; // 라이센스 활용 기간
}

const INITIAL_FORM_DATA: FormData = {
    title: '',
    type: 'content',
    mission_guide: '',
    recruit_end_date: '',
    max_participants: 10,
    reward_amount: 0,
    business_id: 'business-1',
    business_intro: '정성을 담아 운영하는 오프라인 매장입니다.',
    photo_guide: '밝은 조명에서 음식 사진을 촬영해주세요.',
    thumbnail: '',
    detail_images: [],
    reward_items: [],
    visit_instruction: '평일 오후 2시~5시 방문 권장, 주말 방문 불가',
    keywords: ['블로그리뷰', '데이트코스'],
    mission_precautions: '타 브랜드 언급 금지\n비공개 계정 참여 불가',
    mandatory_inclusions: '매장 위치 지도 첨부\n메뉴판 사진 1장 이상',
    forbidden_content: '부정적인 표현\n타사 비교',
    submission_requirements: ['완료된 포스팅 URL'],
    business_address: '',
    homepage_url: '',
    channel: 'instagram',
    target_gender: 'any',
    target_age: [],
    license_usage: [],
    license_period: '12'
}



const SUBMISSION_OPTIONS = [
    { label: '콘텐츠 링크', type: 'link' },
    { label: '콘텐츠 스크린샷', type: 'image' }
];

export default function NewCampaignPage() {
    const router = useRouter()
    const [step, setStep] = useState<'select' | 'template' | 'clone' | 'ai' | 'quick' | 'preview'>('select')
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
    const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
    const [newRewardItem, setNewRewardItem] = useState('')
    const [newKeyword, setNewKeyword] = useState('')
    const [activeSection, setActiveSection] = useState<string>('basic')
    const thumbnailInputRef = useRef<HTMLInputElement>(null)
    const detailImagesInputRef = useRef<HTMLInputElement>(null)

    // Refs for validation focus
    const titleRefBasic = useRef<HTMLInputElement>(null)
    const participantsRef = useRef<HTMLInputElement>(null)
    const endDateRefBasic = useRef<HTMLInputElement>(null)
    const missionGuideRefBasic = useRef<HTMLTextAreaElement>(null)
    const titleRefDetail = useRef<HTMLInputElement>(null)
    const businessIntroRef = useRef<HTMLInputElement>(null)
    const keywordInputRef = useRef<HTMLInputElement>(null)
    const missionGuideRefDetail = useRef<HTMLTextAreaElement>(null)
    const endDateRefDetail = useRef<HTMLInputElement>(null)
    const visitInstructionRef = useRef<HTMLInputElement>(null)
    const rewardItemInputRef = useRef<HTMLInputElement>(null)

    // 템플릿 데이터
    const templates = [
        {
            id: 'template-1',
            name: '맛집 블로그 리뷰',
            category: '음식점',
            description: '블로그 리뷰 + 사진촬영 기본 템플릿',
            data: {
                title: '[강남역] 파스타가 맛있는 "이탈리아노" 체험단',
                type: 'package',
                mission_guide: '• 네이버 블로그 1000자 이상 리뷰 작성\n• 음식 사진 5장 이상 업로드',
                max_participants: 10,
                reward_amount: 0,
                reward_items: ['5만원 식사권'],
                visit_instruction: '평일 오후 2시~5시 방문 권장, 주말 방문 불가',
                keywords: ['강남맛집', '파스타', '데이트'],
                mission_precautions: '예약 필수, 당일 캔슬 불가',
                mandatory_inclusions: '매장 지도, 영업시간 정보',
                forbidden_content: '비속어 사용 금지',
                submission_requirements: ['포스팅 URL'],
                business_address: '서울시 강남구 테헤란로 123',
                homepage_url: 'https://place.naver.com/restaurant/123456'
            }
        },
        {
            id: 'template-2',
            name: '인스타그램 릴스',
            category: '카페/디저트',
            description: '숏폼 콘텐츠 제작 템플릿',
            data: {
                title: '[성수동] 힙한 감성 카페 "카페모카" 릴스 체험단',
                type: 'content',
                mission_guide: '• 15~30초 릴스 제작\n• 매장 태그 필수',
                max_participants: 5,
                reward_amount: 0,
                reward_items: ['3만원 디저트 이용권', '아메리카노 2잔'],
                visit_instruction: '모든 시간대 방문 가능',
                keywords: ['성수카페', '디저트맛집', '릴스챌린지'],
                mission_precautions: '음원 저작권 주의',
                mandatory_inclusions: '매장 태그, 스토리 공유',
                forbidden_content: '단순 사진 슬라이드 형식 금지',
                submission_requirements: ['릴스 링크'],
                business_address: '서울시 성동구 성수동 456',
                homepage_url: 'https://instagram.com/cafemocha'
            }
        },
        {
            id: 'template-3',
            name: '네이버 지도 리뷰',
            category: '오프라인 매장',
            description: '방문 후 지도 리뷰 작성',
            data: {
                title: '네이버 지도 리뷰 이벤트',
                type: 'review',
                mission_guide: '• 네이버 지도에서 별점 5점\n• 리뷰 200자 이상 작성',
                max_participants: 20,
                reward_amount: 0,
                reward_items: ['5천원 네이버 포인트'],
                visit_instruction: '영수증 지참 필수',
                keywords: ['지도리뷰', '영수증인증'],
                mission_precautions: '영수증 분실 시 재발급 불가',
                mandatory_inclusions: '방문 인증샷',
                forbidden_content: '',
                submission_requirements: ['리뷰 캡쳐본'],
                business_address: '서울시 마포구 홍대입구 789',
                homepage_url: ''
            }
        },
        {
            id: 'template-4',
            name: '숙박업소 블로그 체험단',
            category: '숙박/여행',
            description: '호텔/펜션 방문 후 상세 블로그 리뷰',
            data: {
                title: '[제주] 오션뷰가 멋있는 "바다펜션" 숙박 체험단',
                type: 'package',
                mission_guide: '• 객실 및 부대시설 (바베큐장, 수영장) 사진 20장 이상 포함\n• 1박 2일 숙박 후기 상세 작성',
                max_participants: 3,
                reward_amount: 0,
                reward_items: ['주말 1박 2일 숙박권 (2인 기준)'],
                visit_instruction: '사전 예약 필수, 주말 예약 가능',
                keywords: ['제주여행', '제주펜션', '오션뷰숙소', '감성숙소'],
                mission_precautions: '객실 내 흡연 금지, 기물 파손 주의',
                mandatory_inclusions: '숙소 위치 지도, 예약 링크',
                forbidden_content: '타 숙소 비교',
                submission_requirements: ['포스팅 URL'],
                business_address: '제주특별자치도 제주시 애월읍 1004',
                homepage_url: 'https://badaseapension.com'
            }
        },
        {
            id: 'template-5',
            name: '제품 배송형 유튜브 리뷰',
            category: '쇼핑/제품',
            description: '제품 수령 후 유튜브 영상 리뷰 제작',
            data: {
                title: '[신제품] 홈카페 감성 "브루잉 커피머신" 유튜브 리뷰',
                type: 'content',
                mission_guide: '• 제품 언박싱 및 사용 영상 5분 내외 제작\n• 커피 추출 장면 및 완성된 음료 컷 필수 포함',
                max_participants: 5,
                reward_amount: 100000,
                reward_items: ['20만원 상당 커피머신 제공'],
                visit_instruction: '비대면 (택배 발송)',
                keywords: ['홈카페', '커피머신추천', '언박싱', '제품리뷰'],
                mission_precautions: '영상 내 유료 광고 포함 표기 필수',
                mandatory_inclusions: '구매 링크 더보기란 기재',
                forbidden_content: '경쟁사 제품 노출 금지',
                submission_requirements: ['업로드 영상 링크'],
                business_address: '',
                homepage_url: 'https://smartstore.naver.com/coffeelife'
            }
        },
        {
            id: 'template-6',
            name: '뷰티/헤어숍 인스타그램 방문 후기',
            category: '뷰티',
            description: '헤어, 네일 등 뷰티 서비스 체험 후 인스타 리뷰',
            data: {
                title: '[강남] 퍼스널 컬러 진단 & 메이크업 체험단',
                type: 'content',
                mission_guide: '• 비포/애프터 사진 포함 피드 1건 업로드\n• 릴스 영상 1건 (시술 과정)',
                max_participants: 5,
                reward_amount: 0,
                reward_items: ['15만원 상당 퍼스널컬러 진단권'],
                visit_instruction: '평일 오전 10시~오후 4시 방문 가능',
                keywords: ['강남퍼스널컬러', '메이크업', '뷰티체험단'],
                mission_precautions: '노쇼 절대 금지 (위약금 발생 가능)',
                mandatory_inclusions: '매장 계정 태그 (@personal_color)',
                forbidden_content: '보정 어플 과도한 사용 지양',
                submission_requirements: ['인스타그램 피드/릴스 링크'],
                business_address: '서울시 강남구 청담동 88',
                homepage_url: 'https://instagram.com/beauty_shop'
            }
        }
    ]

    const handleAddRewardItem = () => {
        if (!newRewardItem.trim()) return;
        setFormData(prev => ({
            ...prev,
            reward_items: [...prev.reward_items, newRewardItem]
        }));
        setNewRewardItem('');
    };

    const handleRemoveRewardItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            reward_items: prev.reward_items.filter((_, i) => i !== index)
        }));
    };

    const handleAddKeyword = () => {
        if (!newKeyword.trim()) return;
        setFormData(prev => ({
            ...prev,
            keywords: [...(prev.keywords || []), newKeyword]
        }));
        setNewKeyword('');
    };

    const handleRemoveKeyword = (index: number) => {
        setFormData(prev => ({
            ...prev,
            keywords: (prev.keywords || []).filter((_, i) => i !== index)
        }));
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
        }
    };

    const handleDetailImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const currentCount = (formData.detail_images || []).length;
            const remainingSlots = 3 - currentCount;

            if (remainingSlots <= 0) {
                alert('상세 이미지는 최대 3개까지만 업로드 가능합니다.');
                return;
            }

            const filesToAdd = Array.from(files).slice(0, remainingSlots);
            const newImages = filesToAdd.map(file => URL.createObjectURL(file));

            if (files.length > remainingSlots) {
                alert(`최대 3개까지만 업로드 가능합니다. ${filesToAdd.length}개만 추가됩니다.`);
            }

            setFormData(prev => ({
                ...prev,
                detail_images: [...(prev.detail_images || []), ...newImages]
            }));
        }
    };
    const handleRemoveDetailImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            detail_images: prev.detail_images.filter((_, i) => i !== index)
        }));
    };

    const handleToggleSubmissionRequirement = (option: string) => {
        setFormData(prev => {
            const current = prev.submission_requirements || [];
            if (current.includes(option)) {
                return { ...prev, submission_requirements: current.filter(item => item !== option) };
            } else {
                return { ...prev, submission_requirements: [...current, option] };
            }
        });
    };

    // Validation Logic
    const validateBasicInfo = (): { error: string; field?: string } | null => {
        if (!formData.title.trim()) return { error: "캠페인 제목을 입력해주세요.", field: 'title' };
        if (formData.max_participants <= 0) return { error: "모집 인원을 1명 이상 입력해주세요.", field: 'participants' };
        if (!formData.recruit_end_date) return { error: "모집 마감일을 선택해주세요.", field: 'endDateBasic' };
        if (formData.reward_items.length === 0 && formData.reward_amount <= 0) return { error: "제공 혜택(리워드)을 최소 1개 이상 입력해주세요.", field: 'rewards' };
        if (!formData.mission_guide.trim()) return { error: "미션 가이드를 입력해주세요.", field: 'missionGuideBasic' };
        return null;
    };

    const validateDetailInfo = (): { error: string; field?: string; section?: string } | null => {
        // Detail step validation: Updated required fields
        if (!formData.thumbnail) return { error: "메인 썸네일을 업로드해주세요.", field: 'thumbnail', section: 'basic' };
        if (!formData.title.trim()) return { error: "제목을 입력해주세요.", field: 'titleDetail', section: 'basic' };
        if (!formData.business_intro.trim()) return { error: "매장/브랜드 한줄 소개를 입력해주세요.", field: 'businessIntro', section: 'basic' };
        if (formData.keywords.length < 3) return { error: "검색 키워드를 최소 3개 이상 입력해주세요.", field: 'keywords', section: 'mission' };
        if (!formData.mission_guide.trim()) return { error: "미션 상세 가이드를 입력해주세요.", field: 'missionGuideDetail', section: 'mission' };
        if (!formData.recruit_end_date) return { error: "모집 마감일을 선택해주세요.", field: 'endDateDetail', section: 'schedule' };
        if (!formData.visit_instruction.trim()) return { error: "방문/이용 안내를 입력해주세요.", field: 'visitInstruction', section: 'schedule' };
        if (formData.reward_items.length === 0) return { error: "제공 혜택을 최소 1개 이상 입력해주세요.", field: 'rewardItems', section: 'schedule' };
        if (!formData.submission_requirements || formData.submission_requirements.length === 0) return { error: "제출물(증빙) 요구사항을 최소 1개 이상 입력해주세요.", field: 'submissionReq', section: 'schedule' };
        return null;
    };

    const focusField = (field: string) => {
        setTimeout(() => {
            switch (field) {
                case 'title': titleRefBasic.current?.focus(); break;
                case 'participants': participantsRef.current?.focus(); break;
                case 'endDateBasic': endDateRefBasic.current?.focus(); break;
                case 'missionGuideBasic': missionGuideRefBasic.current?.focus(); break;
                case 'titleDetail': titleRefDetail.current?.focus(); titleRefDetail.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
                case 'businessIntro': businessIntroRef.current?.focus(); businessIntroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
                case 'keywords': keywordInputRef.current?.focus(); keywordInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
                case 'missionGuideDetail': missionGuideRefDetail.current?.focus(); missionGuideRefDetail.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
                case 'endDateDetail': endDateRefDetail.current?.focus(); endDateRefDetail.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
                case 'visitInstruction': visitInstructionRef.current?.focus(); visitInstructionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
                case 'rewardItems': rewardItemInputRef.current?.focus(); rewardItemInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
            }
        }, 100);
    };

    const handleNextToDetail = () => {
        const result = validateBasicInfo();
        if (result) {
            alert(result.error);
            if (result.field) focusField(result.field);
            return;
        }
        setActiveSection('basic'); // Always open first accordion when entering detail step
        setStep('preview');
    };

    const handleRegisterCampaign = () => {
        // Basic + Detail 모두 재검증 (상세 화면 내에서 처리)
        const basicResult = validateBasicInfo();
        if (basicResult) {
            alert(`${basicResult.error}`);
            // 기본 정보 필드도 상세 화면의 accordion에 있으므로, 상세 화면 내에서 포커싱
            // 기본 정보 섹션 열기
            if (['thumbnail', 'titleDetail', 'businessIntro'].includes(basicResult.field || '')) {
                setActiveSection('basic');
            } else if (['missionGuideDetail', 'keywords'].includes(basicResult.field || '')) {
                setActiveSection('mission');
            } else if (['endDateDetail', 'visitInstruction', 'rewardItems', 'submissionReq'].includes(basicResult.field || '')) {
                setActiveSection('schedule');
            }

            // 기본 정보 필드를 상세 화면의 해당 필드로 매핑
            const fieldMapping: { [key: string]: string } = {
                'title': 'titleDetail',
                'missionGuideBasic': 'missionGuideDetail',
                'endDateBasic': 'endDateDetail',
                'rewards': 'rewardItems'
            };
            const targetField = fieldMapping[basicResult.field || ''] || basicResult.field;
            if (targetField) focusField(targetField);
            return;
        }

        const detailResult = validateDetailInfo();
        if (detailResult) {
            alert(`${detailResult.error}`);
            if (detailResult.section) setActiveSection(detailResult.section);
            if (detailResult.field) focusField(detailResult.field);
            return;
        }

        // 성공 시
        alert("캠페인이 성공적으로 등록되었습니다!");
        router.push('/owner/campaigns');
    };


    // Step 1: 생성 방법 선택
    if (step === 'select') {
        return (
            <div className="min-h-screen py-12 px-6 bg-gray-50/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            새 캠페인 만들기
                        </h1>
                        <p className="text-gray-500 text-lg">어떤 방식으로 캠페인을 시작하시겠습니까?</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                        {/* 빈 캠페인 */}
                        <button
                            onClick={() => {
                                setFormData(INITIAL_FORM_DATA);
                                setStep('quick');
                            }}
                            className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all text-left group"
                        >
                            <div className="mb-6 inline-flex p-3 rounded-lg bg-gray-100 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                <Icons.FileText size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">직접 만들기 (빈 캠페인)</h3>
                            <p className="text-gray-500 mb-6 text-sm">처음부터 모든 내용을 직접 작성합니다.</p>
                            <div className="flex items-center gap-2 text-gray-900 font-medium text-sm group-hover:underline decoration-2 underline-offset-4">
                                시작하기 <Icons.ArrowRight size={16} />
                            </div>
                        </button>

                        {/* 템플릿 */}
                        <button
                            onClick={() => setStep('template')}
                            className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all text-left group"
                        >
                            <div className="mb-6 inline-flex p-3 rounded-lg bg-gray-100 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                <Icons.LayoutTemplate size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">템플릿 사용하기</h3>
                            <p className="text-gray-500 mb-6 text-sm">업종별 최적화된 템플릿으로 빠르게 시작합니다.</p>
                            <div className="flex items-center gap-2 text-gray-900 font-medium text-sm group-hover:underline decoration-2 underline-offset-4">
                                선택하기 <Icons.ArrowRight size={16} />
                            </div>
                        </button>

                        {/* 복제 */}
                        <button
                            onClick={() => setStep('clone')}
                            className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all text-left group"
                        >
                            <div className="mb-6 inline-flex p-3 rounded-lg bg-gray-100 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                <Icons.Copy size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">이전 캠페인 복제</h3>
                            <p className="text-gray-500 mb-6 text-sm">기존에 진행했던 캠페인 설정을 그대로 가져옵니다.</p>
                            <div className="flex items-center gap-2 text-gray-900 font-medium text-sm group-hover:underline decoration-2 underline-offset-4">
                                복제하기 <Icons.ArrowRight size={16} />
                            </div>
                        </button>

                        {/* AI 생성 */}
                        <button
                            onClick={() => setStep('ai')}
                            className="relative bg-indigo-900 p-8 rounded-xl border border-indigo-800 hover:shadow-xl hover:shadow-indigo-900/20 transition-all text-left group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                                <Icons.Sparkles size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="mb-6 inline-flex p-3 rounded-lg bg-indigo-800 text-indigo-200 group-hover:bg-white group-hover:text-indigo-900 transition-colors">
                                    <Icons.Sparkles size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">AI 자동 생성</h3>
                                <p className="text-indigo-200 mb-6 text-sm">질문에 답하면 AI가 최적의 캠페인을 제안합니다.</p>
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-1 bg-indigo-800 text-indigo-100 text-xs rounded font-medium border border-indigo-700">Premium</span>
                                    <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:underline decoration-2 underline-offset-4">
                                        시작하기 <Icons.ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="text-center">
                        <Button variant="ghost" onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
                            취소하고 돌아가기
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Step 1-A: 템플릿 선택
    if (step === 'template') {
        return (
            <div className="min-h-screen py-12 px-6 bg-gray-50/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            템플릿 선택
                        </h1>
                        <p className="text-gray-500">가장 적합한 템플릿을 선택하여 시작하세요.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => {
                                    setFormData({ ...INITIAL_FORM_DATA, ...template.data })
                                    setSelectedTemplate(template)
                                    setStep('quick')
                                }}
                                className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600 transition-all text-left h-full flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <Icons.Layout size={24} />
                                    </div>
                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                                        {template.category}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-6 flex-1">{template.description}</p>
                                <div className="w-full py-2.5 rounded-lg border border-gray-200 text-center text-sm font-medium text-gray-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                    이 템플릿 사용하기
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="md:pl-1">
                        <Button variant="outline" onClick={() => setStep('select')}>
                            이전으로
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Step 2 임시 로직
    if (step === 'clone' || step === 'ai') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">준비 중인 기능입니다.</h2>
                    <Button onClick={() => setStep('quick')}>기본 편집기로 이동</Button>
                </div>
            </div>
        )
    }


    // Step 2: 퀵 생성
    if (step === 'quick') {
        return (
            <div className="min-h-screen py-8 px-6 bg-gray-50/50">
                <div className="container mx-auto max-w-5xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">기본 정보 입력 (1/2)</h1>
                        <p className="text-gray-500 mt-1">캠페인 생성에 필요한 최소 정보를 입력해주세요. 다음 단계에서 상세 내용을 편집할 수 있습니다.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
                                <div className="space-y-6">
                                    {/* SNS 채널 선택 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                                            SNS 채널 선택 <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {[
                                                { id: 'instagram', name: '인스타그램', icon: Icons.Instagram, color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white' },
                                                { id: 'blog', name: '블로그', icon: Icons.Blog, color: 'bg-green-500 text-white' },
                                                { id: 'youtube', name: '유튜브', icon: Icons.Youtube, color: 'bg-red-600 text-white' },
                                                { id: 'shorts', name: '릴스/숏폼', icon: Icons.Shorts, color: 'bg-black text-white' }
                                            ].map((ch) => (
                                                <button
                                                    key={ch.id}
                                                    onClick={() => setFormData({ ...formData, channel: ch.id })}
                                                    className={`group p-3 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all h-32 ${formData.channel === ch.id
                                                        ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-indigo-200'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${ch.color} transform transition-transform group-hover:-translate-y-1`}>
                                                        <ch.icon size={24} />
                                                    </div>
                                                    <span className={`text-sm font-bold ${formData.channel === ch.id ? 'text-indigo-900' : 'text-gray-600'}`}>{ch.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            캠페인 제목 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            ref={titleRefBasic}
                                            type="text"
                                            placeholder="예: 강남점 파스타 신메뉴 체험단 모집"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-400 text-lg font-medium"
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                모집 인원 <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    ref={participantsRef}
                                                    type="number"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-8"
                                                    value={formData.max_participants}
                                                    onChange={(e) => setFormData({ ...formData, max_participants: Number(e.target.value) })}
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">명</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                모집 마감일 <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                ref={endDateRefBasic}
                                                type="date"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={formData.recruit_end_date}
                                                onChange={(e) => setFormData({ ...formData, recruit_end_date: e.target.value })}
                                                onClick={(e) => {
                                                    try {
                                                        (e.target as HTMLInputElement).showPicker?.();
                                                    } catch (error) {
                                                        // showPicker not supported in some browsers
                                                    }
                                                }}

                                            />
                                        </div>
                                    </div>

                                    {/* 타겟 설정 */}
                                    <div className="grid sm:grid-cols-2 gap-6 pt-2">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                모집 성별
                                            </label>
                                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                                {[
                                                    { id: 'any', label: '무관' },
                                                    { id: 'female', label: '여성' },
                                                    { id: 'male', label: '남성' }
                                                ].map((g) => (
                                                    <button
                                                        key={g.id}
                                                        onClick={() => setFormData({ ...formData, target_gender: g.id })}
                                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.target_gender === g.id
                                                            ? 'bg-white text-gray-900 shadow-sm'
                                                            : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                    >
                                                        {g.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                모집 연령대 <span className="text-xs text-gray-500 font-normal">(중복 가능)</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {['20대', '30대', '40대', '50대+'].map((age) => (
                                                    <button
                                                        key={age}
                                                        onClick={() => {
                                                            const newAges = formData.target_age.includes(age)
                                                                ? formData.target_age.filter(a => a !== age)
                                                                : [...formData.target_age, age];
                                                            setFormData({ ...formData, target_age: newAges });
                                                        }}
                                                        className={`px-3 py-2 text-sm border rounded-lg transition-all ${formData.target_age.includes(age)
                                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {age}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>


                                    {/* 제공 혜택 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            제공 혜택 (리워드) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                            {formData.reward_items.length > 0 && (
                                                <div className="space-y-2 mb-4">
                                                    {formData.reward_items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200 shadow-sm">
                                                            <div className="flex items-center gap-2">
                                                                <Icons.Gift size={16} className="text-indigo-500" />
                                                                <span className="text-sm font-medium text-gray-700">{item}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleRemoveRewardItem(idx)}
                                                                className="text-gray-400 hover:text-red-500 p-1"
                                                            >
                                                                <Icons.X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="예: 5만원 식사권, 아메리카노 2잔"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                                                    value={newRewardItem}
                                                    onChange={(e) => setNewRewardItem(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddRewardItem();
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleAddRewardItem}
                                                    disabled={!newRewardItem.trim()}
                                                    className="shrink-0 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                                >
                                                    <Icons.Plus size={16} className="mr-1" />
                                                    추가
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 현금 리워드 */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            추가 현금 포인트 (선택)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-8"
                                                placeholder="0"
                                                value={formData.reward_amount || ''}
                                                onChange={(e) => setFormData({ ...formData, reward_amount: Number(e.target.value) })}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">원</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            미션 가이드 (간단요약) <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            ref={missionGuideRefBasic}
                                            rows={5}
                                            placeholder="참여자가 수행해야 할 미션을 입력해주세요."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-gray-400 resize-none"
                                            value={formData.mission_guide}
                                            onChange={(e) => setFormData({ ...formData, mission_guide: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-500 mt-2 text-right">{formData.mission_guide.length} / 1000자</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" size="lg" onClick={() => setStep('select')}>
                                    이전
                                </Button>
                                <Button
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                                    onClick={handleNextToDetail}
                                >
                                    다음: 확인 및 상세편집
                                    <Icons.ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Icons.CheckCircle2 className="text-indigo-600" size={18} />
                                    제공 혜택 요약
                                </h3>
                                <div className="space-y-3 pb-4 border-b border-gray-100">
                                    <div className="text-sm">
                                        <span className="text-gray-600 block mb-1">제공 물품/서비스</span>
                                        {formData.reward_items.length > 0 ? (
                                            <ul className="list-disc pl-4 text-gray-900 font-medium space-y-1">
                                                {formData.reward_items.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="text-gray-400 font-normal">입력된 혜택 없음</span>
                                        )}
                                    </div>
                                    {formData.reward_amount > 0 && (
                                        <div className="flex justify-between text-sm pt-2">
                                            <span className="text-gray-600">추가 현금 포인트</span>
                                            <span className="font-medium text-gray-900">{formData.reward_amount.toLocaleString()}원</span>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-4 flex justify-between items-center text-sm">
                                    <span className="font-bold text-gray-900">총 모집 인원</span>
                                    <span className="font-bold text-indigo-600">{formData.max_participants}명</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        )
    }

    // Step 3: 라이브 프리뷰 및 상세 편집 (2/2)
    if (step === 'preview') {
        return (
            <div className="min-h-screen py-8 px-6 bg-gray-50/50">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                <span className="cursor-pointer hover:text-gray-900" onClick={() => setStep('quick')}>기본 정보</span>
                                <Icons.ChevronRight size={14} />
                                <span className="font-semibold text-gray-900">확인 및 상세편집</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">캠페인 상세 설정 (2/2)</h1>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep('quick')}>
                                <Icons.ChevronLeft className="mr-2 w-4 h-4" />
                                이전 단계
                            </Button>
                            <div className="flex md:flex-col gap-4">
                                <Button
                                    size="lg"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                                    onClick={handleRegisterCampaign}
                                >
                                    캠페인 등록 완료
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push('/owner/campaigns')} // 임시: 목록으로 이동
                                >
                                    임시 저장
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* 좌측: 상세 편집기 (Accordion Style) */}
                        <div className="lg:col-span-7 space-y-4">

                            {/* 섹션 1: 제목/썸네일/한줄요약 */}
                            <div className={`bg-white rounded-xl border transition-all ${activeSection === 'basic' ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <button
                                    className="w-full flex items-center justify-between p-5 text-left"
                                    onClick={() => setActiveSection(activeSection === 'basic' ? '' : 'basic')}
                                >
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">1</div>
                                        제목 / 썸네일 / 소개
                                    </h3>
                                    <Icons.ChevronRight className={`transform transition-transform ${activeSection === 'basic' ? 'rotate-90' : ''}`} size={18} />
                                </button>
                                {activeSection === 'basic' && (
                                    <div className="p-5 pt-0 border-t border-gray-100 space-y-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">메인 썸네일 <span className="text-red-500">*</span></label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                                                    {formData.thumbnail ? (
                                                        <img src={formData.thumbnail} alt="thumbnail" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Icons.Image className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={thumbnailInputRef}
                                                        className="hidden"
                                                        onChange={handleThumbnailUpload}
                                                    />
                                                    <Button variant="outline" size="sm" onClick={() => thumbnailInputRef.current?.click()}>
                                                        <Icons.Upload className="w-4 h-4 mr-2" />
                                                        이미지 업로드
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">상세 이미지 (선택, 최대 3개)</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {(formData.detail_images || []).map((img, idx) => (
                                                    <div key={idx} className="w-20 h-20 bg-gray-100 rounded border border-gray-200 relative overflow-hidden group">
                                                        <img src={img} alt={`detail-${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => handleRemoveDetailImage(idx)}
                                                            className="absolute top-0 right-0 bg-black/50 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Icons.X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(formData.detail_images || []).length < 3 && (
                                                    <div
                                                        className="w-20 h-20 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                                                        onClick={() => detailImagesInputRef.current?.click()}
                                                    >
                                                        <Icons.Plus className="text-gray-400" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    ref={detailImagesInputRef}
                                                    className="hidden"
                                                    onChange={handleDetailImagesUpload}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
                                            <input
                                                ref={titleRefDetail}
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">매장/브랜드 한줄 소개 <span className="text-red-500">*</span></label>
                                            <input
                                                ref={businessIntroRef}
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                value={formData.business_intro}
                                                onChange={(e) => setFormData({ ...formData, business_intro: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">매장 주소</label>
                                            <div className="relative">
                                                <Icons.MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    placeholder="서울시 강남구 테헤란로 123"
                                                    value={formData.business_address}
                                                    onChange={(e) => setFormData({ ...formData, business_address: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">홈페이지/SNS 링크</label>
                                            <div className="relative">
                                                <Icons.Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    placeholder="https://..."
                                                    value={formData.homepage_url}
                                                    onChange={(e) => setFormData({ ...formData, homepage_url: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 섹션 2: 미션 가이드 상세 */}
                            <div className={`bg-white rounded-xl border transition-all ${activeSection === 'mission' ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <button
                                    className="w-full flex items-center justify-between p-5 text-left"
                                    onClick={() => setActiveSection(activeSection === 'mission' ? '' : 'mission')}
                                >
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">2</div>
                                        미션 / 키워드 / 가이드
                                    </h3>
                                    <Icons.ChevronRight className={`transform transition-transform ${activeSection === 'mission' ? 'rotate-90' : ''}`} size={18} />
                                </button>
                                {activeSection === 'mission' && (
                                    <div className="p-5 pt-0 border-t border-gray-100 space-y-6 mt-4">

                                        {/* 필수 키워드 */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">필수 키워드 (해시태그, 최소 3개) <span className="text-red-500">*</span></label>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    ref={keywordInputRef}
                                                    type="text"
                                                    placeholder="키워드 입력 (예: 강남맛집)"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    value={newKeyword}
                                                    onChange={(e) => setNewKeyword(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                                                />
                                                <Button size="sm" onClick={handleAddKeyword} variant="secondary">추가</Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-sm">
                                                {(formData.keywords || []).map((k, i) => (
                                                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                                        <Icons.Hash size={12} className="mr-1" />
                                                        {k}
                                                        <Icons.X size={12} className="ml-1 cursor-pointer hover:text-blue-900" onClick={() => handleRemoveKeyword(i)} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 미션 상세 */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">미션 상세 가이드 (체크리스트) <span className="text-red-500">*</span></label>
                                            <textarea
                                                ref={missionGuideRefDetail}
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none whitespace-pre-wrap"
                                                value={formData.mission_guide}
                                                onChange={(e) => setFormData({ ...formData, mission_guide: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-500 text-right mt-1">{formData.mission_guide.length} / 1000자</p>
                                        </div>

                                        {/* 필수 포함 사항 / 금지 사항 */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">게시물 필수 포함 사항</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none whitespace-pre-wrap"
                                                    placeholder="예: 지도 삽입, 메뉴판 사진"
                                                    value={formData.mandatory_inclusions}
                                                    onChange={(e) => setFormData({ ...formData, mandatory_inclusions: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">주의/금지 사항</label>
                                                <textarea
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none whitespace-pre-wrap"
                                                    placeholder="예: 타사 언급 금지"
                                                    value={formData.forbidden_content}
                                                    onChange={(e) => setFormData({ ...formData, forbidden_content: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* 촬영 가이드 */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">사진 촬영/표현 가이드</label>
                                            <div className="relative">
                                                <Icons.Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    value={formData.photo_guide}
                                                    onChange={(e) => setFormData({ ...formData, photo_guide: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 섹션 3: 일정/리워드/검수 */}
                            <div className={`bg-white rounded-xl border transition-all ${activeSection === 'schedule' ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                <button
                                    className="w-full flex items-center justify-between p-5 text-left"
                                    onClick={() => setActiveSection(activeSection === 'schedule' ? '' : 'schedule')}
                                >
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">3</div>
                                        일정 / 리워드 / 검수정책
                                    </h3>
                                    <Icons.ChevronRight className={`transform transition-transform ${activeSection === 'schedule' ? 'rotate-90' : ''}`} size={18} />
                                </button>
                                {activeSection === 'schedule' && (
                                    <div className="p-5 pt-0 border-t border-gray-100 space-y-4 mt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">모집 마감 <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <input
                                                        ref={endDateRefDetail}
                                                        type="date"
                                                        className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer"
                                                        value={formData.recruit_end_date}
                                                        onChange={(e) => setFormData({ ...formData, recruit_end_date: e.target.value })}
                                                        onClick={(e) => {
                                                            try {
                                                                (e.target as HTMLInputElement).showPicker?.();
                                                            } catch (error) {
                                                                // showPicker not supported in some browsers
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">방문/이용 안내 <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <Icons.Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input
                                                        ref={visitInstructionRef}
                                                        type="text"
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        value={formData.visit_instruction}
                                                        onChange={(e) => setFormData({ ...formData, visit_instruction: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">제공 혜택 관리 (현금포인트는 선택) <span className="text-red-500">*</span></label>
                                            <div className="space-y-3">
                                                {/* 물품 리워드 */}
                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <div className="flex gap-2 mb-2">
                                                        <input
                                                            ref={rewardItemInputRef}
                                                            type="text"
                                                            placeholder="물품/서비스 혜택 추가 (예: 5만원 식사권)"
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                                                            value={newRewardItem}
                                                            onChange={(e) => setNewRewardItem(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddRewardItem()}
                                                        />
                                                        <Button size="sm" onClick={handleAddRewardItem} type="button">추가</Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.reward_items.map((item, idx) => (
                                                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-white text-gray-800 rounded border border-gray-300 text-xs font-medium">
                                                                <Icons.Gift size={12} className="text-indigo-500" />
                                                                {item}
                                                                <Icons.X size={12} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveRewardItem(idx)} />
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* 현금 리워드 */}
                                                <div className="flex items-center gap-3">
                                                    <div className="relative flex-1">
                                                        <Icons.Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input
                                                            type="number"
                                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            placeholder="추가 현금 포인트 (선택)"
                                                            value={formData.reward_amount || ''}
                                                            onChange={(e) => setFormData({ ...formData, reward_amount: Number(e.target.value) })}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-500">포인트</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">미션 주의사항</label>
                                            <textarea
                                                rows={4}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                                                placeholder="참여자가 반드시 주의해야 할 사항을 입력해주세요."
                                                value={formData.mission_precautions}
                                                onChange={(e) => setFormData({ ...formData, mission_precautions: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">제출물(증빙) 요구사항 <span className="text-red-500">*</span> <span className="text-xs text-gray-400 font-normal">(중복 선택 가능)</span></label>
                                            <div className="flex flex-wrap gap-2">
                                                {SUBMISSION_OPTIONS.map((option) => {
                                                    const isSelected = (formData.submission_requirements || []).includes(option.label);
                                                    return (
                                                        <button
                                                            key={option.label}
                                                            onClick={() => handleToggleSubmissionRequirement(option.label)}
                                                            className={`px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2 ${isSelected
                                                                ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {isSelected ? <Icons.Check size={14} /> : (
                                                                option.type === 'link' ? <Icons.Link size={14} /> : <Icons.Image size={14} />
                                                            )}
                                                            {option.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {(formData.submission_requirements || []).length === 0 && (
                                                <p className="text-xs text-red-500 mt-1">최소 1개 이상의 제출물을 선택해주세요.</p>
                                            )}
                                        </div>

                                        {/* 라이센스 활용 동의 */}
                                        <div className="pt-6 mt-6 border-t border-gray-100">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <Icons.FileCheck size={16} className="text-indigo-600" />
                                                콘텐츠 라이센스 활용 동의
                                            </label>

                                            <div className="grid sm:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-2">활용 매체 선택</label>
                                                    <div className="space-y-2">
                                                        {['상세페이지', 'SNS 광고', '오프라인 홍보물', '홈페이지'].map((usage) => (
                                                            <label key={usage} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                    checked={formData.license_usage.includes(usage)}
                                                                    onChange={(e) => {
                                                                        const newUsage = e.target.checked
                                                                            ? [...formData.license_usage, usage]
                                                                            : formData.license_usage.filter(u => u !== usage);
                                                                        setFormData({ ...formData, license_usage: newUsage });
                                                                    }}
                                                                />
                                                                {usage}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-2">활용 기간 (최대 24개월)</label>
                                                    <select
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                                                        value={formData.license_period}
                                                        onChange={(e) => setFormData({ ...formData, license_period: e.target.value })}
                                                    >
                                                        <option value="3">3개월</option>
                                                        <option value="6">6개월</option>
                                                        <option value="12">1년 (12개월)</option>
                                                        <option value="24">2년 (24개월)</option>
                                                    </select>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        * 크리에이터 동의 없이 기간을 연장할 수 없습니다.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* 우측: 라이브 프리뷰 (Sticky) */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Icons.Smartphone size={18} className="text-gray-500" />
                                        참여자에게 보이는 화면
                                    </h3>
                                    <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded">Live Preview</span>
                                </div>

                                {/* 모바일 카드 UI */}
                                <div className="bg-white rounded-[2rem] border-8 border-gray-900 overflow-hidden shadow-2xl relative min-h-[700px] max-h-[85vh] flex flex-col">
                                    {/* 상단바 */}
                                    <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-100 shrink-0">
                                        <Icons.ChevronLeft size={20} className="text-gray-900" />
                                        <span className="font-bold text-sm">캠페인 상세</span>
                                        <Icons.Copy size={20} className="text-gray-900" />
                                    </div>

                                    {/* 컨텐츠 영역 (Scrollable) */}
                                    <div className="flex-1 overflow-y-auto no-scrollbar pb-20 bg-gray-50">
                                        {/* 썸네일 (Cover Image - Height fixed to prevent cropping issue) */}
                                        <div className="w-full h-auto bg-gray-200 relative group cursor-pointer" onClick={() => thumbnailInputRef.current?.click()}>
                                            {formData.thumbnail ? (
                                                <div className="w-full bg-black/5 flex items-center justify-center p-2">
                                                    <img src={formData.thumbnail} alt="thumbnail" className="w-auto h-auto max-w-full max-h-[300px] object-contain mx-auto block shadow-sm" />
                                                </div>
                                            ) : (
                                                <div className="h-56 flex flex-col items-center justify-center text-gray-400">
                                                    <Icons.Image size={40} className="mb-2 opacity-50" />
                                                    <span className="text-xs">대표 이미지를 등록해주세요</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-2 py-1 bg-black/50 text-white text-[10px] rounded backdrop-blur-md">
                                                    {formData.type === 'package' ? '패키지' : '콘텐츠 체험단'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 헤더 정보 */}
                                        <div className="bg-white p-5 mb-2">
                                            <h2 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                                                {formData.title || '캠페인 제목을 입력하세요'}
                                            </h2>

                                            {/* 상세 이미지 썸네일들 */}
                                            {(formData.detail_images && formData.detail_images.length > 0) && (
                                                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
                                                    {formData.detail_images.map((img, idx) => (
                                                        <img key={idx} src={img} alt="detail" className="w-20 h-20 rounded-lg object-cover border border-gray-100 shrink-0" />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
                                                <p className="line-clamp-2">{formData.business_intro}</p>
                                                {formData.business_address && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Icons.MapPin size={12} className="shrink-0" />
                                                        {formData.business_address}
                                                    </div>
                                                )}
                                                {formData.homepage_url && (
                                                    <a href={formData.homepage_url} target="_blank" className="flex items-center gap-1.5 text-xs text-indigo-600 underline truncate">
                                                        <Icons.Link size={12} className="shrink-0" />
                                                        {formData.homepage_url}
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {(formData.keywords || []).map((k, i) => (
                                                    <span key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex items-center">
                                                        <Icons.Hash size={10} className="mr-0.5" />
                                                        {k}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                                {formData.reward_items.map((item, i) => (
                                                    <span key={i} className="shrink-0 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md border border-indigo-100 flex items-center">
                                                        <Icons.Gift size={12} className="mr-1" /> {item}
                                                    </span>
                                                ))}
                                                {(formData.reward_amount > 0) && (
                                                    <span className="shrink-0 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-md border border-yellow-100 flex items-center">
                                                        <Icons.Coins size={12} className="mr-1" /> {formData.reward_amount.toLocaleString()}P
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <Icons.Users size={14} />
                                                        <span>{formData.max_participants}명 모집</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Icons.Clock size={14} />
                                                        <span>~ {formData.recruit_end_date || '날짜 미정'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 미션 & 체크리스트 (개행 지원 whitespace-pre-line) */}
                                        <div className="bg-white p-5 mb-2">
                                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                                <Icons.CheckCircle2 className="text-green-500" size={16} />
                                                미션 & 필수사항
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed border border-gray-100">
                                                    <strong className="block mb-2 text-gray-900 flex items-center gap-1.5">
                                                        <Icons.FileText size={14} className="text-gray-900" /> 할 일 (미션)
                                                    </strong>
                                                    <div className="whitespace-pre-wrap pl-1">{formData.mission_guide || '미션 가이드가 입력되지 않았습니다.'}</div>
                                                </div>

                                                {formData.mandatory_inclusions && (
                                                    <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 border border-blue-100">
                                                        <strong className="block mb-2 flex items-center gap-1.5">
                                                            <Icons.Check size={14} /> 필수 포함
                                                        </strong>
                                                        <div className="whitespace-pre-wrap pl-1">{formData.mandatory_inclusions}</div>
                                                    </div>
                                                )}

                                                {formData.forbidden_content && (
                                                    <div className="bg-red-50 rounded-lg p-3 text-sm text-red-800 border border-red-100">
                                                        <strong className="block mb-2 flex items-center gap-1.5">
                                                            <Icons.AlertTriangle size={14} /> 주의/금지
                                                        </strong>
                                                        <div className="whitespace-pre-wrap pl-1">{formData.forbidden_content}</div>
                                                    </div>
                                                )}

                                                {(formData.submission_requirements && formData.submission_requirements.length > 0) && (
                                                    <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 border border-gray-200">
                                                        <strong className="block mb-2 flex items-center gap-1.5">
                                                            <Icons.FileCheck size={14} /> 제출물 증빙
                                                        </strong>
                                                        <ul className="list-disc pl-4 space-y-1">
                                                            {formData.submission_requirements.map((req, i) => (
                                                                <li key={i}>{req}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 방문 안내 */}
                                        <div className="bg-white p-5 mb-2">
                                            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                                                <Icons.MapPin className="text-gray-900" size={16} />
                                                방문 및 이용 안내
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2 flex items-start gap-2">
                                                <Icons.Info size={14} className="mt-0.5 shrink-0 text-gray-400" />
                                                {formData.visit_instruction}
                                            </p>
                                            {formData.photo_guide && (
                                                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded text-xs text-yellow-800 flex items-start gap-2">
                                                    <Icons.Camera size={14} className="mt-0.5 shrink-0" />
                                                    <span><strong>촬영 포인트:</strong> {formData.photo_guide}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 하단 신청 버튼 (Fake) */}
                                    <div className="absolute bottom-0 w-full bg-white p-4 border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                                        <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 flex items-center justify-center gap-2" disabled>
                                            지금 신청하기 <Icons.ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
