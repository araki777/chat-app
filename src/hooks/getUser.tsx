import { supabase } from "@/lib/supabase"
import { useSession } from "@/context/session"

export const getUser = () => {
  const { session, setSession } = useSession()

  async function getSession() {
    const { data: {session}, error } = await supabase.auth.getSession()
    setSession(session)
  }
  getSession()
}
