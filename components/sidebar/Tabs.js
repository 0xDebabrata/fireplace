import { motion } from "framer-motion"
import Image from "next/image"

import styles from "../../styles/Sidebar.module.css"

const Tabs = ({ selectedTab, setSelectedTab }) => {
    const tabs = ["Chat", "Settings"]

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                {tabs.map((item, index) => {
                    return (
                        <li key={index}
                            onClick={() => setSelectedTab(item)}>
                            <p>{item}</p>
                            { selectedTab === item ? (
                                <motion.div className="selected"
                                    layoutId="selected" />
                            ) : null }
                        </li>
                    )
                })}
            </ul>
            <div className={styles.close}>
                <Image src={"/cross-icon.svg"}
                    alt={"Close sidebar"}
                    width={30}
                    height={30}
                />
            </div>
        </nav>
    )
}

export default Tabs
