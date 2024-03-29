import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Chat from "./Chat"

import styles from "../../styles/Sidebar.module.css"
import Tabs from "./Tabs"

import { handleClick, handleMouseUp } from "../../functions/sidebar"

const Sidebar = ({ session, ws, partyId, messageList, setMessageList }) => {
  const [selectedTab, setSelectedTab] = useState("Chat")

  // Listen to mouseup events
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp) 
    }
  })

  return (
    <div 
      onMouseDown={(e) => handleClick(e)}
      id="border"
      className={styles.container}
    >
      <div className={styles.window}>
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <main>
          <AnimatePresence mode="wait">
            <motion.div
                className={styles.motionDiv}
                key={selectedTab}
                animate={{opacity: 1, x: 0}}
                initial={{opacity: 0, x: -20}}
                exit={{opacity: 0, x: 20}}
                transition={{duration: 0.15}}
            >
              {selectedTab === "Chat" ?
                <Chat session={session} ws={ws} partyId={partyId} messageList={messageList} setMessageList={setMessageList} /> : "Settings"}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Sidebar 
