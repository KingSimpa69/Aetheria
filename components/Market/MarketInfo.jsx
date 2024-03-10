import styles from "@/styles/market.module.css"
import ViewSwitcher from "./ViewSwitcher"
import MarketInfoItem from "./MarketInfoItem"
import { useEffect, useState } from "react"
import BLOCKSCOUT from "@/blockscout.json"
import { isAddress } from "viem"
import Image from "next/image"
import { FACTORY_CONTRACT } from "@/functions/contracts"
import ABI from "@/functions/contracts/ABI.json"
import { readContract } from '@wagmi/core'
import SocialIcon from "./SocialIcon"
import { formatUnits } from "viem"
import formatETH from "@/functions/formatETH"
import { publicClient } from "../Web3/Web3Modal"
import delay from "@/functions/delay"

const MarketInfo = ({marketOwner,isLoading, setIsLoading,web3Shit, marketInfo, setMarketInfo, view, setView, firstRun,setFirstRun}) => {


    const [marketLogo,setMarketLogo] = useState("")
    const [marketCover,setMarketCover] = useState("")

    const holders = async () => {
        const result = await fetch(`${BLOCKSCOUT[web3Shit.chain]}/api/v2/tokens/${marketInfo[1]}`);
        const data = await result.json();
        return data.holders
    }

    const getDefaultLogo = async () => {
        try{
            const result = await fetch(`${BLOCKSCOUT[web3Shit.chain]}/api/v2/tokens/${marketInfo[1]}/instances/${1}`);
            const data = await result.json();
            setMarketLogo(data.image_url)
            
        } catch (e) {
            console.log(e)
        }
    }

    const logoAndCoverSet = (logo,cover) => {
        logo !== "" ? setMarketLogo(logo) : getDefaultLogo()
        cover !== "" ? setMarketCover(cover) : setMarketCover(null)
    }

    const getMarktData = async () => {
        console.log("Pulling data")
        try {
            const idPromise = readContract({
                ...FACTORY_CONTRACT[web3Shit.chain],
                functionName: 'markets',
                args: [marketInfo[1]]
            });
    
            const dataPromise = idPromise.then(id => readContract({
                ...FACTORY_CONTRACT[web3Shit.chain],
                functionName: 'getMarketData',
                args: [parseInt(id)]
            }));
    
            const [id, data] = await Promise.all([idPromise, dataPromise]);
    
            const [volume, floor, listed, totalSupply, lpBalance, holdersData] = await Promise.all([
                readContract({
                    address: marketInfo[2],
                    abi: ABI.market,
                    functionName: 'volume'
                }),
                readContract({
                    address: marketInfo[2],
                    abi: ABI.market,
                    functionName: 'getFloorPrice'
                }),
                readContract({
                    address: marketInfo[2],
                    abi: ABI.market,
                    functionName: 'getListedTokens'
                }).then(listed => listed.length),
                readContract({
                    address: marketInfo[1],
                    abi: ABI.erc721,
                    functionName: 'totalSupply'
                }),
                publicClient.getBalance({ address: marketInfo[2] }),
                holders()
            ]);
            
            if (data) {
                logoAndCoverSet(data.logo,data.cover)
                setMarketInfo(prev => [
                    prev[0],
                    prev[1],
                    prev[2],
                    data,
                    {
                        volume,
                        floor,
                        listed,
                        supply: totalSupply,
                        lp: lpBalance,
                        holders: parseInt(holdersData)
                    }
                ]);
            }
        } catch (error) {
            console.error("Error in getMarktData:", error);
        } finally {
            if (!firstRun) {
                setFirstRun(true)
            }
        }
    };
    
    useEffect(() => {
        firstRun && setIsLoading(false)
    }, [marketInfo,firstRun]);

    useEffect(() => {
        if (!isLoading && firstRun && web3Shit.chain && isAddress(marketInfo[1]) && isAddress(marketInfo[2])) {
            getMarktData()
        }
    }, [isLoading])

    useEffect(() => {
        !firstRun && marketInfo[2] && getMarktData()
    }, [marketInfo])
    

    return(
        marketLogo !== "" && marketInfo[3] && <div className={`flexCol`} style={{width:"100%"}}>
            <div className={`flexRow ${styles.marketInfo}`} style={{background: marketCover !== "" ? `url(${marketCover})` : 'none'}}>
                <div className={styles.marketMeta}>
                    <div className={styles.imgAndLinks}>
                        <div className={styles.marketPfp}>
                            <Image src={marketLogo} alt={'Project-logo'} fill sizes="100%"/>
                        </div>
                        <div>
                            <div className={styles.marketTitle}>{marketInfo[3].name !== "" ? marketInfo[3].name : marketInfo[0]}</div>
                            <div className={`flexRow ${styles.socials}`}>
                                {marketInfo[3].website !== "" && <SocialIcon link={marketInfo[3].website} icon={'fa-solid fa-globe'} />}
                                {marketInfo[3].x !== "" && <SocialIcon link={marketInfo[3].x} icon={'fa-brands fa-x-twitter'} />}
                                {marketInfo[3].discord !== "" && <SocialIcon link={marketInfo[3].discord} icon={'fa-brands fa-discord'} />}
                                {marketInfo[3].telegram !== "" && <SocialIcon link={marketInfo[3].telegram} icon={'fa-brands fa-telegram'} />}
                                {marketInfo[3].github !== "" && <SocialIcon link={marketInfo[3].github} icon={'fa-brands fa-github'} />}
                            </div>
                        </div>
                    </div>

                    <div>{marketInfo[3].description !== "" && marketInfo[3].description}</div>
                </div>
                <MarketInfoItem kee={'Volume'} value={formatETH(formatUnits(marketInfo[4].volume,18))} />
                <MarketInfoItem kee={'Floor'} value={formatETH(formatUnits(marketInfo[4].floor,18))} />
                <MarketInfoItem kee={'Listed'} supply={parseInt(marketInfo[4].supply)} value={marketInfo[4].listed} />
                <MarketInfoItem kee={'Liquidity Pool'} value={formatETH(formatUnits(marketInfo[4].lp,18))} />
                <MarketInfoItem kee={'Holders (Unique)'} supply={parseInt(marketInfo[4].supply)} value={marketInfo[4].holders} />
            </div>
            <ViewSwitcher web3Shit={web3Shit} owner={marketOwner} view={view} setView={setView} />
        </div>
    )

}

export default MarketInfo