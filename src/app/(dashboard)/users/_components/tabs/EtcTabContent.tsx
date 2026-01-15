import { forwardRef, useContext, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { UserEtcDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { UserIdContext, useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'

interface EtcTabContentProps {
  defaultData: UserEtcDtoType
}

const EtcTabContent = forwardRef<refType, EtcTabContentProps>(({ defaultData }, ref) => {
  const savedTabs = useSavedTabsContext()

  const userId = useContext(UserIdContext)

  const { mutateAsync: mutateEtcAsync } = useMutateSingleMember<UserEtcDtoType>(userId.toString(), 'etc')

  const form = useForm<UserEtcDtoType>({
    defaultValues: {
      ...defaultData,
      benefits: {
        youthJobLeap: defaultData.benefits?.youthJobLeap ?? '',
        youthEmploymentIncentive: defaultData.benefits?.youthEmploymentIncentive ?? '',
        youthDigital: defaultData.benefits?.youthDigital ?? '',
        seniorInternship: defaultData.benefits?.seniorInternship ?? '',
        newMiddleAgedJobs: defaultData.benefits?.newMiddleAgedJobs ?? ''
      },
      incomeTaxReduction: {
        beginDate: defaultData.incomeTaxReduction?.beginDate ?? '',
        endDate: defaultData.incomeTaxReduction?.endDate ?? '',
        employedType: defaultData.incomeTaxReduction?.employedType ?? '',
        militaryPeriod: defaultData.incomeTaxReduction?.militaryPeriod ?? ''
      },
      registeredAt: defaultData.registeredAt ?? '',
      lastLoginAt: defaultData.lastLoginAt ?? ''
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
        benefits: {
          youthJobLeap: newEtc.benefits?.youthJobLeap ?? '',
          youthEmploymentIncentive: newEtc.benefits?.youthEmploymentIncentive ?? '',
          youthDigital: newEtc.benefits?.youthDigital ?? '',
          seniorInternship: newEtc.benefits?.seniorInternship ?? '',
          newMiddleAgedJobs: newEtc.benefits?.newMiddleAgedJobs ?? ''
        },
        incomeTaxReduction: {
          beginDate: newEtc.incomeTaxReduction?.beginDate ?? '',
          endDate: newEtc.incomeTaxReduction?.endDate ?? '',
          employedType: newEtc.incomeTaxReduction?.employedType ?? '',
          militaryPeriod: newEtc.incomeTaxReduction?.militaryPeriod ?? ''
        },
        registeredAt: newEtc.registeredAt ?? '',
        lastLoginAt: newEtc.lastLoginAt ?? ''
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

  const { benefits, incomeTaxReduction, ...etcInfo } = MEMBER_INPUT_INFO.etc
  const labelMap = {
    ...etcInfo,
    'benefits.youthJobLeap': benefits?.youthJobLeap,
    'benefits.youthEmploymentIncentive': benefits?.youthEmploymentIncentive,
    'benefits.youthDigital': benefits?.youthDigital,
    'benefits.seniorInternship': benefits?.seniorInternship,
    'benefits.newMiddleAgedJobs': benefits?.newMiddleAgedJobs,
    'incomeTaxReduction.beginDate': incomeTaxReduction?.beginDate,
    'incomeTaxReduction.endDate': incomeTaxReduction?.endDate,
    'incomeTaxReduction.employedType': incomeTaxReduction?.employedType,
    'incomeTaxReduction.militaryPeriod': incomeTaxReduction?.militaryPeriod
  }

  return (
    <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
      <Grid2 container spacing={3} columns={2} columnSpacing={5}>
        <TextInputBox name='incomeTaxReduction.employedType' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='incomeTaxReduction.militaryPeriod' form={form} labelMap={labelMap} column={1} />
        <TextInputBox type='date' name='incomeTaxReduction.beginDate' form={form} labelMap={labelMap} column={1} />
        <TextInputBox type='date' name='incomeTaxReduction.endDate' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='benefits.newMiddleAgedJobs' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='benefits.seniorInternship' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='benefits.youthDigital' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='benefits.youthEmploymentIncentive' form={form} labelMap={labelMap} column={1} />
        <TextInputBox name='benefits.youthJobLeap' form={form} labelMap={labelMap} column={1} />
      </Grid2>
    </DialogContent>
  )
})

export default EtcTabContent