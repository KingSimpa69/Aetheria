import styles from "@/styles/market.module.css"
import Image from "next/image"
import Stat from "./Stat"
import { shortenEthAddy } from "@/functions/shortenEthAddy"
import ImageLoader from "../ImageLoader"
import ABI from "@/functions/contracts/ABI.json"
import { writeContract, readContract } from '@wagmi/core'
import { isAddress } from "viem"
import formatETH from "@/functions/formatETH"
import { publicClient } from "../Web3/Web3Modal"
import delay from "@/functions/delay"
import {useState,useEffect} from 'react'

const BuyModal = ({spotlight,buyModal,toggleBuyModal,web3Shit,marketInfo,prices,setIsLoading,w3m,setListed,alert}) => {

    const [css0,setCss0] = useState("")
    const [css1,setCss1] = useState("hidden")

    const getListed = async () => {
        const data = await readContract({
            abi:ABI.market,
            address:marketInfo[2],
            functionName: 'getListedTokens',
          })
          //console.log(data)
          setListed(data)
    }

    const buy = async () => {
        try{
            const data = await writeContract({
                abi:ABI.market,
                address:marketInfo[2],
                functionName: 'buy',
                args: [spotlight.id],
                value: prices[spotlight.id]
              })
              setIsLoading(true)
              const confirmation = await publicClient.waitForTransactionReceipt({ hash: data.hash,confirmations: 1})
              if (confirmation.status === "success") {
                alert("success","Transaction Confirmed",data.hash)
                setIsLoading(false);
                await delay(420)
                toggleBuyModal(false)
                await delay(420)
                getListed()
              } else {
                  console.log("Transaction was not successful");
                  alert("error","error")
              }
        } catch (error) {
            setIsLoading(false)
            error.toString() === "ConnectorNotFoundError: Connector not found" && w3m({view:'Connect'})
            alert("error","error")
        }
    }

    const delist = async () => {
        try{
            const data = await writeContract({
                abi:ABI.market,
                address:marketInfo[2],
                functionName: 'delist',
                args: [spotlight.id]
              })
              setIsLoading(true)
              const confirmation = await publicClient.waitForTransactionReceipt({ hash: data.hash,confirmations: 1})
              if (confirmation.status === "success") {
                  setIsLoading(false);
                  alert("success","Transaction Confirmed",data.hash)
                  await delay(1000)
                  getListed()
                  toggleBuyModal(false)
              } else {
                  console.log("Transaction was not successful");
                  alert("error","error")
              }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
            alert("error","error")
        }
    }

    useEffect(() => {
        const closeModal = async() => {
            setCss0("animate__animated animate__bounceOutUp animate__faster")
            await delay(420)
            setCss1("hidden")
        }
        const openModal = async() => {
            setCss1("modalWrapper")
            setCss0("animate__animated animate__bounceInDown animate__faster")
        }
        buyModal ? openModal() : closeModal()
    }, [buyModal])

    return spotlight.image !== undefined && (
        <div onClick={()=>{toggleBuyModal(!buyModal)}} className={`${styles[css1]} ${css0}`}>
            <div onClick={(e)=>e.stopPropagation()} className={styles.modalContainer}>
                <div className={styles.modalImage}>
                    <ImageLoader alt={spotlight.id} src={spotlight.image} fill={true} />
                </div>
                <div className={`flexCol ${styles.statCol}`}>
                    <Stat stat={'Name'} value={spotlight.metadata.name} />
                    <Stat stat={'Owner'} value={spotlight.owner === web3Shit.address ? "You" : shortenEthAddy(spotlight.owner)} />
                    <Stat stat={'Price'} value={formatETH(parseInt(prices[spotlight.id])/10**18) + " ETH"} />
                    <div className={styles.attributes}>
                        {spotlight.metadata.attributes.map((e,index)=>{
                            return(
                                <div key={index} className={styles.attribute}>
                                    <div>{e.trait_type}</div>
                                    <div className={styles.traitValue}>{e.value}</div>
                                </div>
                            )
                        })}
                    </div>
                    {web3Shit.address === spotlight.owner ?<div onClick={()=>delist()} className={styles.buyButton}>Delist</div> : <div onClick={()=>buy()} className={styles.buyButton}>Buy</div>}
                </div>
            </div>
        </div>
    )
}

export default BuyModal