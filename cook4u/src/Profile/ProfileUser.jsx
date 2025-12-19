import {
  Award,
  Calendar,
  Camera,
  Edit3,
  Heart,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ProfileUser = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorChefCount, setFavorChefCount] = useState(0);
  const [profileData, setProfileData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    reward: "",
    avatar: "https://i.pravatar.cc/150?img=50",
  });
  
  const [originalData, setOriginalData] = useState({});

  // Lấy token từ localStorage
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Hàm lấy thông tin user
  const fetchUserData = () => {
    axios
      .get("http://localhost:3000/api/users/me", getAuthHeader())
      .then((res) => {
        const user = res.data.data;
        const newData = {
          fullname: user.FULLNAME || "",
          email: user.EMAIL || "",
          phone: user.PHONENUMBER || "",
          address: user.ADDRESS || "",
          bio: user.INTRODUCTION || "",
          reward: user.REWARDPOINT || "0",
          avatar: user.AVTURL || "https://i.pravatar.cc/150?img=50",
        };
        setProfileData(newData);
        setOriginalData(newData); // Lưu dữ liệu gốc để hủy
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        alert("Không thể tải thông tin người dùng");
      });
  };

  const getFavorChefCount = async() => {
    try {
      const userItem = JSON.parse(localStorage.getItem('user'));
      const userId = userItem.id;
      let res = await axios({
        url: `http://localhost:3000/api/favorites/${userId}`,
        method: "GET"
      })
      setFavorChefCount(res.data.favoriteCount)
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchUserData();
    getFavorChefCount();
  }, []);

  const fileInputRef = useRef(null);

  // Hàm cập nhật thông tin user
  const handleSaveProfile = () => {
    setLoading(true);
    
    const updatedData = {
      fullname: profileData.fullname,
      email: profileData.email,
      phonenumber: profileData.phone,
      address: profileData.address,
      introduction: profileData.bio,
      avturl: profileData.avatar,
    };

    axios
      .put("http://localhost:3000/api/users/me", updatedData, getAuthHeader())
      .then((res) => {
        const user = res.data.data;
        const newData = {
          fullname: user.FULLNAME,
          email: user.EMAIL,
          phone: user.PHONENUMBER,
          address: user.ADDRESS,
          bio: user.INTRODUCTION,
          reward: user.REWARDPOINT,
          avatar: user.AVTURL || "https://i.pravatar.cc/150?img=50",
        };
        setProfileData(newData);
        setOriginalData(newData);
        setIsEditing(false);
        setLoading(false);
        // alert("Đã lưu thông tin thành công!");
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        setLoading(false);
        if (err.response?.status === 400) {
          alert("Dữ liệu không hợp lệ: " + err.response.data.message);
        } else {
          alert("Có lỗi xảy ra khi lưu thông tin");
        }
      });
  };

  // Hàm hủy chỉnh sửa
  const handleCancelEdit = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  // Hàm upload ảnh (nếu muốn upload thực sự)
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Hiển thị preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({
        ...prev,
        avatar: reader.result,
      }));
    };
    reader.readAsDataURL(file);

    // Nếu muốn upload thực sự lên server
    // const formData = new FormData();
    // formData.append('avatar', file);
    // axios.post('/api/upload-avatar', formData, getAuthHeader())
    //   .then(res => {
    //     setProfileData(prev => ({...prev, avatar: res.data.url}));
    //   })
    //   .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <div className="w-full mx-auto mt-8 px-6">
        <h2 className="text-2xl font-semibold mb-2">Hồ sơ cá nhân</h2>
        <p className="text-gray-500 mb-6">
          Quản lý thông tin cá nhân của bạn
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Card */}
          <div className="bg-white lg:col-span-2 p-6 shadow-sm flex flex-col items-center">
            <div className="relative">
              <img
                src={profileData.avatar}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover"
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full text-white hover:bg-orange-600"
              >
                <Camera size={16} />
              </button>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{profileData.fullname}</h3>
            <p className="text-gray-500 text-sm">{profileData.email}</p>
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
                <p className="font-semibold">{favorChefCount}</p>
                <p className="text-gray-500 text-sm">Đầu bếp yêu thích</p>
              </div>
              <div className="flex-1">
                <Award className="mx-auto text-orange-500" />
                <p className="font-semibold">{profileData.reward}</p>
                <p className="text-gray-500 text-sm">Điểm thưởng</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center cursor-pointer gap-2 text-orange-600 hover:text-orange-700"
                >
                  <Edit3 size={16} /> {isEditing ? "Hủy" : "Chỉnh sửa"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-gray-700 mt-6">
                {/* Họ và tên */}
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-2 w-1/3">
                    <User size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Họ và tên
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.fullname}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          fullname: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm text-gray-800">
                      {profileData.fullname || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-2 w-1/3">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Email
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm text-gray-800">
                      {profileData.email || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-2 w-1/3">
                    <Phone size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Số điện thoại
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm text-gray-800">
                      {profileData.phone || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-2 w-1/3">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Địa chỉ
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm text-gray-800">
                      {profileData.address || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Giới thiệu bản thân */}
                <div className="sm:col-span-2 mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Giới thiệu bản thân
                  </p>
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      rows="3"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {profileData.bio || "Chưa có giới thiệu"}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang lưu...
                      </span>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;