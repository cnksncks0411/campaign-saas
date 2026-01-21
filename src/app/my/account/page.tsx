"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Lock, Camera } from "lucide-react"

const Icons = { User: User as any, Mail: Mail as any, Phone: Phone as any, Lock: Lock as any, Camera: Camera as any }

export default function AccountPage() {
    const [profile, setProfile] = useState({
        name: '홍길동',
        email: 'hong@example.com',
        phone: '010-1234-5678'
    })

    return (
        <div className="min-h-screen py-8 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                        내 계정
                    </h1>
                    <p className="text-gray-600">프로필과 보안 설정</p>
                </div>

                <div className="grid gap-6">
                    {/* 프로필 사진 */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">프로필 사진</h3>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                    <Icons.User size={48} className="text-white" />
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border-2 border-gray-200 hover:bg-gray-50">
                                    <Icons.Camera size={16} />
                                </button>
                            </div>
                            <div>
                                <Button variant="outline">사진 변경</Button>
                            </div>
                        </div>
                    </div>

                    {/* 기본 정보 */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">기본 정보</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                    value={profile.email}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                                <input
                                    type="tel"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                                저장하기
                            </Button>
                        </div>
                    </div>

                    {/* 보안 */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Icons.Lock size={20} />
                            보안
                        </h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-between">
                                비밀번호 변경
                                <span className="text-gray-400">→</span>
                            </Button>
                            <Button variant="outline" className="w-full justify-between">
                                2단계 인증
                                <span className="text-green-600 text-sm">활성화됨</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
