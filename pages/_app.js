import "@/styles/globals.css";
import 'animate.css';
import { useState, useEffect } from "react";
import AetheriaGlow from "@/components/AetheriaGlow";
import HeadMeta from "@/components/HeadMeta";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/router";
const { library, config } = require('@fortawesome/fontawesome-svg-core');
import { faGithub, faDiscord, faLinkedin, faXTwitter, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faCopy} from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass, faWallet, faStore, faTag, faXmark, faInfo, faThumbsUp, faGlobe, faSliders  } from '@fortawesome/free-solid-svg-icons';
import { Web3Modal } from "@/components/Web3/Web3Modal";
import Alert from "@/components/Alert";
import MatrixLoadingScreen from "@/components/LoadingScreen";
library.add(faWallet,faStore,faMagnifyingGlass,faTag,faXmark,faInfo,faThumbsUp, faGlobe, faXTwitter, faGithub, faDiscord, faTelegram, faSliders)
config.autoAddCss = false;

export default function App({ Component, pageProps }) {

  const [web3Shit, setWeb3Shit] = useState({chain: 0, address: undefined, isConnected: false})
  const router = useRouter();
  const [alerts,setAlerts] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  const alert = (type,message,tx) => {
    setAlerts(alerts=>[...alerts,{
      type:type,
      message:message,
      tx:tx
    }])
  }
  
  useEffect(() => {
    web3Shit.chain !== 0 ? console.log(web3Shit) : null
  }, [web3Shit])  

  return (
    <Web3Modal>
      <MatrixLoadingScreen isLoading={isLoading}/>
      <HeadMeta />
      <Alert web3Shit={web3Shit} alerts={alerts} setAlerts={setAlerts} />
      <AetheriaGlow />
      <NavBar setIsLoading={setIsLoading} config={config} router={router} web3Shit={web3Shit} setWeb3Shit={setWeb3Shit}/>
      <Component isLoading={isLoading} setIsLoading={setIsLoading} router={router} web3Shit={web3Shit} {...pageProps} alert={alert} />
    </Web3Modal>
  )

}