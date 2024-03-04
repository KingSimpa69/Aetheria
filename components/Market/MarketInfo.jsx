import styles from "@/styles/market.module.css"
import ViewSwitcher from "./ViewSwitcher"
import MarketInfoItem from "./MarketInfoItem"
import { useEffect, useState } from "react"
import BLOCKSCOUT from "@/blockscout.json"
import { isAddress } from "viem"
import Image from "next/image"

const MarketInfo = ({web3Shit, marketInfo, view, setView}) => {

    const [marketLogo,setMarketLogo] = useState("")

    useEffect(() => {
        console.log(marketInfo)
        const getZeroMeta = async () => {
            try{
                const result = await fetch(`${BLOCKSCOUT[web3Shit.chain]}/api/v2/tokens/${marketInfo[1]}/instances/${0}`);
                const data = await result.json();
                setMarketLogo(data.image_url)
            } catch (e) {
                console.log(e)
            }
        }

        web3Shit.chain && isAddress(marketInfo[1]) && getZeroMeta()
    }, [marketInfo])
    

    return(
        <div className={`flexCol`}>
            <div className={`flexRow ${styles.marketInfo}`}>
                <div className={styles.marketMeta}>
                    <div className={styles.imgAndLinks}>
                        <div className={styles.marketPfp}>
                            <Image src={marketLogo} fill sizes="100%"/>
                        </div>
                        <div>
                            <div className={styles.marketTitle}>{marketInfo[0]}</div>
                            <div>I I I I</div>
                        </div>
                    </div>

                    <div>
                        100% Community run Based Fellas is the first ever 10k PFP project on the Base L2 chain by Coinbase. We have a unique and diverse trait selection of over 180+ traits. Generated together, these make up the Based Fellas collection.
                        Own a piece of Base history by grabbing a couple fellas & come connect with us in Discord and check out our community! 
                    </div>
                </div>
                <MarketInfoItem kee={'Volume'} value={'98 ETH'} />
                <MarketInfoItem kee={'Floor'} value={'0.02 ETH'} />
                <MarketInfoItem kee={'Listed'} value={'7.2 %'} />
                <MarketInfoItem kee={'Liquidity Pool'} value={'0.001 ETH'} />
                <MarketInfoItem kee={'Holders (Unique)'} value={'2000 (32%)'} />
            </div>
            <ViewSwitcher view={view} setView={setView} />
        </div>
    )

}

export default MarketInfo