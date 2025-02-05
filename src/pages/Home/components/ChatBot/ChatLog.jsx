import PropTypes from 'prop-types';
import moment from 'moment'
// Components
import { Container, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Assets
import { faRobot } from '@fortawesome/free-solid-svg-icons';
//Styles
import './style.scss'

const ChatLogLoader = () => {
  return (
    <div className='chatbot__message'>
      <div className='chatbot__message-empty' />

      <div id='tms_bot' className='chatbot__message-info'>
        <p className='chatbot__message-bot' >
          <FontAwesomeIcon icon={faRobot} />

          Estou a gerar os teus relatórios aguarda um momento...

          <Spinner className='chatbot__message-spinner' animation="border" />
        </p>
      </div>
    </div>
  )
}

const ChatBotMessage = ({ message, type = 'bot', timeStamp }) => {
  const messageStyle = type === 'user' ? 'chatbot__message-user' : 'chatbot__message-bot'
  const messageStyleId = type === 'user' ? 'tms_user' : 'tms_bot'
  const messageAlignment = type === 'user' ? 'chatbot__message-align-right' : 'chatbot__message-align-left'

  return (
    <div className={`chatbot__message ${messageAlignment}`}>
      <div className='chatbot__message-info'>
        <p className={messageStyle}>{message}</p>
        <p id={messageStyleId} className='chatbot__message-time'>{timeStamp.format('HH:mm:ss')}</p>
      </div>
    </div>
  )
}

ChatBotMessage.propTypes = {
  type: PropTypes.oneOf(['user', 'bot']),
  message: PropTypes.object.isRequired,
  timeStamp: PropTypes.instanceOf(moment).isRequired
}


const ChatLog = ({ messages, loading = false }) => {
  return (
    <Container className="chatbot__messages">
      {loading && <ChatLogLoader />}

      {messages.map(({ type, message, timeStamp }, index) => {
        const keyID = timeStamp.format("M_D_YYYY_h_mm_ss_a") + index

        return (
          <ChatBotMessage
            key={keyID}
            type={type}
            message={message}
            timeStamp={timeStamp}
          />
        )
      })}
    </Container>
  )
}

ChatLog.propTypes = {
  loading: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['user', 'bot']),
    message: PropTypes.string.isRequired,
    timeStamp: PropTypes.instanceOf(moment).isRequired
  })).isRequired
}

export default ChatLog
