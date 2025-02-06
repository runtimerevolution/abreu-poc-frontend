import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import DefaultLayout from "../layout/DefaultLayout"
import Home from "../pages/Home"
import Login from "../pages/Login"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navigate replace to='/' />} path='login' />
        <Route path='/' element={<Login />} />
        <Route path='home' element={<DefaultLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
