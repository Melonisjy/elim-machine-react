import { companyNameOption, gradeOption, workStatusOption } from '@/@core/data/options'
import type { EngineerFilterType, InputFieldType } from '../../types'

export const ENGINEER_FILTER_INFO: Record<keyof EngineerFilterType, InputFieldType> = {
  licenseName: {
    type: 'multi',
    label: '회사',
    options: companyNameOption
  },
  grade: {
    type: 'multi',
    label: '등급',
    options: gradeOption
  },
  status: {
    type: 'multi',
    label: '상태',
    options: workStatusOption
  }
}
