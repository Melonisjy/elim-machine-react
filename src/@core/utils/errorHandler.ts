import { toast } from 'react-toastify'

/**
 * API 에러 응답에서 메시지를 추출하여 사용자에게 표시할 수 있는 형태로 포맷팅합니다.
 * @param error - axios 에러 객체
 * @param defaultMessage - 기본 에러 메시지 (선택사항)
 * @returns 포맷팅된 에러 메시지
 */
export const getErrorMessage = (error: any, defaultMessage: string = '처리 중 오류가 발생했습니다.'): string => {
  // 네트워크 에러나 응답이 없는 경우
  if (!error.response?.data) {
    return defaultMessage
  }

  const errorData = error.response.data
  let errorMessage = errorData.message || defaultMessage

  // errors 배열이 있는 경우 구체적인 에러 메시지 표시
  if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
    const errorDetails = errorData.errors
      .map((err: any) => err.message || err.defaultMessage || String(err))
      .filter(Boolean) // 빈 값 제거
      .join('\n')

    if (errorDetails) {
      errorMessage = errorDetails
    }
  }

  return errorMessage
}

/**
 * API 에러를 처리하고 alert로 메시지를 표시합니다.
 * @param error - axios 에러 객체 또는 에러 메시지 문자열
 * @param defaultMessage - 기본 에러 메시지 (선택사항)
 * @param showAlert - alert 표시 여부 (기본값: true)
 * @returns 에러 메시지 문자열
 */
export const handleApiError = (
  error: any | string,
  defaultMessage: string = '처리 중 오류가 발생했습니다.',
  showAlert: boolean = true
): string => {
  console.error('API Error:', error)

  const errorMessage = typeof error === 'string' ? error : getErrorMessage(error, defaultMessage)

  if (showAlert) {
    toast.error(errorMessage)
  }

  return errorMessage
}

/**
 * 성공 메시지를 표시합니다.
 * @param message - 성공 메시지
 * @param showAlert - alert 표시 여부 (기본값: true)
 */
export const handleSuccess = (message: string = '성공적으로 처리되었습니다.', showAlert: boolean = true): void => {
  if (showAlert) {
    toast.success(message)
  }
}
