"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft, User, Phone, Store, MapPin, Building } from "lucide-react"
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
    Store: Store as any,
    MapPin: MapPin as any,
    Building: Building as any
}

export default function OwnerRegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState<'account' | 'business'>('account')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    const [accountData, setAccountData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: ''
    })

    const [businessData, setBusinessData] = useState({
        businessName: '',
        businessType: '',
        address: '',
        detailAddress: '',
        businessIntro: ''
    })

    const handleAccountNext = (e: React.FormEvent) => {
        e.preventDefault()

        if (accountData.password !== accountData.passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }

        setStep('business')
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()

        // TODO: 실제 회원가입 로직
        alert('회원가입이 완료되었습니다!\n(백엔드 연동 후 실제 동작)')
        router.push('/auth/login')
    }

    const handleSkipBusiness = () => {
        // TODO: 사업체 정보 없이 회원가입 로직
        alert('사업체 등록을 건너뛰고 가입을 완료합니다.')
        router.push('/auth/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center p-6">
            {/* 배경 장식 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* 뒤로 가기 */}
                <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-colors"
                >
                    <Icons.ArrowLeft size={20} />
                    <span className="font-medium">계정 유형 선택으로 돌아가기</span>
                </Link>

                {/* 회원가입 카드 */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 md:p-12">
                    {/* 로고 */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <Icons.Sparkles size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Campaign SaaS
                        </span>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">소상공인 회원가입</h1>
                        <p className="text-gray-600">
                            {step === 'account' ? '계정 정보를 입력해주세요' : '사업체 정보를 입력해주세요'}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'account' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'} font-semibold transition-colors`}>
                            1
                        </div>
                        <div className={`h-1 w-16 ${step === 'business' ? 'bg-indigo-600' : 'bg-gray-200'} rounded transition-colors`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'business' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'} font-semibold transition-colors`}>
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
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                                        className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/40 transition-all hover:scale-[1.02]"
                            >
                                다음
                            </Button>
                        </form>
                    )}

                    {/* Step 2: 사업체 정보 */}
                    {step === 'business' && (
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* 사업체명 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    사업체명 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="예: 강남점 파스타하우스"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                        value={businessData.businessName}
                                        onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* 업종 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    업종 <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Icons.Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <select
                                        required
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all appearance-none bg-white"
                                        value={businessData.businessType}
                                        onChange={(e) => setBusinessData({ ...businessData, businessType: e.target.value })}
                                    >
                                        <option value="">선택해주세요</option>
                                        <option value="restaurant">음식점</option>
                                        <option value="cafe">카페</option>
                                        <option value="beauty">뷰티/미용</option>
                                        <option value="fitness">헬스/피트니스</option>
                                        <option value="retail">소매/유통</option>
                                        <option value="education">교육</option>
                                        <option value="service">서비스업</option>
                                        <option value="other">기타</option>
                                    </select>
                                </div>
                            </div>

                            {/* 주소 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    매장 주소 <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <Icons.MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="서울시 강남구 테헤란로 123"
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                            value={businessData.address}
                                            onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="상세 주소 (선택)"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                        value={businessData.detailAddress}
                                        onChange={(e) => setBusinessData({ ...businessData, detailAddress: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* 사업체 소개 */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    사업체 한줄 소개 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="예: 정성을 담아 운영하는 이탈리안 레스토랑입니다."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
                                    value={businessData.businessIntro}
                                    onChange={(e) => setBusinessData({ ...businessData, businessIntro: e.target.value })}
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
                                    type="button"
                                    variant="outline"
                                    className="flex-1 py-3 text-lg font-semibold border-2 text-gray-600 hover:bg-gray-50"
                                    onClick={handleSkipBusiness}
                                >
                                    다음에 하기
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-[2] py-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/40 transition-all hover:scale-[1.02]"
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
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
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
