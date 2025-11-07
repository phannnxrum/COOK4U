import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import HeaderUsers from './User/HeaderUsers'
import SignIn from './SignInUp/SignIn'
import AdminSignIn from './SignInUp/AdminSignIn'
import SignUp from './SignInUp/SignUp'
import Users from './User/Users'
import HeaderClient from './Client/HeaderClient'
import CarouselClient from './Client/CarouselClient'
import HomePage from './ServicePage/HomePage/HomePage'
import DishDetail from './DetailDishes/DishDetail'
import FindChef from './FindChef/FindChef'
import FindDish from './FindDish/FindDish'
import PickChef from './PickChef/PickChef'
import ProfileUser from './Profile/ProfileUser'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Users></Users>}></Route>
          <Route path='sign-in' element={<SignIn></SignIn>}></Route>
          <Route path='sign-up' element={<SignUp></SignUp>}></Route>
          <Route path='client' element={<HeaderClient></HeaderClient>}>
            <Route index element={<CarouselClient></CarouselClient>}></Route>
            <Route path='profile' element={<ProfileUser></ProfileUser>}></Route>
          </Route>

          <Route path='admin'>
            <Route path='sign-in' element={<AdminSignIn></AdminSignIn>}></Route>
          </Route>

          <Route>
            <Route path='home' element={<HomePage></HomePage>}></Route>
            <Route path='profile' element={<ProfileUser></ProfileUser>}></Route>
            <Route path='findachef' element={<FindChef></FindChef>}></Route>
            <Route path='pickchef/:chefId' element={<PickChef></PickChef>}></Route>
            <Route path='findadish' element={<FindDish></FindDish>}></Route>
            <Route path='dish/:dishId' element={<DishDetail></DishDetail>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  </StrictMode>,
)
