import { cookies } from "next/headers"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from "next/navigation"

import ClientComponent from "./ClientComponent";

interface Props {
  params: {
    creatorId: string;
    id: string;
    nickname: string;
  }
}

const Watch = async ({ params }: Props) => {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return <ClientComponent session={session} params={params} />
};

export default Watch;
