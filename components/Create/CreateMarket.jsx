import styles from "@/styles/create.module.css"
import HorizontalRule from "../HorizontalRule"
import Link from "next/link"
import { writeContract } from '@wagmi/core'
import { publicClient } from "@/components/Web3/Web3Modal"
import { FACTORY_CONTRACT } from "@/functions/contracts"
import { useEffect, useState } from "react"

const CreateMarket = ({ web3Shit, name, nftContract, setIsLoading, alert }) => {

    const [marketAddress, setMarketAddress] = useState("")

    const createMarket = async (address) => {
        try {
            const deploy = await writeContract({
                ...FACTORY_CONTRACT[web3Shit.chain],
                functionName: 'createMarket',
                args: [address, "", "", "", "", "", ""],
                value: 1000000000000000
            });
            setIsLoading(true)
            const confirmation = await publicClient.waitForTransactionReceipt({ hash: deploy.hash, confirmations: 3 })
            if (confirmation.status === "success") {
                console.log(confirmation.logs[0].address)
                setMarketAddress(confirmation.logs[0].address)
                alert("success", "Market deployed", deploy.hash)
                setIsLoading(false);
            }
        } catch (e) {
            alert("error", "Market deploy failed")
            console.log(e)
        }
    }

    useEffect(() => {
        console.log(marketAddress)
    }, [marketAddress])
    

    return (
        <div className={styles.container}>
            <div className={styles.header}>{name} Market</div>
            <HorizontalRule />
            <div className={styles.checkParams}>Welcome to the market deployment page!</div>
            <div className={styles.checkParams}>This page allows anyone to create a market for any NFT project.</div>
            <div className={styles.checkParams}>Anyone can create the market, but only the NFT contract owner can manage the market.</div>
            <HorizontalRule />
            {marketAddress === "" ? (
                <div onClick={() => createMarket(nftContract)} className={styles.deployButton}>Deploy</div>
            ) : (
                <div className={styles.checkParams} style={{ marginTop: "15px", color: "var(--buttonColor)", fontSize: "12px" }}>
                    <Link href={`/market/${marketAddress}`}>{`aetheria.market/market/${marketAddress}`}</Link>
                </div>
            )}
        </div>
    )
}

export default CreateMarket;
