import { useEffect } from "react"
import styles from "../../styles/Sidebar.module.css"

import { handleClick, handleMouseUp } from "../../functions/sidebar"

const Sidebar = () => {

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
            className={styles.container}>
            <div className={styles.window} />
        </div>
    )
}

export default Sidebar 
