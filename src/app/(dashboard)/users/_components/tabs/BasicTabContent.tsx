import { forwardRef, useContext, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { UserBasicDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useGetLicenseNames, useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { useSavedTabsContext, UserIdContext, type refType } from '../UserModal'
import useCurrentUserStore from '@/@core/hooks/zustand/useCurrentUserStore'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'

interface BasicTabContentProps {
  defaultData: UserBasicDtoType
}

const BasicTabContent = forwardRef<refType, BasicTabContentProps>(({ defaultData }, ref) => {
  const userId = useContext(UserIdContext)

  const savedTabs = useSavedTabsContext()

  const { currentUser, setCurrentUserName } = useCurrentUserStore()

  const { mutateAsync: mutateBasicAsync } = useMutateSingleMember<UserBasicDtoType>(userId.toString(), 'basic')
  const { data: licenseNames } = useGetLicenseNames()
  const licenseNameOption = licenseNames?.map(v => ({ value: v.licenseName, label: v.licenseName }))

  const form = useForm<UserBasicDtoType>({
    defaultValues: {
      ...defaultData,
      name: defaultData.name ?? '',
      email: defaultData.email ?? '',
      licenseName: defaultData.licenseName ?? '',
      status: defaultData.status ?? '',
      remark: defaultData.remark ?? ''
    }
  })

  function dontSave() {
    form.reset()
  }

  const handleSave = form.handleSubmit(async data => {
    try {
      const newBasic = await mutateBasicAsync(data)

      form.reset({
        ...newBasic,
        name: newBasic.name ?? '',
        email: newBasic.email ?? '',
        licenseName: newBasic.licenseName ?? '',
        status: newBasic.status ?? '',
        remark: newBasic.remark ?? ''
      })

      // 헤더에서 사용하는 정보 업데이트 (현재 로그인 중인 사용자의 정보라면)
      if (currentUser && currentUser.userId) {
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
