import styles from "@/styles/market.module.css"
import { useEffect,useState } from "react"
import BLOCKSCOUT from "@/blockscout.json"
import Image from "next/image"
import { readContract,writeContract } from '@wagmi/core'
import ABI from "@/functions/contracts/ABI.json"
import formatETH from "@/functions/formatETH"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const ListedItem = ({id,marketInfo,web3Shit,setSpotlight,setPrices}) => {

    const [theShit,setTheShit] = useState({})

    useEffect(()=>{
        const getTheShit = async () => {
            const price = await readContract({
                abi:ABI.market,
                address:marketInfo[2],
                functionName: 'price',
                args:[id]
              })
            setPrices(preev=>({...preev,[id]:price}))
            const result = await fetch(`${BLOCKSCOUT[web3Shit.chain]}/api/v2/tokens/${marketInfo[1]}/instances/${id}`);
            const data = await result.json();
            setTheShit({
                id:data.id,
                image:data.image_url,
                metadata:data.metadata,
                owner:data.owner.hash,
                price:price
            })
        }
        getTheShit()
    },[id,web3Shit])

    return(
        theShit.image && <div className={styles.item}>
            <div onClick={()=>setSpotlight(theShit)}><Image priority alt={theShit.id} src={theShit.image} width={195} height={195} /></div>
            <div className={styles.priceTag}>
            <FontAwesomeIcon icon="fa-solid fa-tag" /><div>{`${formatETH((parseFloat(theShit?.price)/10**18))} ETH`}</div>
            </div>
        </div>
    )
}

export default ListedItem