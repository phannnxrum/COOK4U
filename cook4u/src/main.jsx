import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import HeaderUsers from './User/HeaderUsers'
import SignIn from './SignInUp/SignIn'
import SignUp from './SignInUp/SignUp'
import Users from './User/Users'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Users></Users>}></Route>
          <Route path='sign-in' element={<SignIn></SignIn>}></Route>
          <Route path='sign-up' element={<SignUp></SignUp>}></Route>
          <Route path='client'>
            <Route></Route>
          </Route>

          <Route path='admin'>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  </StrictMode>,
)
