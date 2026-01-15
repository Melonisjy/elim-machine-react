import { forwardRef, useContext, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { UserCareerDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { UserIdContext, useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'

interface CareerTabContentProps {
  defaultData: UserCareerDtoType
}

const CareerTabContent = forwardRef<refType, CareerTabContentProps>(({ defaultData }, ref) => {
  const userId = useContext(UserIdContext)

  const savedTabs = useSavedTabsContext()

  const { mutateAsync: mutateCareerAsync } = useMutateSingleMember<UserCareerDtoType>(userId.toString(), 'career')

  const form = useForm<UserCareerDtoType>({
    defaultValues: {
      ...defaultData,

      jobGrade: defaultData.jobGrade ?? '',
      jobField: defaultData.jobField ?? '',
      preJoinExperienceMonth: {
        industrySameMonth: defaultData.preJoinExperienceMonth?.industrySameMonth ?? 0,
        industryOtherMonth: defaultData.preJoinExperienceMonth?.industryOtherMonth ?? 0
      },
      certNum1: defaultData.certNum1 ?? '',
      certNum2: defaultData.certNum2 ?? ''
    }
  })

  function dontSave() {
    form.reset()
  }

  const handleSave = form.handleSubmit(async data => {
    try {
      const newCareer = await mutateCareerAsync(data)

      form.reset({
        ...newCareer,
        jobGrade: newCareer.jobGrade ?? '',
        jobField: newCareer.jobField ?? '',
        preJoinExperienceMonth: {
          industrySameMonth: newCareer.preJoinExperienceMonth?.industrySameMonth ?? 0,
          industryOtherMonth: newCareer.preJoinExperienceMonth?.industryOtherMonth ?? 0
        },
        certNum1: newCareer.certNum1 ?? '',
        certNum2: newCareer.certNum2 ?? ''
      })

      console.log('career 정보 수정 완료')
      savedTabs.current?.push('경력정보')
    } catch (e) {
      console.log(e)
      handleApiError(e)
    }
  })

  useImperativeHandle(ref, () => ({
    handleSave: handleSave,
    handleDontSave: dontSave,
    dirty: form.formState.isDirty
  }))
  
  const { preJoinExperienceMonth, ...careerInfo } = MEMBER_INPUT_INFO.career
  const labelMap = {
    ...careerInfo,
    'preJoinExperienceMonth.industrySameMonth': preJoinExperienceMonth?.industrySameMonth,
    'preJoinExperienceMonth.industryOtherMonth': preJoinExperienceMonth?.industryOtherMonth
  }

  return (
    <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
      <Grid2 container spacing={3} columns={2} columnSpacing={5}>
        <MultiInputBox disabled name='jobGrade' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='jobField' form={form} labelMap={labelMap} column={1} />
        <TextInputBox type='number' name='preJoinExperienceMonth.industrySameMonth' form={form} labelMap={labelMap} column={1} />
        <TextInputBox type='number' name='preJoinExperienceMonth.industryOtherMonth' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='certNum1' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='certNum2' form={form} labelMap={labelMap} column={1} />
      </Grid2>
    </DialogContent>
  )
})

export default CareerTabContent
