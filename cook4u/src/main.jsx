import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import HeaderUsers from "./User/HeaderUsers";
import SignIn from "./SignInUp/SignIn";
import AdminSignIn from "./SignInUp/AdminSignIn";
import SignUp from "./SignInUp/SignUp";
import Users from "./User/Users";
import HeaderClient from "./Client/HeaderClient";
import HomePage from "./ServicePage/HomePage/HomePage";
import DishDetail from "./DetailDishes/DishDetail";
import FindChef from "./FindChef/FindChef";
import FindDish from "./FindDish/FindDish";
import PickChef from "./PickChef/PickChef";
import ProfileUser from "./Profile/ProfileUser";
import MyCart from "./MyCart/MyCart.jsx";
import BookingPage from "./Booking/booking.jsx";
import AboutUs from "./AboutUs/AboutUs.jsx";
import Orders from "./Orders/Orders.jsx";
import Admin from "./Admin/Admin.jsx";
import ProtectedRoute from "./contexts/ProtectedRoute";

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    <p className="mt-4 text-gray-600">Đang tải...</p>
  </div>
);

// Component chính
const AppContent = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Users />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/admin/sign-in" element={<AdminSignIn />} />
      
      {/* Protected User Routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <HeaderClient />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="findachef" element={<FindChef />} />
        <Route path="findadish" element={<FindDish />} />
        <Route path="pickchef/:chefId" element={<PickChef />} />
        <Route path="dish/:dishId" element={<DishDetail />} />
        <Route path="mycart" element={<MyCart />} />
        <Route path="profile" element={<ProfileUser />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="aboutus" element={<AboutUs />} />
      </Route>
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <HeaderClient />
        </ProtectedRoute>
      }>
        <Route index element={<Orders />} />
      </Route>
      
      {/* Protected Admin Routes */}
      <Route path="/admin/dash-board" element={
        <ProtectedRoute requireAdmin={true}>
          <Admin />
        </ProtectedRoute>
      } />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Render App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);