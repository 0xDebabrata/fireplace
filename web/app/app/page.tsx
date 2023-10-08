import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from "next/navigation"

import Navbar from "../../components/Navbar"
import ApplicationDashboard from '../../components/ApplicationDashboard'

export default async function Application() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <Navbar session={session} />
      <ApplicationDashboard />
    </div>
  )
}
