import { useCallback, useEffect, useState } from "react"
import moment from 'moment'
import { v4 } from "uuid";
// Components
import { Button, Col, Container, FormCheck, FormControl, InputGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ChatLog from "./ChatLog";
import ReportSelection from "./ReportSelection";
// Utils
import { generateBotMsg, generateRandomOption, parseResponseData } from "./utils";
// Assets
import { faClose, faComment } from "@fortawesome/free-solid-svg-icons"
// Styles
import './style.scss'

const PROMPT_PROPS = ['destination', 'origin', 'when', 'who', 'budget']
const initialPrompts = PROMPT_PROPS.map((key) => ({ key, value: '' }))
const api_url = 'https://abreu-ai-poc-9f2880723694.herokuapp.com'

const ChatBot = () => {
  const [currentPrompt, setCurrentPrompt] = useState('destination')
  // API Info
  const [isThonking, setIsThonking] = useState(false)
  const [sessionID, setSessionID] = useState(v4())
  const [prompts, setPrompts] = useState(initialPrompts)
  // Chat box State
  const [isNoChat, setIsNoChat] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [userPrompt, setUserPrompt] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [chatOptions, setChatOptions] = useState([])
  const [chatFreely, setChatFreely] = useState(false)

  const resetChatLog = useCallback(() => {
    setIsUpdating(true)
    setCurrentPrompt('destination')
    setPrompts(initialPrompts)
    setIsNoChat(false)

    if (chatFreely) {
      setChatHistory([generateBotMsg('opening'), generateBotMsg('free_form')])
    } else {
      setChatHistory([generateBotMsg('opening'), generateBotMsg('destination')])
    }
    setIsUpdating(false)
  }, [chatFreely])

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
      setChatHistory([...updatedChatLog, generateBotMsg('generate_options'), generateBotMsg('reset')])
      setIsNoChat(true)
    } else {
      setCurrentPrompt('destination')
      setPrompts(initialPrompts)
      setChatHistory([...updatedChatLog, generateBotMsg('request_error'), generateBotMsg('destination')])
    }

    // const response = await fetch('TO_CHANGE', options)
    setIsThonking(false)
    // return response.json()
  }, [sessionID])

  useEffect(() => {
    resetChatLog()
    setSessionID(v4())
  }, [])

  useEffect(() => {
    resetChatLog()
  }, [chatFreely])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendPrompt()
  }
  const handleUserPrompt = (e) => setUserPrompt(e.target.value)
  const handleResetChat = () => sendResetToAPI()
  const handleChangeToFree = (e) => setChatFreely(e.target.checked)

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
    <Container className="chatbot">
      <h5>
        Geração de Roteiros de viagens à medida.
      </h5>

      <Col>
        <ChatLog isUpdating={isUpdating} isRequesting={isThonking} messages={reversedChatLog} />

        <InputGroup>
          <FormCheck
            className="chatbot__switch"
            type="switch"
            id="custom-switch"
            label="Livre"
            onChange={handleChangeToFree}
          />

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
  )
}

export default ChatBot
