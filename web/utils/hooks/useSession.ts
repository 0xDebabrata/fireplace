import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from '@supabase/supabase-js'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      console.log("get session", session)
      setSession(session)
    }

    getSession()

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("session state change", session)
      setSession(session)
    })
  }, [])

  return session
}
