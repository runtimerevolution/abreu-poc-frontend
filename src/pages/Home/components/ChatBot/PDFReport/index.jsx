import PropTypes from 'prop-types';
import moment from 'moment';
// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Assets
import { faPlaneArrival, faPlaneDeparture, faTemperature0 } from '@fortawesome/free-solid-svg-icons';
// Utils
import { getDayPeriodFromIndex } from '../utils';
//Styles
import './style.scss'

const FlightTraject = ({ flight }) => {
  const [, time, duration] = flight.split(',')

  const [durationHour, durationMinutes] = duration.split('h')
  const endTime = moment(time, 'HH:mm').add(durationHour, 'hours').add(durationMinutes, 'minutes').format('HH:mm')

  return (
    <div className='report-modal__flight' key={flight}>
      <p>{time}</p>

      <div className='report-modal__flight-traject' >
        <div className='report-modal__flight-visual' >
          <FontAwesomeIcon icon={faPlaneDeparture} />
          <div className='report-modal__flight-visual-line' />
          <FontAwesomeIcon icon={faPlaneArrival} />
        </div>

        <p>{durationHour}h{durationMinutes}m</p>
      </div>

      <p>{endTime}</p>
    </div>
  )
}

FlightTraject.propTypes = {
  flight: PropTypes.string.isRequired
}

const PDFReport = ({ data, innerRef }) => {
  if (!data) return null

  const renderHistoryAndPrice = () => {
    const priceText = data.price ? `${data.price}` : 'Preço não disponível'

    return (
      <tr>
        <td className='pdf-report__right-border'>
          <p className='pdf-report__text' > {data.small_history || 'Sem Historia'}</p >

          {!!data.average_temp && (
            <p className='report-modal__text'>
              <FontAwesomeIcon icon={faTemperature0} />

              Temperatura Média:

              <strong>
                {data.average_temp}
              </strong>
            </p>
          )}
        </td>
        <td width='30%'>
          <p className='pdf-report__price'>
            Pessoas: <strong>{data.family_size || 'N/A'}</strong>
          </p>

          <p className='pdf-report__price'>
            Origem: <strong>{data.origin || 'N/A'}</strong>
          </p>

          <p className='pdf-report__price'>
            Preço Total Estimado:

            <strong>
              {priceText}
            </strong>
          </p>
        </td>
      </tr>
    )
  }

  const renderVoos = () => {
    const { departures_from_origin, departures_from_destination } = data

    const dataDeIda = data.departures_from_origin ? data.departures_from_origin[0].split(',')[0] : 'N/A'
    const dataDeVolta = data.departures_from_destination ? data.departures_from_destination[0].split(',')[0] : 'N/A'

    return (
      <tr>
        <td className='pdf-report__right-border' width='50%'>
          <div className='pdf-report__flights'>
            <h5><strong>Voos de Ida:</strong> {dataDeIda}</h5>

            <div className='pdf-report__flights-list'>
              {departures_from_origin?.map((flight) => <FlightTraject key={flight} flight={flight} />)}
            </div>
          </div>
        </td>
        <td width='50%'>
          <div className='pdf-report__flights'>
            <h5><strong>Voos de Volta:</strong> {dataDeVolta}</h5>

            <div className='pdf-report__flights-list'>
              {departures_from_destination?.map((flight) => <FlightTraject key={flight} flight={flight} />)}
            </div>
          </div>
        </td>
      </tr>
    )
  }

  const renderActivities = () => {
    const _activities = data.activities_per_day || {}
    const mainKeys = Object.keys(_activities)

    if (typeof _activities === 'object') {
      return (
        <>
          <tr className='pdf-report__activities-row'>
            <td colSpan='2'>
              <table>
                <thead>
                  <tr className='pdf-report__table-row-no-border'>
                    <th colSpan='2'>
                      <div className='pdf-report__activities'>
                        <h3>Atividades:</h3>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mainKeys.map((key, index) => {
                    const day = _activities[key]
                    const dayKeys = Object.keys(day)

                    const rowStyle = index + 1 !== mainKeys.length ? 'pdf-report__table-row-no-border' : ''

                    return (
                      <tr className={rowStyle} key={key}>
                        <td colSpan='2'>
                          <div key={key} className='pdf-report__activities-day'>
                            <h4>{key}:</h4>

                            <div className='pdf-report__activities-day-periods'>
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
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </td>
          </tr>
        </>
      )
    }

    return null
  }

  const renderLandMarks = () => {
    const { landmarks } = data
    if (!landmarks) return null

    return (
      <tr className='pdf-report__table-row-no-border'>
        <td colSpan='2'>
          <table className='pdf-report__image-group-list'>
            <thead>
              <tr className='pdf-report__table-row-no-border'>
                <th colSpan='2'>
                  <h3>Pontos de Interesse</h3>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                landmarks.map((landmark, index) => {
                  const rowStyle = landmarks.length - 1 !== index ? 'pdf-report__table-row-no-border' : ''

                  return (
                    <tr key={landmark} className={rowStyle}>
                      <td colSpan='2'>
                        <div key={landmark} className='pdf-report__image-group-item'>
                          <img className='pdf-report__image-group-item-img' src={landmark.image} alt={landmark.name} />

                          <div className='pdf-report__image-group-item-info'>
                            <h5>{landmark.name}</h5>

                            <p>{landmark.description || '--'}</p>

                            <p>
                              Preço estimado de Entrada:

                              <strong>
                                €€
                              </strong>
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </td>
      </tr>
    )
  }

  const renderRestaurants = () => {
    const { restaurants } = data
    if (!restaurants) return null

    return (
      <tr className='pdf-report__table-row-no-border'>
        <td colSpan='2'>
          <table className='pdf-report__image-group-list'>
            <thead>
              <tr className='pdf-report__table-row-no-border'>
                <th colSpan='2'>
                  <h3>Restaurantes</h3>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                restaurants.map((restaurant, index) => {
                  const rowStyle = restaurants.length - 1 !== index ? 'pdf-report__table-row-no-border' : ''

                  return (
                    <tr key={restaurant} className={rowStyle}>
                      <td colSpan='2'>
                        <div className='pdf-report__image-group-item'>
                          <img
                            className='pdf-report__image-group-item-img'
                            src={restaurant.image}
                            alt={restaurant.name}
                          />

                          <div className='pdf-report__image-group-item-info'>
                            <h5>{restaurant.name}</h5>

                            {/* <p>--</p> */}

                            <p>
                              Preço Médio por Pessoa:
                              <strong>
                                €€€
                              </strong>
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </td>
      </tr>
    )
  }

  const renderHotels = () => {
    const { hotel_list } = data
    if (!hotel_list) return null

    return (
      <tr className='pdf-report__table-row-no-border'>
        <td colSpan='2'>
          <table className='pdf-report__image-group-list'>
            <thead>
              <tr className='pdf-report__table-row-no-border'>
                <th colSpan='2'>
                  <h3>Hoteis</h3>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                hotel_list.map((hotel, index) => {
                  const rowStyle = hotel_list.length - 1 !== index ? 'pdf-report__table-row-no-border' : ''

                  return (
                    <tr key={hotel} className={rowStyle}>
                      <td colSpan='2'>
                        <div className='pdf-report__image-group-item'>
                          <img className='pdf-report__image-group-item-img' src={hotel.image} alt={hotel.name} />

                          <div className='pdf-report__image-group-item-info'>
                            <h5>{hotel.name}</h5>

                            {/* <p>--</p> */}

                            <p>
                              Preço Médio por Pessoa:
                              <strong>
                                €€€
                              </strong>
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </td>
      </tr>
    )
  }

  const destination = data.destination || ''
  const date = moment().format('DD/MM/YYYY')
  return (
    <div ref={innerRef} className='pdf-report'>
      <table>
        <thead>
          <tr>
            <th colSpan='2'>
              <div className='pdf-report__header'>
                <img
                  className='pdf-report__header-logo'
                  src="https://www.abreu.pt/images/abreu_logo.png"
                  alt="Abreu"
                />

                <h3 className='pdf-report__header-title'>
                  Relatório:

                  <span>
                    {destination}
                  </span>
                </h3>

                <p className='pdf-report__header-date'>
                  Data de Geração: {date}
                </p>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {renderHistoryAndPrice()}

          {renderVoos()}

          {renderActivities()}

          {renderLandMarks()}

          {renderRestaurants()}

          {renderHotels()}
        </tbody>
        <tfoot>
          <tr className='pdf-report__table-row-no-border'>
            <td id='footer-spacer' colSpan='2' />
          </tr>
        </tfoot>
      </table>

      <div id='footer'>
        This is a report generated by the Abreu Chatbot
      </div>
    </div>
  )
}

PDFReport.propTypes = {
  isPrinting: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  innerRef: PropTypes.object.isRequired
}

export default PDFReport
