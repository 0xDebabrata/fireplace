import styles from "../../styles/Chat.module.css"

const ChatMessage = ({ messageObj }) => {
  if (messageObj.type === "event") {
    return (
      <div className="py-2 flex justify-center items-center space-x-2">
        <p className="text-neutral-400 text-xs truncate">{messageObj.message}</p>
      </div>
    )
  }

  return (
    <div 
      className={styles.wrapper}
    >
      <div className={`${messageObj.sent? 'text-right mr-3' : 'text-left'}`}>
        <div 
          className={`${messageObj.sent ? 'bg-neutral-800' : 'bg-neutral-600'} break-words inline-block mt-2 mb-1 py-1 px-3 rounded-md max-w-[70%]`}
        > 
          <p className="text-neutral-200">{messageObj.message}</p>
        </div>
      </div>
      {!messageObj.sent && (
        <div className={styles.nickname}>
          <p 
            style={{
              color: "#ffffff90",
            }}
          >
            {messageObj.nickname}
          </p>
        </div>
      )}
    </div>
  )
}

export default ChatMessage
