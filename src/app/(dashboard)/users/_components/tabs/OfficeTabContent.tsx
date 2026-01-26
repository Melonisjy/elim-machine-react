import { forwardRef, useContext, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { UserOfficeDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleUser } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { UserIdContext, useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'
import { contractTypeOption, laborFormOption, mapLabelToValue, officeDepartmentNameOption, officePositionOption, workFormOption } from '@/@core/data/options'

interface OfficeTabContentProps {
  defaultData: UserOfficeDtoType
}

const OfficeTabContent = forwardRef<refType, OfficeTabContentProps>(({ defaultData }, ref) => {
  const userId = useContext(UserIdContext)

  const { mutateAsync: mutateOfficeAsync } = useMutateSingleUser<UserOfficeDtoType>(userId.toString(), 'office')

  const savedTabs = useSavedTabsContext()

  const form = useForm<UserOfficeDtoType>({
    defaultValues: {
      ...defaultData,
      staffNum: defaultData.staffNum ?? '',
      department: mapLabelToValue(officeDepartmentNameOption, defaultData.department),
      position: mapLabelToValue(officePositionOption, defaultData.position),
      apprentice: defaultData.apprentice ?? '',
      contractType: mapLabelToValue(contractTypeOption, defaultData.contractType),
      contractYn: defaultData.contractYn ?? '',
      workForm: mapLabelToValue(workFormOption, defaultData.workForm),
      laborForm: mapLabelToValue(laborFormOption, defaultData.laborForm),
      fieldworkYn: defaultData.fieldworkYn ?? '',
      staffCardYn: defaultData.staffCardYn ?? '',
      joinDate: defaultData.joinDate ?? '',
      resignDate: defaultData.resignDate ?? '',
      insurancesAcquisitionDate: defaultData.insurancesAcquisitionDate ?? '',
      insurancesLossDate: defaultData.insurancesLossDate ?? '',
      // groupInsuranceYn: defaultData.groupInsuranceYn ?? ''
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
        department: mapLabelToValue(officeDepartmentNameOption, newOffice.department),
        position: mapLabelToValue(officePositionOption, newOffice.position),
        apprentice: newOffice.apprentice ?? '',
        contractType: mapLabelToValue(contractTypeOption, newOffice.contractType),
        contractYn: newOffice.contractYn ?? '',
        workForm: mapLabelToValue(workFormOption, newOffice.workForm),
        laborForm: mapLabelToValue(laborFormOption, newOffice.laborForm),
        fieldworkYn: newOffice.fieldworkYn ?? '',
        staffCardYn: newOffice.staffCardYn ?? '',
        joinDate: newOffice.joinDate ?? '',
        resignDate: newOffice.resignDate ?? '',
        insurancesAcquisitionDate: newOffice.insurancesAcquisitionDate ?? '',
        insurancesLossDate: newOffice.insurancesLossDate ?? '',
        // groupInsuranceYn: newOffice.groupInsuranceYn ?? ''
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
        <MultiInputBox name='department' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        <MultiInputBox name='position' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
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
          name='insurancesAcquisitionDate'
          form={form}
          labelMap={MEMBER_INPUT_INFO.office}
          column={1}
        />
        <TextInputBox type='date' name='insurancesLossDate' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} />
        {/* <MultiInputBox name='groupInsuranceYn' form={form} labelMap={MEMBER_INPUT_INFO.office} column={1} /> */}
      </Grid2>
    </DialogContent>
  )
})

export default OfficeTabContent
