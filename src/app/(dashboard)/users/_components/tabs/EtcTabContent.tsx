import { forwardRef, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { MemberEtcDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'

interface EtcTabContentProps {
  defaultData: MemberEtcDtoType
}

const EtcTabContent = forwardRef<refType, EtcTabContentProps>(({ defaultData }, ref) => {
  const savedTabs = useSavedTabsContext()

  const memberId = defaultData.memberId

  const { mutateAsync: mutateEtcAsync } = useMutateSingleMember<MemberEtcDtoType>(memberId.toString(), 'etc')

  const form = useForm<MemberEtcDtoType>({
    defaultValues: {
      ...defaultData,

      youthJobLeap: defaultData.youthJobLeap ?? '',
      youthEmploymentIncentive: defaultData.youthEmploymentIncentive ?? '',
      youthDigital: defaultData.youthDigital ?? '',
      seniorInternship: defaultData.seniorInternship ?? '',
      newMiddleAgedJobs: defaultData.newMiddleAgedJobs ?? '',
      incomeTaxReducedBeginDate: defaultData.incomeTaxReducedBeginDate ?? '',
      incomeTaxReducedEndDate: defaultData.incomeTaxReducedEndDate ?? '',
      employedType: defaultData.employedType ?? '',
      militaryPeriod: defaultData.militaryPeriod ?? ''
    }
  })

  function dontSave() {
    form.reset()
  }

  const handleSave = form.handleSubmit(async data => {
    try {
      const newEtc = await mutateEtcAsync(data)

      form.reset({
        ...newEtc,
        youthJobLeap: newEtc.youthJobLeap ?? '',
        youthEmploymentIncentive: newEtc.youthEmploymentIncentive ?? '',
        youthDigital: newEtc.youthDigital ?? '',
        seniorInternship: newEtc.seniorInternship ?? '',
        newMiddleAgedJobs: newEtc.newMiddleAgedJobs ?? '',
        incomeTaxReducedBeginDate: newEtc.incomeTaxReducedBeginDate ?? '',
        incomeTaxReducedEndDate: newEtc.incomeTaxReducedEndDate ?? '',
        employedType: newEtc.employedType ?? '',
        militaryPeriod: newEtc.militaryPeriod ?? ''
      })

      console.log('etc 정보 수정 완료')
      savedTabs.current?.push('기타정보')
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
        <TextInputBox name='employedType' form={form} labelMap={MEMBER_INPUT_INFO.etc} column={1} />
        <TextInputBox name='militaryPeriod' form={form} labelMap={MEMBER_INPUT_INFO.etc} column={1} />
        <TextInputBox
          type='date'
          name='incomeTaxReducedBeginDate'
          form={form}
          labelMap={MEMBER_INPUT_INFO.etc}
          column={1}
        />
        <TextInputBox
          type='date'
          name='incomeTaxReducedBeginDate'
          form={form}
          labelMap={MEMBER_INPUT_INFO.etc}
          column={1}
        />
        <TextInputBox name='newMiddleAgedJobs' form={form} labelMap={MEMBER_INPUT_INFO.etc} column={1} />
        <TextInputBox name='seniorInternship' form={form} labelMap={MEMBER_INPUT_INFO.etc} column={1} />
        <TextInputBox name='youthDigital' form={form} labelMap={MEMBER_INPUT_INFO.etc} column={1} />
        <TextInputBox name='youthEmploymentIncentive' form={form} labelMap={MEMBER_INPUT_INFO.etc} column={1} />
        <TextInputBox name='youthJobLeap' form={form} labelMap={MEMBER_INPUT_INFO.etc} column={1} />
      </Grid2>
    </DialogContent>
  )
})

export default EtcTabContent
