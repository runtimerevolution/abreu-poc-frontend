import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import AppRoutes from './routes'

import { AppContext } from './helpers/AppContext'
// Styles
import './App.scss'

const queryClient = new QueryClient()

function App() {
  const [isloggedIn, setIsLoggedIn] = useState(false)

  return (
    <Provider store={store}>
      <AppContext.Provider value={{ isloggedIn, setIsLoggedIn }}>
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </AppContext.Provider>
    </Provider>
  )
}

export default App
