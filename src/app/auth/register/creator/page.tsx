"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, MapPin, FileText } from "lucide-react"
import Link from "next/link"

const Icons = {
    Sparkles: Sparkles as any,
    Mail: Mail as any,
    Lock: Lock as any,
    Eye: Eye as any,
    EyeOff: EyeOff as any,
    ArrowLeft: ArrowLeft as any,
    User: User as any,
    Phone: Phone as any,
    MapPin: MapPin as any,
    FileText: FileText as any
}

export default function CreatorRegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState<'account' | 'profile'>('account')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    const [accountData, setAccountData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: ''
    })

    const [profileData, setProfileData] = useState({
        region: '',
        categories: [] as string[],
        style: '',
        introduction: ''
    })

    const handleAccountNext = (e: React.FormEvent) => {
        e.preventDefault()

        if (accountData.password !== accountData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }

        setStep('profile')
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()

        // TODO: 실제 회원가입 로직
        alert('회원가입이 완료되었습니다!\n(백엔드 연동 후 실제 동작)')
        router.push('/auth/login')
    }

    const toggleCategory = (category: string) => {
        if (profileData.categories.includes(category)) {
            setProfileData({
                ...profileData,
                categories: profileData.categories.filter(c => c !== category)
            })
        } else {
            setProfileData({
                ...profileData,
                categories: [...profileData.categories, category]
            })
        }
    }

    const categories = ['음식점', '카페', '뷰티', '헬스', '소매', '교육', '서비스', '기타']

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center p-6">
            {/* 배경 장식 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* 뒤로 가기 */}
                <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
                >
                    <Icons.ArrowLeft size={20} />
                    <span className="font-medium">계정 유형 선택으로 돌아가기</span>
                </Link>

                {/* 회원가입 카드 */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 md:p-12">
                    {/* 로고 */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                            <Icons.Sparkles size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Campaign SaaS
                        </span>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">크리에이터 회원가입</h1>
                        <p className="text-gray-600">
                            {step === 'account' ? '계정 정보를 입력해주세요' : '프로필 정보를 입력해주세요'}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'account' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'} font-semibold transition-colors`}>
                            1
                        </div>
                        <div className={`h-1 w-16 ${step === 'profile' ? 'bg-purple-600' : 'bg-gray-200'} rounded transition-colors`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'profile' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'} font-semibold transition-colors`}>
                            2
                        </div>
                    </div>

                    {/* Step 1: 계정 정보 */}
                    {step === 'account' && (
                        <form onSubmit={handleAccountNext} className="space-y-6">
                            {/* 이름 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    이름 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="홍길동"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        value={accountData.name}
                                        onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* 이메일 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    이메일 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="example@email.com"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        value={accountData.email}
                                        onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* 전화번호 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    전화번호 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="010-1234-5678"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        value={accountData.phone}
                                        onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* 비밀번호 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    비밀번호 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        minLength={8}
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        value={accountData.password}
                                        onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <Icons.EyeOff size={20} /> : <Icons.Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">최소 8자 이상</p>
                            </div>

                            {/* 비밀번호 확인 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    비밀번호 확인 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPasswordConfirm ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        value={accountData.passwordConfirm}
                                        onChange={(e) => setAccountData({ ...accountData, passwordConfirm: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPasswordConfirm ? <Icons.EyeOff size={20} /> : <Icons.Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* 다음 버튼 */}
                            <Button
                                type="submit"
                                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02]"
                            >
                                다음
                            </Button>
                        </form>
                    )}

                    {/* Step 2: 프로필 정보 */}
                    {step === 'profile' && (
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* 활동 지역 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    주요 활동 지역 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="예: 서울 강남구"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        value={profileData.region}
                                        onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* 관심 업종 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    관심 업종 <span className="text-gray-500 text-xs">(복수 선택 가능)</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => toggleCategory(category)}
                                            className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${profileData.categories.includes(category)
                                                    ? 'bg-purple-600 border-purple-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 콘텐츠 스타일 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    콘텐츠 스타일
                                </label>
                                <div className="relative">
                                    <Icons.FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <select
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all appearance-none bg-white"
                                        value={profileData.style}
                                        onChange={(e) => setProfileData({ ...profileData, style: e.target.value })}
                                    >
                                        <option value="">선택해주세요 (선택사항)</option>
                                        <option value="emotional">감성적</option>
                                        <option value="practical">실용적/정보형</option>
                                        <option value="funny">유머/재미</option>
                                        <option value="minimal">미니멀/깔끔</option>
                                        <option value="dynamic">역동적/활동적</option>
                                    </select>
                                </div>
                            </div>

                            {/* 자기소개 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    자기소개
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="간단한 자기소개를 작성해주세요 (선택사항)"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                                    value={profileData.introduction}
                                    onChange={(e) => setProfileData({ ...profileData, introduction: e.target.value })}
                                />
                            </div>

                            {/* 버튼 그룹 */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 py-3 text-lg font-semibold border-2"
                                    onClick={() => setStep('account')}
                                >
                                    이전
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/40 transition-all hover:scale-[1.02]"
                                >
                                    가입 완료
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* 로그인 링크 */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            이미 계정이 있으신가요?{" "}
                            <Link
                                href="/auth/login"
                                className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                            >
                                로그인
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
        </div>
    )
}
