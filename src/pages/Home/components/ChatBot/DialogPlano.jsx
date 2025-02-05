import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
// Components
import { Button, Modal } from 'react-bootstrap';
// Assets
//Styles
import './style.scss'
import moment from 'moment';

const DialogPlano = ({ data, open = false, onClose = () => { } }) => {
  const pdfRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef: pdfRef })
  const handlePrint = () => reactToPrintFn()

  if (!data) return null

  const renderDestination = (isPdf) => {
    const value = data.destination || ''

    if (isPdf) return <h4>{value}</h4>

    return <h3>{value}</h3>
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
          <h5>Pontos de referência</h5>

          <div className='chat-plano_landmarks-list'>
            {_landmarks.map((landmark, index) => {
              return <p key={index}>{landmark}</p>
            })}
          </div>
        </div>
      )
    }

    return null
  }

  const renderActivities = (isPdf = false) => {
    const _activities = data.activities
    console.log('renderActivities', typeof _activities)
    //if (typeof _activities === '')

    return (
      <div>
        ACTIVITIES
      </div>
    )
  }

  const renderHotels = (isPdf = false) => {
    const _hotels = data.hotels
    console.log('renderHotels', typeof _hotels)
    //if (typeof _hotels === '')

    return (
      <div>
        HOTELS
      </div>
    )
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

        <div className='chat-plano_pdf' ref={pdfRef}>
          <div className='chat-plano_pdf-header'>
            <img
              className='chat-plano_pdf-header-logo'
              src="https://www.abreu.pt/images/abreu_logo.png"
              alt="Abreu"
              width="170px"
            />

            <div className='chat-plano_pdf-header-title'>
              <h3>Relatório:</h3>

              {renderDestination(true)}
            </div>

            <p className='chat-plano_pdf-header-date'>{moment().format('DD/MM/YYYY')}</p>
          </div>

          {renderSmallHistory(true)}

          <div className="chat-plano_pdf-divider" />

          {renderLandMarks(true)}

          <div className="chat-plano_pdf-divider" />

          {renderActivities(true)}

          <div className="chat-plano_pdf-divider" />

          {renderHotels(true)}
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

DialogPlano.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func
}

export default DialogPlano
