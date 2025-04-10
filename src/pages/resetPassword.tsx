import { supabase } from "@/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import { NextPage } from "next"
import React, { useState } from "react";

const ResetPassword: NextPage = () => {
  const [password, setPassword] = useState<string>('');
  const [isSend, setIsSend] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleSubmitPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setError(error);
        throw error
      }
      setIsSend(true);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  if (error) {
    return <p>エラー</p>
  }

  if (isSend) {
    return <p>送信しました</p>
  }

  return (
    <div>
      <p>新しいパスワードを入力してください</p>
      <form onSubmit={handleSubmitPassword}>
        <input value={password} type="password" onChange={handleSetPassword} placeholder="パスワード" />
        <button type="submit">送信</button>
      </form>
    </div>
  )
}

export default ResetPassword
