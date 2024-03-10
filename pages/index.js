import { useEffect } from "react"

const Index = ({router,setIsLoading,isLoading}) => {

    useEffect(() => {
        isLoading && setIsLoading(false)
    }, [isLoading])
    

    return(
        <div className={'wrapper'}>
            <div className={'welcome'}>Type an NFT smart contract into the search bar to begin</div>
        </div>
    )
}

export default Index