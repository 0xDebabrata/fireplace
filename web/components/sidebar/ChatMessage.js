import styles from "../../styles/Chat.module.css"

const ChatMessage = ({ messageObj }) => {
  console.log(messageObj)
  return (
    <div 
      className={styles.wrapper}
    >
      <div className={`${messageObj.sent? 'text-right mr-3' : 'text-left'}`}>
        <div 
          className={`${messageObj.sent ? 'bg-neutral-800' : 'bg-neutral-600'} break-words inline-block mt-2 mb-1 py-1 px-3 rounded-md max-w-[70%]`}
        > 
          <p>{messageObj.message}</p>
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
