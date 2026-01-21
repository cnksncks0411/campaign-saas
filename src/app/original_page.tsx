"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Zap, Shield, Users, TrendingUp, Clock, Star } from "lucide-react"

const Icons = {
    ArrowRight: ArrowRight as any,
    CheckCircle2: CheckCircle2 as any,
    Zap: Zap as any,
    Shield: Shield as any,
    Users: Users as any,
    TrendingUp: TrendingUp as any,
    Clock: Clock as any,
    Star: Star as any
}

export default function HomePage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navbar */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="container mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="font-bold text-xl text-gray-900">Campaign SaaS</div>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">BETA</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/auth/login')}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                로그인
                            </Button>
                            <Button
                                onClick={() => router.push('/auth/register')}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                무료로 시작하기
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-6 bg-white overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="max-w-2xl relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
                                <Icons.Star size={14} />
                                소상공인 캠페인 운영 솔루션
                            </div>

                            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                마케팅이 아니라<br />
                                <span className="text-indigo-600">'운영'</span>입니다
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                검수부터 정산까지 모든 과정을 시스템화하여<br />
                                문제 · 시간 · 스트레스를 줄입니다
                            </p>

                            <div className="flex gap-4">
                                <Button
                                    size="lg"
                                    className="bg-indigo-600 hover:bg-indigo-700 px-6"
                                    onClick={() => router.push('/auth/register')}
                                >
                                    무료로 시작하기
                                    <Icons.ArrowRight size={18} className="ml-2" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-gray-300 hover:bg-gray-50"
                                    onClick={() => router.push('/auth/login')}
                                >
                                    로그인
                                </Button>
                            </div>

                            <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                                <Icons.CheckCircle2 size={16} className="text-green-600" />
                                신용카드 등록 없이 바로 시작 가능
                            </p>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src="/campaign_dashboard_hero.png"
                                    alt="Campaign SaaS Dashboard"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto rounded-xl"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            왜 Campaign SaaS인가?
                        </h2>
                        <p className="text-gray-600">
                            오프라인 매장에 최적화된 캠페인 운영 시스템
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Icons.Zap,
                                title: '자동화된 검수',
                                desc: '상태 기반 워크플로우로 검수 시간 90% 단축. 자동승인으로 지연 제로.',
                                color: 'text-yellow-600',
                                bg: 'bg-yellow-50'
                            },
                            {
                                icon: Icons.Shield,
                                title: '안전한 정산',
                                desc: '크레딧 시스템으로 투명하고 즉시 처리. 먹튀 방지.',
                                color: 'text-green-600',
                                bg: 'bg-green-50'
                            },
                            {
                                icon: Icons.Users,
                                title: '규칙 기반 운영',
                                desc: '미션·검수·수정요청을 템플릿화하여 분쟁 최소화.',
                                color: 'text-indigo-600',
                                bg: 'bg-indigo-50'
                            }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className={`inline-flex p-3 rounded-lg ${feature.bg} mb-4`}>
                                    <feature.icon size={24} className={feature.color} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            누가 사용하나요?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 소상공인 */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                                <Icons.Shield size={24} className="text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">소상공인 · 브랜드 담당자</h3>
                            <ul className="space-y-3">
                                {[
                                    '캠페인 생성 무료, 템플릿으로 1분 만에 시작',
                                    '검수·수정요청·자동승인 구조화로 분쟁 최소화',
                                    '크레딧 시스템으로 안전하고 투명한 정산',
                                    '멀티 매장 지원 (추가 사업체는 유료)'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Icons.CheckCircle2 size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 크리에이터 */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                                <Icons.Users size={24} className="text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">크리에이터 · 리뷰어</h3>
                            <ul className="space-y-3">
                                {[
                                    '할 일 명확 → 보상 명확 → 대기 없음',
                                    '미션 체크리스트로 정확한 가이드 제공',
                                    '48시간 자동승인으로 검수 지연 구조적 방지',
                                    '크레딧 지갑으로 즉시 정산·투명한 내역'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <Icons.CheckCircle2 size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { label: '검수 시간 단축', value: '90%', icon: Icons.Clock },
                            { label: '분쟁 발생률', value: '<3%', icon: Icons.Shield },
                            { label: '크리에이터 재참여율', value: '85%', icon: Icons.TrendingUp },
                            { label: '평균 승인 시간', value: '24h', icon: Icons.Zap }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <stat.icon size={24} className="text-indigo-600 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-indigo-600 rounded-2xl p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            지금 바로 시작하세요
                        </h2>
                        <p className="text-indigo-100 mb-8 text-lg">
                            캠페인 생성은 무료입니다. 신용카드 등록 없이 바로 체험 가능.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                className="bg-white text-indigo-600 hover:bg-gray-100 px-8"
                                onClick={() => router.push('/auth/register')}
                            >
                                무료로 시작하기
                                <Icons.ArrowRight size={18} className="ml-2" />
                            </Button>
                            <Button
                                size="lg"
                                className="bg-white text-indigo-600 hover:bg-gray-100 border-2 border-white px-8"
                                onClick={() => router.push('/auth/login')}
                            >
                                로그인
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <div className="font-bold text-lg text-white mb-2">Campaign SaaS</div>
                        <p className="text-sm">
                            © 2024 Campaign SaaS. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
