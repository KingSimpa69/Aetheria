export const shortenEthAddy = (addy) => {
    const shorty = addy.slice(0,5) + "..." + addy.slice(37,41)
    return shorty
}