import { enqueueSnackbar } from 'notistack'

import { getErrorMessage } from '@core/utils/errorHandler'

export function printSuccessSnackbar(message: string, autoHideDuration = 1000) {
  enqueueSnackbar(message, { variant: 'success', autoHideDuration: autoHideDuration })
}

export function printWarningSnackbar(message: string, autoHideDuration = 1000) {
  enqueueSnackbar(message, { variant: 'warning', autoHideDuration: autoHideDuration })
}

export function printInfoSnackbar(message: string, autoHideDuration = 1000) {
  enqueueSnackbar(message, { variant: 'info', autoHideDuration: autoHideDuration })
}

export function printErrorSnackbar(
  error: any | string,
  message = '처리 중 오류가 발생했습니다',
  autoHideDuration = 1000
) {
  const errorMessage = typeof error === 'string' ? error : getErrorMessage(error, message)
  enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: autoHideDuration })
}
