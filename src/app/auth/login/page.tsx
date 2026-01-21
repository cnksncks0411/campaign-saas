"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"

const Icons = {
    Sparkles: Sparkles as any,
    Mail: Mail as any,
    Lock: Lock as any,
    Eye: Eye as any,
    EyeOff: EyeOff as any,
    ArrowLeft: ArrowLeft as any
}

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: 실제 로그인 로직
        alert('로그인 기능은 백엔드 연동 후 구현됩니다.')
        // 임시로 소상공인 대시보드로 이동
        router.push('/owner/campaigns')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center p-6">
            {/* 배경 장식 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* 뒤로 가기 */}


                {/* 로그인 카드 */}
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
                        <p className="text-gray-600">계정에 로그인하여 캠페인을 관리하세요</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* 이메일 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                이메일
                            </label>
                            <div className="relative">
                                <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <Icons.EyeOff size={20} /> : <Icons.Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* 비밀번호 찾기 */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>

                        {/* 로그인 버튼 */}
                        <Button
                            type="submit"
                            className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/40 transition-all hover:scale-[1.02]"
                        >
                            로그인
                        </Button>
                    </form>

                    {/* 구분선 */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">또는</span>
                        </div>
                    </div>

                    {/* 소셜 로그인 (선택) */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <div className="w-5 h-5 bg-yellow-400 rounded"></div>
                            카카오로 로그인
                        </button>
                        <button
                            type="button"
                            className="w-full py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <div className="w-5 h-5 bg-green-500 rounded"></div>
                            네이버로 로그인
                        </button>
                    </div>

                    {/* 회원가입 링크 */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                            아직 계정이 없으신가요?{" "}
                            <Link
                                href="/auth/register"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                회원가입
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
