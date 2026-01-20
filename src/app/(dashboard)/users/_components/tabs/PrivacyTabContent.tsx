import { forwardRef, useContext, useImperativeHandle } from 'react'

import { DialogContent, Grid2 } from '@mui/material'

import { useForm } from 'react-hook-form'

import type { UserPrivacyDtoType } from '@core/types'
import { MEMBER_INPUT_INFO } from '@/@core/data/input/memberInputInfo'
import { useMutateSingleMember } from '@core/hooks/customTanstackQueries'
import { handleApiError } from '@core/utils/errorHandler'
import { UserIdContext, useSavedTabsContext, type refType } from '../UserModal'
import TextInputBox from '@/@core/components/elim-inputbox/TextInputBox'
import MultiInputBox from '@/@core/components/elim-inputbox/MultiInputBox'
import { mapLabelToValue, nationalityOption } from '@/@core/data/options'

interface PrivacyTabContentProps {
  defaultData: UserPrivacyDtoType
}

const PrivacyTabContent = forwardRef<refType, PrivacyTabContentProps>(({ defaultData }, ref) => {
  const userId = useContext(UserIdContext)
  const { mutateAsync: mutatePrivacyAsync } = useMutateSingleMember<UserPrivacyDtoType>(
    userId.toString(),
    'privacy'
  )

  const savedTabs = useSavedTabsContext()

  const form = useForm<UserPrivacyDtoType>({
    defaultValues: {
      ...defaultData,
      nationality: mapLabelToValue(nationalityOption, defaultData.nationality),
      juminNum: defaultData.juminNum ?? '',
      birthday: defaultData.birthday ?? '',
      phoneNumber: defaultData.phoneNumber ?? '',
      emergency1: defaultData.emergency1 ?? '',
      emergency2: defaultData.emergency2 ?? '',
      familyCnt: defaultData.familyCnt ?? 0,
      religion: defaultData.religion ?? '',
      address: defaultData.address ?? '',
      // detailAddress: defaultData.detailAddress ?? '',
      educationLevel: defaultData.educationLevel ?? '',
      educationMajor: defaultData.educationMajor ?? '',
      carOwned: defaultData.carOwned ?? '',
      carNumber: defaultData.carNumber ?? '',
      bankName: defaultData.bankName ?? '',
      bankNumber: defaultData.bankNumber ?? ''
    }
  })

  const watchCarOwned = form.watch('carOwned')

  function dontSave() {
    form.reset()
  }

  const handleSave = form.handleSubmit(async data => {
    try {
      const newPrivacy = await mutatePrivacyAsync(data)

      form.reset({
        ...newPrivacy,
        nationality: newPrivacy.nationality ?? '',
        juminNum: newPrivacy.juminNum ?? '',
        birthday: newPrivacy.birthday ?? '',
        phoneNumber: newPrivacy.phoneNumber ?? '',
        emergency1: newPrivacy.emergency1 ?? '',
        emergency2: newPrivacy.emergency2 ?? '',
        familyCnt: newPrivacy.familyCnt ?? 0,
        religion: newPrivacy.religion ?? '',
        address: newPrivacy.address ?? '',
        // detailAddress: newPrivacy.detailAddress ?? '',
        educationLevel: newPrivacy.educationLevel ?? '',
        educationMajor: newPrivacy.educationMajor ?? '',
        carOwned: newPrivacy.carOwned ?? '',
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
        <MultiInputBox name='nationality' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='juminNum' juminNum labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox type='date' name='birthday' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='phoneNumber' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='emergency1' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='emergency2' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox type='number' name='familyCnt' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='religion' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />

        <TextInputBox name='address' postcode labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={2} />
        {/* <TextInputBox name='detailAddress' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={2} /> */}

        <TextInputBox name='educationLevel' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox name='educationMajor' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />

        <MultiInputBox name='carOwned' labelMap={MEMBER_INPUT_INFO.privacy} form={form} column={1} />
        <TextInputBox
          disabled={watchCarOwned !== 'Y'}
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
