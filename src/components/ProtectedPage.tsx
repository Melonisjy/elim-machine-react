'use client'

import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Backdrop, Button, CircularProgress, Typography } from '@mui/material'

import useAccessTokenStore from '@/@core/hooks/zustand/useAuthStore'
import { refresh } from '@/@core/utils/auth'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'
import { HTTP_STATUS_RANGE } from '@/@core/constants/httpStatusCodes'

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [dotCnt, setDotCnt] = useState<0 | 1 | 2 | 3>(0)
  const [showRelogin, setShowRelogin] = useState(false)
  const [hostname, setHostname] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(true)

  const accessToken = useAccessTokenStore(state => state.accessToken)


  // 환경 변수로 인증 보호 비활성화 제어
  const skipProtection = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' && hostname === "localhost"

  const routeToLoginPage = useCallback(() => {
    router.push('/login')
  }, [router])

  useEffect(() => {
    setHostname(window.location.hostname)

    const attemptRefresh = async () => {
      setIsRefreshing(true)
      const statusCode = await refresh()

      // 200번대 상태 코드는 성공으로 처리
      if (!HTTP_STATUS_RANGE.isSuccess(statusCode)) {
        // refresh 실패 시 토큰 및 사용자 정보 삭제
        useAccessTokenStore.getState().setAccessToken(null)
        useCurrentUserStore.getState().setCurrentUser(null)
        router.push('/login')
      }

      setIsRefreshing(false)
    }

    // accessToken이 없을 때만 refresh 시도
    if (!accessToken) {
      attemptRefresh()
    } else {
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
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

  // refresh 중이거나 accessToken이 없을 때 로딩 표시
  const isLoading = isRefreshing || !accessToken

  return (
    <>
      <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={isLoading}>
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
