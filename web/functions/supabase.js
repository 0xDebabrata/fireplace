// TODO: IMPLEMENT VIDEO ID

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function getSubtitleURL(name, creatorId) {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.rpc("get_subtitle_url", {
    video_name: name,
    creator_user_id: creatorId,
  });

  if (!error) {
    return data[0].subtitle_url;
  } else {
    return null;
  }
}
