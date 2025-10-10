import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import HeaderUsers from './User/HeaderUsers'
import SignIn from './SignInUp/SignIn'
import SignUp from './SignInUp/SignUp'
import Users from './User/Users'
import HeaderClient from './Client/HeaderClient'
import CarouselClient from './Client/CarouselClient'

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
          </Route>

          <Route path='admin'>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  </StrictMode>,
)
