import type { Config, UseChainsReturnType } from 'wagmi'
import { createPublicClient, fromHex, getContract, http, type Address } from 'viem'

import type { ProfileRoles } from '#/types/requests'
import { DEFAULT_CHAIN } from '#/lib/constants/chains'
import { rpcProviders } from '#/lib/constants/rpc-providers'
import { coreEfpContracts } from '#/lib/constants/contracts'
import { efpListRecordsAbi, efpListRegistryAbi } from '#/lib/abi'

export const fetchProfileRoles = async ({
  list,
  userAddress,
  chains
}: {
  list: number | string
  userAddress: Address
  chains: UseChainsReturnType<Config>
}) => {
  const listRegistryContract = getContract({
    address: coreEfpContracts.EFPListRegistry,
    abi: efpListRegistryAbi,
    client: createPublicClient({
      chain: DEFAULT_CHAIN,
      transport: http(rpcProviders[DEFAULT_CHAIN.id])
    })
  })

  const listStorageLocation = await listRegistryContract.read.getListStorageLocation([BigInt(list)])

  const listStorageLocationChainId = fromHex(`0x${listStorageLocation.slice(64, 70)}`, 'number')

  const slot = BigInt(`0x${listStorageLocation.slice(-64)}`)
  const listStorageLocationChain = chains.find(item => item.id === listStorageLocationChainId)
  const listRecordsContractAddress = listStorageLocation
    ? (`0x${listStorageLocation.slice(70, 110)}` as Address)
    : coreEfpContracts.EFPListRecords

  const listRecordsContract = getContract({
    address: listRecordsContractAddress,
    abi: efpListRecordsAbi,
    client: createPublicClient({
      chain: listStorageLocationChain || DEFAULT_CHAIN,
      transport: http(rpcProviders[listStorageLocationChain?.id || DEFAULT_CHAIN.id])
    })
  })

  const listOwner = await listRegistryContract.read.ownerOf([BigInt(list)])
  const listManager = await listRecordsContract.read.getListManager([slot])
  const listUser = await listRecordsContract.read.getListUser([slot])

  return {
    isOwner: listOwner?.toLowerCase() === userAddress?.toLowerCase(),
    isManager: listManager?.toLowerCase() === userAddress?.toLowerCase(),
    isUser: listUser?.toLowerCase() === userAddress?.toLowerCase(),
    listChainId: listStorageLocationChainId
  } as ProfileRoles
}
