import styles from "@/styles/market.module.css"

const Stat = ({stat,value}) => {

    return(
    <div className={styles.stats}>
        <div className={styles.statKey}>{stat}</div>
        <div className={stat !== "Price" ? styles.statValue : styles.priceStat}>{value}</div>
    </div>
    )
}

export default Stat