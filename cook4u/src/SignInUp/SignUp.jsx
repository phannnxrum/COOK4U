// cook4u/src/SignInUp/SignUp.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const backTo = location.state?.from === "signin" ? "/sign-in" : "/";
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agree: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  const validate = (values = form) => {
    const e = {};
    if (!values.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    if (!values.email.trim()) e.email = "Vui lòng nhập email";
    else if (!emailRegex.test(values.email)) e.email = "Email không hợp lệ";
    if (!values.password) e.password = "Nhập mật khẩu";
    else if (values.password.length < 6) e.password = "Tối thiểu 6 ký tự";
    if (!values.confirmPassword) e.confirmPassword = "Xác nhận mật khẩu";
    else if (values.confirmPassword !== values.password)
      e.confirmPassword = "Mật khẩu không khớp";
    if (values.phone && !/^\d{8,15}$/.test(values.phone))
      e.phone = "Số điện thoại 8–15 chữ số";
    if (!values.agree) e.agree = "Bạn cần đồng ý điều khoản";
    return e;
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  const onBlur = () => setErrors(validate());

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    setServerMsg(null);
    if (Object.keys(v).length) return;

    try {
      setLoading(true);
      const API_URL = "http://localhost:3000/api/auth/register";

      // --- Mock khi CHƯA có backend ---
      // await new Promise((r) => setTimeout(r, 600))
      // setServerMsg('Đăng ký thành công! Hãy đăng nhập.')
      // setTimeout(() => navigate('/sign-in', { replace: true }), 700)
      // return

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: form.fullName,
          email: form.email,
          phonenumber: form.phone,
          password: form.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.message || `Đăng ký thất bại (HTTP ${res.status})`
        );
      }

      setServerMsg("Đăng ký thành công! Hãy đăng nhập.");
      setTimeout(() => navigate("/sign-in", { replace: true }), 2000);
    } catch (err) {
      setServerMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasError = (k) => Boolean(errors[k]);
  const disabled = loading || Object.keys(validate()).length > 0;

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <Link
          to={backTo}
          className="flex items-center gap-4 text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </Link>
      </header>
      <main className="flex justify-center items-center pt-10 pb-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center">
            <img
              src="/image/LogoCook4u.png"
              alt="Cook4U"
              className="h-10 mb-1"
            />
            <h1 className="text-3xl mb-2 text-center font-extrabold">
              Tạo tài khoản
            </h1>
            <p className="text-gray-500 mb-6 text-center">
              Tham gia COOK4U và thưởng thức những bữa ăn chất lượng đầu bếp tại
              nhà
            </p>
          </div>

          {serverMsg && (
            <div
              className={`mb-3 rounded-lg px-3 py-2 text-sm ${
                serverMsg.includes("thành công")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {serverMsg}
            </div>
          )}

          <form onSubmit={onSubmit} noValidate>
            {/* Họ tên */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên của bạn
              </label>
              <div className="relative">
                <UserRound
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Nguyen Van A"
                  autoComplete="name"
                  className={`w-full bg-gray-100 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 ${
                    hasError("fullName")
                      ? "ring-2 ring-red-400"
                      : "focus:ring-orange-500"
                  }`}
                />
              </div>
              {hasError("fullName") && (
                <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="cook4u@example.com"
                  autoComplete="email"
                  className={`w-full bg-gray-100 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 ${
                    hasError("email")
                      ? "ring-2 ring-red-400"
                      : "focus:ring-orange-500"
                  }`}
                />
              </div>
              {hasError("email") && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <div className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">
                  +84
                </div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="1234 56789"
                  autoComplete="tel"
                  inputMode="numeric"
                  className={`w-full bg-gray-100 rounded-lg py-3 pl-[76px] pr-4 focus:outline-none focus:ring-2 ${
                    hasError("phone")
                      ? "ring-2 ring-red-400"
                      : "focus:ring-orange-500"
                  }`}
                />
              </div>
              {hasError("phone") && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full bg-gray-100 rounded-lg py-3 pl-11 pr-11 focus:outline-none focus:ring-2 ${
                    hasError("password")
                      ? "ring-2 ring-red-400"
                      : "focus:ring-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="toggle password"
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {hasError("password") && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPwd2 ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full bg-gray-100 rounded-lg py-3 pl-11 pr-11 focus:outline-none focus:ring-2 ${
                    hasError("confirmPassword")
                      ? "ring-2 ring-red-400"
                      : "focus:ring-orange-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd2((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="toggle confirm password"
                >
                  {showPwd2 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {hasError("confirmPassword") && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Điều khoản */}
            <label className="flex items-start gap-2 text-sm text-gray-600 mt-1 mb-2">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
                onBlur={onBlur}
                className="mt-1"
              />
              <span>
                Tôi đồng ý với{" "}
                <a
                  href="#"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Điều khoản và điều kiện
                </a>{" "}
                và{" "}
                <a
                  href="#"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Chính sách bảo mật
                </a>
              </span>
            </label>
            {hasError("agree") && (
              <p className="text-red-600 text-sm -mt-2 mb-2">
                Bạn cần đồng ý điều khoản
              </p>
            )}

            {/* Nút */}
            <button
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300 mb-2 disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>

            {/* Link đăng nhập */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Đã có tài khoản?{" "}
              <Link
                to="/sign-in"
                className="text-orange-600 font-bold hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
