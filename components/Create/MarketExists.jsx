import styles from "@/styles/create.module.css"
import HorizontalRule from "../HorizontalRule"
import Link from "next/link"

const MarketExists = ({contract,name}) => {

    return(
        <div className={styles.container}>
            <div className={styles.header}>Market Exists</div>
            <HorizontalRule />
            <div className={styles.checkParams}>No need to create a market for {name}</div>
            <div className={styles.checkParams}>One already exists!</div>
            <div className={styles.checkParams} style={{marginTop:"15px",color:"var(--buttonColor",fontSize:"12px"}}><Link href={`/market/${contract}`}>{`aetheria.market/market/${contract}`}</Link></div>
        </div>
    )
}

export default MarketExists