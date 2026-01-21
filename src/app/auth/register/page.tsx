"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Store, User, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const Icons = {
    Sparkles: Sparkles as any,
    Store: Store as any,
    User: User as any,
    ArrowLeft: ArrowLeft as any,
    CheckCircle2: CheckCircle2 as any
}

export default function RegisterPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center p-6">
            {/* 배경 장식 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative w-full max-w-4xl">
                {/* 뒤로 가기 */}


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

                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">회원가입</h1>
                        <p className="text-gray-600">어떤 유형의 계정을 만드시겠어요?</p>
                    </div>

                    {/* 계정 유형 선택 */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* 소상공인 */}
                        <button
                            onClick={() => router.push('/auth/register/owner')}
                            className="group relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>

                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                    <Icons.Store size={32} className="text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3">소상공인 · 브랜드</h3>
                                <p className="text-gray-600 mb-6">
                                    캠페인을 생성하고 크리에이터를 관리하세요
                                </p>

                                <ul className="space-y-2 text-sm">
                                    {[
                                        '캠페인 생성/관리',
                                        '검수/승인 시스템',
                                        '크레딧 정산',
                                        '멀티 매장 지원'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Icons.CheckCircle2 size={16} className="text-indigo-600" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <span className="inline-block text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                                        소상공인으로 시작하기 →
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* 크리에이터 */}
                        <button
                            onClick={() => router.push('/auth/register/creator')}
                            className="group relative p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>

                            <div className="relative">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                    <Icons.User size={32} className="text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3">크리에이터 · 리뷰어</h3>
                                <p className="text-gray-600 mb-6">
                                    캠페인에 참여하고 리워드를 받으세요
                                </p>

                                <ul className="space-y-2 text-sm">
                                    {[
                                        '캠페인 참여/신청',
                                        '미션 수행/제출',
                                        '크레딧 지갑',
                                        '포트폴리오 관리'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Icons.CheckCircle2 size={16} className="text-purple-600" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <span className="inline-block text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
                                        크리에이터로 시작하기 →
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* 로그인 링크 */}
                    <div className="text-center pt-6 border-t border-gray-200">
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
