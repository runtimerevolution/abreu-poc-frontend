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
import { faPlaneArrival, faPlaneDeparture, faTemperature0 } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const FlightTraject = ({ flight }) => {
  const [, time, duration] = flight.split(',')

  const [durationHour, durationMinutes] = duration.split('h')
  const endTime = moment(time, 'HH:mm').add(durationHour, 'hours').add(durationMinutes, 'minutes').format('HH:mm')

  const hoursText = durationHour ? `${durationHour}h` : ''
  const minutesText = durationMinutes ? `${durationMinutes}m` : ''
  return (
    <div className='report-modal__flight' key={flight}>
      <p>{time}</p>

      <div className='report-modal__flight-traject' >
        <div className='report-modal__flight-visual' >
          <FontAwesomeIcon icon={faPlaneDeparture} />
          <div className='report-modal__flight-visual-line' />
          <FontAwesomeIcon icon={faPlaneArrival} />
        </div>

        <p>{hoursText}{minutesText}</p>
      </div>

      <p>{endTime}</p>
    </div>
  )
}

FlightTraject.propTypes = {
  flight: PropTypes.string.isRequired
}

const ReportModal = ({ data, open = false, onClose = () => { } }) => {
  const [selectedTab, setSelectedTab] = useState('flights')

  const pdfRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef: pdfRef, preserveAfterPrint: true })
  const handlePrint = () => reactToPrintFn()

  if (!data) return null

  const renderActivities = () => {
    const activities = data.activities_per_day || {}
    const mainKeys = Object.keys(activities)
    if (mainKeys.length === 0) return null

    return (
      <div className='report-modal__activities'>
        {mainKeys.map((key) => {
          const day = activities[key]
          const dayKeys = Object.keys(day)

          return (
            <div key={key} className='report-modal__activities-day'>
              <h4>{key}:</h4>

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
              <div className='report-modal__image-group-item-top'>
                <img src={landmark.image} alt={landmark.name} />
                <h5>{landmark.name}</h5>
              </div>
              <div>
                <p>{landmark.description || '--'}</p>

                <p>
                  Preço de admissão:

                  <strong>
                    €€
                  </strong>
                </p>
              </div>
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
              <div className='report-modal__image-group-item-top'>
                <img src={restaurant.image} alt={restaurant.name} />
                <h5>{restaurant.name}</h5>
              </div>
              <div>
                <p>--</p>

                <p>
                  Preço estimado:

                  <strong>
                    €€€
                  </strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderHotels = () => {
    const hotels = data.hotels || []
    if (hotels.length === 0) return null

    return (
      <div className='report-modal__image-group'>
        <div className='report-modal__image-group-list'>
          {hotels.map((hotel, index) => (
            <div key={index} className='report-modal__image-group-item'>
              <div className='report-modal__image-group-item-top'>
                <img src={hotel.image} alt={hotel.name} />
                <h5>{hotel.name}</h5>
              </div>
              <div>
                <p>--</p>

                <p>
                  Preço por pessoa:

                  <strong>
                    €€€€
                  </strong>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderFlights = () => {
    const dataDeIda = data.departures_from_origin ? data.departures_from_origin[0].split(',')[0] : 'N/A'
    const dataDeVolta = data.departures_from_destination ? data.departures_from_destination[0].split(',')[0] : 'N/A'


    return (
      <div className='report-modal__flights'>
        <div className='report-modal__flights-going'>
          <h5>
            <strong>Ida:</strong>

            {dataDeIda}
          </h5>

          <div className='report-modal__flights-list'>
            {data.departures_from_origin?.map((flight) => <FlightTraject key={flight} flight={flight} />)}
          </div>
        </div>

        <div className='report-modal__flights-return'>
          <h5>
            <strong>Volta:</strong>

            {dataDeVolta}
          </h5>

          <div className='report-modal__flights-list'>
            {data.departures_from_destination?.map((flight) => <FlightTraject key={flight} flight={flight} />)}
          </div>
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
      case 'flights':
        return renderFlights()
      default:
        return null
    }
  }

  const destination = data.destination || ''
  const recievedPrice = data.price
  const price = recievedPrice
    ? recievedPrice.includes('EUR') || recievedPrice.includes('€') ? data.price : `${data.price}€`
    : 'N/A'
  return (
    <Modal dialogClassName='report-modal' show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Relatório: {destination}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className='report-modal__info'>
          <div className='report-modal__info-geral'>
            <p className='report-modal__text'>
              {data.small_history}
            </p>

            <p className='report-modal__text'>
              <FontAwesomeIcon icon={faTemperature0} />

              Temperatura Média:

              <strong>
                {data.average_temp ? data.average_temp : 'N/A'}
              </strong>
            </p>
          </div>

          <div className='report-modal__info-choices'>
            <p className='report-modal__text'>
              Pessoas: <strong>{data.family_size || 'N/A'}</strong>
            </p>

            <p className='report-modal__text'>
              Origem: <strong>{data.origin || 'N/A'}</strong>
            </p>

            <p className='report-modal__text'>
              Preço Total Estimado: <strong>{price}</strong>
            </p>
          </div>
        </div>

        <div className='report-modal__divider' />

        <Nav variant='tabs' activeKey={selectedTab} onSelect={(sk) => setSelectedTab(sk)}>
          <Nav.Item>
            <Nav.Link eventKey='flights'>Voos Disponíveis</Nav.Link>
          </Nav.Item>
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
