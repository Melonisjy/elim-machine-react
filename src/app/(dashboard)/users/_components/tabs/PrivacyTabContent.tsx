import { forwardRef, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { MemberPrivacyDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'

interface PrivacyTabContentProps {
  defaultData: MemberPrivacyDtoType
}

const PrivacyTabContent = forwardRef<refType, PrivacyTabContentProps>(({ defaultData }, ref) => {
  const { mutateAsync: mutatePrivacyAsync } = useMutateSingleMember<MemberPrivacyDtoType>(
    defaultData.memberId.toString(),
    'privacy'
  )

  const savedTabs = useSavedTabsContext()

  const form = useForm<MemberPrivacyDtoType>({
    defaultValues: {
      ...defaultData,
      foreignYn: defaultData.foreignYn ?? '',
      juminNum: defaultData.juminNum ?? '',
      birthday: defaultData.birthday ?? '',
      phoneNumber: defaultData.phoneNumber ?? '',
      emerNum1: defaultData.emerNum1 ?? '',
      emerNum2: defaultData.emerNum2 ?? '',
      familyCnt: defaultData.familyCnt ?? 0,
      religion: defaultData.religion ?? '',
      roadAddress: defaultData.roadAddress ?? '',
      detailAddress: defaultData.detailAddress ?? '',
      educationLevel: defaultData.educationLevel ?? '',
      educationMajor: defaultData.educationMajor ?? '',
      carYn: defaultData.carYn ?? '',
      carNumber: defaultData.carNumber ?? '',
      bankName: defaultData.bankName ?? '',
      bankNumber: defaultData.bankNumber ?? ''
    }
  })

  const watchCarYn = form.watch('carYn')

  function dontSave() {
    form.reset()
  }

  const handleSave = form.handleSubmit(async data => {
    try {
      const newPrivacy = await mutatePrivacyAsync(data)

      form.reset({
        ...newPrivacy,
        foreignYn: newPrivacy.foreignYn ?? '',
        juminNum: newPrivacy.juminNum ?? '',
        birthday: newPrivacy.birthday ?? '',
        phoneNumber: newPrivacy.phoneNumber ?? '',
        emerNum1: newPrivacy.emerNum1 ?? '',
        emerNum2: newPrivacy.emerNum2 ?? '',
        familyCnt: newPrivacy.familyCnt ?? 0,
        religion: newPrivacy.religion ?? '',
        roadAddress: newPrivacy.roadAddress ?? '',
        detailAddress: newPrivacy.detailAddress ?? '',
        educationLevel: newPrivacy.educationLevel ?? '',
        educationMajor: newPrivacy.educationMajor ?? '',
        carYn: newPrivacy.carYn ?? '',
        carNumber: newPrivacy.carNumber ?? '',
        bankName: newPrivacy.bankName ?? '',
        bankNumber: newPrivacy.bankNumber ?? ''
      })

      savedTabs.current?.push('개인정보')
      console.log('privacy 정보 수정 완료')
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
        <MultiInputBox name='foreignYn' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='juminNum' juminNum labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox type='date' name='birthday' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='phoneNumber' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='emerNum1' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='emerNum2' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox type='number' name='familyCnt' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='religion' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />

        <TextInputBox name='roadAddress' postcode labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={2} />
        <TextInputBox name='detailAddress' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={2} />

        <TextInputBox name='educationLevel' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='educationMajor' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />

        <MultiInputBox name='carYn' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox
          disabled={watchCarYn !== 'Y'}
          name='carNumber'
          labelMap={MEMBER_INPUT_INFO.privacy}
          form={form}
          column={1}
        />
        <TextInputBox name='bankName' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='bankNumber' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
      </Grid2>
    </DialogContent>
  )
})

export default PrivacyTabContent
