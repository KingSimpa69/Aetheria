import "@/styles/globals.css";
import AetheriaGlow from "@/components/AetheriaGlow";
import HeadMeta from "@/components/HeadMeta";

export default function App({ Component, pageProps }) {
  return (
    <>
    <HeadMeta />
    <AetheriaGlow />
    <Component {...pageProps} />
    </>
  )

}
