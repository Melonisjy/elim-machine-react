'use client'

import { useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'

import { AppBar, Button, Toolbar, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import { logout } from '@core/utils/auth'
import UserModal from '@/app/(dashboard)/member/_components/UserModal'
import { useGetSingleMember } from '@core/hooks/customTanstackQueries'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'

export default function Header() {
  const router = useRouter()
  const [openUser, setOpenUser] = useState(false)

  const currentUser = useCurrentUserStore(set => set.currentUser)

  function UserModalContainer() {
    const { data: userData } = useGetSingleMember((currentUser?.userId ?? 0).toString())

    return userData && <UserModal open={openUser} setOpen={setOpenUser} selectedUserData={userData} />
  }

  const handleLogout = useCallback(() => {
    toast.info('로그아웃되었습니다.')
    logout()
  }, [])

  return (
    <AppBar
      sx={{
        background: theme => `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`
      }}
      position='static'
    >
      <Toolbar className='flex justify-between'>
        <div className='flex gap-2'>
          <div onClick={() => router.push('/safety')} className='cursor-pointer'>
            {/* <Logo /> */}
            <Typography color='white' variant='h4' sx={{ paddingInlineStart: 4 }}>
              엘림 주식회사
            </Typography>
          </div>
        </div>
        <div className='flex gap-5 items-center overflow-visible'>
          {currentUser && (
            <Typography
              color='white'
              onClick={() => console.log(document.cookie.split(';'))}
              sx={{ alignItems: 'center', display: 'flex' }}
            >
              반갑습니다,
              <Button color='inherit' type='button' onClick={() => setOpenUser(true)}>
                {currentUser.name}
              </Button>
              님
            </Typography>
          )}
          <Button
            size='small'
            sx={{ backgroundColor: 'white', ':hover': { boxShadow: 5, backgroundColor: 'lightgray' } }}
            variant='contained'
            onClick={handleLogout}
          >
            <Typography sx={{ fontWeight: 600 }}>로그아웃</Typography>
          </Button>
        </div>
      </Toolbar>
      {openUser && currentUser && <UserModalContainer />}
    </AppBar>
  )
}
