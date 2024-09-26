import { formatQueryParams } from '#/utils/formatQueryParams'
import type { FollowingResponse, InfiniteProfileQueryProps } from '#/types/requests'

export const fetchProfileFollowing = async ({
  addressOrName,
  list,
  limit,
  sort,
  tags,
  pageParam,
  search,
  allResults,
  fresh
}: InfiniteProfileQueryProps) => {
  try {
    const queryParams = formatQueryParams({
      limit,
      offset: pageParam * limit,
      tags,
      term: search,
      sort: sort
        ? {
            'earliest first': 'earliest',
            'latest first': 'latest',
            'follower count': 'followers'
          }[sort]
        : undefined,
      cache: fresh ? 'fresh' : undefined
    })

    const url =
      list !== undefined
        ? `${process.env.NEXT_PUBLIC_EFP_API_URL}/lists/${list}/${
            allResults
              ? 'allFollowing'
              : search && search?.length >= 3
                ? 'searchFollowing'
                : 'following'
          }?${queryParams}`
        : `${process.env.NEXT_PUBLIC_EFP_API_URL}/users/${addressOrName}/${
            allResults
              ? 'allFollowing'
              : search && search?.length >= 3
                ? 'searchFollowing'
                : 'following'
          }?${queryParams}`

    const response = await fetch(url, {
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    const data = (await response.json()).following as FollowingResponse[]
    return {
      following: data ?? [],
      nextPageParam: pageParam + 1
    }
  } catch (err: unknown) {
    return {
      following: [],
      nextPageParam: pageParam + 1
    }
  }
}
