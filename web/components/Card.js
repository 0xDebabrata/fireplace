import { Fragment, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Card = ({ video, setVideos }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const fileInputRef = useRef(null);

  const handleDelete = async (id, name) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const reqObject = {
      method: "POST",
      body: JSON.stringify({
        key: `${user.id}/${id}/${name}`,
      }),
    };

    // const promise = deleteFile(id)
    const promise = new Promise(async (resolve, reject) => {
      const { err } = await fetch("/api/deleteVideo", reqObject);
      const { error } = await supabase
        .from("fireplace-videos")
        .delete()
        .eq("id", id);

      if (err || error) {
        reject();
        throw new Error(err);
      } else {
        setVideos(prevVideos => prevVideos.filter((video) => video.id != id));
        resolve();
      }
    });

    toast.promise(promise, {
      success: "Video deleted successfully",
      loading: "Deleting video",
      error: "Could not delete video",
    });
  };

  const updateDb = async (userId, subtitleFilename) => {
    const { error } = await supabase
      .from("fireplace-videos")
      .update({
        subtitle_url: `https://d3v6emoc2mddy2.cloudfront.net/${userId}/${subtitleFilename}`,
      })
      .or(`and(url.eq.${video.url}, user_id.eq.${userId})`);

    if (error) {
      console.error(error);
    }
    return { error }
  };

  const handleAddSubtitleClick = async () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async () => {
    const file = fileInputRef.current.files[0];
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // use video file's name instead of subtitle file's name
    const subtitleFilename = name.split(".").slice(0, -1).join(".") + ".vtt";

    const reqObject = {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        fileName: subtitleFilename,
        fileType: ".vtt",
      }),
    };

    const promise = new Promise(async (resolve, reject) => {
      const url = await fetch("/api/preSignedURL", reqObject)
        .then((resp) => resp.json())
        .then((url) => {
          return url.url;
        });

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const { error } = await updateDb(user.id, subtitleFilename);
            if (error) {
              reject(error.message)
            }
            resolve();
          } else {
            reject("Could not upload subtitle");
          }
        }
      };

      xhr.open("PUT", url);
      xhr.setRequestHeader("content-type", "text/vtt");
      xhr.send(file);
    });

    toast.promise(promise, {
      loading: "Uploading subtitle",
      success: "Subtitles uploaded",
      error: (message) => message,
    })
  };

  const handlePlay = async () => {
    window.open(video.url, "_blank");
  };

  const createWatchparty = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const info = {
      video_url: video.url,
      creator_id: user.id,
      test: process.env.NEXT_PUBLIC_STAGE === "dev" ? true : false,
    };

    const { data, err } = await supabase
      .from("watchparties")
      .insert([info])
      .select();

    if (err) {
      console.error(err);
    }

    router.push(`/${user.id}/${data[0].id}/create`);
  };

  return (
    <li className="overflow-hidden rounded-xl border border-neutral-600">
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-neutral-700 p-6">
        <div>
          <svg
            onClick={handlePlay}
            className="fill-white hover:fill-neutral-400 duration-150"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.3418 21.3711C9.71094 21.3711 10.0361 21.2393 10.4404 21.002L20.8203 14.999C21.5762 14.5596 21.8926 14.2168 21.8926 13.6631C21.8926 13.1094 21.5762 12.7754 20.8203 12.3271L10.4404 6.32422C10.0361 6.08691 9.71094 5.95508 9.3418 5.95508C8.62109 5.95508 8.11133 6.50879 8.11133 7.37891V19.9473C8.11133 20.8262 8.62109 21.3711 9.3418 21.3711Z" />
          </svg>
        </div>

        <div className="text-sm leading-6 text-gray-200 truncate">
          {video.name}
        </div>

        <Menu as="div" className="relative ml-auto">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-neutral-800 border border-neutral-600 py-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={handleAddSubtitleClick}
                    className={classNames(
                      active ? "bg-neutral-700" : "",
                      "cursor-pointer block px-3 py-1 text-sm leading-6 text-neutral-400"
                    )}
                  >
                    <div
                    >
                      Add subtitles<span className="sr-only">, {video.name}</span>
                    </div>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={() => handleDelete(video.id, video.name)}
                    className={classNames(
                      active ? "bg-neutral-700" : "",
                      "cursor-pointer block px-3 py-1 text-sm leading-6 text-neutral-400"
                    )}
                  >
                    Delete<span className="sr-only">, {video.name}</span>
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>

        <input
          onChange={handleFileSelect}
          type="file"
          accept=".vtt"
          hidden
          ref={fileInputRef}
        />
      </div>
      <dl className="-my-3 divide-y divide-neutral-600 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between items-center gap-x-4 py-3">
          {/*<dt className="text-gray-500">Last invoice</dt>*/}
          <dd className="text-gray-700">
            <button
              onClick={() => createWatchparty()}
              className="px-4 py-1 text-sm text-neutral-400 border border-neutral-600 rounded-md hover:bg-yellow-600 hover:text-neutral-800 duration-150"
            >
              Start watchparty
            </button>
          </dd>
        </div>
      </dl>
    </li>
  );
};

export default Card;
