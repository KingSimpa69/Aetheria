import { useEffect, useState } from "react"
import styles from "@/styles/create.module.css"
import { isAddress } from "viem"
import NoRouteQuery from "@/components/Create/NoRouteQuery.jsx"
import { readContract } from "@wagmi/core";
import { publicClient } from "@/components/Web3/Web3Modal";
import ABI from "@/functions/contracts/ABI.json"
import {FACTORY_CONTRACT} from "@/functions/contracts"
import MarketExists from "@/components/Create/MarketExists";
import CreateMarket from "@/components/Create/CreateMarket";

const Create = ({web3Shit, router, alert, isLoading, setIsLoading}) => {

    const [exists,setExists] = useState(false)
    const [valid,setIsValid] = useState(false)
    const [marketContract,setMarketContract] = useState("")
    const [nftName,setNftName] = useState("")

    const marketExists = async() => {
        try {
            const result = await readContract({
                ...FACTORY_CONTRACT[web3Shit.chain],
                functionName: 'markets',
                args: [router.query.index[0]]
            });
            const {marketContract,name} = await readContract({
                ...FACTORY_CONTRACT[web3Shit.chain],
                functionName: 'getMarketData',
                args: [(result)]
            });
            marketContract && setMarketContract(marketContract)
            name && setNftName(name)
            parseInt(result) === 0 ? setExists(false) : setExists(true)
        } catch (error) {

        } finally {
            isValidNft()
        }
    }

    const isValidNft = async() => {
        try {
            const getNftName = await readContract({
                address: router.query.index[0],
                abi: ABI.erc721,
                functionName: 'name'
            });
            getNftName && setIsValid(true)
            getNftName && setNftName(getNftName) 
        } catch (error) {
            setIsValid(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        router.query.index && router.query.index[0] && marketExists()
    }, [router])  

    return(
        <div className={!isLoading ? 'wrapper' : 'hidden'}>
            {
            router.query.index && isAddress(router.query.index[0]) && !exists && valid ? <CreateMarket alert={alert} setIsLoading={setIsLoading} nftContract={router.query.index[0]} web3Shit={web3Shit} name={nftName}/> :
            router.query.index && isAddress(router.query.index[0]) && exists ? <MarketExists name={nftName} contract={marketContract} /> :
            <NoRouteQuery />
            }
        </div>

    )
}

export default Create