import React, { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, UserCog, Mail, Lock, Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginUser } = useAuth()

  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1: nhập email, 2: nhập mật khẩu mới, 3: thành công
  const [forgotEmail, setForgotEmail] = useState('')
  const [foundUser, setFoundUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      })

      console.log('Login success:', res.data)

      // Lưu thông tin user bằng AuthContext
      loginUser(res.data.user, res.data.token)

    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  // Mở modal quên mật khẩu
  const handleOpenForgotPassword = (e) => {
    e.preventDefault()
    setShowForgotPassword(true)
    setForgotStep(1)
    setForgotEmail('')
    setFoundUser(null)
    setNewPassword('')
    setConfirmPassword('')
    setForgotError('')
  }

  // Đóng modal quên mật khẩu
  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotStep(1)
    setForgotEmail('')
    setFoundUser(null)
    setNewPassword('')
    setConfirmPassword('')
    setForgotError('')
  }

  // Bước 1: Kiểm tra email
  const handleCheckAccount = async (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotLoading(true)

    try {
      const res = await axios.post('http://localhost:3000/api/auth/check-account', {
        email: forgotEmail
      })

      setFoundUser(res.data)
      setForgotStep(2)
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Không tìm thấy tài khoản')
    } finally {
      setForgotLoading(false)
    }
  }

  // Bước 2: Đổi mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setForgotError('')

    if (newPassword.length < 6) {
      setForgotError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Mật khẩu xác nhận không khớp')
      return
    }

    setForgotLoading(true)

    try {
      await axios.post('http://localhost:3000/api/auth/reset-password', {
        userId: foundUser.userId,
        newPassword
      })

      setForgotStep(3)
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-4 text-gray-500 hover:text-black transition-color">
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Link>
        <Link to="/admin/sign-in" className="flex items-center gap-2 text-gray-500 hover:text-black transition-color">
          <UserCog size={20} />
          <span>Đăng nhập Admin</span>
        </Link>
      </header>

      <main className="flex justify-center items-center pt-10 pb-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
          <h1 className="text-3xl mb-2 text-center">Chào mừng trở lại</h1>
          <p className="text-gray-500 mb-6 text-center">Đăng nhập vào tài khoản COOK4U của bạn</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="cook4u@example.com"
                  className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right mb-3">
              <button
                type="button"
                onClick={handleOpenForgotPassword}
                className="text-sm text-orange-600 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-orange-400' : 'bg-orange-500'
                } text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 mb-2 disabled:opacity-50`}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Chưa có tài khoản?{' '}
              <Link
                to="/sign-up"
                className="text-orange-600 font-bold hover:underline"
              >
                Đăng ký
              </Link>
            </p>
          </form>
        </div>
      </main>

      {/* Modal Quên mật khẩu */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseForgotPassword}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {forgotStep === 1 && 'Quên mật khẩu'}
                  {forgotStep === 2 && 'Đặt mật khẩu mới'}
                  {forgotStep === 3 && 'Thành công!'}
                </h2>
                <button
                  onClick={handleCloseForgotPassword}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              {/* Progress Steps */}
              <div className="flex items-center gap-2 mt-3">
                <div className={`flex-1 h-1 rounded-full ${forgotStep >= 1 ? 'bg-white' : 'bg-white/30'}`} />
                <div className={`flex-1 h-1 rounded-full ${forgotStep >= 2 ? 'bg-white' : 'bg-white/30'}`} />
                <div className={`flex-1 h-1 rounded-full ${forgotStep >= 3 ? 'bg-white' : 'bg-white/30'}`} />
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Error Message */}
              {forgotError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={18} />
                  {forgotError}
                </div>
              )}

              {/* Step 1: Nhập email */}
              {forgotStep === 1 && (
                <form onSubmit={handleCheckAccount}>
                  <p className="text-gray-600 mb-4">
                    Nhập email đã đăng ký để khôi phục mật khẩu.
                  </p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotLoading ? 'Đang kiểm tra...' : 'Tiếp tục'}
                  </button>
                </form>
              )}

              {/* Step 2: Đặt mật khẩu mới */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword}>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-orange-700">
                      <span className="font-medium">Xin chào, {foundUser?.fullname}!</span>
                      <br />
                      Tài khoản: {foundUser?.email}
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                        className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {/* Password match indicator */}
                    {confirmPassword && (
                      <p className={`text-sm mt-1 ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                        {newPassword === confirmPassword ? '✓ Mật khẩu khớp' : '✗ Mật khẩu không khớp'}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Thành công */}
              {forgotStep === 3 && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Đổi mật khẩu thành công!</h3>
                  <p className="text-gray-600 mb-6">
                    Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
                  </p>
                  <button
                    onClick={handleCloseForgotPassword}
                    className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default SignIn