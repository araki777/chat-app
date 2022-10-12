import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

const useAuth = () => {
  const router = useRouter();

  const onSignUp = async (email: string, password: string, name: string, employeePosition: number) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              user_name: name,
              employee_position: employeePosition,
            }
          }
        },
      );
      if (signUpError) {
        throw signUpError;
      }
      await router.push("/login");
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
      await router.push('/')
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
      await router.push("/");
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
      await router.push("/");
    } catch (error) {
      alert('エラーが発生しました')
    }
  }

  return {
    onSignUp,
    onSignIn,
    onSignInWithGoogle,
    onSignInWithGitHub
  };
};

export default useAuth;
