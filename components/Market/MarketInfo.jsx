import styles from "@/styles/market.module.css"
import ViewSwitcher from "./ViewSwitcher"

const MarketInfo = ({marketInfo, view, setView}) => {

    return(
        <div className={`flexCol`}>
            {/*<div className={`flexRow ${styles.marketInfo}`}>
                <div>{marketInfo[0]}</div>
                <div>Stats</div>
            </div>*/}
            <ViewSwitcher view={view} setView={setView} />
        </div>
    )

}

export default MarketInfo