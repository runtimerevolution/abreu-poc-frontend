import PropTypes from 'prop-types';
import moment from 'moment';
// Components
import { Button, Modal } from 'react-bootstrap';
// Assets
//Styles
import './style.scss'

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
                  <h4>{index + 1} Dia</h4>

                  <ul className='pdf-report__activities-list'>
                    {dayKeys.map((period, index) => {
                      const activities = day[period]

                      return (
                        <li key={index} className='pdf-report__activities-item'>
                          <p>{activities}</p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="pdf-report__divider" />
        </>
      )
    }

    return null
  }

  const renderLandMarks = () => { }

  const destination = data.destination || ''
  const date = moment().format('DD/MM/YYYY')
  return (
    <div ref={innerRef} className='pdf-report'>
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

      {renderSmallHistory()}

      {renderActivities()}
    </div>
  )
}

PDFReport.propTypes = {
  data: PropTypes.object.isRequired,
  innerRef: PropTypes.object.isRequired
}

export default PDFReport
