import styles from "@/styles/navbar.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState,useEffect } from "react";
import { isAddress } from "viem";
import { readContract } from "@wagmi/core";
import { publicClient } from "@/components/Web3/Web3Modal";
import ABI from "@/functions/contracts/ABI.json"
import {FACTORY_CONTRACT} from "@/functions/contracts"
import { formatUnits } from "viem";
import formatETH from "@/functions/formatETH";
import Link from "next/link";
import BLOCKSCOUT from "@/blockscout.json"


const SearchBar = ({web3Shit,setIsLoading}) => {

    const [search,setSearch] = useState("")
    const [result,setResults] = useState([])

    const handleInput = (value) => {
        setSearch(value.toString());
    };

    const masterSearch = async (address) => {

        const registrySearch = await searchRegistry(address)

        const verifiedSearch = await searchVerifiedMarkets(await fetchVerifiedMarkets(),address)

        if(isAddress(address)){
            setResults([registrySearch])
        } else {
            setResults(verifiedSearch)
        }
    }

    const searchRegistry = async (address) => {
        if (!isAddress(address)) {
            setResults([]);
            return;
        }
    
        try {
            const idCheck = await getMarketId(address);
    
            if (parseInt(idCheck) === 0) {
                return await handleNonMarketNFT(address);
            } else {
                return await handleMarketNFT(idCheck,address);
            }
    
        } catch (e) {
            console.log(e);
            handleSearchError();
        }
    };

    const searchVerifiedMarkets = async (jsonData, address) => {
        const results = [];
        if (jsonData) {
            for (const key in jsonData) {
                const markets = jsonData[key];
                for (const item of markets) {
                    const data = {};
                    const getMarketFloor = await readContract({
                        address: item.contracts.market,
                        abi: ABI.market,
                        functionName: 'getFloorPrice'
                    });
                    const getMarketVolume = await readContract({
                        address: item.contracts.market,
                        abi: ABI.market,
                        functionName: 'volume'
                    });
                    
                    if (item.name && (item.name.toLowerCase().includes(address.toLowerCase()))) {
                        data.market = true;
                        data.contract = item.contracts.market;
                        data.image = item.image;
                        data.marketName = item.name;
                        data.volume = getMarketVolume;
                        data.floor = getMarketFloor;
                        results.push(data);
                    }
                }
            }
        }
        return results;
    };
    

    const fetchVerifiedMarkets = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/KingSimpa69/markets/main/markets.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching market data:', error);
            return null;
        }
    };
    
    const getMarketId = async (address) => {
        const result = await readContract({
            ...FACTORY_CONTRACT[web3Shit.chain],
            functionName: 'markets',
            args: [address]
        });
        return result;
    };
    
    const handleNonMarketNFT = async (address) => {
        try {
            const getNftName = await readContract({
                address: address,
                abi: ABI.erc721,
                functionName: 'name'
            });
            const getNFT0 = await fetch(`${BLOCKSCOUT[web3Shit.chain]}/api/v2/tokens/${address}/instances/${1}`);
            const data = await getNFT0.json();
            console.log(data)
            return(
                {
                    market: false,
                    image: data.image_url === null ? "/images/eth.svg" : data.image_url,
                    name: getNftName
                }
            );
        } catch (error) {
            console.log(error);
            return handleSearchError();
        }
    };
    
    const handleMarketNFT = async (idCheck,address) => {
        try {
            const getMarketDeets = await readContract({
                ...FACTORY_CONTRACT[web3Shit.chain],
                functionName: 'getMarketData',
                args: [idCheck]
            });
    
            const getMarketFloor = await readContract({
                address: getMarketDeets.marketContract,
                abi: ABI.market,
                functionName: 'getFloorPrice'
            });
    
            const getMarketVolume = await readContract({
                address: getMarketDeets.marketContract,
                abi: ABI.market,
                functionName: 'volume'
            });

            const getNFT0 = await fetch(`${BLOCKSCOUT[web3Shit.chain]}/api/v2/tokens/${address}/instances/${1}`);
            const {image_url} = await getNFT0.json();
    
            return(
                {
                    market: true,
                    contract: getMarketDeets.marketContract,
                    image: getMarketDeets.logo === "" ? image_url : getMarketDeets.logo,
                    marketName: getMarketDeets.name,
                    volume: getMarketVolume,
                    floor: getMarketFloor
                }
            );
        } catch (error) {
            console.log(error);
            return handleSearchError();
        }
    };
    
    const handleSearchError = () => {
        return(
            {
                market: false,
                image: "/images/eth.svg",
                name: "Error loading NFT contract"
            }
        );
    };    

    useEffect(() => {
        search !== "" ? masterSearch(search) : setResults([])
    }, [search])
    
    return(
        <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
            <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
            <input value={search} onChange={(e)=>handleInput(e.target.value)} placeholder={'Search for NFT smart contract'} type={'text'} />
        </div>
        <div className={styles.searchResults}>
            {result.length > 0 && result.map((e,index)=>{
                if (e.market === true) { 
                return(
                <Link key={index} href={`/market/${e.contract}`}>
                    <div onClick={()=>{setSearch(""),setIsLoading(true)}} className={styles.searchResult}>
                        <img src={e.image}/>
                        <h1>{e.marketName}</h1>
                        <div>
                            <div>
                                <div>
                                {formatETH(formatUnits(e.volume,18))}
                                <img height={15} width={15} src={'/images/eth.svg'} />
                                </div>
                                <p>Volume</p>
                            </div>
                            <div>
                                <div>
                                {formatETH(formatUnits(e.floor,18))}
                                <img height={15} width={15} src={'/images/eth.svg'} />
                                </div>
                                <p>Floor</p>
                            </div>
                        </div>
                    </div>
                </Link>
                )} else {
                    return(
                    <Link key={index} href={`/create/${search}`}>
                    <div onClick={()=>{setSearch(""),setIsLoading(true)}} className={styles.searchResult}>
                        <img src={e.image}/>
                        <h1>{e.name}</h1>
                        <div className={styles.noMarket}>
                            Market Not Found
                        </div>
                    </div>
                    </Link>
                    )
                }
            })}
        </div>
        </div>
    )
}

export default SearchBar