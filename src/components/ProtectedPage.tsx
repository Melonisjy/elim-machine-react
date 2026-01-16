'use client'

import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Backdrop, Button, CircularProgress, Typography } from '@mui/material'

import useAccessTokenStore from '@/@core/hooks/zustand/useAuthStore'

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [dotCnt, setDotCnt] = useState<0 | 1 | 2 | 3>(0)
  const [showRelogin, setShowRelogin] = useState(false)
  const [hostname, setHostname] = useState<string | null>(null)

  const accessToken = useAccessTokenStore(set => set.accessToken)

  // 환경 변수로 인증 보호 비활성화 제어
  const skipProtection = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' && hostname === "localhost"

  const routeToLoginPage = useCallback(() => {
    router.push('/login')
  }, [router])

  useEffect(() => {
    setHostname(window.location.hostname)
    const intervalId = setInterval(() => setDotCnt(prev => (prev === 3 ? 0 : ((prev + 1) as 1 | 2 | 3))), 500)

    setTimeout(() => {
      setShowRelogin(true)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [])

  // 개발 환경이거나 환경 변수로 비활성화된 경우 바로 접근 허용
  if (skipProtection) {
    return <>{children}</>
  }

  return (
    <>
      <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={!accessToken}>
        <div className='flex flex-col gap-3 items-center'>
          <Typography color='white' variant='h4'>
            로그인 정보를 찾는 중{Array(dotCnt).fill('.')}
            <span className='opacity-[0%]'>{Array(3 - dotCnt).fill('.')}</span>
          </Typography>
          <CircularProgress sx={{ color: 'white' }} />
          {showRelogin && (
            <Button variant='contained' type='button' onClick={routeToLoginPage}>
              다시 로그인
            </Button>
          )}
        </div>
      </Backdrop>

      {children}
    </>
  )
}
