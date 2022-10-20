import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/context/session'
import axios from 'axios'
import { io } from 'socket.io-client'
import { response } from 'express'

type Props = {
  children: ReactNode
}

export const SessionGuard = ({ children }: Props) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState<boolean>(false);
  const { sessionUser, setSessionUser, setSocket, socket } = useSession()

  useEffect(() => {
    authCheck(router.asPath)

    const hideContent = () => {
      setAuthorized(false)
    };
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    }
  }, [])

  const authCheck = async (url: string) => {
    const path = url.split('/')[1];
    const { data, error } = await supabase.auth.getSession()

    if (data.session && !sessionUser) {
      const response = await axios.post(`/api/users/${data.session.user.id}`)
      setSessionUser(response.data.user)

      if (!socket) {
        setSocket(() => io())
      }
    }

    if (data.session !== null && path === 'login') {
      setAuthorized(true);
      router.push('/')
    }

    if (data.session === null && path !== 'login') {
      setAuthorized(false);
      router.push('/login')
      return null
    } else {
      setAuthorized(true);
    }
  }

  return authorized ? <>{ children }</> : null
}

export default SessionGuard;
