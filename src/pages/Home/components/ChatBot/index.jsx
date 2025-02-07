/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react"
import moment from 'moment'
import { v4 } from "uuid";
// Components
import { Button, Col, Container, FormControl, InputGroup, Nav } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ChatLog from "./ChatLog";
import ReportSelection from "./ReportSelection";
// Utils
import {
  DEFAULT_PROMPT_KEYS,
  generateOfflineBotMsg,
  generatePrompts,
  generateRandomOption,
  INITIAL_PROMPTS,
  parseResponseData
} from "./utils";
// Assets
import { faClose, faComment } from "@fortawesome/free-solid-svg-icons"
// Styles
import './style.scss'

const api_url = 'https://abreu-ai-poc-9f2880723694.herokuapp.com'

const ChatBot = () => {
  // API Info
  const [isThonking, setIsThonking] = useState(false)
  const [sessionID, setSessionID] = useState(v4())
  const [promptKeys, setPromptKeys] = useState([])
  const [prompts, setPrompts] = useState([])
  const [reports, setReports] = useState([])
  // Chat box State
  const [isNoChat, setIsNoChat] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [userPrompt, setUserPrompt] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  const [chatType, setChatType] = useState('structured')

  const askAPIforPrompts = useCallback(async () => {
    let generatedChatMsg = null

    const options = { method: 'GET' }
    const response = await fetch(`${api_url}/questions`, options)
    if (response.ok) {
      const aiPrompts = await response.json()
      const aiPromptKeys = aiPrompts.map(({ key }) => key)
      const generatedPrompts = generatePrompts(aiPrompts)
      setPrompts(generatedPrompts)
      setPromptKeys(aiPromptKeys)

      generatedChatMsg = generateAutoBotMsg(aiPromptKeys[0], generatedPrompts)
    } else { generatedChatMsg = generateOfflineBotMsg('prompts_error') }

    return generatedChatMsg
  }, [])

  const sendPromptsToAPI = useCallback(async (_prompts, updatedChatLog) => {
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
      setReports(parseResponseData(data))
      setChatHistory([...updatedChatLog, generateOfflineBotMsg('generate_options'), generateOfflineBotMsg('reset')])
      setIsNoChat(true)
    } else {
      setPromptKeys(DEFAULT_PROMPT_KEYS)
      setPrompts(INITIAL_PROMPTS)
      setChatHistory(
        [
          ...updatedChatLog,
          generateOfflineBotMsg('request_error'),
          generateAutoBotMsg(DEFAULT_PROMPT_KEYS[0], INITIAL_PROMPTS)
        ])
    }

    setIsThonking(false)
  }, [sessionID])

  const resetChatLog = useCallback(async () => {
    const uuid = v4()
    console.log('resetChatLog sessionID', uuid)
    setSessionID(uuid)
    setIsUpdating(true)
    setIsNoChat(false)

    const startingChatLog = [generateOfflineBotMsg('opening')]

    switch (chatType) {
      case 'free_form': {
        setPromptKeys([])
        startingChatLog.push(generateOfflineBotMsg('free_form'))
        break
      }
      case 'surprise': {
        const firstChatMessage = await askAPIforPrompts()
        startingChatLog.push(firstChatMessage)
        break
      }
      case 'structured':
      default: {
        setPromptKeys(DEFAULT_PROMPT_KEYS)
        setPrompts(INITIAL_PROMPTS)
        startingChatLog.push(generateAutoBotMsg(DEFAULT_PROMPT_KEYS[0], INITIAL_PROMPTS))
        break
      }
    }

    setChatHistory(startingChatLog)
    setReports([])
    setIsUpdating(false)
  }, [chatType])

  useEffect(() => {
    resetChatLog()
  }, [])

  useEffect(() => {
    resetChatLog()
  }, [chatType])

  // =================== UTILS =================================================
  const generateAutoBotMsg = useCallback((key, initialPrompts = null) => {
    const _prompts = initialPrompts ? initialPrompts : prompts
    console.log('generateAutoBotMsg prompts', _prompts)
    const keyPrompt = _prompts.find((p) => p.key === key)
    console.log('generateAutoBotMsg keyPrompt', keyPrompt)
    if (keyPrompt) return { type: 'bot', message: keyPrompt.question, timeStamp: moment(), finished: false }

    return { type: 'bot', message: `UNKNOWN KEY RECEIVE ${key}`, timeStamp: moment() }
  }, [prompts])

  // =================== HANDLERS ===============================================

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSendPrompt()
  }
  const handleUserPrompt = (e) => setUserPrompt(e.target.value)
  const handleResetChat = () => resetChatLog()

  const handleSendPrompt = useCallback(async () => {
    if (!userPrompt) return

    if (['structured', 'surprise'].includes(chatType)) {
      let currentKey = promptKeys[0]

      const updatedChatLog = [...chatHistory, { type: 'user', message: userPrompt, timeStamp: moment() }]
      const updatedPrompts = prompts.map((p) => p.key === currentKey ? { ...p, key: p.key, value: userPrompt } : p)

      const missingPrompts = promptKeys.filter((v) => v !== currentKey)
      currentKey = missingPrompts[0]

      if (missingPrompts.length > 0) {
        const msg = generateAutoBotMsg(currentKey)
        updatedChatLog.push(msg)
      }

      setPrompts(updatedPrompts)
      setPromptKeys(missingPrompts)
      setChatHistory(updatedChatLog)

      if (!missingPrompts.length && updatedPrompts.every(p => p.value)) {
        await sendPromptsToAPI(updatedPrompts, updatedChatLog)
      }
    }
    setUserPrompt('')
  }, [userPrompt, prompts, chatHistory, chatType, sendPromptsToAPI])

  const reversedChatLog = chatHistory.toReversed();
  const hasUserMessages = chatHistory.some(({ type }) => type === 'user')
  return (
    <Container className="chatbot">
      <h5>
        Geração de Roteiros de viagens à medida.
      </h5>

      <Col>
        <Nav className="chatbot__tabs" variant='tabs' activeKey={chatType} onSelect={(sk) => setChatType(sk)}>
          <Nav.Item>
            <Nav.Link eventKey='structured'>Estruturado</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='surprise'>Suprende-me!</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='free_form'>Conversa Livre</Nav.Link>
          </Nav.Item>
        </Nav>

        <ChatLog isUpdating={isUpdating} isRequesting={isThonking} messages={reversedChatLog} />

        <InputGroup>
          {hasUserMessages && (
            <Button
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

        <ReportSelection options={reports} />
      </Col >
    </Container >
  )
}

export default ChatBot
