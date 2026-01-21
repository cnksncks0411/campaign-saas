"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Megaphone,
    Users,
    Wallet,
    FileText,
    Settings,
    User,
    LogOut,
    Search,
    ClipboardList,
    Trophy,
    HelpCircle
} from "lucide-react"

const Icons = {
    LayoutDashboard: LayoutDashboard as any,
    Megaphone: Megaphone as any,
    Users: Users as any,
    Wallet: Wallet as any,
    FileText: FileText as any,
    Settings: Settings as any,
    User: User as any,
    LogOut: LogOut as any,
    Search: Search as any,
    ClipboardList: ClipboardList as any,
    Trophy: Trophy as any,
    HelpCircle: HelpCircle as any
}

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()

    const isOwner = pathname?.startsWith('/owner')
    const isCreator = pathname?.startsWith('/creator')
    const isMyPage = pathname?.startsWith('/my')

    if (pathname === '/') return null

    // 사장님(소상공인) 메뉴 - 기획서 9번 대시보드 기반
    const ownerNavItems = [
        { label: '대시보드', icon: Icons.LayoutDashboard, href: '/owner/dashboard' },
        { label: '캠페인', icon: Icons.Megaphone, href: '/owner/campaigns' },
        { label: '참여자', icon: Icons.Users, href: '/owner/participants' },
        { label: '리포트', icon: Icons.FileText, href: '/owner/reports' },
    ]

    // 크리에이터 메뉴 - 기획서 10-1 크리에이터 IA
    const creatorNavItems = [
        { label: '할 일', icon: Icons.ClipboardList, href: '/creator/dashboard' },
        { label: '캠페인 둘러보기', icon: Icons.Search, href: '/creator/campaigns' },
        { label: '내 신청/선정', icon: Icons.Trophy, href: '/creator/applications' },
        { label: '내 크레딧', icon: Icons.Wallet, href: '/creator/credits' },
    ]

    // 공통 우측 메뉴
    const commonNavItems = [
        { label: '마이페이지', icon: Icons.Settings, href: '/my/account' },
    ]

    let navItems: { label: string; icon: any; href: string }[] = []
    let roleLabel = ''
    let roleColor = ''

    if (isOwner) {
        navItems = ownerNavItems
        roleLabel = '사장님'
        roleColor = 'from-blue-600 to-purple-600'
    } else if (isCreator) {
        navItems = creatorNavItems
        roleLabel = '크리에이터'
        roleColor = 'from-green-600 to-emerald-600'
    } else if (isMyPage) {
        navItems = []
        roleLabel = '설정'
        roleColor = 'from-gray-600 to-slate-600'
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    {/* 로고 */}
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => router.push('/')}
                            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            Campaign SaaS
                        </button>

                        {/* 메인 메뉴 */}
                        <div className="hidden lg:flex gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 우측 */}
                    <div className="flex items-center gap-3">
                        {/* 크레딧 표시 (사장님/크리에이터만) */}
                        {(isOwner || isCreator) && (
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                                <Icons.Wallet size={16} className="text-yellow-600" />
                                <span className="text-sm font-bold text-yellow-700">50,000원</span>
                            </div>
                        )}

                        {/* 역할 배지 */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${roleColor} rounded-lg`}>
                            <Icons.User size={16} className="text-white" />
                            <span className="text-sm font-bold text-white">{roleLabel}</span>
                        </div>

                        {/* 마이페이지 */}
                        {!isMyPage && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/my/account')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <Icons.Settings size={18} />
                            </Button>
                        )}

                        {/* 역할 전환 */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <Icons.LogOut size={18} className="mr-1" />
                            전환
                        </Button>
                    </div>
                </div>
            </div>

            {/* 모바일 메뉴 (간소화) */}
            <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-2">
                    <div className="flex gap-2 overflow-x-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => router.push(item.href)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <item.icon size={14} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
