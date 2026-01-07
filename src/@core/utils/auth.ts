import { redirect } from 'next/navigation'

import axios from 'axios'

import type { LoginResponseDtoType, TokenResponseDto } from '@core/types'
import useAccessTokenStore from '@/@core/hooks/zustand/useAuthStore'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'

export const auth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
  withCredentials: true // 👈 쿠키(RefreshToken) 주고받기 위해 필요
})

// 로그인 함수 (클라이언트 컴포넌트) (로컬 스토리지에 accesstoken 저장)
export async function login(email: string, password: string) {
  try {
    const res = await axios.post<{ data: LoginResponseDtoType; code: number }>(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/authentication/web/login`,
      { email, password },
      { withCredentials: true }
    )

    const accessToken = res.data.data.tokenResponseDto.accessToken // JSON body에서 가져옴
    useAccessTokenStore.getState().setAccessToken(accessToken)

    const UserInfo = res.data.data.loginMemberResponseDto
    useCurrentUserStore.getState().setCurrentUser(UserInfo)

    return res.data.code
  } catch (error) {
    return error
  }
}

export async function logout() {
  try {
    // ! CSRF token 같이 넣어서 POST
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/authentication/web/logout`, null, {
      withCredentials: true
    })

    console.log('로그아웃되었습니다.')
  } catch (e) {
    console.error(e)
  } finally {
    useCurrentUserStore.getState().setCurrentUser(null)
    useAccessTokenStore.getState().setAccessToken(null)
    redirect('/login')
  }
}

// 헤더에 access token 추가
auth.interceptors.request.use(config => {
  const accessToken = useAccessTokenStore.getState().accessToken

  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  } else {
    console.log('no access token')
  }

  return config
})

auth.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true // 무한 루프 방지 플래그 설정

      try {
        // RefreshToken은 쿠키에 있기 때문에 단순 호출만 해주면 됨
        const res = await axios.post<{ data: TokenResponseDto }>(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/authentication/web/refresh`,
          null,
          { withCredentials: true }
        )

        const newAccessToken = res.data.data.accessToken

        useAccessTokenStore.getState().setAccessToken(newAccessToken)

        // 실패했던 요청 다시 실행
        const originalRequest = error.config
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return auth(originalRequest)
      } catch (err) {
        // ! 나중에 주석 풀어야함
        // Refresh도 실패 → 로그인 페이지로 이동
        useAccessTokenStore.getState().setAccessToken(null)
        console.log('refresh failed!')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)
