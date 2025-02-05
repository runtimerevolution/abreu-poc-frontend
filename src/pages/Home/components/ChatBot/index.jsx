import { useCallback, useEffect, useState } from "react"
import moment from 'moment'
import { v4 } from "uuid";
import { Button, Col, Container, FormControl, InputGroup } from "react-bootstrap"
import ChatLog from "./ChatLog";
import ChatOptionSelection from "./ChatOptionSelection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faComment, faRobot } from "@fortawesome/free-solid-svg-icons"

import './style.scss'
import { generateBotMsg, generateRandomOption, timeOfDay } from "./utils";

const PROMPT_PROPS = ['destination', 'origin', 'when', 'who']
const initialPrompts = PROMPT_PROPS.map((key) => ({ key, value: '' }))
const sessionId = v4()
const api_url = 'https://abreu-ai-poc-9f2880723694.herokuapp.com/'

const ChatBot = () => {
  const [currentPrompt, setCurrentPrompt] = useState('destination')
  const [prompts, setPrompts] = useState(initialPrompts)
  const [chatHistory, setChatHistory] = useState([])
  const [chatOptions, setChatOptions] = useState([])

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
    setChatOptions([
      generateRandomOption(),
      generateRandomOption(),
      generateRandomOption(),
      generateRandomOption(),
      generateRandomOption()
    ])
  }, [])

  const sendResetToAPI = useCallback(async () => {
    setIsThonking(true)
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_session: sessionId,
        prompt: prompts
      })
    }
    const response = await fetch(api_url, options)
    if (response.ok) {
      const data = response.json()
      setChatOptions(data)
    } else {
      setChatHistory([...chatHistory, {
        type: 'bot',
        message: `Desculpe, não foi possivel gerar opções. Poderia tentar outra vez?`,
        timeStamp: moment()
      }])
    }

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
          Quere planear as suas férias? Fale com o assistente virtual <FontAwesomeIcon icon={faRobot} />
        </h5>

        <Col>
          <ChatLog loading={isThonking} messages={reversedChatLog} />

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

          <ChatOptionSelection options={chatOptions} />
        </Col >
      </Container >
    </>
  )
}

export default ChatBot
