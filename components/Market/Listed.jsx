import styles from "@/styles/market.module.css"
import { useState,useEffect } from "react"
import ABI from "@/functions/contracts/ABI.json"
import { readContract } from '@wagmi/core'
import ListedItem from "./ListedItem"

const Listed = ({marketInfo,isValid,setIsLoading,web3Shit,setSpotlight,toggleBuyModal,listed,setListed,setPrices}) => {

    useEffect(() => {
        const getListed = async () => {
            const data = await readContract({
                abi:ABI.market,
                address:marketInfo[2],
                functionName: 'getListedTokens',
              })
              //console.log(data)
              setListed(data)
              setIsLoading(false)
        }
        isValid && marketInfo.length > 2 && getListed()
    }, [marketInfo,isValid,setIsLoading])

    return( listed.length === 0 ? <div className={styles.notFound}>No NFTs for sale!</div> : isValid && <div className={`flexRow ${styles.itemCont}`}>{
            
            listed.map((e,index)=>{
                return(
                    <div onClick={()=>toggleBuyModal(true)} key={index}>
                        <ListedItem setPrices={setPrices} web3Shit={web3Shit} marketInfo={marketInfo} id={e} setSpotlight={setSpotlight} />
                    </div>  
                )
            }) }</div>
    )
}

export default Listed