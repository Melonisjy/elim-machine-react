'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'

import { TextField, Typography } from '@mui/material'

import { useForm } from 'react-hook-form'

import classNames from 'classnames'

import DefaultModal from '@/@core/components/elim-modal/DefaultModal'
import type { MemberCreateRequestDtoType } from '@core/types'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { auth } from '@core/utils/auth'
import { useGetLicenseNames } from '@core/hooks/customTanstackQueries'
import styles from '@core/styles/customTable.module.css'
import TextFieldTd from '@/@core/components/elim-inputbox/TextFieldTd'
import SelectTd from '@/@core/components/elim-inputbox/SelectTd'
import { memberStatusOption } from '@/@core/data/options'

type AddUserModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  handlePageChange: () => void
}

const AddUserModal = ({ open, setOpen, handlePageChange }: AddUserModalProps) => {
  const [loading, setLoading] = useState(false)

  const { data: licenses } = useGetLicenseNames()
  const companyNameOption = licenses?.map(v => ({ label: v.companyName, value: v.companyName }))

  const form = useForm<MemberCreateRequestDtoType>({
    defaultValues: {
      companyName: '',
      name: '',
      memberStatus: '',
      email: '',
      note: ''
    }
  })

  const onSubmitHandler = form.handleSubmit(async data => {
    try {
      setLoading(true)
      const response = await auth.post<{ data: MemberCreateRequestDtoType }>(`/api/members`, data)

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
              <SelectTd form={form} name='companyName' option={companyNameOption!} />
            </tr>
            <tr>
              <th>재직상태</th>
              <SelectTd form={form} name='memberStatus' option={memberStatusOption} />
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
