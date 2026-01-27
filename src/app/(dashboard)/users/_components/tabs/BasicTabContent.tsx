import { forwardRef, useContext, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { UserBasicDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useGetLicenseFilter, useMutateSingleUser } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { useSavedTabsContext, UserIdContext, type refType } from '../UserModal'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'
import { mapLabelToValue, userStatusOption } from '@/@core/data/options'

interface BasicTabContentProps {
  defaultData: UserBasicDtoType
}

const BasicTabContent = forwardRef<refType, BasicTabContentProps>(({ defaultData }, ref) => {
  const userId = useContext(UserIdContext)

  const savedTabs = useSavedTabsContext()

  const { currentUser, setCurrentUserName } = useCurrentUserStore()

  const { mutateAsync: mutateBasicAsync } = useMutateSingleUser<UserBasicDtoType>(userId.toString(), 'basic')
  const { data: licenseFilter } = useGetLicenseFilter()
  const licenseNameOption = licenseFilter?.map(v => ({ value: String(v.licenseSeq), label: v.name }))

  const form = useForm<UserBasicDtoType>({
    defaultValues: {
      ...defaultData,
      name: defaultData.name ?? '',
      email: defaultData.email ?? '',
      licenseName: defaultData.licenseName ?? '',
      licenseSeq: defaultData.licenseSeq ?? 0,
      status: mapLabelToValue(userStatusOption, defaultData.status),
      remark: defaultData.remark ?? ''
    }
  })

  function dontSave() {
    form.reset()
  }

  const handleSave = form.handleSubmit(async data => {
    try {
      // licenseName이 한글이면 영문으로 변환
      const normalizedLicenseName = licenseNameOption
        ? mapLabelToValue(licenseNameOption, data.licenseName)
        : data.licenseName

      const selectedLicense = licenseFilter?.find(l => String(l.licenseSeq) === normalizedLicenseName)

      const requestData = {
        ...data,
        licenseName: normalizedLicenseName,
        licenseSeq: selectedLicense?.licenseSeq,
      }
      const newBasic = await mutateBasicAsync(requestData as unknown as UserBasicDtoType)

      form.reset({
        ...newBasic,
        name: newBasic.name ?? '',
        email: newBasic.email ?? '',
        licenseName: licenseNameOption
          ? mapLabelToValue(licenseNameOption, newBasic.licenseName)
          : newBasic.licenseName,
        licenseSeq: newBasic.licenseSeq ?? 0,
        status: mapLabelToValue(userStatusOption, newBasic.status),
        remark: newBasic.remark ?? ''
      })

      if (currentUser && currentUser.userId === userId) {
        setCurrentUserName(newBasic.name)
      }

      console.log('basic 정보 수정 완료')
      savedTabs.current?.push('기본정보')
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
        <TextInputBox name='name' form={form} labelMap={MEMBER_INPUT_INFO.basic} column={1} />
        <TextInputBox name='email' form={form} labelMap={MEMBER_INPUT_INFO.basic} column={1} />
        <MultiInputBox
          name='licenseName'
          form={form}
          labelMap={{
            ...MEMBER_INPUT_INFO.basic,
            licenseName: { ...MEMBER_INPUT_INFO.basic.licenseName, options: licenseNameOption }
          }}
          column={1}
        />
        <MultiInputBox name='status' form={form} labelMap={MEMBER_INPUT_INFO.basic} column={1} />
        <TextInputBox multiline name='remark' form={form} labelMap={MEMBER_INPUT_INFO.basic} column={2} />
      </Grid2>
    </DialogContent>
  )
})

export default BasicTabContent
