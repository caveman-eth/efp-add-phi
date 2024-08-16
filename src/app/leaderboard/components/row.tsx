import Link from 'next/link'
import type { Address } from 'viem'
import { useTranslation } from 'react-i18next'

import { Avatar } from '#/components/avatar'
import { truncateAddress } from '#/lib/utilities'
import { formatNumber } from '#/utils/formatNumber'
import FollowButton from '#/components/follow-button'
import useFollowState from '#/hooks/use-follow-state'
import { usePathname } from 'next/navigation'

interface TableRowProps {
  address: Address
  name: string | null
  avatar: string | null
  rank: number
  following?: number
  followers?: number
  mutuals?: number
  blockedMuted?: number
}

const TableRow: React.FC<TableRowProps> = ({
  address,
  name,
  avatar,
  rank,
  following,
  followers,
  mutuals,
  blockedMuted
}) => {
  const rankedAs = rank <= 3 ? 'top-three' : rank <= 10 ? 'top-ten' : 'regular'
  const rankNumber = {
    'top-three': (
      <p
        className={`text-2xl xxs:text-3xl sm:text-4xl md:text-5xl ${
          {
            1: 'first-place',
            2: 'second-place',
            3: 'third-place'
          }[rank]
        }
        `}
      >
        {rank}
      </p>
    ),
    'top-ten': (
      <p className='text-2xl xxs:text-3xl text-darkGrey sm:text-4xl md:text-5xl font-bold w-min mx-auto'>
        {rank}
      </p>
    ),
    regular: (
      <p className='text xxs:text-xl sm:text-2xl font-bold w-min mx-auto'>{formatNumber(rank)}</p>
    )
  }[rankedAs]

  // const { data: fetchedEnsProfile } = useQuery({
  //   queryKey: ['ens metadata', address],
  //   queryFn: async () => await resolveEnsProfile(address)
  // })

  const pathname = usePathname()
  const { t } = useTranslation()
  const { followerTag } = useFollowState({
    address,
    type: 'follower'
  })

  const isHome = pathname === '/'
  // const name = fetchedEnsProfile?.name
  // const avatarUrl = fetchedEnsProfile?.avatar

  return (
    <div className='flex items-center w-full gap-4 p-2 sm:p-4 hover:bg-[#ebebeb88] rounded-xl sm:gap-6 md:gap-8 h-[75px]'>
      <div className='tabular-nums min-w-4 w-4 xxs:min-w-6 xxs:w-6 sm:w-10 flex justify-center text-right'>
        {rankNumber}
      </div>
      <div
        className={`flex gap-2 items-center w-[51%] 3xs:w-[54%] xxs:w-[56%] xs:w-2/3 sm:w-1/2 md:w-[40%] ${
          isHome ? ' sm:w-full md:w-1/2 lg:w-[55%] xl:w-1/2' : 'xl:w-1/4 '
        }`}
        data-name='name-column'
      >
        <Avatar
          name={name || address}
          avatarUrl={avatar}
          size='h-[45px] w-[45px] md:h-[50px] md:w-[50px]'
        />
        <div
          className='flex flex-col items-start max-w-[calc(100% - 50px)] md:max-w-[calc(100% - 60px)] truncate justify-center text-left'
          style={{ maxWidth: 'calc(100% - 55px)' }}
        >
          <Link href={`/${name || address}`} className='w-full'>
            <p className='font-bold text-base xxs:text-lg truncate max-w-full hover:opacity-60 hover:text-pink-400'>
              {name || truncateAddress(address)}
            </p>
          </Link>
          <div
            className={`rounded-full font-bold text-[10px] flex items-center justify-center bg-gray-300 h-5 w-20 ${followerTag.className}`}
          >
            {t(followerTag.text)}
          </div>
        </div>
      </div>
      <div
        className={`items-center justify-between hidden sm:flex sm:w-1/4 md:w-[55%] ${
          isHome ? 'sm:w-fit md:w-2/5 lg:w-3/5 xl:w-1/4' : ''
        }`}
      >
        <div className='flex-col items-center w-1/2 lg:w-1/3 xl:w-1/4 hidden lg:flex'>
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(mutuals || 0)}</p>
          <p className='font-semibold text-sm text-gray-500'>Mutuals</p>
        </div>
        <div className='hidden sm:flex flex-col items-center w-1/2 lg:w-1/3 xl:w-1/4'>
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(followers || 0)}</p>
          <p className='font-semibold text-sm text-gray-500'>Followers</p>
        </div>
        <div
          className={`hidden md:flex ${
            isHome ? 'xl:hidden' : ''
          } flex-col items-center w-1/2 lg:w-1/3 xl:w-1/4`}
        >
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(following || 0)}</p>
          <p className='font-semibold text-sm text-gray-500'>Following</p>
        </div>
        <div
          className={`flex-col items-center w-1/2 lg:w-1/3 xl:w-1/4 hidden xl:flex  ${
            isHome ? 'lg:flex xl:hidden' : ''
          } `}
        >
          <p className='font-bold text-sm sm:text-lg'>{formatNumber(blockedMuted || 0)}</p>
          <p className='font-semibold text-sm text-gray-500'>Blocked</p>
        </div>
      </div>
      <div
        className={`w-fit ${
          isHome ? 'lg:w-[25%] 2xl:w-[20%]' : 'lg:w-[15%] 2xl:w-[10%]'
        } flex justify-end`}
      >
        <FollowButton address={address} />
      </div>
    </div>
  )
}

export default TableRow
