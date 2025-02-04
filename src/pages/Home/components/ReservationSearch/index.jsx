import { useState } from "react"
import { faBed, faCamera, faMagnifyingGlass, faPlane, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Col, Container, Nav, NavItem, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form'
import ChatBot from "../ChatBot"

import './style.scss'

const SearchNavItems = [
  { eventKey: 'ferias', label: 'Férias', icon: faCamera },
  { eventKey: 'voo_hotel', label: 'Voo + Hotel', icon: faWallet },
  { eventKey: 'hotel', label: 'Hotel', icon: faBed },
  { eventKey: 'voos', label: 'Voos', icon: faPlane },
  { eventKey: 'disney', label: 'Disneyland Paris', image: "https://www.abreu.pt/images/icon-disney.png" },
]

const ReservationSearch = () => {
  const [currentForm, setCurrentForm] = useState('ferias')

  const renderForm = () => {
    switch (currentForm) {
      case 'ferias':
      default: {
        return (
          <Row>
            <Col sm={12} lg={7} md={7}>
              <Form.Control
                className="searchForm_input"
                type='text'
                placeholder='Nome do programa/Destino'
              />
            </Col>

            <Col sm={12} lg={3} md={7}>
              <Form.Select className="searchForm_input searchForm_select">
                <option>-escolha o mês-</option>
                <option value='1'>Janeiro</option>
                <option value='2'>Fevereiro</option>
                <option value='3'>Março</option>
                <option value='3'>Abril</option>
                <option value='3'>Maio</option>
                <option value='3'>Junho</option>
                <option value='3'>Julho</option>
                <option value='3'>Agosto</option>
              </Form.Select>
            </Col>

            <Col sm={12} lg={2} md={2}>
              <Button className='searchForm_submit' variant='primary' type='submit'>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Col>
          </Row>
        )
      }
    }
  }

  return (
    <Container className='mainSearch' fluid>
      <Container className='mainSearch_container'>
        <Nav
          className='searchNav'
          variant='pills'
          activeKey={currentForm}
          as='ul'
          onSelect={(selectedKey) => setCurrentForm(selectedKey)}
        >
          {SearchNavItems.map((item) => {
            const { eventKey, icon, image, label } = item

            return (
              <NavItem className='searchNav_item' as='li' key={eventKey}>
                <Nav.Link className='searchNav_link' key={eventKey} eventKey={eventKey}>
                  {!!icon && <FontAwesomeIcon className='searchNav_link-icon' icon={icon} />}

                  {!!image && <img src={image} width="16px" style={{ marginRight: '5px' }} />}

                  <p className='searchNav_link-label'>{label}</p>
                </Nav.Link>
              </NavItem>
            )
          })}
        </Nav>

        <Form className='searchForm'>
          {renderForm()}
        </Form>

        <ChatBot />
      </Container>
    </Container>
  )
}

export default ReservationSearch
