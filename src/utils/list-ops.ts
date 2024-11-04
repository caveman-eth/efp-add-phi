import { fromHex, toHex, type Address } from 'viem'
import type { ListOp, TagListOp } from '#/types/list-op'

export const listOpAddListRecord = (address: Address): ListOp => {
  return {
    version: 1,
    opcode: 1,
    data: address
  }
}

export const listOpRemoveListRecord = (address: Address): ListOp => {
  return {
    version: 1,
    opcode: 2,
    data: address
  }
}

export const listOpAddTag = (address: Address, tag: string): ListOp => {
  return {
    version: 1,
    opcode: 3,
    data: `${address}${toHex(tag).slice(2)}`
  }
}

export const listOpRemoveTag = (address: Address, tag: string): ListOp => {
  return {
    version: 1,
    opcode: 4,
    data: `${address}${toHex(tag).slice(2)}`
  }
}

// Extract address and tag from a ListOp add/remove tag data
export const extractAddressAndTag = (listOp: TagListOp): { address: Address; tag: string } => {
  const address = listOp.data.slice(0, 42) as Address
  const tag = fromHex(`0x${listOp.data.slice(42)}`, 'string')

  return { address, tag }
}

// Type guard to check if a ListOp is a TagListOp
export const isTagListOp = (listOp: ListOp): listOp is TagListOp => {
  return listOp.opcode === 3 || listOp.opcode === 4
}
