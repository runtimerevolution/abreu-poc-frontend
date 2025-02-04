import { useCallback, useEffect, useState } from "react"
import moment from 'moment'
import PropTypes from 'prop-types';
import { Button, Col, Container, FormControl, InputGroup, Spinner } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faComment, faRobot } from "@fortawesome/free-solid-svg-icons"
import { useMutation } from "@tanstack/react-query"

import './style.scss'
import axios from "axios";

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const timeOfDay = () => {
  const currentHour = moment().format('HH')

  if (currentHour >= 3 && currentHour < 12) return 'bom dia'
  else if (currentHour >= 12 && currentHour < 19) return 'boa tarde'

  return null
}

const ChatBotMessage = ({ message, type = 'bot', timeStamp }) => {
  const renderMessage = () => {
    const { text, link } = message
    const messageStyle = type === 'user' ? 'chatbot__message-user' : 'chatbot__message-bot'

    return (
      <div className={messageStyle}>
        <p>{text}</p>
      </div>
    )
  }

  const messageStyleId = type === 'user' ? 'tms_user' : 'tms_bot'
  const messageAlignment = type === 'user' ? 'chatbot__message-align-right' : 'chatbot__message-align-left'

  return (
    <div className={`chatbot__message ${messageAlignment}`}>
      <div className='chatbot__message-info'>
        {renderMessage()}
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

const ChatBot = () => {
  const [chatLog, setChatLog] = useState([])
  const [isThonking, setIsThonking] = useState(false)
  const [userPrompt, setUserPrompt] = useState('')

  const resetChatLog = useCallback(() => {
    const initialMessage = {
      text: `Olá, ${timeOfDay()}! Para onde deseja viajar? Em que altura ou data, se possível?`,
      link: false
    }
    setChatLog([{ type: 'bot', message: initialMessage, timeStamp: moment() }])
  }, [])

  const sendResetToAPI = useCallback(async () => {
    setIsThonking(true)
    //const options = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ userPrompt })
    // }
    // const response = await fetch('TO_CHANGE', options)

    // return response.json()
    resetChatLog()
    setIsThonking(false)
  }, [resetChatLog])

  const sendPromptToAPI = useCallback(async (userPrompt) => {
    const newLog = [...chatLog, { type: 'user', message: { text: userPrompt, link: false }, timeStamp: moment() }]
    setChatLog(newLog)
    setIsThonking(true)

    // await sleep(Math.floor(Math.random() * 10000) + 1)

    const botResponse = `Desculpe, não entendi o que você quis dizer com "${userPrompt}". Poderia reformular?`

    setChatLog([
      ...newLog,
      {
        type: 'bot',
        message: { text: botResponse, link: false },
        timeStamp: moment()
      }
    ])

    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({ userPrompt })
    }

    const response = await axios.post('TESTE', { userPrompt })

    // const response = await fetch('TO_CHANGE', options)
    setIsThonking(false)
    // return response.json()
  }, [chatLog, setChatLog])

  useEffect(() => {
    resetChatLog()
  }, [])

  const { mutate, isPending } = useMutation({
    mutationKey: ['chatbot', userPrompt],
    mutationFn: sendPromptToAPI
  })

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendPrompt()
  }
  const handleUserPrompt = (e) => setUserPrompt(e.target.value)
  const handleResetChat = () => sendResetToAPI()

  const handleSendPrompt = useCallback(async () => {
    if (!userPrompt) return
    mutate(userPrompt)
    setUserPrompt('')
  }, [userPrompt, mutate])

  const reversedChatLog = chatLog.toReversed();
  return (
    <>
      <div className="chatbot__divider" />

      <Container className="chatbot">
        <h5>
          Quere um plano personalizado? Fale com o assistente virtual <FontAwesomeIcon icon={faRobot} />
        </h5>

        <Col>
          <InputGroup>
            {chatLog.length > 2 && (
              <Button
                disabled={isPending || isThonking}
                className="chatbot__send-btn"
                variant="primary"
                onClick={handleResetChat}
              >
                <FontAwesomeIcon icon={faClose} />
              </Button>
            )}

            <FormControl
              id='user_prompt'
              value={userPrompt}
              onChange={handleUserPrompt}
              placeholder="Responda aqui..."
              disabled={isPending || isThonking}
              onKeyDown={handleKeyDown}
            />

            <Button
              disabled={isPending || isThonking}
              className="chatbot__send-btn"
              variant="primary"
              onClick={handleSendPrompt}
            >
              <FontAwesomeIcon icon={faComment} />
            </Button>
          </InputGroup>

          <div className="chatbot__sub-divider" />

          <Container className="chatbot__messages">
            {(isPending || isThonking) && (
              <div className='chatbot__message'>
                <div className='chatbot__message-empty' />

                <div className='chatbot__message-info'>
                  <p className='chatbot__message-bot' >
                    <FontAwesomeIcon icon={faRobot} />

                    Estou a pensar...

                    <Spinner className='chatbot__message-spinner' animation="border" />
                  </p>
                </div>
              </div>
            )}

            {reversedChatLog.map(({ type, message, timeStamp }) => (
              <ChatBotMessage
                key={timeStamp.format("M_D_YYYY_h_mm_ss_a")}
                type={type}
                message={message}
                timeStamp={timeStamp}
              />
            ))}
          </Container>
        </Col >
      </Container >
    </>
  )
}

export default ChatBot
