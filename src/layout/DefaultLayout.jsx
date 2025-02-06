import { Outlet, useNavigate } from "react-router-dom"
import { Container, Navbar } from "react-bootstrap"
import { useContext, useEffect } from "react"
import { AppContext } from "../helpers/AppContext"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faPhone } from "@fortawesome/free-solid-svg-icons"
// import HoverDropdownMenu from "./components/HoverDropdownMenu"
// import SubMenus from "./components/SubMenus"

import './style.scss'



export default function DefaultLayout() {
  const navigate = useNavigate()
  const { isloggedIn } = useContext(AppContext)

  // const renderNavigationItems = () => {
  //   return NavigationItems.map(item => {
  //     const { key, label, path } = item

  //     switch (key) {
  //       // case 'destinos': {
  //       //   return (
  //       //     <HoverDropdownMenu
  //       //       label={
  //       //         <Nav.Item as='li' className='default-layout_nav-item' key={key}>
  //       //           <Nav.Link
  //       //             className='default-layout_nav-link'
  //       //             eventKey={key}
  //       //             href={path}>
  //       //             {label}
  //       //           </Nav.Link>
  //       //         </Nav.Item>
  //       //       }
  //       //       key={key}
  //       //     >
  //       //       <SubMenus subMenu={key} />
  //       //     </HoverDropdownMenu>
  //       //   )
  //       // }

  //       default: {
  //         return (
  //           <Nav.Item as='li' className='default-layout_nav-item' key={key}>
  //             <Nav.Link
  //               className='default-layout_nav-link'
  //               eventKey={key}
  //               href={path}>
  //               {label}
  //             </Nav.Link>
  //           </Nav.Item>
  //         )
  //       }
  //     }

  //   })
  // }

  useEffect(() => {
    if (!isloggedIn) {
      navigate('/login')
    }
  }, [isloggedIn, navigate])

  return (
    <>
      <Navbar expand="lg" variant="light" bg="light" fixed="top" sticky="top" as='header'>
        <Container>
          <Navbar.Brand className="default-layout_nav-brand" href="/">
            <img src="https://www.abreu.pt/images/abreu_logo.png" alt="Abreu" width="170px" />
          </Navbar.Brand>
          <Navbar.Collapse>
            <h3 className="default-layout_h3">
              Agente de Geração de Roteiros.
            </h3>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>

  )
}
