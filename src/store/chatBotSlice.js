import { createSlice } from "@reduxjs/toolkit";


export const chatBotSlice = createSlice({
  name: 'chatbot',
  initialState: {
    message: []
  },
  reducers: {
    userSentMessage: (state, action) => {
      state.message.push({ type: 'user', message: action.payload })
    },
    botSentMessage: (state, action) => {
      state.message.push({ type: 'bot', message: action.payload })
    }
  },

})

export const { userSentMessage, botSentMessage } = chatBotSlice.actions

export default chatBotSlice.reducer
