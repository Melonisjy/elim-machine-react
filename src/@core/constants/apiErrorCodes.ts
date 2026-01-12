/**
 * PHP API 에러 코드 상수
 */
export const API_ERROR_CODES = {
  // 400 Bad Request
  VALIDATION_FAILED: 40001,

  // 401 Unauthorized
  UNAUTHORIZED: 40110,
  USER_NOT_FOUND: 40111,
  INVALID_PASSWORD: 40112,
  NO_REFRESH_TOKEN: 40114,
  INVALID_REFRESH_TOKEN: 40115,
  REFRESH_ROW_NOT_FOUND: 40116,
  TOKEN_OWNER_MISMATCH: 40117,
  REFRESH_TOKEN_REPLAY: 40118,
  REFRESH_TOKEN_EXPIRED: 40119,
  REFRESH_HASH_MISMATCH: 40120,
  INVALID_TOKEN_ROW_ID: 40121,
  REFRESH_UNAUTHORIZED: 40122,

  // 403 Forbidden
  CSRF_FAILED: 40301,
  CSRF_FORBIDDEN_ORIGIN: 40302,
  USER_NOT_ACTIVE: 40311,
  USER_BLOCKED: 40312,
  USER_NO_ROLES: 40313,

  // 500 Internal Server Error
  INTERNAL_ERROR: 50000,

  // 클라이언트 측 에러 코드
  NETWORK_ERROR: -1,
  INVALID_RESPONSE: -2,
  MISSING_TOKEN: -3
} as const

/**
 * 에러 코드별 사용자 메시지 매핑
 */
export const API_ERROR_MESSAGES: Record<number, string> = {
  // 400 Bad Request
  [API_ERROR_CODES.VALIDATION_FAILED]: '입력 정보를 확인해주세요.',

  // 401 Unauthorized
  [API_ERROR_CODES.UNAUTHORIZED]: '인증이 필요합니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.USER_NOT_FOUND]: '존재하지 않는 사용자입니다.',
  [API_ERROR_CODES.INVALID_PASSWORD]: '비밀번호가 일치하지 않습니다.',
  [API_ERROR_CODES.NO_REFRESH_TOKEN]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.INVALID_REFRESH_TOKEN]: '유효하지 않은 토큰입니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.REFRESH_ROW_NOT_FOUND]: '세션 정보를 찾을 수 없습니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.TOKEN_OWNER_MISMATCH]: '토큰 정보가 일치하지 않습니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.REFRESH_TOKEN_REPLAY]: '보안상의 이유로 다시 로그인해주세요.',
  [API_ERROR_CODES.REFRESH_TOKEN_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.REFRESH_HASH_MISMATCH]: '토큰 검증에 실패했습니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.INVALID_TOKEN_ROW_ID]: '토큰 정보가 올바르지 않습니다. 다시 로그인해주세요.',
  [API_ERROR_CODES.REFRESH_UNAUTHORIZED]: '인증에 실패했습니다. 다시 로그인해주세요.',

  // 403 Forbidden
  [API_ERROR_CODES.CSRF_FAILED]: '보안 검증에 실패했습니다. 페이지를 새로고침해주세요.',
  [API_ERROR_CODES.CSRF_FORBIDDEN_ORIGIN]: '허용되지 않은 요청입니다.',
  [API_ERROR_CODES.USER_NOT_ACTIVE]: '비활성화된 계정입니다. 관리자에게 문의해주세요.',
  [API_ERROR_CODES.USER_BLOCKED]: '차단된 계정입니다. 관리자에게 문의해주세요.',
  [API_ERROR_CODES.USER_NO_ROLES]: '접근 권한이 없습니다. 관리자에게 문의해주세요.',

  // 500 Internal Server Error
  [API_ERROR_CODES.INTERNAL_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',

  // 클라이언트 측 에러
  [API_ERROR_CODES.NETWORK_ERROR]: '네트워크 오류가 발생했습니다. 연결을 확인해주세요.',
  [API_ERROR_CODES.INVALID_RESPONSE]: '서버 응답 형식이 올바르지 않습니다.',
  [API_ERROR_CODES.MISSING_TOKEN]: '인증 토큰이 없습니다. 다시 로그인해주세요.'
}

/**
 * 에러 코드로부터 사용자 메시지를 가져옴.
 * @param errorCode 에러 코드
 * @param defaultMessage 기본 메시지 (에러 코드가 매핑되지 않은 경우)
 * @returns 사용자에게 표시할 메시지
 */
export const getErrorMessageByCode = (errorCode: number, defaultMessage: string = '오류가 발생했습니다.'): string => {
  return API_ERROR_MESSAGES[errorCode] || defaultMessage
}

/**
 * HTTP 상태 코드를 기반으로 기본 메시지를 반환.
 * @param statusCode HTTP 상태 코드
 * @returns 기본 메시지
 */
export const getDefaultMessageByStatus = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return '성공적으로 처리되었습니다.'
  }
  if (statusCode === 400) {
    return '잘못된 요청입니다.'
  }
  if (statusCode === 401) {
    return '인증이 필요합니다.'
  }
  if (statusCode === 403) {
    return '접근 권한이 없습니다.'
  }
  if (statusCode === 404) {
    return '요청한 리소스를 찾을 수 없습니다.'
  }
  if (statusCode >= 500) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
  return '오류가 발생했습니다.'
}
