'use client'

import { useState } from 'react'

import Button from '@mui/material/Button'

import { TextField, Typography } from '@mui/material'

import { useForm } from 'react-hook-form'

import classNames from 'classnames'

import type { safetyInspectionTypeType, SafetyProjectCreateRequestDtoType } from '@core/types'
import DefaultModal from '@/@core/components/elim-modal/DefaultModal'
import { handleApiError, handleSuccess } from '@core/utils/errorHandler'
import { auth } from '@core/utils/auth'
import { useGetLicenseNames } from '@core/hooks/customTanstackQueries'

import styles from '@core/styles/customTable.module.css'
import { safetyInspectionTypeOption } from '@/@core/data/options'
import SelectTd from '@core/components/elim-inputbox/SelectTd'
import TextFieldTd from '@core/components/elim-inputbox/TextFieldTd'
import FileUploadButton from '@/@core/components/elim-button/FileUploadButton'

type AddSafetyProjectModalProps = {
  open: boolean
  setOpen: (open: boolean) => void
  reloadPage: () => void
}

export default function AddSafetyProjectModal({ open, setOpen, reloadPage }: AddSafetyProjectModalProps) {
  const [loading, setLoading] = useState(false)

  const { data: licenseList } = useGetLicenseNames()
  const companyNameOption = licenseList?.map(v => ({ label: v.licenseName, value: v.licenseName }))

  const form = useForm<
    Omit<SafetyProjectCreateRequestDtoType, 'safetyInspectionType'> & {
      safetyInspectionType: safetyInspectionTypeType | ''
    }
  >({
    defaultValues: {
      companyName: '',
      safetyInspectionType: '',
      buildingName: '',
      uniqueNo: '',
      facilityNo: '',
      buildingId: '',
      beginDate: '',
      endDate: '',
      note: ''
    }
  })

  const onSubmitHandler = form.handleSubmit(async data => {
    try {
      setLoading(true)
      const response = await auth.post<{ data: { id: number } }>(`/api/safety/projects`, data)

      console.log('new machine project added', response.data.data.id)
      handleSuccess('새로운 안전진단현장이 추가되었습니다.')

      reloadPage()
      setOpen(false)
    } catch (error: any) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  })

  const handleUpload = (file: File) => {
    // todo
    console.log('file', file)
  }

  return (
    <DefaultModal
      size='sm'
      open={open}
      setOpen={setOpen}
      title='안전진단현장 추가'
      primaryButton={
        <Button variant='contained' onClick={onSubmitHandler} type='submit' disabled={loading}>
          추가
        </Button>
      }
      uploadButton={
        <FileUploadButton
          onFileSelect={handleUpload}
          accept=".pdf"
          variant="button"
          buttonText="시설물대장 업로드"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded ml-4"
        />
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
              <th>점검업체</th>
              <SelectTd
                form={form}
                name='companyName'
                option={companyNameOption!}
                placeholder='점검업체를 선택해주세요'
              />
            </tr>
            <tr className={styles.required}>
              <th>점검종류</th>
              <SelectTd
                form={form}
                name='safetyInspectionType'
                option={safetyInspectionTypeOption}
                placeholder='점검종류를 선택해주세요'
              />
            </tr>
            <tr className={styles.required}>
              <th>건물명</th>
              <TextFieldTd form={form} name='buildingName' placeholder='건물명은 필수입력입니다' />
            </tr>
            <tr>
              <th>시설물번호</th>
              <TextFieldTd form={form} name='facilityNo' />
            </tr>
            <tr>
              <th>고유번호</th>
              <TextFieldTd form={form} name='uniqueNo' />
            </tr>
            <tr>
              <th>건물 ID</th>
              <TextFieldTd form={form} name='buildingId' />
            </tr>
          </tbody>
        </table>
        <div>
          <Typography>점검일정</Typography>
          <table>
            <colgroup>
              <col width={'25%'} />
              <col width={'75%'} />
            </colgroup>
            <tbody>
              <tr className={styles.required}>
                <th>투입시작</th>
                <TextFieldTd form={form} name='beginDate' type='date' />
              </tr>
              <tr className={styles.required}>
                <th>투입종료</th>
                <TextFieldTd form={form} name='endDate' type='date' />
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <Typography>비고</Typography>
          <TextField fullWidth multiline rows={3} {...form.register('note')} />
        </div>
      </div>
    </DefaultModal>
  )
}
