import { ethers } from 'ethers'

/**
 * Returns an ethers JsonRpcProvider for the requested chain.
 * RPC URLs are loaded from environment variables named `RPC_{CHAIN_ID}`.
 */
export function getProvider(chainId: number): ethers.providers.JsonRpcProvider {
  const rpcUrl = process.env[`RPC_${chainId}`]
  if (!rpcUrl) {
    throw new Error(`No RPC URL configured for chain ${chainId}`)
  }
  return new ethers.providers.JsonRpcProvider(rpcUrl)
}
