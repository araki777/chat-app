import type { AppProps } from "next/app";
import SessionProvider from '@/context/session';
import '@/styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp;
