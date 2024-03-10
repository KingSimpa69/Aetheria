import styles from "@/styles/market.module.css"
import formatPercent from "@/functions/formatPercent"

const MarketInfoItem = ({kee,value,supply}) => {

    return(
        <div className={styles.marketInfoItem}>
            <h1>
            {value} 
            {kee === "Listed" && ` (${formatPercent(value/supply)}%)`}
            {kee === "Holders (Unique)" && ` (${formatPercent(value/supply)}%)`}
            {kee === "Volume" || kee === "Floor" || kee === "Liquidity Pool" ? " ETH" : kee === "Holders (Unique)" || kee === "Listed" ? null : "%"} 
            </h1>
            <p>{kee}</p>   
        </div>
    )
}

export default MarketInfoItem