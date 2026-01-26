'use client'

// React Imports
import type { RefObject } from 'react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Box from '@mui/material/Box'

// Component Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

import { toast } from 'react-toastify'

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'

import TabContext from '@mui/lab/TabContext'

import { IconX } from '@tabler/icons-react'

import type { UserDetailResponseDtoType } from '@core/types'

import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import DeleteModal from '@/@core/components/elim-modal/DeleteModal'
import { auth } from '@core/utils/auth'
import { useGetUserBasic, useGetUserCareer, useGetUserEtc, useGetUserOffice, useGetUserPrivacy, type UserType } from '@core/hooks/customTanstackQueries'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'
import AlertModal from '@/@core/components/elim-modal/AlertModal'
import BasicTabContent from './tabs/BasicTabContent'
import PrivacyTabContent from './tabs/PrivacyTabContent'

import OfficeTabContent from './tabs/OfficeTabContent'
import CareerTabContent from './tabs/CareerTabContent'
import EtcTabContent from './tabs/EtcTabContent'
import ForgotPwModal from '@/app/(login)/login/_components/ForgotPwModal'


export type refType = {
  handleSave: () => Promise<void>
  handleDontSave: () => void
  dirty: boolean
}

type requestRuleBodyType = {
  url: string
  value: UserType
  label: string
  dtoKey: keyof UserDetailResponseDtoType
}

type tabType = '1' | '2' | '3' | '4' | '5'

const requestRule: Record<tabType, requestRuleBodyType> = {
  '1': {
    url: '',
    label: '기본정보',
    value: 'basic',
    dtoKey: 'userBasicResponseDto'
  },
  '2': {
    url: '/privacy',
    label: '개인정보',
    value: 'privacy',
    dtoKey: 'userPrivacyResponseDto'
  },
  '3': {
    url: '/office',
    label: '재직정보',
    value: 'office',
    dtoKey: 'userOfficeResponseDto'
  },
  '4': {
    url: '/career',
    label: '경력정보',
    value: 'career',
    dtoKey: 'userCareerResponseDto'
  },
  '5': {
    url: '/etc',
    label: '기타정보',
    value: 'etc',
    dtoKey: 'userEtcResponseDto'
  }
}

type EditUserInfoProps = {
  open: boolean
  setOpen: (open: boolean) => void
  userId: number
  onDelete?: () => void
  reloadPages?: () => void
}

export const UserIdContext = createContext<number>(0)
const savedTabsContext = createContext<RefObject<string[]> | null>(null)

/**
 * 어떤 탭의 정보가 수정 반영되었는지 확인하기 위한 context
 * @returns
 */
export const useSavedTabsContext = () => {
  const savedTabs = useContext(savedTabsContext)

  if (!savedTabs) throw new Error('no savedTabs context')

  return savedTabs
}

const UserModal = ({ open, setOpen, userId, onDelete, reloadPages }: EditUserInfoProps) => {
  const changedEvenOnce = useRef(false)

  const [tabValue, setTabValue] = useState<tabType>('1')
  const [openDelete, setOpenDelete] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [openAlertNoSave, setOpenAlertNoSave] = useState(false)
  const [openForgetPW, setOpenForgotPW] = useState(false)

  const [loading, setLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)


  const basicTabRef = useRef<refType>(null)
  const privacyTabRef = useRef<refType>(null)
  const officeTabRef = useRef<refType>(null)
  const careerTabRef = useRef<refType>(null)
  const etcTabRef = useRef<refType>(null)

  const { data: basicData, isLoading: isLoadingBasic } = useGetUserBasic(
    open && userId > 0 && (tabValue === '1' || basicTabRef.current?.dirty)
      ? userId.toString()
      : '0'
  )

  const { data: privacyData, isLoading: isLoadingPrivacy } = useGetUserPrivacy(
    open && userId > 0 && tabValue === '2' ? userId.toString() : '0'
  )

  const { data: officeData, isLoading: isLoadingOffice } = useGetUserOffice(
    open && userId > 0 && tabValue === '3' ? userId.toString() : '0'
  )

  const { data: careerData, isLoading: isLoadingCareer } = useGetUserCareer(
    open && userId > 0 && tabValue === '4' ? userId.toString() : '0'
  )

  const { data: etcData, isLoading: isLoadingEtc } = useGetUserEtc(
    open && userId > 0 && tabValue === '5' ? userId.toString() : '0'
  )

  const getIsDirty = useCallback(() => {
    return (
      basicTabRef.current?.dirty ||
      privacyTabRef.current?.dirty ||
      officeTabRef.current?.dirty ||
      careerTabRef.current?.dirty ||
      etcTabRef.current?.dirty
    ) ?? false
  }, [])

  useEffect(() => {
    const checkDirty = () => {
      const dirty = getIsDirty()
      setIsDirty(dirty)
    }

    // 초기 확인
    checkDirty()

    // 주기적으로 확인 (폼 상태 변경 감지)
    const interval = setInterval(checkDirty, 100)

    return () => clearInterval(interval)
  }, [getIsDirty])

  const FormSkeleton = () => (
    <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 3 }}>
            <Skeleton variant='rectangular' height={56} sx={{ flex: 1, borderRadius: 1 }} />
            <Skeleton variant='rectangular' height={56} sx={{ flex: 1, borderRadius: 1 }} />
          </Box>
        ))}
      </Box>
    </DialogContent>
  )

  // else 문 추가 필요
  const handleDeleteUser = async () => {
    if (!userId) return

    try {
      await auth.delete(`/api/members`, {
        // @ts-ignore
        data: { memberDeleteRequestDtos: [{ memberId: memberId, version: version }] }
      })

      console.log(`memberId: ${userId} user is deleted successfully`)
      handleSuccess('해당 직원이 삭제되었습니다.')
      onDelete && onDelete()
      changedEvenOnce.current = true
      onClose()
    } catch (error) {
      handleApiError(error)
    }
  }

  const onDeleteUserConfirm = async () => {
    try {
      await handleDeleteUser()
    } catch (error: any) {
      toast.error(`${error.message}`)
    }
  }

  const savedTabs = useRef<string[]>([])

  const onSubmitHandler = async () => {
    try {
      setLoading(true)
      savedTabs.current = []

      if (basicTabRef.current?.dirty) {
        await basicTabRef.current?.handleSave()
      }

      if (privacyTabRef.current?.dirty) {
        await privacyTabRef.current.handleSave()
      }

      if (officeTabRef.current?.dirty) {
        await officeTabRef.current.handleSave()
      }

      if (careerTabRef.current?.dirty) {
        await careerTabRef.current.handleSave()
      }

      if (etcTabRef.current?.dirty) {
        await etcTabRef.current.handleSave()
      }

      if (savedTabs.current.length > 0) {
        handleSuccess(`${savedTabs.current.join(', ')}가 수정되었습니다`)

        changedEvenOnce.current = true
      }
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  // 실제로 창이 닫힐 때 동작하는 함수
  const onClose = useCallback(() => {
    if (changedEvenOnce.current) {
      reloadPages && reloadPages()
    }

    setOpen(false)
  }, [setOpen, reloadPages])

  // 창을 닫으려 할 때 동작하는 함수 - 변경사항이 있으면 경고창 출력
  const handleClose = useCallback(() => {
    if (getIsDirty()) {
      setOpenAlert(true)
    } else {
      onClose()
    }
  }, [getIsDirty, onClose])

  const handleQuitWithoutSave = useCallback(() => {
    setOpenAlert(false)
    onClose()
  }, [onClose])

  const handleDontSave = useCallback(() => {
    for (const i of [basicTabRef, privacyTabRef, officeTabRef, careerTabRef, etcTabRef]) {
      if (i.current?.dirty) {
        i.current.handleDontSave()
      }
    }

    setOpenAlertNoSave(false)
  }, [])

  return (
    <UserIdContext.Provider value={userId ?? 0}>
      <savedTabsContext.Provider value={savedTabs}>
        <Dialog
          onClose={(_, reason) => {
            if (reason === 'backdropClick') return
            handleClose()
          }}
          open={open}
          fullWidth
          maxWidth='md'
        >
          <DialogTitle sx={{ position: 'relative' }}>
            <div className='flex flex-col w-full grid place-items-center'>
              <Typography variant='h3'>
                {basicData?.name || '사용자 정보 수정'}
              </Typography>
              <Typography variant='subtitle1'>{basicData?.licenseName || ''}</Typography>
            </div>
            <IconButton type='button' onClick={handleClose} className='absolute right-4 top-4'>
              <IconX />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TabContext value={tabValue}>
              <div className='h-[60dvh] flex flex-col'>
                <TabList
                  centered
                  onChange={(event, newValue) => {
                    setTabValue(newValue)
                  }}
                  aria-label='centered tabs example'
                >
                  {Object.keys(requestRule).map(item => {
                    const key = item as keyof typeof requestRule

                    return <Tab key={key} value={key} label={requestRule[key].label} />
                  })}
                </TabList>
                <div className='flex-1 overflow-y-auto pt-5'>
                  <TabPanel value='1' keepMounted>
                    {isLoadingBasic ? (
                      <FormSkeleton />
                    ) : (
                      basicData && <BasicTabContent ref={basicTabRef} defaultData={basicData} />
                    )}
                  </TabPanel>
                  <TabPanel value='2' keepMounted>
                    {isLoadingPrivacy ? (
                      <FormSkeleton />
                    ) : (
                      privacyData && <PrivacyTabContent ref={privacyTabRef} defaultData={privacyData} />
                    )}
                  </TabPanel>
                  <TabPanel value='3' keepMounted>
                    {isLoadingOffice ? (
                      <FormSkeleton />
                    ) : (
                      officeData && <OfficeTabContent ref={officeTabRef} defaultData={officeData} />
                    )}
                  </TabPanel>
                  <TabPanel value='4' keepMounted>
                    {isLoadingCareer ? (
                      <FormSkeleton />
                    ) : (
                      careerData && <CareerTabContent ref={careerTabRef} defaultData={careerData} />
                    )}
                  </TabPanel>
                  <TabPanel value='5' keepMounted>
                    {isLoadingEtc ? (
                      <FormSkeleton />
                    ) : (
                      etcData && <EtcTabContent ref={etcTabRef} defaultData={etcData} />
                    )}
                  </TabPanel>
                </div>
              </div>
            </TabContext>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 10 }}>
            <Button variant='contained' onClick={onSubmitHandler} type='submit' color='success' disabled={loading || !isDirty}>
              저장
            </Button>
            <Button variant='contained' color='secondary' onClick={handleClose}>
              닫기
            </Button>
          </DialogActions>
        </Dialog>

        {openDelete && <DeleteModal open={openDelete} setOpen={setOpenDelete} onDelete={onDeleteUserConfirm} />}
        {openAlert && <AlertModal open={openAlert} setOpen={setOpenAlert} handleConfirm={handleQuitWithoutSave} />}
        {openAlertNoSave && (
          <AlertModal
            open={openAlertNoSave}
            setOpen={setOpenAlertNoSave}
            handleConfirm={handleDontSave}
            title={'변경사항을 모두 폐기하시겠습니까?'}
            confirmMessage='폐기'
          />
        )}
        {openForgetPW && basicData && (
          <ForgotPwModal
            open={openForgetPW}
            setOpen={setOpenForgotPW}
            userEmail={basicData.email}
          />
        )}
      </savedTabsContext.Provider>
    </UserIdContext.Provider>
  )
}

export default UserModal
