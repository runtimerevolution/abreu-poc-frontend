import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
// Components
import { Button, Modal, Nav } from 'react-bootstrap';
import PDFReport from '../PDFReport';
// Assets
// Utils
import { getDayPeriodFromIndex } from '../utils';
//Styles
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperature0 } from '@fortawesome/free-solid-svg-icons';



const ReportModal = ({ data, open = false, onClose = () => { } }) => {
  const [selectedTab, setSelectedTab] = useState('landmarks')

  const pdfRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef: pdfRef })
  const handlePrint = () => reactToPrintFn()

  if (!data) return null

  const renderActivities = () => {
    const activities = data.activities_per_day || {}
    const mainKeys = Object.keys(activities)
    if (mainKeys.length === 0) return null

    return (
      <div className='report-modal__activities'>
        {mainKeys.map((key, index) => {
          const day = activities[key]
          const dayKeys = Object.keys(day)

          return (
            <div key={key} className='report-modal__activities-day'>
              <h4>{index + 1} Dia:</h4>

              <div className='report-modal__activities-day-periods'>
                {dayKeys.map((period, index) => {
                  const activities = day[period]

                  return (
                    <p key={index}>
                      <strong>{getDayPeriodFromIndex(index)}</strong>

                      {activities}
                    </p>)
                })}
              </div>
            </div>
          )

        })}
      </div>
    )
  }

  const renderLandmarks = () => {
    const landmarks = data.landmarks || []
    if (landmarks.length === 0) return null

    return (
      <div className='report-modal__image-group'>
        <div className='report-modal__image-group-list'>
          {landmarks.map((landmark, index) => (
            <div key={index} className='report-modal__image-group-item'>
              <img src='https://picsum.photos/seed/picsum/200' alt={landmark} />
              <p>{landmark}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderRestaurants = () => {
    const restaurants = data.restaurants || []
    if (restaurants.length === 0) return null

    return (
      <div className='report-modal__image-group'>
        <div className='report-modal__image-group-list'>
          {restaurants.map((restaurant, index) => (
            <div key={index} className='report-modal__image-group-item'>
              <img src='https://picsum.photos/seed/picsum/200' alt={restaurant} />
              <p>{restaurant}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderHotels = () => {
    const hotels = data.hotel_list || []
    if (hotels.length === 0) return null

    return (
      <div className='report-modal__image-group'>
        <div className='report-modal__image-group-list'>
          {hotels.map((hotel, index) => (
            <div key={index} className='report-modal__image-group-item'>
              <img src='https://picsum.photos/seed/picsum/200' alt={hotel} />
              <p>{hotel}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSelectedTab = () => {
    switch (selectedTab) {
      case 'activities':
        return renderActivities()
      case 'landmarks':
        return renderLandmarks()
      case 'restaurants':
        return renderRestaurants()
      case 'hotel_list':
        return renderHotels()
      default:
        return null
    }
  }

  const destination = data.destination || ''
  return (
    <Modal dialogClassName='report-modal' show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Relatório: {destination}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className='report-modal__text'>
          {data.small_history}
        </p>

        {!!data.average_temp && (
          <p className='report-modal__text'>
            <FontAwesomeIcon icon={faTemperature0} />

            Temperatura Média:

            <strong>
              {data.average_temp}
            </strong>
          </p>
        )}

        <div className='report-modal__divider' />

        <Nav variant='tabs' activeKey={selectedTab} onSelect={(sk) => setSelectedTab(sk)}>
          <Nav.Item>
            <Nav.Link eventKey='landmarks'>Pontos de Interesse</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='activities'>Atividades</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='restaurants'>Restaurantes</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='hotel_list'>Hoteis</Nav.Link>
          </Nav.Item>
        </Nav>

        {renderSelectedTab()}

        <div style={{ display: 'none' }}>
          <PDFReport data={data} innerRef={pdfRef} />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant='primary'
          onClick={handlePrint}
        >
          Imprimir Relatório
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ReportModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func
}

export default ReportModal
