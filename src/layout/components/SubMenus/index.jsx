import { Col, Row } from "react-bootstrap"
import PropTypes from 'prop-types';

import "./style.scss"

const SUB_OPTIONS = {
  destinos: [
    [
      { label: "Portugal", key: "portugal", header: true },
      { label: "Açores", key: "acores" },
      { label: "Madeira", key: "madeira" },
      { label: "Praias Portugal", key: "praias" }
    ],
    [
      { label: "Europa", key: "europa", header: true },
      { label: "Espanha", key: "espanha" },
      { label: "França", key: "franca" },
      { label: "Itália", key: "italia" },
      { label: "Cidades a descobrir", key: "cidades_descobrir" }
    ],
    [
      { label: "África", key: "africa", header: true },
      { label: "Cabo Verde", key: "cabo_verde" },
      { label: "Marrocos", key: "marrocos" },
      { label: "Tunísia", key: "tunisia" },
      { label: "Egito", key: "egito" }
    ],
    [
      { label: "Américas", key: "americas", header: true },
      { label: "Caraíbas", key: "caraibas" },
      { label: "E.U.A. e Canadá", key: "eua_canada" }
    ],
    [
      { label: "Médio Oriente", key: "middle_east", header: true },
      { label: "Dubai", key: "dubai" },
    ],
    [
      { label: "Ásia", key: "asia", header: true },
      { label: "Japão", key: "japao" },
      { label: "Tai", key: "eua_canada" }
    ]
  ]
}




const SubMenus = ({ subMenu }) => {
  if (!subMenu) { return null }
  const subOptions = SUB_OPTIONS[subMenu]

  return (
    <Row>
      {subOptions.map((subOption, index) => {
        return (
          <Col lg={2} md={2} sm={12} key={index}>
            <ul className="sub-menu_list">
              {subOption.map((option, index) => {
                return (
                  <li key={index}>{option.label}</li>
                )
              })}
            </ul>
          </Col>
        )
      })}
    </Row>
  )
}

SubMenus.propTypes = {
  subMenu: PropTypes.string.isRequired,
}

export default SubMenus
