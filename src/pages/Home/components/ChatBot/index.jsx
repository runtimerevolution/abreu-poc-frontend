import { useCallback, useEffect, useState } from "react"
import moment from 'moment'
import { v4 } from "uuid";
// Components
import { Button, Col, Container, FormControl, InputGroup } from "react-bootstrap"
import ChatLog from "./ChatLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// Utils
import { generateBotMsg, parseResponseData, timeOfDay } from "./utils";
// Assets
import { faClose, faComment } from "@fortawesome/free-solid-svg-icons"
// Styles
import './style.scss'
import ReportSelection from "./ReportSelection";

const PROMPT_PROPS = ['destination', 'origin', 'when', 'who', 'budget']
const initialPrompts = PROMPT_PROPS.map((key) => ({ key, value: '' }))
const api_url = 'https://abreu-ai-poc-9f2880723694.herokuapp.com'

const ChatBot = () => {
  const [currentPrompt, setCurrentPrompt] = useState('destination')
  const [sessionID, setSessionID] = useState(v4())
  const [prompts, setPrompts] = useState(initialPrompts)
  const [chatHistory, setChatHistory] = useState([])
  const [chatOptions, setChatOptions] = useState([])

  const [isThonking, setIsThonking] = useState(false)
  const [isNoChat, setIsNoChat] = useState(false)
  const [userPrompt, setUserPrompt] = useState('')

  const resetChatLog = useCallback(() => {
    setCurrentPrompt('destination')
    setPrompts(initialPrompts)
    setIsNoChat(false)
    setChatHistory([
      {
        type: 'bot',
        message: `Olá, ${timeOfDay()}! Bem vindo ao seu assistente de viagem à medida.`,
        timeStamp: moment(),
      },
      generateBotMsg('destination')
    ])
  }, [])

  const sendResetToAPI = useCallback(async () => {
    setIsThonking(true)
    // return response.json()
    resetChatLog()
    setIsThonking(false)
  }, [resetChatLog])

  const sendPromptToAPI = useCallback(async (_prompts, updatedChatLog) => {
    setIsThonking(true)

    const promptObject = {}
    _prompts.forEach(({ key, value }) => promptObject[key] = value)

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_session: sessionID,
        prompt: promptObject
      })
    }
    const response = await fetch(`${api_url}/prompt`, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      setChatOptions(parseResponseData(data))
      setChatHistory([
        ...updatedChatLog, {
          type: 'bot',
          message: `Aqui estão algumas sugestões para a tua viagem!`,
          timeStamp: moment()
        },
        {
          type: 'bot',
          message: `Se quiseres recomeçar a conversa, clica no botão de reset(x).`,
          timeStamp: moment()
        }
      ])
      setIsNoChat(true)
    } else {
      setCurrentPrompt('destination')
      setPrompts(initialPrompts)
      setChatHistory([
        ...updatedChatLog, {
          type: 'bot',
          message: `Desculpa, não foi possivel gerar relatórios. Tenta outra vez!`,
          timeStamp: moment()
        },
        {
          type: 'bot',
          message: `Qual o destino da tua viagem ?`,
          timeStamp: moment(),
        }
      ])
    }

    // const response = await fetch('TO_CHANGE', options)
    setIsThonking(false)
    // return response.json()
  }, [sessionID])

  useEffect(() => {
    resetChatLog()
    setSessionID(v4())
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
      {/* <div className="chatbot__divider" /> */}

      <Container className="chatbot">
        <h5>
          Geração de Roteiros de viagens à medida.
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
              disabled={isThonking || isNoChat}
              onKeyDown={handleKeyDown}
            />

            <Button
              className="chatbot__send-btn"
              disabled={isThonking || isNoChat}
              variant="primary"
              onClick={handleSendPrompt}
            >
              <FontAwesomeIcon icon={faComment} />
            </Button>
          </InputGroup>

          <div className="chatbot__sub-divider" />

          <ReportSelection options={chatOptions} />
        </Col >
      </Container >
    </>
  )
}

export default ChatBot
