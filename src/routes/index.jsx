import { BrowserRouter, Route, Routes } from "react-router-dom"
import DefaultLayout from "../layout/DefaultLayout"
import Home from "../pages/Home"
import Login from "../pages/Login"

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
