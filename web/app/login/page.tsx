import { cookies } from 'next/headers'
import dynamic from 'next/dynamic'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import { Database } from '../../database.types'
const DynamicLogin = dynamic(() => import('../../components/Login'), {
  ssr: false
})

export default async function LoginPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()
  console.log("session", session)

  return (
    <div>
      <DynamicLogin />
    </div>
  )
}
