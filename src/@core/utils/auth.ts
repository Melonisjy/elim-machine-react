import { redirect } from 'next/navigation'

import axios from 'axios'

import type { LoginResponseDtoType, MeReponseDtoType, TokenResponseDto } from '@core/types'
import useAccessTokenStore from '@/@core/hooks/zustand/useAuthStore'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'

import { API_ERROR_CODES } from '@/@core/constants/apiErrorCodes'
import { HTTP_STATUS, HTTP_STATUS_RANGE } from '../constants/httpStatusCodes'

// 기계설비용 Java 백엔드 API
export const auth = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_API_URL}`,
  withCredentials: true // 👈 쿠키(RefreshToken) 주고받기 위해 필요
})

// PHP API 공통 응답 형식 (ApiResult)
export interface PhpApiResult<T = unknown> {
  success: boolean
  message: string
  code: number
  data: T | null
}

// PHP API용 axios 인스턴스
export const phpAuth = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// Constants 
const AUTH_ENDPOINTS = {
  LOGIN: '/web/auth/login',
  LOGOUT: '/web/auth/logout',
  REFRESH: '/web/auth/refresh',
  ME: '/web/auth/me'
} as const

/**
 * 로그인 함수 (PHP API 사용)
 * @param email 이메일
 * @param password 비밀번호
 * @returns HTTP 상태 코드 (200-299: 성공, 그 외: 에러)
 */
export async function login(email: string, password: string): Promise<number> {
  try {
    // PHP 로그인 요청
    const res = await phpAuth.post<PhpApiResult<LoginResponseDtoType>>(AUTH_ENDPOINTS.LOGIN, {
      email,
      password
    })


    // 디버깅: 응답 구조 확인 (필요시 주석 처리)
    // console.log('로그인 응답:', res)

    if (HTTP_STATUS_RANGE.isSuccess(res.status) && res.data.data) {
      // PHP API 응답 구조 확인
      const responseData: LoginResponseDtoType = res.data.data

      // PHP API 응답 구조: jwtTokenRes.accessToken
      const accessToken = responseData.jwtTokenRes?.accessToken

      if (!accessToken) {
        console.error('로그인 응답에 accessToken이 없습니다:', responseData)
        return API_ERROR_CODES.MISSING_TOKEN
      }

      useAccessTokenStore.getState().setAccessToken(accessToken)

      // 사용자 정보는 data에 직접 있음 (userSeq, email, name, roles, status)
      const UserInfo = {
        userId: responseData.userSeq,
        name: responseData.name,
        role: responseData.roles[0],
        licenseSeq: responseData.licenseSeq
      }

      useCurrentUserStore.getState().setCurrentUser(UserInfo)

      return res.status
    } else {
      console.error('로그인 실패:', res.data.message, 'code:', res.data.code)
      // 백엔드 에러 코드 우선 반환
      return res.data.code || res.status || API_ERROR_CODES.INTERNAL_ERROR
    }
  } catch (error: any) {
    // 네트워크 오류 또는 기타 예외
    if (error.response) {
      // HTTP 응답이 있는 경우
      const apiError = error.response.data as PhpApiResult
      console.error('PHP 로그인 실패:', apiError?.message || error.message, 'code:', apiError?.code)
      // 백엔드 에러 코드 우선, 없으면 HTTP 상태 코드
      return apiError?.code || error.response.status || API_ERROR_CODES.NETWORK_ERROR
    }
    console.error('PHP 로그인 네트워크 오류:', error)
    // 네트워크 오류 등 응답이 없는 경우
    return API_ERROR_CODES.NETWORK_ERROR
  }
}

/**
 * 로그아웃 함수 (PHP API 사용)
 */
export async function logout() {
  try {
    // PHP 로그아웃 요청 (CSRF 비활성화 버전)
    const res = await phpAuth.post<PhpApiResult<null>>(AUTH_ENDPOINTS.LOGOUT, null)

    if (HTTP_STATUS_RANGE.isSuccess(res.status)) {
      console.log('로그아웃되었습니다.')
    } else {
      console.error('로그아웃 실패:', res.data.message, 'code:', res.data.code)
    }
  } catch (e: any) {
    if (e.response?.data) {
      const apiError = e.response.data as PhpApiResult
      console.error('PHP 로그아웃 실패:', apiError.message, 'code:', apiError.code)
    } else {
      console.error('PHP 로그아웃 네트워크 오류:', e)
    }
  } finally {
    useCurrentUserStore.getState().setCurrentUser(null)
    useAccessTokenStore.getState().setAccessToken(null)
    redirect('/login')
  }
}

// refresh token 갱신 함수 (PHP API 사용)
export async function refresh(): Promise<number> {
  try {
    const res = await phpAuth.post<PhpApiResult<TokenResponseDto>>(AUTH_ENDPOINTS.REFRESH, null)

    if (res.data.success && res.data.data) {
      // refresh 성공 로그
      console.log('refresh 성공 응답: ', res.data);
      const newAccessToken = res.data.data.accessToken
      useAccessTokenStore.getState().setAccessToken(newAccessToken)

      const userInfo = useCurrentUserStore.getState().currentUser

      if (!userInfo) {
        try {
          const meResponse = await phpAuth.get<PhpApiResult<MeReponseDtoType>>(AUTH_ENDPOINTS.ME)

          if (meResponse.data.success && meResponse.data.data) {
            useCurrentUserStore.getState().setCurrentUser({
              userId: meResponse.data.data.userSeq,
              name: meResponse.data.data.name,
              role: meResponse.data.data.roles[0],
            })
          }
        } catch (e: any) {
          console.error('PHP me 네트워크 오류:', e)
        }
      }

      return res.status
    } else {
      console.error('Refresh 실패:', res.data.message, 'code:', res.data.code)
      return res.data.code || res.status || API_ERROR_CODES.INTERNAL_ERROR
    }
  } catch (e: any) {
    console.error('PHP refresh 네트워크 오류:', e)
    return API_ERROR_CODES.NETWORK_ERROR
  }
}


// 헤더에 access token 추가
// auth.interceptors.request.use(config => {
//   const accessToken = useAccessTokenStore.getState().accessToken

//   if (accessToken) {
//     config.headers = config.headers ?? {}
//     config.headers.Authorization = `Bearer ${accessToken}`
//   } else {
//     console.log('no access token')
//   }

//   return config
// })

// 기계설비용 Java 백엔드 인터셉터 (java 백엔드 사용안할 시 주석)
// auth.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         const res = await axios.post<{ data: TokenResponseDto }>(
//           `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/authentication/web/refresh`,
//           null,
//           { withCredentials: true }
//         )

//         const newAccessToken = res.data.data.accessToken
//         useAccessTokenStore.getState().setAccessToken(newAccessToken)

//         originalRequest.headers = originalRequest.headers ?? {}
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

//         return auth(originalRequest)
//       } catch (err) {
//         useAccessTokenStore.getState().setAccessToken(null)
//         console.log('refresh failed!')
//         window.location.href = '/login'
//       }
//     }

//     return Promise.reject(error)
//   }
// )

// PHP API용 인터셉터
phpAuth.interceptors.request.use(config => {
  const accessToken = useAccessTokenStore.getState().accessToken

  const isRefreshEndpoint = config.url?.includes(AUTH_ENDPOINTS.REFRESH)
  console.log('isRefreshEndpoint', isRefreshEndpoint);

  if (isRefreshEndpoint) {
    // refresh 엔드포인트는 Authorization 헤더를 제거
    if (config.headers) {
      delete config.headers.Authorization
    }
    return config
  }

  // Authorization 헤더 필수 (AccessToken이 있으면)
  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// PHP API용 인터셉터 (refresh token 처리)
// login, logout, refresh 엔드포인트는 그대로 에러 반환
// 401 Unauthorized → refresh 1회 호출

phpAuth.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    const isAuthEndpoint = Object.values(AUTH_ENDPOINTS).some(endpoint => originalRequest.url?.includes(endpoint))

    if (isAuthEndpoint) {
      // 로그인/로그아웃/refresh 엔드포인트는 그대로 에러 반환
      return Promise.reject(error)
    }

    // 401 Unauthorized → refresh 1회 호출
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await phpAuth.post<PhpApiResult<TokenResponseDto>>(AUTH_ENDPOINTS.REFRESH, null)

        if (res.status === HTTP_STATUS.OK && res.data.data) {
          const newAccessToken = res.data.data.accessToken
          useAccessTokenStore.getState().setAccessToken(newAccessToken)

          originalRequest.headers = originalRequest.headers ?? {}
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          return phpAuth(originalRequest)
        } else {
          // refresh 실패 → 로그아웃 및 로그인 화면
          throw new Error(`Refresh 실패: ${res.data.message} (code: ${res.data.code})`)
        }
      } catch (err) {
        // refresh 실패 시 로그아웃 처리
        useAccessTokenStore.getState().setAccessToken(null)
        useCurrentUserStore.getState().setCurrentUser(null)
        console.log('PHP refresh failed! 로그인 화면으로 이동합니다.')
        window.location.href = '/login'
        // 에러를 다시 throw하지 않아서 무한 루프 방지
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)
