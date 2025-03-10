'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { usePathname } from 'next/navigation'
import { useClickAway } from '@uidotdev/usehooks'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import Menu from './menu'
import { cn } from '#/lib/utilities'
import { EXTERNAL_LINKS, NAV_ITEMS } from '#/lib/constants'
import { useEFPProfile } from '#/contexts/efp-profile-context'

const NavItems = () => {
  const pathname = usePathname()
  const { address: userAddress } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { selectedList, lists } = useEFPProfile()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const clickAwayRef = useClickAway<HTMLDivElement>((_) => {
    setMobileMenuOpen(false)
  })

  const itemUrl =
    selectedList === Number(lists?.primary_list) && pathname !== `/${selectedList}`
      ? userAddress?.toLowerCase()
      : (selectedList?.toString() ?? userAddress?.toLowerCase())
  const itemIndex = EXTERNAL_LINKS.find((link) => link.href === pathname)
    ? 4
    : NAV_ITEMS.findIndex((item) => item.href(itemUrl) === pathname)

  return (
    <div ref={clickAwayRef} className='relative'>
      <div className='z-40 bg-neutral/80 backdrop-blur-xl flex flex-row items-center pr-0.5 h-[54px] border-[3px] border-grey hover:border-text transition-all rounded-full'>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.name}
            className='z-10 px-0.5 group/nav-item'
            href={item.href(itemUrl)}
            prefetch={true}
            onClick={(e) => {
              if ((item.name === 'profile' || item.name === 'feed') && !userAddress && openConnectModal) {
                e.preventDefault()
                openConnectModal()
              }

              setMobileMenuOpen(false)
            }}
          >
            <item.icon
              className={cn(
                'px-2 w-11 h-11 font-bold text-[28px] z-50 group-hover/nav-item:scale-110 transition-all cursor-pointer',
                item.href(itemUrl) === pathname
                  ? 'text-black bg-followButton rounded-full'
                  : 'text-text-neutral group-hover/nav-item:text-text'
              )}
            />
          </Link>
        ))}
        <div
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={cn(
            'flex hover:scale-110 h-11 w-11 cursor-pointer group/hamburger relative transition-all items-center justify-center gap-[5px] flex-col',
            itemIndex === 4 ? 'bg-followButton rounded-full' : ''
          )}
        >
          {new Array(3).fill(0).map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-6 h-1 rounded-full transition-all bg-text',
                itemIndex === 4 ? 'bg-black' : 'bg-text-neutral group-hover/hamburger:bg-text'
              )}
            ></div>
          ))}
        </div>
      </div>
      {mobileMenuOpen && <Menu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />}
    </div>
  )
}

export default NavItems
