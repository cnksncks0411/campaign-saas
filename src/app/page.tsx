"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Building2, User, ArrowRight } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Campaign SaaS
          </h1>
          <p className="text-xl text-gray-600">
            소상공인과 크리에이터를 연결하는 캠페인 플랫폼
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 사장님 (Owner) */}
          <div
            onClick={() => router.push('/owner/dashboard')}
            className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <Building2 className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">사장님</h2>
              <p className="text-gray-600 mb-6">
                캠페인을 만들고 크리에이터를 모집하세요
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-transform">
                시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 크리에이터 (Creator) */}
          <div
            onClick={() => router.push('/creator/dashboard')}
            className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <User className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">크리에이터</h2>
              <p className="text-gray-600 mb-6">
                다양한 캠페인에 참여하고 리워드를 받으세요
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:scale-105 transition-transform">
                시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>이미 계정이 있으신가요? <button onClick={() => router.push('/auth/login')} className="text-blue-600 hover:underline">로그인</button></p>
        </div>
      </div>
    </div>
  )
}
