'use client'

// React Imports
import { useCallback, useRef, useState } from 'react'

// MUI Imports

import Button from '@mui/material/Button'

import { useForm } from 'react-hook-form'

import { Backdrop, CircularProgress } from '@mui/material'

import DefaultModal from '@/@core/components/elim-modal/DefaultModal'
import type { LicenseCreateRequestDto, LicenseResponseDtoType } from '@core/types'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import DeleteModal from '@/@core/components/elim-modal/DeleteModal'
import LicenseInputs from './LicenseInputs'
import AlertModal from '@/@core/components/elim-modal/AlertModal'
import { useMutateLicense } from '@core/hooks/customTanstackQueries'
import { printWarningSnackbar } from '@core/utils/snackbarHandler'
import deleteLicense from '../_util/deleteLicense'
import ResetButton from '@/@core/components/elim-button/ResetButton'

type LicenseModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  initialData: LicenseResponseDtoType
  adjustPage: (offset: number) => void
  reloadPages: () => void
}

const LicenseModal = ({ open, setOpen, initialData, adjustPage, reloadPages }: LicenseModalProps) => {
  const licenseId = initialData.id

  const [loading, setLoading] = useState(false)
  const { mutate: mutateLicense, isPending } = useMutateLicense(licenseId.toString())

  const [openDelete, setOpenDelete] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [openAlertNoSave, setOpenAlertNoSave] = useState(false)

  const changedEvenOnce = useRef(false)

  const form = useForm<LicenseCreateRequestDto>({
    defaultValues: {
      companyName: initialData?.companyName ?? '',
      companyNameAbbr: initialData?.companyNameAbbr ?? '',
      bizno: initialData?.bizno ?? '',
      ceoName: initialData?.ceoName ?? '',
      managerName: initialData?.managerName ?? '',
      managerPhoneNumber: initialData?.managerPhoneNumber ?? '',
      managerEmail: initialData?.managerEmail ?? '',
      taxEmail: initialData?.taxEmail ?? '',
      homepageAddr: initialData?.homepageAddr ?? '',
      tel: initialData?.tel ?? '',
      fax: initialData?.fax ?? '',
      roadAddress: initialData?.roadAddress ?? '',
      jibunAddress: initialData?.jibunAddress ?? '',
      detailAddress: initialData?.detailAddress ?? '',
      businessType: initialData?.businessType ?? '',
      businessCategory: initialData?.businessCategory ?? '',
      contractDate: initialData?.contractDate ?? '',
      expireDate: initialData?.expireDate ?? '',
      remark: initialData?.remark ?? ''
    }
  })

  const isDirty = form.formState.isDirty

  const handleDeleteLicense = async () => {
    await deleteLicense(licenseId)
    adjustPage(-1)
    reloadPages()
    setOpen(false)
  }

  const handleSave = form.handleSubmit(data => {
    if (isDirty) {
      setLoading(true)

      try {
        mutateLicense(data as LicenseResponseDtoType)

        form.reset(data)
        handleSuccess(`라이선스 정보가 수정되었습니다.`)
        changedEvenOnce.current = true
      } catch (error: any) {
        handleApiError(error)
      } finally {
        setLoading(false)
      }
    } else {
      printWarningSnackbar('변경사항이 없습니다.', 1500)
    }
  })

  const handleDontSave = useCallback(() => {
    form.reset()

    setOpenAlertNoSave(false)
  }, [form])

  // 실제로 창이 닫힐 때 동작하는 함수
  const onClose = useCallback(() => {
    if (changedEvenOnce.current) {
      reloadPages()
    }

    setOpen(false)
  }, [setOpen, reloadPages])

  // 창을 닫으려 할 때 동작하는 함수 - 변경사항이 있으면 경고창 출력
  const handleClose = useCallback(() => {
    if (isDirty) {
      setOpenAlert(true)
    } else {
      onClose()
    }
  }, [isDirty, onClose])

  return (
    <DefaultModal
      size='md'
      open={open}
      setOpen={setOpen}
      title={initialData.companyName}
      onClose={handleClose}
      headerDescription={initialData.bizno}
      primaryButton={
        <Button
          variant='contained'
          onClick={() => handleSave()}
          type='submit'
          color='success'
          disabled={!isDirty || loading}
        >
          저장
        </Button>
      }
      secondaryButton={
        <Button variant='contained' color='secondary' onClick={handleClose}>
          닫기
        </Button>
      }
      modifyButton={
        <div className='flex gap-3'>
          <Button
            sx={{ boxShadow: 'none' }}
            variant='contained'
            color='error'
            type='reset'
            onClick={() => setOpenDelete(true)}
          >
            삭제
          </Button>
          <ResetButton isDirty={isDirty} onClick={() => isDirty && setOpenAlertNoSave(true)} />
        </div>
      }
    >
      <div className='flex flex-col overflow-visible pbs-0 sm:pli-16 gap-4'>
        {loading ? (
          <div className='h-full w-full grid place-items-center'>
            <CircularProgress />
          </div>
        ) : (
          <LicenseInputs form={form} />
        )}
      </div>
      {openDelete && <DeleteModal open={openDelete} setOpen={setOpenDelete} onDelete={handleDeleteLicense} />}
      {openAlert && <AlertModal open={openAlert} setOpen={setOpenAlert} handleConfirm={onClose} />}
      {openAlertNoSave && (
        <AlertModal
          open={openAlertNoSave}
          setOpen={setOpenAlertNoSave}
          handleConfirm={handleDontSave}
          title={'변경사항을 모두 폐기하시겠습니까?'}
          subtitle='폐기한 후에는 복구할 수 없습니다'
          confirmMessage='폐기'
        />
      )}
      <Backdrop sx={theme => ({ zIndex: theme.zIndex.drawer + 1 })} open={isPending}>
        <CircularProgress sx={{ color: 'white' }} size={50} />
      </Backdrop>
    </DefaultModal>
  )
}

export default LicenseModal
