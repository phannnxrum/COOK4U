import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { CartProvider } from "./contexts/CartContext";
import HeaderUsers from "./User/HeaderUsers";
import SignIn from "./SignInUp/SignIn";
import AdminSignIn from "./SignInUp/AdminSignIn";
import SignUp from "./SignInUp/SignUp";
import Users from "./User/Users";
import HeaderClient from "./Client/HeaderClient";
import CarouselClient from "./Client/CarouselClient";
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Users></Users>}></Route>
            <Route path="sign-in" element={<SignIn></SignIn>}></Route>
            <Route path="sign-up" element={<SignUp></SignUp>}></Route>
            <Route path="admin">
              <Route
                path="sign-in"
                element={<AdminSignIn></AdminSignIn>}
              ></Route>
              <Route path="dash-board" element={<Admin></Admin>}></Route>
            </Route>
            <Route path="orders" element={<HeaderClient></HeaderClient>}>
              <Route index element={<Orders></Orders>}></Route>
            </Route>
            <Route path="home" element={<HeaderClient></HeaderClient>}>
              <Route index element={<HomePage></HomePage>}></Route>
              <Route path="findachef" element={<FindChef></FindChef>}></Route>
              <Route path="findadish" element={<FindDish></FindDish>}></Route>
              <Route
                path="pickchef/:chefId"
                element={<PickChef></PickChef>}
              ></Route>
              <Route
                path="dish/:dishId"
                element={<DishDetail></DishDetail>}
              ></Route>
              <Route path="mycart" element={<MyCart></MyCart>}></Route>
              <Route
                path="profile"
                element={<ProfileUser></ProfileUser>}
              ></Route>
              <Route path="book" element={<BookingPage></BookingPage>}></Route>
              <Route path="aboutus" element={<AboutUs></AboutUs>}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>
);
