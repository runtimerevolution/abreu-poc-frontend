import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// Components
import { Container } from 'react-bootstrap';
import ReportModal from '../ReportModal';
// Assets
// Utils
import { randomIntFromInterval } from '../utils';
//Styles
import './style.scss'

const Option = ({ data, onSelect }) => {
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (data.image) {
      setImage(data.image)
    } else {
      setImage(`https://picsum.photos/200?random=${randomIntFromInterval(1, 100)}`)
    }

  }, [data])

  const { destination, short_description } = data
  return (
    <div className='report-select_option' onClick={() => onSelect(data)}>
      <figure className='report-select_option_info'>
        <img className='report-select_option_img' src={image} alt={destination} />
        <h5>{destination}</h5>
      </figure>

      <p>{short_description}</p>
    </div>
  )
}

Option.propTypes = {
  select: PropTypes.bool,
  data: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired
}

const ReportSelection = ({ options = [], onSelect, select = false }) => {
  const [currentData, setCurrentData] = useState(null)

  const handleSelect = (data) => {
    if (select) onSelect(data)
    setCurrentData(data)
  }

  if (!options.length) return null
  return (
    <>
      <Container className='report-select'>
        {options.map((option) => {
          return <Option data={option} key={option.id} onSelect={handleSelect} />
        })}
      </Container>

      <ReportModal data={currentData} open={!!currentData} onClose={() => setCurrentData(null)} />
    </>

  )
}

ReportSelection.propTypes = {
  select: PropTypes.bool,
  options: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

export default ReportSelection
