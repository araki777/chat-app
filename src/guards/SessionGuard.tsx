import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/context/session'
import axios from 'axios'
import { io } from 'socket.io-client'

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

    return () => {
      router.events.off('routeChangeStart', hideContent);
    }
  }, [router])

  useEffect(() => {
    if (sessionUser && !socket) {
      setSocket(() => io())
    }
  }, [sessionUser])

  const authCheck = async (url: string) => {
    const path = url.split('/')[1];
    const { data: { session }, error } = await supabase.auth.getSession()

    // セッションを取得しているが、セッションユーザーが取得出来ていない場合
    if (session && !sessionUser) {
      const response = await axios.post(`/api/users/${session.user.id}`)
      setSessionUser(response.data.user)
    }

    // セッションを取得している状態でログイン画面へ遷移した場合
    if (session && path === 'login') {
      return router.push('/')
    }

    // セッションを取得していない状態でログイン画面以外へ遷移した場合
    if (!session && path !== 'login') {
      return router.push('/login')
    }

    // return処理に引っかからなかった場合
    setAuthorized(true)
  }

  return authorized ? <>{ children }</> : null
}

export default SessionGuard;
