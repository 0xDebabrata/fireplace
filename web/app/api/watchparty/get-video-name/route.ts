import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const GET = async (req: Request) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const url = new URL(req.url)

  const watchpartyId = url.searchParams.get("watchpartyId")
  const { data, error } = await supabase
    .from("watchparties")
    .select("fireplace-videos(name)")
    .eq("id", watchpartyId)
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json({ name: data["fireplace-videos"].name })
}
