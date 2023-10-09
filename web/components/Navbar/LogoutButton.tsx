'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const Logout = () => {
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <button className="text-sm px-3 py-1.5 rounded-md text-neutral-400 border border-neutral-700 hover:bg-neutral-800 duration-150" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default Logout
