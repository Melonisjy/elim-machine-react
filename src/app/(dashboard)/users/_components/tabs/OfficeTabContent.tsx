import { forwardRef, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { MemberOfficeDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'

interface OfficeTabContentProps {
  defaultData: MemberOfficeDtoType
}

const OfficeTabContent = forwardRef<refType, OfficeTabContentProps>(({ defaultData }, ref) => {
  const memberId = defaultData.memberId

  const { mutateAsync: mutateOfficeAsync } = useMutateSingleMember<MemberOfficeDtoType>(memberId.toString(), 'office')

  const savedTabs = useSavedTabsContext()

  const form = useForm<MemberOfficeDtoType>({
    defaultValues: {
      ...defaultData,
      staffNum: defaultData.staffNum ?? '',
      officeDepartmentName: defaultData.officeDepartmentName ?? '',
      officePosition: defaultData.officePosition ?? '',
      apprentice: defaultData.apprentice ?? '',
      contractType: defaultData.contractType ?? '',
      contractYn: defaultData.contractYn ?? '',
      workForm: defaultData.workForm ?? '',
      laborForm: defaultData.laborForm ?? '',
      fieldworkYn: defaultData.fieldworkYn ?? '',
      staffCardYn: defaultData.staffCardYn ?? '',
      joinDate: defaultData.joinDate ?? '',
      resignDate: defaultData.resignDate ?? '',
      insuranceAcquisitionDate: defaultData.insuranceAcquisitionDate ?? '',
      insuranceLostDate: defaultData.insuranceLostDate ?? '',
      groupInsuranceYn: defaultData.groupInsuranceYn ?? ''
    }
  })

  function dontSave() {
    form.reset()
  }

  const save = form.handleSubmit(async data => {
    try {
      const newOffice = await mutateOfficeAsync(data)

      form.reset({
        ...newOffice,
        staffNum: newOffice.staffNum ?? '',
        officeDepartmentName: newOffice.officeDepartmentName ?? '',
        officePosition: newOffice.officePosition ?? '',
        apprentice: newOffice.apprentice ?? '',
        contractType: newOffice.contractType ?? '',
        contractYn: newOffice.contractYn ?? '',
        workForm: newOffice.workForm ?? '',
        laborForm: newOffice.laborForm ?? '',
        fieldworkYn: newOffice.fieldworkYn ?? '',
        staffCardYn: newOffice.staffCardYn ?? '',
        joinDate: newOffice.joinDate ?? '',
        resignDate: newOffice.resignDate ?? '',
        insuranceAcquisitionDate: newOffice.insuranceAcquisitionDate ?? '',
        insuranceLostDate: newOffice.insuranceLostDate ?? '',
        groupInsuranceYn: newOffice.groupInsuranceYn ?? ''
      })

      console.log('office 정보 수정 완료')
      savedTabs.current?.push('재직정보')
    } catch (e) {
      console.log(e)
      handleApiError(e)
    }
  })

  useImperativeHandle(ref, () => ({
    handleSave: save,
    handleDontSave: dontSave,
    dirty: form.formState.isDirty
  }))

  return (
    <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
      <Grid2 container spacing={3} columns={2} columnSpacing={5}>
        <TextInputBox name='staffNum' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='officeDepartmentName' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='officePosition' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <TextInputBox name='apprentice' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='contractType' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='contractYn' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='laborForm' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='workForm' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='fieldworkYn' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='staffCardYn' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <TextInputBox type='date' name='joinDate' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <TextInputBox type='date' name='resignDate' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <TextInputBox
          type='date'
          name='insuranceAcquisitionDate'
          form={form}
          labelMap={MEMBER_INPUT_INFO.office}
          column={1}
        />
        <TextInputBox type='date' name='insuranceLostDate' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='groupInsuranceYn' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
      </Grid2>
    </DialogContent>
  )
})

export default OfficeTabContent
