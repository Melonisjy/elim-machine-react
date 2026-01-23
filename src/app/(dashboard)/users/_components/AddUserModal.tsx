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
import { useGetLicenseFilter } from '@core/hooks/customTanstackQueries'
import styles from '@core/styles/customTable.module.css'
import TextFieldTd from '@/@core/components/elim-inputbox/TextFieldTd'
import SelectTd from '@/@core/components/elim-inputbox/SelectTd'
import { userStatusOption } from '@/@core/data/options'
import { phpAuth } from '@/@core/utils/auth'

type AddUserModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  handlePageChange: () => void
}

const AddUserModal = ({ open, setOpen, handlePageChange }: AddUserModalProps) => {
  const [loading, setLoading] = useState(false)

  const { data: licenseFilter } = useGetLicenseFilter()
  const licenseNameOption = licenseFilter?.map(v => ({ value: v.englishName, label: v.name }))

  const form = useForm<UserCreateRequestDtoType>({
    defaultValues: {
      licenseName: '',
      name: '',
      userStatus: '',
      email: '',
      note: ''
    }
  })

  const onSubmitHandler = form.handleSubmit(async data => {
    try {
      setLoading(true)
      const response = await phpAuth.post<{ data: UserCreateRequestDtoType }>(`/api/members`, data)

      console.log('new member added', response.data.data.name)
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
              <TextFieldTd form={form} name='name' placeholder='이름은 필수입력입니다' />
            </tr>
            <tr className={styles.required}>
              <th>이메일</th>
              <TextFieldTd form={form} name='email' placeholder='이메일은 필수입력입니다' />
            </tr>
            <tr>
              <th>소속</th>
              <SelectTd form={form} name='licenseName' option={licenseNameOption!} />
            </tr>
            <tr>
              <th>재직상태</th>
              <SelectTd form={form} name='userStatus' option={userStatusOption} />
            </tr>
          </tbody>
        </table>
        <div>
          <Typography>비고</Typography>
          <TextField fullWidth multiline rows={3} {...form.register('note')} />
        </div>
      </div>
    </DefaultModal>
  )
}

export default AddUserModal
