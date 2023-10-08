import type { AppProps } from 'next/app'

import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

function App({ Component, pageProps }: AppProps) {
  return ( 
      <>
        <Component {...pageProps} />
        <Toaster 
            toastOptions={{
                style: {
                    minWidth: "300px"
                }
            }} />
      </>
  )
}

export default App
