'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'

import { Autocomplete, TextField, Typography } from '@mui/material'

import { useForm } from 'react-hook-form'

import classNames from 'classnames'

import { useQueryClient } from '@tanstack/react-query'

import DefaultModal from '@/@core/components/elim-modal/DefaultModal'
import type { engineerTypeType, MachineEngineerCreateRequestDtoType } from '@core/types'

import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { auth } from '@core/utils/auth'
import { useGetEngineersOptions, useGetMembersLookup } from '@core/hooks/customTanstackQueries'

import styles from '@core/styles/customTable.module.css'
import SelectTd from '../elim-inputbox/SelectTd'
import TextFieldTd from '../elim-inputbox/TextFieldTd'
import { gradeOption } from '@/@core/data/options'
import { useEngineerTypeContext } from './EngineerPage'

type AddEngineerModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  reloadPage: () => void
}

const AddEngineerModal = ({ open, setOpen, reloadPage }: AddEngineerModalProps) => {
  const queryClient = useQueryClient()
  const engineerType = useEngineerTypeContext()
  const engineerTerm = ({ MACHINE: '설비인력', SAFETY: '진단인력' } as Record<engineerTypeType, string>)[engineerType]

  const { data: memberList } = useGetMembersLookup()
  const memberOption = memberList?.map(v => ({ value: v.memberId, label: `${v.name} (${v.email})` })) ?? []

  const { data: engineerList } = useGetEngineersOptions(engineerType)

  const [loading, setLoading] = useState(false)

  const form = useForm<MachineEngineerCreateRequestDtoType>({
    defaultValues: {
      memberId: 0,
      grade: '',
      engineerLicenseNum: '',
      remark: ''
    }
  })

  // 추가 핸들러
  const onSubmitHandler = form.handleSubmit(async data => {
    try {
      setLoading(true)

      const response = await auth
        .post<{ data: MachineEngineerCreateRequestDtoType }>(`/api/engineers`, { ...data, engineerType: engineerType })
        .then(v => v.data.data)

      queryClient.removeQueries({ queryKey: ['GET_ENGINEERS_OPTIONS', engineerType] })

      reloadPage()
      setOpen(false)

      console.log(`new engineer added: ${response.memberId}`)
      handleSuccess(`새 ${engineerTerm}이 추가되었습니다.`)
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
      title={`${engineerTerm} 추가`}
      primaryButton={
        <Button variant='contained' onClick={() => onSubmitHandler()} type='submit' disabled={loading}>
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
            <col width={'30%'} />
            <col width={'70%'} />
          </colgroup>
          <tbody>
            <tr className={styles.required}>
              <th>이름</th>
              <td className='p-0'>
                <Autocomplete
                  sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0, borderRadius: 0 } }}
                  fullWidth
                  size='small'
                  options={memberOption}
                  noOptionsText='해당 이름의 직원을 찾을 수 없습니다'
                  getOptionDisabled={option => engineerList?.some(v => v.memberId === option.value) ?? false}
                  onChange={(_, value) => form.setValue('memberId', value?.value ?? 0, { shouldDirty: true })}
                  renderInput={params => <TextField {...params} placeholder='이름은 필수입력입니다' />}
                />
              </td>
            </tr>
            <tr>
              <th>등급</th>
              <SelectTd form={form} name='grade' option={gradeOption} />
            </tr>
            <tr>
              <th>기술자 자격번호</th>
              <TextFieldTd form={form} name='engineerLicenseNum' />
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

export default AddEngineerModal
