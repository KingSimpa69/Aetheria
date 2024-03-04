import styles from "@/styles/market.module.css"

const MarketInfoItem = ({kee,value}) => {

    return(
        <div className={styles.marketInfoItem}>
            <h1>{value}</h1>
            <p>{kee}</p>   
        </div>
    )
}

export default MarketInfoItem