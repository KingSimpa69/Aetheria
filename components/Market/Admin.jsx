import styles from "@/styles/market.module.css"
import {useState,useEffect} from "react"
import Info from "./admin/Info"
import Taxes from "./admin/Taxes"
import Liquidity from "./admin/Liquidity"
import Ownership from "./admin/Ownership"
import { FACTORY_CONTRACT } from "@/functions/contracts"
import { readContract } from '@wagmi/core'

const Admin = ({owner,marketInfo,web3Shit,alert,setIsLoading}) => {

    const [activeTab,setActiveTab] = useState("info")
    const [marketId,setMarketId] = useState(0)

    const getMarketId = async () => {
        const id = readContract({
            ...FACTORY_CONTRACT[web3Shit.chain],
            functionName: 'markets',
            args: [marketInfo[1]]
        });
        setMarketId(parseInt(await id))
    }

    useEffect(() => {
        marketInfo[1] && getMarketId()
    }, [marketInfo])
    

    return(
        marketInfo[3] && <>
            <div className={styles.adminWrapper}>
                <div className={styles.adminNav}>
                    <div className={activeTab === "info" ? styles.adminNavActive:null} onClick={()=>setActiveTab("info")}>Info</div>
                    <div className={activeTab === "taxes" ? styles.adminNavActive:null} onClick={()=>setActiveTab("taxes")}>Taxes</div>
                    <div className={activeTab === "liquidity" ? styles.adminNavActive:null} onClick={()=>setActiveTab("liquidity")}>Liquidity</div>
                    <div className={activeTab === "ownership" ? styles.adminNavActive:null} onClick={()=>setActiveTab("ownership")}>Ownership</div>
                </div>
                <div className={styles.adminContent}>
                    {activeTab === "info" && <Info alert={alert} setIsLoading={setIsLoading} marketId={marketId} web3Shit={web3Shit} marketInfo={marketInfo[3]}/>}
                    {activeTab === "taxes" && <Taxes alert={alert} setIsLoading={setIsLoading} web3Shit={web3Shit} marketContract={marketInfo[2]} />}
                    {activeTab === "liquidity" && <Liquidity alert={alert} setIsLoading={setIsLoading} marketInfo={marketInfo}/>}
                    {activeTab === "ownership" && <Ownership owner={owner} alert={alert} setIsLoading={setIsLoading} marketInfo={marketInfo}/>}
                </div>
            </div>
        </>
    )
}

export default Admin