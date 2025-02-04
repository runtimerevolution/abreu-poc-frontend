import { Outlet } from "react-router-dom"
import { Container, Nav, Navbar } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPhone } from "@fortawesome/free-solid-svg-icons"
// import HoverDropdownMenu from "./components/HoverDropdownMenu"
// import SubMenus from "./components/SubMenus"

import './style.scss'

const NavigationItems = [
  { key: 'promocoes', label: 'Só Online', path: '/' },
  { key: 'destinos', label: 'Destinos', path: '/' },
  { key: 'ferias', label: 'Férias', path: '/' },
  { key: 'cruzeiros', label: 'Cruzeiros', path: '/' },
  { key: 'feriados', label: 'Feriados', path: '/' },
  { key: 'ferias_verao', label: 'Verão', path: '/' },
]


export default function DefaultLayout() {
  const renderNavigationItems = () => {
    return NavigationItems.map(item => {
      const { key, label, path } = item

      switch (key) {
        // case 'destinos': {
        //   return (
        //     <HoverDropdownMenu
        //       label={
        //         <Nav.Item as='li' className='default-layout_nav-item' key={key}>
        //           <Nav.Link
        //             className='default-layout_nav-link'
        //             eventKey={key}
        //             href={path}>
        //             {label}
        //           </Nav.Link>
        //         </Nav.Item>
        //       }
        //       key={key}
        //     >
        //       <SubMenus subMenu={key} />
        //     </HoverDropdownMenu>
        //   )
        // }

        default: {
          return (
            <Nav.Item as='li' className='default-layout_nav-item' key={key}>
              <Nav.Link
                className='default-layout_nav-link'
                eventKey={key}
                href={path}>
                {label}
              </Nav.Link>
            </Nav.Item>
          )
        }
      }

    })
  }

  return (
    <>
      <Navbar expand="lg" variant="light" bg="light" fixed="top" sticky="top" as='header'>
        <Container>
          <Navbar.Brand className="default-layout_nav-brand" href="/">
            <img src="https://www.abreu.pt/images/abreu_logo.png" alt="Abreu" width="170px" />
          </Navbar.Brand>
          <Navbar.Collapse>
            <Nav
              defaultActiveKey='promocoes'
              as='ul'
              className='default-layout_nav'
            >
              {renderNavigationItems()}
            </Nav>

            <div>
              <a href="tel:707 20 1840" className="default-layout_phone">
                <FontAwesomeIcon icon={faPhone} />
                707 20 1840
              </a>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>

  )
}
