import { cookies } from "next/headers"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

import Navbar from "../../../../components/Navbar"
import CreateClientComponent from './Create'
import { redirect } from "next/navigation"

interface CreateProps {
  params: {
    creatorId: string;
    id: string;
  }
}

const Create = async ({ params }: CreateProps) => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <Navbar session={session} />
      <CreateClientComponent 
        params={params}
        session={session}
      />
    </>
  )
}

export default Create 
