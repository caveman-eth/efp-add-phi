import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'

import type { FollowState } from '#/types/common'
import { fetchFollowState } from '#/api/fetchFollowState'
import { useEFPProfile } from '#/contexts/efp-profile-context'

const useFollowingState = ({
  address
}: {
  address?: Address
}) => {
  const { address: userAddress } = useAccount()
  const { selectedList, fetchFreshStats } = useEFPProfile()

  const {
    data: followingStatus,
    isLoading: isFollowingStatusLoading,
    isRefetching: isFollowingStatusRefetching
  } = useQuery({
    queryKey: ['follow state', address, selectedList, fetchFreshStats],
    queryFn: async () => {
      if (!address) return null

      const fetchedProfile = await fetchFollowState({
        address: address,
        userAddress,
        list: selectedList,
        type: 'following',
        fresh: fetchFreshStats
      })
      return fetchedProfile
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false
  })

  const followingState = useMemo((): FollowState => {
    if (!followingStatus?.state) return 'none'

    if (followingStatus.state.block) return 'blocks'
    if (followingStatus.state.mute) return 'mutes'
    if (followingStatus.state.follow) return 'follows'

    return 'none'
  }, [followingStatus])

  const isFollowingStateLoading = isFollowingStatusLoading || isFollowingStatusRefetching

  const followerTag = {
    blocks: {
      text: 'blocks you',
      className: 'text-red-500'
    },
    mutes: {
      text: 'mutes you',
      className: 'text-red-500'
    },
    follows: {
      text: 'follows you',
      className: 'text-darkGray'
    },
    none: {
      text: '',
      className: 'hidden text-darkGray'
    }
  }[followingState]

  return {
    followingState,
    followerTag,
    isFollowingStateLoading
  }
}

export default useFollowingState
