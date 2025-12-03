import { Award, Calendar, Camera, Edit3, Heart, Mail, MapPin, Phone, User } from 'lucide-react'
import React, { useState } from 'react'

const ProfileUser = () => {
    const [tab, setTab] = useState("info");
    return (
        <div className='container'>
            <div className="w-full mx-auto mt-8 px-6">
                <h2 className="text-2xl font-semibold mb-2">Hồ sơ cá nhân</h2>
                <p className="text-gray-500 mb-6">
                    Quản lý thông tin cá nhân và sở thích của bạn
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Left Card */}
                    <div className="bg-white lg:col-span-2 p-6 shadow-sm flex flex-col items-center">
                        <div className="relative">
                            <img
                                src="https://randomuser.me/api/portraits/men/1.jpg"
                                alt="avatar"
                                className="w-32 h-32 rounded-full object-cover"
                            />
                            <button className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full text-white hover:bg-orange-600">
                                <Camera size={16} />
                            </button>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">Nguyễn Văn A</h3>
                        <p className="text-gray-500 text-sm">nguyenvana@email.com</p>
                        <p className="text-xs text-gray-400 my-6 border px-3 py-1 rounded-full">
                            Thành viên từ 15/1/2024
                        </p>

                        {/* Stats */}
                        <div className="flex justify-between w-full mt-6 text-center">
                            <div className="flex-1">
                                <Calendar className="mx-auto text-orange-500" />
                                <p className="font-semibold">12</p>
                                <p className="text-gray-500 text-sm">Đơn hàng</p>
                            </div>
                            <div className="flex-1">
                                <Heart className="mx-auto text-orange-500" />
                                <p className="font-semibold">5</p>
                                <p className="text-gray-500 text-sm">Đầu bếp yêu thích</p>
                            </div>
                            <div className="flex-1">
                                <Award className="mx-auto text-orange-500" />
                                <p className="font-semibold">250</p>
                                <p className="text-gray-500 text-sm">Điểm thưởng</p>
                            </div>
                        </div>

                        {/* Sở thích ẩm thực */}
                        <div className="mt-8 w-full border-t pt-4">
                            <h4 className="font-semibold mb-2">Sở thích ẩm thực</h4>
                            <p className="text-sm mb-2">
                                <span className="font-medium">Khẩu vị:</span>{" "}
                                <span className="bg-gray-100 px-2 py-1 rounded-full text-sm mr-2">Không ăn hải sản</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-full text-sm">Ít cay</span>
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Dị ứng:</span>{" "}
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">Đậu phộng</span>
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="lg:col-span-3 items-end">
                        {/* Tabs */}
                        <div className="flex mb-4">
                            <button
                                className={`flex-1 py-2 text-center cursor-pointer font-medium ${tab === "info"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-500 hover:text-orange-500"
                                    }`}
                                onClick={() => setTab("info")}
                            >
                                Thông tin cá nhân
                            </button>
                            <button
                                className={`flex-1 py-2 text-center cursor-pointer font-medium ${tab === "prefs"
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-500 hover:text-orange-500"
                                    }`}
                                onClick={() => setTab("prefs")}
                            >
                                Sở thích
                            </button>
                        </div>

                        {/* Tab Content */}
                        {tab === "info" ? (
                            <div className="bg-white p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
                                    <button className="flex items-center cursor-pointer gap-2 text-orange-600 hover:text-orange-700">
                                        <Edit3 size={16} /> Chỉnh sửa
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-gray-700 mt-6">
                                    {/* Họ và tên */}
                                    <div className="flex items-start gap-2">
                                        <div className="flex items-center gap-2 w-1/3">
                                            <User size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-600">Họ và tên</span>
                                        </div>
                                        <p className="text-sm text-gray-800">Nguyễn Văn A</p>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-2">
                                        <div className="flex items-center gap-2 w-1/3">
                                            <Mail size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-600">Email</span>
                                        </div>
                                        <p className="text-sm text-gray-800">nguyenvana@email.com</p>
                                    </div>

                                    {/* Số điện thoại */}
                                    <div className="flex items-start gap-2">
                                        <div className="flex items-center gap-2 w-1/3">
                                            <Phone size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-600">Số điện thoại</span>
                                        </div>
                                        <p className="text-sm text-gray-800">+84 123 456 789</p>
                                    </div>

                                    {/* Địa chỉ */}
                                    <div className="flex items-start gap-2">
                                        <div className="flex items-center gap-2 w-1/3">
                                            <MapPin size={16} className="text-gray-500" />
                                            <span className="text-sm font-medium text-gray-600">Địa chỉ</span>
                                        </div>
                                        <p className="text-sm text-gray-800">123 Đường ABC, Quận 1, TP.HCM</p>
                                    </div>

                                    {/* Giới thiệu bản thân */}
                                    <div className="sm:col-span-2 mt-4">
                                        <p className="text-sm font-medium text-gray-600 mb-1">Giới thiệu bản thân</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Yêu thích ẩm thực Ý và Nhật Bản. Thích khám phá những món ăn mới và trải nghiệm
                                            văn hóa ẩm thực.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="bg-white p-6 shadow-sm">
                                <h4 className="font-semibold text-lg mb-4">Sở thích ẩm thực</h4>
                                <form className="space-y-6 text-gray-700">
                                    {/* Khẩu vị & Chế độ ăn */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Khẩu vị & Chế độ ăn
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="VD: Ăn chay, Không ăn hải sản, Ít cay..."
                                            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                        <p className="text-gray-400 text-xs mt-1">
                                            Nhập các sở thích ăn uống của bạn, cách nhau bởi dấu phẩy
                                        </p>
                                    </div>

                                    {/* Dị ứng thực phẩm */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Dị ứng thực phẩm
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="VD: Đậu phộng, Hải sản, Sữa..."
                                            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                        <p className="text-gray-400 text-xs mt-1">
                                            Điều này giúp đầu bếp chuẩn bị món ăn an toàn cho bạn
                                        </p>
                                    </div>

                                    {/* Món ăn yêu thích */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Món ăn yêu thích
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="VD: Pasta Ý, Sushi Nhật, Phở Việt Nam..."
                                            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                    </div>

                                    {/* Ngân sách trung bình */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Ngân sách trung bình mỗi bữa
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="VD: 100"
                                            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                    </div>

                                    {/* Nút lưu */}
                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all"
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileUser