'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'

import { TextField, Typography } from '@mui/material'

import { useForm } from 'react-hook-form'

import classNames from 'classnames'

import DefaultModal from '@/@core/components/elim-modal/DefaultModal'
import type { UserCreateRequestDtoType } from '@core/types'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { phpAuth } from '@core/utils/auth'
import { useGetLicenseFilter } from '@core/hooks/customTanstackQueries'
import styles from '@core/styles/customTable.module.css'
import TextFieldTd from '@/@core/components/elim-inputbox/TextFieldTd'
import SelectTd from '@/@core/components/elim-inputbox/SelectTd'
import { userStatusOption } from '@/@core/data/options'

type AddUserModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  handlePageChange: () => void
}

const AddUserModal = ({ open, setOpen, handlePageChange }: AddUserModalProps) => {
  const [loading, setLoading] = useState(false)

  const { data: licenseFilter } = useGetLicenseFilter()
  const licenseNameOption = licenseFilter?.map(v => ({ value: v.licenseSeq, label: v.name }))

  const form = useForm<UserCreateRequestDtoType>({
    defaultValues: {
      licenseSeq: 0,
      name: '',
      status: '',
      email: '',
      remark: '',
    }
  })

  const onSubmitHandler = form.handleSubmit(async data => {
    try {
      setLoading(true)
      await phpAuth.post<{ data: UserCreateRequestDtoType }>(`/web/user`, data)


      handleSuccess('새 직원이 추가되었습니다.')
      handlePageChange()
      setOpen(false)
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  })

  return (
    <DefaultModal
      size='sm'
      open={open}
      setOpen={setOpen}
      title='직원 추가'
      primaryButton={
        <Button variant='contained' onClick={onSubmitHandler} type='submit' disabled={loading}>
          추가
        </Button>
      }
      secondaryButton={
        <Button variant='contained' color='secondary' type='reset' onClick={() => setOpen(false)}>
          취소
        </Button>
      }
    >
      <div className={classNames('grid gap-5 pt-2 overflow-visible sm:pli-16', styles.container)}>
        <table style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col width={'25%'} />
            <col width={'75%'} />
          </colgroup>
          <tbody>
            <tr className={styles.required}>
              <th>이름</th>
              <TextFieldTd form={form} name='name' placeholder='홍길동' rules={{ required: '이름을 입력해주세요' }} />
            </tr>
            <tr className={styles.required}>
              <th>이메일</th>
              <TextFieldTd form={form} name='email' placeholder='example@elimsafety.com' rules={{
                required: '이메일을 입력해주세요', pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: '이메일 형식이 올바르지 않습니다'
                }
              }} />
            </tr>
            <tr className={styles.required}>
              <th>소속</th>
              <SelectTd
                form={form}
                name='licenseSeq'
                placeholder='예: 엘림주식회사'
                option={licenseNameOption!}
                rules={{
                  required: "소속을 선택해주세요",
                  validate: (value) => value !== 0 && value !== '' && value !== undefined || "소속을 선택해주세요."
                }}
              />
            </tr>
            <tr className={styles.required}>
              <th>재직상태</th>
              <SelectTd form={form} name='status' placeholder='재직상태 선택' option={userStatusOption} rules={{
                required: "재직상태를 선택해주세요",
              }} />
            </tr>
          </tbody>
        </table>
        <div>
          <Typography>비고</Typography>
          <TextField fullWidth multiline rows={3} {...form.register('remark')} />
        </div>
      </div>
    </DefaultModal>
  )
}

export default AddUserModal
