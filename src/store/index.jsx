import { configureStore } from "@reduxjs/toolkit";

import chatBotReducer from "./chatBotSlice";

const store = configureStore({
  reducer: {
    chatbot: chatBotReducer
  },
})

export default store
