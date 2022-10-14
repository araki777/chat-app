import { createContext, useState, useContext, Dispatch, SetStateAction, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserResponse } from '@supabase/supabase-js';
import { useRouter } from 'next/router'

type authContextType = {
  onSignUp: (email: string, password: string, name: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignInWithGoogle: () => void;
  onSignInWithGitHub: () => void;
  onSignOut: () => void;
  user: Promise<UserResponse> | undefined,
  setUser: Dispatch<SetStateAction<Promise<UserResponse> | undefined>>,
  loading: boolean
}

const Context = createContext({} as authContextType)

const Provider = ({ children }: any) => {
  const [user, setUser] = useState<Promise<UserResponse>>();
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    setUser(supabase.auth.getUser())
    supabase.auth.onAuthStateChange(() => {
      setUser(supabase.auth.getUser())
    })
  }, [])

  const onSignUp = async (email: string, password: string, name: string) => {
    try {
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
    }
  };

  const onSignIn = async (email: string, password: string) => {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        throw signInError
      }
      router.push('/')
    } catch (error) {
      alert('エラーが発生しました')
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
    setUser,
    loading
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useUser = () => useContext(Context)

export default Provider
