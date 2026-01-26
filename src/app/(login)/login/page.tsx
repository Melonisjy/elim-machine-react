'use client'

import { useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'

import { IconEye, IconEyeOff } from '@tabler/icons-react'

import ForgotPwModal from './_components/ForgotPwModal'
import { login } from '@core/utils/auth'

import 'react-toastify/ReactToastify.css'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { printErrorSnackbar, printSuccessSnackbar } from '@core/utils/snackbarHandler'
import { getErrorMessageByCode, getDefaultMessageByStatus } from '@/@core/constants/apiErrorCodes'
import { useGetLicenseFilter } from '@/@core/hooks/customTanstackQueries'

type LoginFormInputs = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()

  const [openPwModal, setOpenPwModal] = useState(false)
  const [showPW, setShowPW] = useState(false)
  const pwRef = useRef<HTMLInputElement>(null)

  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const { data: licenseFilter } = useGetLicenseFilter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data

    const response = await login(email, password)

    // 200번대 상태 코드는 모두 성공으로 처리
    if (response >= 200 && response < 300) {
      const userInfo = useCurrentUserStore.getState().currentUser
      const userName = userInfo?.name
      const licenseSeq = userInfo?.licenseSeq

      const license = licenseFilter?.find(license => license.licenseSeq === licenseSeq)
      const licenseName = license?.name || license?.englishName || ''

      if (licenseName && userInfo) {
        useCurrentUserStore.getState().setCurrentUser({
          ...userInfo,
          licenseName
        })
      }

      if (isTablet) {
        router.push('/safety')
        printSuccessSnackbar(`환영합니다${userName ? `,\n${userName}님` : ''}`)
      } else {
        router.push('/safety')
        handleSuccess(`환영합니다${userName ? `,\n${userName}님` : ''}`)
      }
    } else {
      // 에러 코드에 맞는 메시지 가져오기
      const errorMessage = getErrorMessageByCode(
        response,
        getDefaultMessageByStatus(response)
      )

      if (isTablet) {
        printErrorSnackbar(errorMessage, '로그인 오류 발생')
      } else {
        handleApiError(errorMessage, '로그인 오류 발생')
      }
    }
  }

  return (
    <div className='flex justify-center items-center min-h-[100dvh] bg-gray-100'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white py-6 px-10 rounded-lg shadow-md min-w-[400px] flex flex-col gap-2 items-center'
      >
        <div className='flex flex-col items-center'>
          <Typography variant='h3' sx={{ mt: 2, fontWeight: 600 }}>
            엘림 워크스페이스
          </Typography>
          <Typography variant='subtitle1'>기계설비현장 웹앱</Typography>
        </div>
        <Divider />
        <div className='w-full flex flex-col gap-4 items-center'>
          <div className='flex flex-col gap-2 w-full'>
            <TextField
              type='email'
              size='small'
              placeholder='이메일을 입력하세요'
              {...register('email', { required: '이메일을 입력해주세요' })}
              className='border  w-full'
            />
            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
            <TextField
              inputRef={pwRef}
              component={Box}
              type={!showPW ? 'password' : 'text'}
              size='small'
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => {
                          setShowPW(prev => !prev)
                          pwRef.current?.focus()
                        }}
                        onMouseDown={e => e.preventDefault()}
                        onMouseUp={e => e.preventDefault()}
                        sx={{ position: 'absolute', right: 0, top: 0 }}
                      >
                        {showPW ? <IconEyeOff /> : <IconEye />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              placeholder='비밀번호를 입력하세요'
              {...register('password', { required: '비밀번호를 입력해주세요' })}
              className='border w-full'
            />
            {errors.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}
          </div>

          <div className='flex w-full gap-1 justify-between'>
            <div className='flex items-center'>
              <Checkbox />
              <Typography variant='subtitle1'>자동 로그인</Typography>
            </div>
            <Button onClick={() => setOpenPwModal(true)}>비밀번호 변경</Button>
          </div>
          <Button size='large' variant='contained' fullWidth type='submit' disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>
      {openPwModal && <ForgotPwModal open={openPwModal} setOpen={setOpenPwModal} />}
      {/* <ToastContainer autoClose={3000} /> */}
    </div>
  )
}
