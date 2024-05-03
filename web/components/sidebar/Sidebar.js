import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Chat from "./Chat";

import styles from "../../styles/Sidebar.module.css";
import Tabs from "./Tabs";

import { handleClick, handleMouseUp } from "../../functions/sidebar";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Sidebar = ({
  session,
  ws,
  partyId,
  messageList,
  setMessageList,
  wsConnected,
  showSidebar,
  setShowSidebar,
}) => {
  const [selectedTab, setSelectedTab] = useState("Chat");

  // Listen to mouseup events
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div
      onMouseDown={(e) => handleClick(e)}
      id="border"
      className={styles.container}
    >
      <div className={styles.window}>
        <div className="flex items-center justify-between pr-2">
          <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

          {/* WebSocket status indicator */}
          <div
            title="WebSocket connection indicator"
            className={`w-2 h-2 rounded-full cursor-pointer ${
              wsConnected ? "bg-teal-400" : "bg-red-500"
            }`}
          ></div>
          {showSidebar && (
            <button
              className="ml-2"
              onClick={() => setShowSidebar(false)}
            >
            <XMarkIcon
              width={25}
              className="text-neutral-400 hover:text-neutral-200 duration-150"
            />
            </button>
          )}
        </div>
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              className={styles.motionDiv}
              key={selectedTab}
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.15 }}
            >
              {selectedTab === "Chat" ? (
                <Chat
                  session={session}
                  ws={ws}
                  partyId={partyId}
                  messageList={messageList}
                  setMessageList={setMessageList}
                />
              ) : (
                "Settings"
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
