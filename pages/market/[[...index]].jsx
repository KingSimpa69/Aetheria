import styles from "@/styles/market.module.css"
import { useEffect,useState } from "react"
import { readContract } from '@wagmi/core'
import { MARKET_CONTRACT } from '@/functions/contracts'
import ABI from "@/functions/contracts/ABI.json"
import { isAddress } from "viem"
import MarketInfo from "@/components/Market/MarketInfo"
import Wallet from "@/components/Market/Wallet"
import Listed from "@/components/Market/Listed"
import MatrixLoadingScreen from "@/components/LoadingScreen"
import BuyModal from "@/components/Market/BuyModal"
import ManageModal from "@/components/Market/ManageModal"
import { useWeb3Modal } from '@web3modal/wagmi/react'

const Market = ({web3Shit, router, alert}) => {

    const { open:w3m } = useWeb3Modal()
    const [marketInfo,setMarketInfo] = useState([])
    const [view,setView] = useState("market")
    const [validMarket,setValidMarket] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const [spotlight,setSpotlight] = useState({})
    const [buyModal,toggleBuyModal] = useState(false)
    const [manageModal,toggleManageModal] = useState(false)
    const [listed,setListed] = useState([])
    const [owned,setOwned] = useState([])
    const [prices,setPrices] = useState({})
 
    const getNFTContract = async (marketAddress) => {
        try{
            const data = await readContract({
                abi:ABI.market,
                address:marketAddress,
                functionName: 'nftContract',
              })
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const getName = async (nftAddress) => {
        try{
            const data = await readContract({
                abi:ABI.erc721,
                address:nftAddress,
                functionName: 'name',
              })
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const isMarket = async (contract) => {
        try{
            const data = await readContract({
                abi:ABI.market,
                address:contract,
                functionName: 'nftContract',
              })
              //console.log(data)
            return !!data
        } catch (error) {
            //console.log(error)
            return false
        }
    }

    useEffect(() => {
        const checkMarketValidity = async () => {
            if (router.query.index) {
                const isAddr = isAddress(router.query.index[0]);
                const isMark = await isMarket(router.query.index[0]);
                setValidMarket(isAddr && isMark);
                //console.log(isMark)
            }
        };
        checkMarketValidity();
    }, [router])

    useEffect(()=>{
        const getInfo = async (marketContract) => {
            const nftContract = await getNFTContract(marketContract);
            const name = await getName(nftContract);
            setMarketInfo([
                name,
                nftContract,
                marketContract
            ])
        }
        validMarket && getInfo(router.query.index[0])
    },[validMarket,router.query.index])

    useEffect(()=>{
        Object.keys(prices).length !== 0 && console.log(prices)
    },[prices])

    return(
        <div className={'wrapper'}>
            <MatrixLoadingScreen isLoading={isLoading}/>
            <BuyModal alert={alert} setListed={setListed} w3m={w3m} setIsLoading={setIsLoading} prices={prices} web3Shit={web3Shit} marketInfo={marketInfo} toggleBuyModal={toggleBuyModal} buyModal={buyModal} spotlight={spotlight} />
            <ManageModal alert={alert} owned={owned} setOwned={setOwned} listed={listed} setListed={setListed} setIsLoading={setIsLoading} web3Shit={web3Shit} marketInfo={marketInfo} spotlight={spotlight} setSpotlight={setSpotlight} manageModal={manageModal} toggleManageModal={toggleManageModal} />
            <MarketInfo view={view} setView={setView} marketInfo={marketInfo} />
            
            {view === "wallet" && <Wallet owned={owned} setOwned={setOwned} setSpotlight={setSpotlight} toggleManageModal={toggleManageModal} setIsLoading={setIsLoading} marketInfo={marketInfo} web3Shit={web3Shit} />}
            {view === "market" && <Listed setPrices={setPrices} listed={listed} setListed={setListed} toggleBuyModal={toggleBuyModal} setSpotlight={setSpotlight} web3Shit={web3Shit} setIsLoading={setIsLoading} isValid={validMarket} marketInfo={marketInfo}/> }    

            {!validMarket && <div className={styles.notFound}>404 Market Not Found</div>} 
        </div>
    )
}

export default Market