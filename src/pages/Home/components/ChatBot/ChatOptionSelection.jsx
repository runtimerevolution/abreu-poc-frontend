import PropTypes from 'prop-types';
import { useState } from 'react';
// Components
import { Container } from 'react-bootstrap';
import DialogPlano from './DialogPlano';
// Assets
//Styles
import './style.scss'

const Option = ({ data, onSelect }) => {
  const { destination, short_description } = data

  return (
    <div className='chat-selection_option' onClick={() => onSelect(data)}>
      <figure className='chat-selection_option_info'>
        <img className='chat-selection_option_img' src={data.image} alt={destination} />
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

const ChatOptionSelection = ({ options = [], onSelect, select = false }) => {
  const [currentData, setCurrentData] = useState(null)

  const handleSelect = (data) => {
    if (select) onSelect(data)
    setCurrentData(data)
  }

  if (!options.length) return null
  return (
    <>
      <Container className='chat-selection'>
        {options.map((option) => {
          return <Option data={option} key={option.id} onSelect={handleSelect} />
        })}
      </Container>

      <DialogPlano data={currentData} open={!!currentData} onClose={() => setCurrentData(null)} />
    </>

  )
}

ChatOptionSelection.propTypes = {
  select: PropTypes.bool,
  options: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

export default ChatOptionSelection
