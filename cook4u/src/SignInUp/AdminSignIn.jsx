import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const AdminSignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginAdmin } = useAuth()
  
  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Gọi API đăng nhập admin
      const res = await axios.post('http://localhost:3000/api/auth/login-admin', {
        email,
        password
      })

      console.log('Admin login success:', res.data)
      
      // Lưu thông tin admin
      loginAdmin(res.data.user, res.data.token)
      
    } catch (err) {
      console.error('Admin login error:', err)
      setError(err.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white min-h-screen text-gray-800">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-4 text-gray-500 hover:text-black transition-color"
        >
          <ArrowLeft size={20}/>
          <span>Quay lại</span>
        </button>
      </header>
      
      <main className="flex justify-center items-center pt-10 pb-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
          <h1 className="text-3xl mb-2 text-center">Chào mừng Admin</h1>
          <p className="text-gray-500 mb-6 text-center">Đăng nhập vào tài khoản admin COOK4U</p>

          {/* Hiển thị lỗi */}
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
                  placeholder="admin@chefhire.com"
                  className="w-full bg-gray-100 border-none rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? 'bg-orange-400' : 'bg-orange-500'
              } text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50`}
            > 
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AdminSignIn