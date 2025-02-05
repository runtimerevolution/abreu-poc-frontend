import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
// Components
import { Button, Modal } from 'react-bootstrap';
import PDFReport from './PDFReport';
// Assets
//Styles
import './style.scss'
import moment from 'moment';
import { getDayPeriodFromIndex } from './utils';




const DialogPlano = ({ data, open = false, onClose = () => { } }) => {
  const pdfRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef: pdfRef })
  const handlePrint = () => reactToPrintFn()

  if (!data) return null

  const renderDestination = (isPdf) => {
    const value = data.destination || ''

    return value
  }

  const renderSmallHistory = () => {
    const value = data.small_history || ''

    return <p className='chat-plano_history'>{value}</p>
  }

  const renderLandMarks = (isPdf = false) => {
    const _landmarks = data.landmarks || []

    if (Array.isArray(_landmarks) && _landmarks.length) {
      return (
        <div className='chat-plano_landmarks'>
          <h4>Pontos de referência</h4>

          <ul className='chat-plano_landmarks-list'>
            {_landmarks.map((landmark, index) => {
              return (
                <li className='chat-plano_landmarks-item' key={index}>
                  <p>{landmark}</p>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    return null
  }

  const renderActivities = () => {
    const _activities = data.activities_per_day

    if (typeof _activities === 'object') {
      const _keys = Object.keys(_activities)

      return (
        <div className='chat-plano_activities'>
          <h4>Atividades</h4>

          <ul className='chat-plano_activities-list'>
            {_keys.map((key, index) => {
              const _activity = _activities[key]
              const _subKeys = Object.keys(_activity)

              return (
                <li className='chat-plano_activities-item' key={key}>
                  <h5>{index + 1} Dia</h5>

                  <ul className='chat-plano_activities-item-list'>
                    {_subKeys.map((subKey, index) => {
                      return (
                        <li key={subKey}>
                          <p><strong>{getDayPeriodFromIndex(index)}</strong> {_activity[subKey]}</p>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    return null
  }

  const renderHotels = (isPdf = false) => {
    const _hotels = data.hotel_list || []

    if (Array.isArray(_hotels) && _hotels.length) {
      return (
        <div className='chat-plano_landmarks'>
          <h4>Hotels</h4>

          <ul className='chat-plano_landmarks-list'>
            {_hotels.map((hotel, index) => {
              return (
                <li className='chat-plano_landmarks-item' key={index}>
                  <p>{hotel}</p>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    return null
  }

  const renderRestaurants = (isPdf = false) => {
    const _restaurantes = data.restaurants || []

    if (Array.isArray(_restaurantes) && _restaurantes.length) {
      return (
        <div className='chat-plano_landmarks'>
          <h4>Restaurantes</h4>

          <ul className='chat-plano_landmarks-list'>
            {_restaurantes.map((hotel, index) => {
              return (
                <li className='chat-plano_landmarks-item' key={index}>
                  <p>{hotel}</p>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    return null
  }

  return (
    <Modal dialogClassName='chat-plano' show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Plano de Viagem</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {renderDestination(false)}

        {renderSmallHistory(false)}

        {renderLandMarks(false)}

        {renderActivities(false)}

        <PDFReport data={data} innerRef={pdfRef} />
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

DialogPlano.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func
}

export default DialogPlano
