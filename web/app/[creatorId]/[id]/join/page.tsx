import { cookies } from "next/headers"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from "next/navigation"
import JoinClientComponent from "./JoinClientComponent";

interface JoinProps {
  params: {
    creatorId: string;
    id: string;
  }
}

const Join = async ({ params }: JoinProps) => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <JoinClientComponent params={params} />
}

export default Join
