import { motion } from "framer-motion"
import Image from "next/image"

import styles from "../../styles/Sidebar.module.css"

const Tabs = ({ selectedTab, setSelectedTab }) => {
    // const tabs = ["Chat", "Settings"]
    const tabs = ["Chat"]

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                {tabs.map((item, index) => {
                    return (
                        <li key={index}
                            className="px-4 py-1 text-sm flex justify-center items-center cursor-pointer relative rounded"
                            onClick={() => setSelectedTab(item)}>
                            <p
                              className="text-neutral-200 z-10"
                            >{item}</p>
                            { selectedTab === item ? (
                                <motion.div className="selected"
                                    layoutId="selected" />
                            ) : null }
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default Tabs
