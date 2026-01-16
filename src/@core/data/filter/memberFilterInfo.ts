import { MEMBER_INPUT_INFO } from '../input/memberInputInfo'
import type { InputFieldType, MemberFilterType } from '../../types'
import { birthMonthOption, careerYearOption, genderOption, regionOption } from '@/@core/data/options'

const { licenseName, status } = MEMBER_INPUT_INFO.basic
const { position, department, contractType, laborForm, workForm } = MEMBER_INPUT_INFO.office
const { nationality } = MEMBER_INPUT_INFO.privacy

export const MEMBER_FILTER_INFO: Record<keyof MemberFilterType, InputFieldType> = {
  // role: role!,
  licenseName: licenseName!,
  department: department!,
  position: position!,
  contractType: contractType!,
  laborForm: laborForm!,
  workForm: workForm!,
  nationality: nationality!,
  gender: {
    type: 'multi',
    label: '성별',
    options: genderOption
  },
  careerYear: {
    type: 'multi',
    label: '근속년수',
    options: careerYearOption
  },
  status: status!,
  birthMonth: {
    type: 'multi',
    label: '생일',
    options: birthMonthOption
  },
  region: {
    type: "multi",
    label: '지역',
    options: regionOption
  }
}
