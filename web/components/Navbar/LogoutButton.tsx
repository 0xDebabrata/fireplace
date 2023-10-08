'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const Logout = () => {
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <button className="text-sm px-2 py-1 rounded-md bg-neutral-700" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default Logout
