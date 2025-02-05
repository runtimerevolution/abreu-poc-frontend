import PropTypes from 'prop-types';
import moment from 'moment';
// Components
// Assets
//Styles
import './style.scss'
import { getDayPeriodFromIndex } from '../utils';

const PDFReport = ({ data, innerRef }) => {
  if (!data) return null

  const renderSmallHistory = () => {
    if (!data.small_history) return null

    return (
      <>
        <p className='pdf-report__text' > {data.small_history}</p >

        <div className="pdf-report__divider" />
      </>
    )
  }

  const renderActivities = () => {
    const _activities = data.activities_per_day || {}
    const mainKeys = Object.keys(_activities)

    if (typeof _activities === 'object') {
      return (
        <>
          <div className='pdf-report__activities'>
            <h3>Atividades</h3>

            {mainKeys.map((key, index) => {
              const day = _activities[key]
              const dayKeys = Object.keys(day)

              return (
                <div key={key} className='pdf-report__activities-day'>
                  <h4>{index + 1} Dia:</h4>

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
              )
            })}
          </div>

          <div className="pdf-report__divider" />

          <div className="page-break" />
        </>
      )
    }

    return null
  }

  const renderLandMarks = () => {
    const { landmarks } = data
    if (!landmarks) return null

    return (
      <>
        <div className='pdf-report__image-group'>
          <h3>Landmarks</h3>

          <div className='pdf-report__image-group-list'>
            {landmarks.map((landmark) => {
              return (
                <div key={landmark} className='pdf-report__image-group-item'>
                  <img src='https://picsum.photos/seed/picsum/200' alt={landmark} />

                  <p>{landmark}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pdf-report__divider" />

        <div className="page-break" />
      </>
    )
  }

  const renderRestaurants = () => {
    const { restaurants } = data
    if (!restaurants) return null

    return (
      <>
        <div className='pdf-report__image-group'>
          <h3>Restaurantes</h3>

          <div className='pdf-report__image-group-list'>
            {restaurants.map((restaurant) => {
              return (
                <div key={restaurant} className='pdf-report__image-group-item'>
                  <img src='https://picsum.photos/seed/picsum/200' alt={restaurant} />

                  <p>{restaurant}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pdf-report__divider" />

        <div className="page-break" />
      </>
    )
  }

  const renderHotels = () => {
    const { hotel_list } = data
    if (!hotel_list) return null

    return (
      <>
        <div className='pdf-report__image-group'>
          <h3>Hoteis</h3>

          <div className='pdf-report__image-group-list'>
            {hotel_list.map((restaurant) => {
              return (
                <div key={restaurant} className='pdf-report__image-group-item'>
                  <img src='https://picsum.photos/seed/picsum/200' alt={restaurant} />

                  <p>{restaurant}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pdf-report__divider" />

        <div className="page-break" />
      </>
    )
  }

  const destination = data.destination || ''
  const date = moment().format('DD/MM/YYYY')
  return (
    <div ref={innerRef} className='pdf-report'>
      <table>
        <thead>
          <tr>
            <td>
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

                <p className='pdf-report__header-date'>{date}</p>
              </div>

              <div className="pdf-report__divider" />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {renderSmallHistory()}

              {renderActivities()}

              {renderLandMarks()}

              {renderRestaurants()}

              {renderHotels()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

PDFReport.propTypes = {
  isPrinting: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  innerRef: PropTypes.object.isRequired
}

export default PDFReport
