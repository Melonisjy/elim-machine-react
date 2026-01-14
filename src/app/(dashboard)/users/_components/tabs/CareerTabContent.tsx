import { forwardRef, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { MemberCareerDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'

interface CareerTabContentProps {
  defaultData: MemberCareerDtoType
}

const CareerTabContent = forwardRef<refType, CareerTabContentProps>(({ defaultData }, ref) => {
  const memberId = defaultData.memberId

  const savedTabs = useSavedTabsContext()

  const { mutateAsync: mutateCareerAsync } = useMutateSingleMember<MemberCareerDtoType>(memberId.toString(), 'career')

  const form = useForm<MemberCareerDtoType>({
    defaultValues: {
      ...defaultData,

      grade: defaultData.grade ?? '',
      jobField: defaultData.jobField ?? '',
      industrySameMonth: defaultData.industrySameMonth ?? 0,
      industryOtherMonth: defaultData.industryOtherMonth ?? 0,
      licenseName1: defaultData.licenseName1 ?? '',
      licenseName2: defaultData.licenseName2 ?? ''
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

        grade: newCareer.grade ?? '',
        jobField: newCareer.jobField ?? '',
        industrySameMonth: newCareer.industrySameMonth ?? 0,
        industryOtherMonth: newCareer.industryOtherMonth ?? 0,
        licenseName1: newCareer.licenseName1 ?? '',
        licenseName2: newCareer.licenseName2 ?? ''
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

  return (
    <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
      <Grid2 container spacing={3} columns={2} columnSpacing={5}>
        <MultiInputBox disabled name='grade' form={form} labelMap={MEMBER_INPUT_INFO.career} column={1} />
        <TextInputBox name='jobField' form={form} labelMap={MEMBER_INPUT_INFO.career} column={1} />
        <TextInputBox
          type='number'
          name='industrySameMonth'
          form={form}
          labelMap={MEMBER_INPUT_INFO.career}
          column={1}
        />
        <TextInputBox
          type='number'
          name='industryOtherMonth'
          form={form}
          labelMap={MEMBER_INPUT_INFO.career}
          column={1}
        />
        <TextInputBox name='licenseName1' form={form} labelMap={MEMBER_INPUT_INFO.career} column={1} />
        <TextInputBox name='licenseName2' form={form} labelMap={MEMBER_INPUT_INFO.career} column={1} />
      </Grid2>
    </DialogContent>
  )
})

export default CareerTabContent
