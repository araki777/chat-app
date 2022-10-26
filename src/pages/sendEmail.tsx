import { supabase } from "@/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import { NextPage } from "next"
import React, { useState } from "react";

const sendEmailToResetPassword: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [isSend, setIsSend] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3000/resetPassword'
      })
      if (error) {
        setError(error);
        throw error
      }
      setIsSend(true)
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  if (error) {
    return <p>エラー</p>
  }

  if (isSend) {
    return <p>送信しました</p>
  }

  return (
    <div>
      <p>登録されているメールアドレスを入力してください</p>
      <form onSubmit={handleSubmitEmail}>
        <input value={email} type="email" onChange={handleSetEmail} placeholder="メールアドレス" />
        <button type="submit">送信</button>
      </form>
    </div>
  )
}

export default sendEmailToResetPassword
