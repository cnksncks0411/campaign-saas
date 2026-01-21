"use client"

import { useRouter, usePathname } from "next/navigation"
import { ReactNode, useState } from "react"
import {
    LayoutDashboard,
    Megaphone,
    Users,
    FileText,
    Wallet,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    Bell,
    User,
    Building2
} from "lucide-react"

/**
 * DES_07 1.1 - SaaS Shell Layout
 * Left Sidebar (240px, 고정) + Top Bar (56px, 고정) + Content Area
 */

const Icons = {
    LayoutDashboard: LayoutDashboard as any,
    Megaphone: Megaphone as any,
    Users: Users as any,
    FileText: FileText as any,
    Wallet: Wallet as any,
    Settings: Settings as any,
    ChevronLeft: ChevronLeft as any,
    ChevronRight: ChevronRight as any,
    Search: Search as any,
    Bell: Bell as any,
    User: User as any,
    Building2: Building2 as any
}

interface MenuItem {
    label: string
    icon: any
    href: string
    badge?: string | number
}

interface SaaSLayoutProps {
    children: ReactNode
    role?: "owner" | "creator" | "admin"
}

export default function SaaSLayout({ children, role = "owner" }: SaaSLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    // Owner 메뉴
    const ownerMenu: MenuItem[] = [
        { label: "대시보드", icon: Icons.LayoutDashboard, href: "/owner/dashboard" },
        { label: "캠페인", icon: Icons.Megaphone, href: "/owner/campaigns" },
        { label: "참여자", icon: Icons.Users, href: "/owner/participants", badge: 3 },
        { label: "리포트", icon: Icons.FileText, href: "/owner/reports" },
        { label: "크레딧·원장", icon: Icons.Wallet, href: "/my/billing" }
    ]

    // Creator 메뉴
    const creatorMenu: MenuItem[] = [
        { label: "할 일", icon: Icons.LayoutDashboard, href: "/creator/dashboard" },
        { label: "캠페인 둘러보기", icon: Icons.Search, href: "/creator/campaigns" },
        { label: "내 신청/선정", icon: Icons.Users, href: "/creator/applications" },
        { label: "내 크레딧", icon: Icons.Wallet, href: "/creator/credits" }
    ]

    const menuItems = role === "owner" ? ownerMenu : creatorMenu

    const isActive = (href: string) => {
        return pathname === href || pathname?.startsWith(href + "/")
    }

    return (
        <div className="saas-layout">
            {/* Left Sidebar */}
            <aside className={`saas-sidebar ${collapsed ? "collapsed" : ""}`}>
                {/* Logo & Workspace Switcher */}
                <div className="p-4 border-b border-neutral-200">
                    {!collapsed ? (
                        <div>
                            <h1 className="font-bold text-lg bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                Campaign SaaS
                            </h1>
                            {role === "owner" && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                                    <Icons.Building2 size={14} />
                                    <span>사업장: 본점</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-2xl text-center">🎯</div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
                    {menuItems.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                                    : "text-neutral-600 hover:bg-neutral-100"
                                    }`}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 bg-danger-500 text-white text-xs rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        )
                    })}
                </nav>
            </aside>

            {/* Collapse Toggle - 사이드바 외부에 배치 */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="fixed top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:shadow-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center group z-[1000]"
                style={{
                    left: collapsed ? 'calc(var(--sidebar-collapsed-width) - 1rem)' : 'calc(var(--sidebar-width) - 1rem)'
                }}
                title={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
                aria-label={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
            >
                {collapsed ? (
                    <Icons.ChevronRight size={16} className="text-gray-700 group-hover:text-indigo-600 transition-colors" />
                ) : (
                    <Icons.ChevronLeft size={16} className="text-gray-700 group-hover:text-indigo-600 transition-colors" />
                )}
            </button>

            {/* Main Content Area */}
            <div className={`saas-main ${collapsed ? "sidebar-collapsed" : ""}`}>
                {/* Top Bar */}
                <header className="saas-topbar">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-500">Home</span>
                        <span className="text-neutral-300">/</span>
                        <span className="text-neutral-900 font-medium">
                            {menuItems.find(item => isActive(item.href))?.label || "페이지"}
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Global Search */}
                        <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Icons.Search size={20} />
                        </button>

                        {/* Notifications */}
                        <button className="relative p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">
                            <Icons.Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
                        </button>

                        {/* User Menu */}
                        <button
                            onClick={() => router.push("/my/account")}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                            <Icons.User size={16} />
                            <span className="text-sm font-medium">
                                {role === "owner" ? "사장님" : "크리에이터"}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="saas-content">
                    {children}
                </main>
            </div>
        </div>
    )
}
