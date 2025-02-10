import PropTypes from 'prop-types';
import moment from 'moment'
// Components
import { Button, Container, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Assets
import { faRobot } from '@fortawesome/free-solid-svg-icons';
//Styles
import './style.scss'

const ChatLogLoader = ({ chatType }) => {
  let message = 'Estou a gerar os teus relatórios aguarda um momento...'

  switch (chatType) {
    case 'free_form':
      message = 'Estou a processar a tua resposta...'
      break
    case 'surprise':
    case 'structured':
    default:
      break
  }

  return (
    <div className='chatbot__message'>
      <div className='chatbot__message-empty' />

      <div id='tms_bot' className='chatbot__message-info'>
        <p className='chatbot__message-bot' >
          <FontAwesomeIcon icon={faRobot} />

          {message}

          <Spinner className='chatbot__message-spinner' animation="border" />
        </p>
      </div>
    </div>
  )
}

ChatLogLoader.propTypes = {
  chatType: PropTypes.oneOf(['structured', 'surprise', 'free_form']).isRequired,
}

const ChatLoading = () => {
  return (
    <div className='chatbot__messages-backdrop'>
      <Spinner className='chatbot__messages-backdrop_spinner' animation="border" />
    </div>
  )
}

const ChatBotMessage = ({
  message,
  type = 'bot',
  isRequesting = false,
  timeStamp,
  hasReport = false,
  onGetReports = () => { }
}) => {
  const messageStyle = type === 'user' ? 'chatbot__message-user' : 'chatbot__message-bot'
  const messageStyleId = type === 'user' ? 'tms_user' : 'tms_bot'
  const messageAlignment = type === 'user' ? 'chatbot__message-align-right' : 'chatbot__message-align-left'

  return (
    <div className={`chatbot__message ${messageAlignment}`}>
      <div className='chatbot__message-info'>
        <div className={messageStyle}>
          <p>{message}</p>

          {hasReport && (
            <Button disabled={isRequesting} className='chatbot__message-btn' variant='primary' onClick={onGetReports}>
              Gerar Relatório
            </Button>
          )}
        </div>
        <p id={messageStyleId} className='chatbot__message-time'>{timeStamp.format('HH:mm:ss')}</p>
      </div>
    </div>
  )
}

ChatBotMessage.propTypes = {
  type: PropTypes.oneOf(['user', 'bot']),
  hasReport: PropTypes.bool,
  isRequesting: PropTypes.bool,
  message: PropTypes.object.isRequired,
  timeStamp: PropTypes.instanceOf(moment).isRequired,
  onGetReports: PropTypes.func
}


const ChatLog = ({ chatType, messages, isUpdating = false, isRequesting = false, onGenerateReport }) => {
  return (
    <Container className="chatbot__messages">
      {isUpdating && <ChatLoading />}

      {isRequesting && <ChatLogLoader chatType={chatType} />}

      {messages.map(({ type, message, timeStamp, has_report }, index) => {
        const keyID = timeStamp.format("M_D_YYYY_h_mm_ss_a") + index

        return (
          <ChatBotMessage
            key={keyID}
            type={type}
            isRequesting={isRequesting}
            message={message}
            timeStamp={timeStamp}
            hasReport={has_report}
            onGetReports={() => onGenerateReport(message)}
          />
        )
      })}
    </Container>
  )
}

ChatLog.propTypes = {
  chatType: PropTypes.oneOf(['structured', 'surprise', 'free_form']).isRequired,
  isUpdating: PropTypes.bool,
  isRequesting: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['user', 'bot']),
    message: PropTypes.string.isRequired,
    timeStamp: PropTypes.instanceOf(moment).isRequired,
    has_report: PropTypes.bool,
    data: PropTypes.object
  })).isRequired,
  onGenerateReport: PropTypes.func.isRequired
}

export default ChatLog
