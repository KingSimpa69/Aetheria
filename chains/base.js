import { defineChain } from 'viem'

export const Base = defineChain({
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://base-mainnet.public.blastapi.io'],
      webSocket: ['wss://base-mainnet.public.blastapi.io'],
    },
    public: {
      http: ['https://base-mainnet.public.blastapi.io'],
      webSocket: ['wss://base-mainnet.public.blastapi.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://base.blockscout.com' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5022,
    },
  },
})

export const BaseSepolia = defineChain({
  id: 84532,
  name: 'Base-Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
      webSocket: ['wss://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
      webSocket: ['wss://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://base-sepolia.blockscout.com' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1059647,
    },
  },
})