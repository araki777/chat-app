import { createContext, useState, useContext, useEffect, Dispatch, SetStateAction } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'
import { Session, User } from '@supabase/supabase-js';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';


type authContextType = {
  onSignUp: (email: string, password: string, name: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignInWithGoogle: () => void;
  onSignInWithGitHub: () => void;
  onSignOut: () => void;
  user: User | undefined,
  loading: boolean,
  setSocket: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined
}

const Context = createContext({} as authContextType)

const Provider = ({ children }: any) => {
  const [session, setSession] = useState<Session | null>()
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  useEffect(() => {
    async function getSession() {
      const { data: {session}, error } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
  }, [])

  useEffect(() => {
    async function setUpUser() {
      if (session?.user.id) {
        const { data: user } = await supabase.from('users').select('*').eq('id', session.user.id).single()
        setUser(user)
      }
    }
    setUpUser()
  }, [session])

  const onSignUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              user_name: name
            }
          }
        },
      );
      if (signUpError) {
        throw signUpError;
      }
      router.push('/login')
    } catch (error) {
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const onSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        throw signInError
      }
      router.push('/')
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false);
    }
  }

  const onSignInWithGoogle = async () => {
    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (signInError) {
        throw signInError
      }
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  const onSignInWithGitHub = async () => {
    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({ provider: 'github' })
      if (signInError) {
        throw signInError
      }
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  const onSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login')
  }

  const exposed: authContextType = {
    onSignUp,
    onSignIn,
    onSignInWithGoogle,
    onSignInWithGitHub,
    onSignOut,
    user,
    loading,
    setSocket,
    socket
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context)

export default Provider
