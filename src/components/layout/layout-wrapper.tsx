"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import SaaSLayout from "./saas-layout"

/**
 * DES_07 레이아웃 래퍼
 * pathname 기반으로 역할을 감지하고 적절한 레이아웃 적용
 */

interface LayoutWrapperProps {
    children: ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
    const pathname = usePathname()

    // 홈페이지나 인증 페이지는 레이아웃 없이 표시
    if (pathname === "/" || pathname?.startsWith("/auth")) {
        return <>{children}</>
    }

    // 역할 감지
    const role = pathname?.startsWith("/owner")
        ? "owner"
        : pathname?.startsWith("/creator")
            ? "creator"
            : pathname?.startsWith("/admin")
                ? "admin"
                : "owner" // 기본값

    return (
        <SaaSLayout role={role}>
            {children}
        </SaaSLayout>
    )
}
