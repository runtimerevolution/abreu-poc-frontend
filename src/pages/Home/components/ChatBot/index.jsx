import { useCallback, useEffect, useState } from "react"
import moment from 'moment'
import PropTypes from 'prop-types';
import { Button, Col, Container, FormControl, InputGroup, Spinner } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faComment, faRobot } from "@fortawesome/free-solid-svg-icons"

import './style.scss'

const PROMPT_PROPS = ['destination', 'origin', 'when', 'who']
const initialPrompts = PROMPT_PROPS.map((key) => ({ key, value: '' }))

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const timeOfDay = () => {
  const currentHour = moment().format('HH')

  if (currentHour >= 3 && currentHour < 12) return 'bom dia'
  else if (currentHour >= 12 && currentHour < 19) return 'boa tarde'

  return null
}

const generateBotMsg = (nextKey) => {
  let chatMessage = { type: 'bot', message: '', timeStamp: moment() }
  switch (nextKey) {
    case 'destination':
      chatMessage.message = 'Para onde deseja viajar? (Cidade ou País)'
      break
    case 'when':
      chatMessage.message = 'Quando pretende ir? (Data de ínicio e fim ou Data de ínicio e duração)'
      break
    case 'origin':
      chatMessage.message = 'De onde é que vai sair ? (Cidade ou País)'
      break
    case 'who':
      chatMessage.message = 'Quantas pessoas irão ?'
      break
  }
  return chatMessage
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

// {
//   destination: '',
//     date: '',
//       when: '',
//         who: ''
// }

const ChatBot = () => {
  const [currentPrompt, setCurrentPrompt] = useState('destination')
  const [prompts, setPrompts] = useState(initialPrompts)
  const [chatHistory, setChatHistory] = useState([])

  const [isThonking, setIsThonking] = useState(false)
  const [userPrompt, setUserPrompt] = useState('')

  const resetChatLog = useCallback(() => {
    setCurrentPrompt('destination')
    setPrompts(initialPrompts)
    setChatHistory([
      {
        type: 'bot',
        message: `Olá, ${timeOfDay()}! Para onde deseja viajar?`,
        timeStamp: moment(),
      }
    ])
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

  const sendPromptToAPI = useCallback(async (_prompts, updatedChatLog) => {
    setIsThonking(true)

    // await sleep(Math.floor(Math.random() * 10000) + 1)


    // const options = {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',

    //   },
    //   body: JSON.stringify({ userPrompt })
    // }

    // const response = await axios.post('TESTE', { userPrompt })
    setChatHistory([...updatedChatLog, {
      type: 'bot',
      message: `Desculpe, não foi possivel. Poderia tentar outra vez?`,
      timeStamp: moment()
    }])

    // const response = await fetch('TO_CHANGE', options)
    setIsThonking(false)
    // return response.json()
  }, [])

  useEffect(() => {
    resetChatLog()
  }, [])

  useEffect(() => {
    const missingPrompts = prompts.filter(({ value }) => !value)
    if (!missingPrompts.length) sendPromptToAPI(prompts)
  }, [prompts, sendPromptToAPI])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendPrompt()
  }
  const handleUserPrompt = (e) => setUserPrompt(e.target.value)
  const handleResetChat = () => sendResetToAPI()

  const handleSendPrompt = useCallback(async () => {
    if (!userPrompt) return
    const updatedChatLog = [...chatHistory, { type: 'user', message: userPrompt, timeStamp: moment() }]
    const _prompts = prompts.map((p) => p.key === currentPrompt ? { key: p.key, value: userPrompt } : p)

    setPrompts(_prompts)
    setUserPrompt('')

    const missingPrompts = _prompts.filter(({ value }) => !value)
    if (missingPrompts.length) {
      const nextKey = missingPrompts[0].key
      setCurrentPrompt(nextKey)
      updatedChatLog.push(generateBotMsg(nextKey))
    }
    setChatHistory(updatedChatLog)

    if (!missingPrompts.length) await sendPromptToAPI(_prompts, updatedChatLog)
  }, [userPrompt, prompts, currentPrompt, chatHistory, sendPromptToAPI])

  const reversedChatLog = chatHistory.toReversed();
  const hasUserMessages = chatHistory.some(({ type }) => type === 'user')
  return (
    <>
      <div className="chatbot__divider" />

      <Container className="chatbot">
        <h5>
          Quere um plano personalizado? Fale com o assistente virtual <FontAwesomeIcon icon={faRobot} />
        </h5>

        <Col>
          <InputGroup>
            {hasUserMessages && (
              <Button
                disabled={isThonking}
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
              disabled={isThonking}
              onKeyDown={handleKeyDown}
            />

            <Button
              disabled={isThonking}
              className="chatbot__send-btn"
              variant="primary"
              onClick={handleSendPrompt}
            >
              <FontAwesomeIcon icon={faComment} />
            </Button>
          </InputGroup>

          <div className="chatbot__sub-divider" />

          <Container className="chatbot__messages">
            {isThonking && (
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

            {reversedChatLog.map(({ type, message, timeStamp }, index) => (
              <ChatBotMessage
                key={timeStamp.format("M_D_YYYY_h_mm_ss_a") + index}
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
